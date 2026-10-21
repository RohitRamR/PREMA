#!/usr/bin/env bash
# =============================================================================
# PREMA — database access-rule checks (Row Level Security + grants)
# =============================================================================
# Runs against the LOCAL Supabase stack only. It checks what a logged-out
# visitor, member A and member B can see and change.
#
#   npx supabase start          # from the repo root (needs Docker)
#   bash supabase/tests/access_rules.sh
#
# How it works:
#   - Creates three test members (A, B and an under-18 C) by inserting into
#     auth.users, which fires the real handle_new_user() sign-up trigger.
#   - Each check runs in its own transaction as `anon` or `authenticated`,
#     with the same JWT claims the Supabase REST API sets, then rolls back.
#   - Deletes the test members (and everything that cascades from them)
#     when it finishes, even if a check fails.
#
# Exit code: 0 when every check passes, 1 otherwise.
# Override the database container with PREMA_DB_CONTAINER (default:
# supabase_db_<project_id from supabase/config.toml>).
# =============================================================================
set -uo pipefail

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
PROJECT_ID=$(sed -nE 's/^project_id *= *"([^"]+)".*/\1/p' "$ROOT/supabase/config.toml")
DB=${PREMA_DB_CONTAINER:-supabase_db_${PROJECT_ID}}

# Fixed ids so a crashed run is cleaned up by the next one.
A=00000000-0000-4000-a000-00000000000a
B=00000000-0000-4000-a000-00000000000b
C=00000000-0000-4000-a000-00000000000c

psql_admin() { docker exec -i "$DB" psql -U postgres -d postgres -tA -q -v ON_ERROR_STOP=1 "$@"; }

if ! docker exec "$DB" pg_isready -q -U postgres 2>/dev/null; then
  echo "Local database container '$DB' isn't running. Start it with: npx supabase start" >&2
  exit 2
fi

cleanup() { psql_admin -c "delete from auth.users where id in ('$A','$B','$C');" >/dev/null 2>&1; }
trap cleanup EXIT
cleanup

PASS=0; FAIL=0

result() { # label who expect got [detail]
  if [ "$3" = "$4" ]; then PASS=$((PASS+1)); m=PASS; else FAIL=$((FAIL+1)); m=FAIL; fi
  printf '%s  %-5s %-52s expected %-8s got %s\n' "$m" "$2" "$1" "$3" "$4"
  if [ "$m" = FAIL ] && [ -n "${5:-}" ]; then echo "      $5"; fi
}

# check "<label>" <anon|A|B> "<rows=N | denied>" "<sql>" ["<setup sql, run as postgres first>"]
check() {
  local label=$1 who=$2 expect=$3 sql=$4 setup=${5:-} role=authenticated uid=
  case $who in anon) role=anon ;; A) uid=$A ;; B) uid=$B ;; esac
  local claims="{\"role\":\"$role\"${uid:+,\"sub\":\"$uid\"}}" out got
  out=$(docker exec -i "$DB" psql -U postgres -d postgres -tA -q -v ON_ERROR_STOP=1 2>&1 <<SQL
begin;
$setup
set local role $role;
select set_config('request.jwt.claims', '$claims', true) \gset
-- q::text forces every column to be computed; count(*) alone can skip
-- function calls (and their permission checks).
with q as materialized ($sql) select count(*) from q where q::text is not null;
rollback;
SQL
)
  if echo "$out" | grep -q 'ERROR'; then got=denied; else got="rows=$(echo "$out" | tail -1)"; fi
  result "$label" "$who" "$expect" "$got" "$(echo "$out" | grep ERROR | head -1)"
}

ev() { echo "insert into public.compatibility_events (user_a_id,user_b_id,event_type,algorithm_version) values ('$1','$2','$3','prema_v1');"; }

# ── Sign-up (8) ──────────────────────────────────────────────────────────────
echo "── 8: sign-up trigger (handle_new_user) ──────────────────────"
signup() { # id, email, metadata → "ok" or "denied"
  psql_admin -c "insert into auth.users (id, email, raw_user_meta_data) values ('$1', '$2', '$3'::jsonb);" >/dev/null 2>&1 && echo ok || echo denied
}
result "sign up with a date of birth"            A ok     "$(signup $A member-a@prema.test '{"first_name":"Asha","gender":"female","date_of_birth":"1998-05-10"}')"
result "age comes from the date of birth"        A "$(psql_admin -c "select date_part('year', age(current_date, '1998-05-10'::date))::int")" \
                                                   "$(psql_admin -c "select age from public.profiles where id='$A'")"
result "sign up with a typed age"                B ok     "$(signup $B member-b@prema.test '{"first_name":"Bharat","gender":"male","age":"30"}')"
result "under-18 sign-up is rejected"            C denied "$(signup $C member-c@prema.test '{"first_name":"Chotu","gender":"male","date_of_birth":"2012-01-01"}')"

if [ "$(psql_admin -c "select count(*) from public.profiles where id in ('$A','$B')")" != 2 ]; then
  echo "Test members A and B couldn't be created; stopping." >&2
  exit 1
fi

# Shared data, written as postgres (like the server-side service role would).
psql_admin <<SQL >/dev/null
insert into public.compatibility_scores (user_a_id, user_b_id, overall_score, astrology_score, strengths, friction_points, reasons, algorithm_version, weights_version)
values ('$A', '$B', 88, 92, '{"Shared values"}', '{"Different sleep schedules"}', '{"Both want marriage"}', 'prema_v1', 'weights_v1');
insert into public.compatibility_events (user_a_id, user_b_id, event_type, algorithm_version)
values ('$A', '$B', 'impression', 'prema_v1'), ('$A', '$B', 'pass', 'prema_v1');
insert into public.birth_data (id, date_of_birth) values ('$B', '1996-03-03');
SQL

echo "── 1, 7: logged-out visitors ─────────────────────────────────"
check "read profiles"                            anon denied "select * from public.profiles"
check "read birth_data"                          anon denied "select * from public.birth_data"
check "read compatibility_scores"                anon denied "select overall_score from public.compatibility_scores"
check "read compatibility_events"                anon denied "select * from public.compatibility_events"
check "read matching_config"                     anon denied "select * from public.matching_config"
check "read algorithm_versions"                  anon denied "select * from public.algorithm_versions"
check "call get_compatibility_details()"         anon denied "select * from public.get_compatibility_details('$A')"

echo "── 1, 2: profiles and birth data ─────────────────────────────"
check "read A's and B's profiles"                A "rows=2" "select * from public.profiles where id in ('$A','$B')"
check "edit own bio"                             A "rows=1" "update public.profiles set bio='Hello' where id='$A' returning 1"
check "set own is_verified = true"               A denied   "update public.profiles set is_verified=true where id='$A' returning 1"
check "change own age"                           A denied   "update public.profiles set age=40 where id='$A' returning 1"
check "edit B's bio"                             A "rows=0" "update public.profiles set bio='hacked' where id='$B' returning 1"
check "delete own profile row"                   A denied   "delete from public.profiles where id='$A' returning 1"
check "age follows saved birth date"             A "rows=1" "select 1 from public.profiles where id='$A' and age=date_part('year', age(current_date, '1996-01-15'::date))" \
      "insert into public.birth_data (id,date_of_birth) values ('$A','1996-01-15');"
check "save an under-18 birth date"              A denied   "insert into public.birth_data (id,date_of_birth) values ('$A','2012-06-01') returning 1"
check "read own birth_data"                      B "rows=1" "select * from public.birth_data where id='$B'"
check "read B's birth_data"                      A "rows=0" "select * from public.birth_data where id='$B'"

echo "── 3: likes, passes, impressions ─────────────────────────────"
check "see own impression and pass on B"         A "rows=2" "select * from public.compatibility_events where user_a_id='$A'"
check "see A's impression or pass on B"          B "rows=0" "select * from public.compatibility_events where event_type in ('impression','pass','like')"
check "see the mutual match"                     B "rows=1" "select * from public.compatibility_events where event_type='mutual_match'" "$(ev $A $B mutual_match)"
check "write an event directly"                  A denied   "insert into public.compatibility_events (user_a_id,user_b_id,event_type,algorithm_version) values ('$A','$B','like','x') returning 1"

echo "── 4: computed profiles are server-written ───────────────────"
ASTRO="insert into public.astro_profiles (id,moon_longitude,rashi_index,rashi_name,nakshatra_index,nakshatra_name,nakshatra_pada,is_manglik) values ('$A',1,1,'Mesha',1,'Ashwini',1,true)"
check "insert own astro_profiles row"            A denied   "$ASTRO returning 1"
check "update own astro_profiles row"            A denied   "update public.astro_profiles set is_manglik=false where id='$A' returning 1" "$ASTRO;"
check "read own astro_profiles row"              A "rows=1" "select * from public.astro_profiles where id='$A'" "$ASTRO;"
check "insert own personality_profiles row"      A denied   "insert into public.personality_profiles (id,social_energy) values ('$A',0.5) returning 1"
check "insert own values_profiles row"           A denied   "insert into public.values_profiles (id,family_importance) values ('$A',0.5) returning 1"
check "insert own relationship_goals (allowed)"  A "rows=1" "insert into public.relationship_goals (id,intention) values ('$A','marriage_oriented') returning 1"
check "insert own user_interests (allowed)"      A "rows=1" "insert into public.user_interests (id,interests) values ('$A','{Yoga}') returning 1"

echo "── 5: compatibility scores and details ───────────────────────"
check "read the pair's scores"                   A "rows=1" "select overall_score, astrology_score from public.compatibility_scores"
check "read the pair's scores"                   B "rows=1" "select overall_score from public.compatibility_scores"
check "read the strengths column"                B denied   "select strengths from public.compatibility_scores"
check "select * (columns must be listed)"        A denied   "select * from public.compatibility_scores"
check "details before a mutual match"            B "rows=0" "select * from public.get_compatibility_details('$A')"
check "details after a mutual match"             B "rows=1" "select * from public.get_compatibility_details('$A')" "$(ev $A $B mutual_match)"
check "call is_mutual_match() for any pair"      A denied   "select public.is_mutual_match('$A','$B') as x"

echo "── 6: post-date feedback ─────────────────────────────────────"
FB="insert into public.post_date_feedback (user_id,match_user_id,would_meet_again,algorithm_version) values"
check "feedback on B with no date"               A denied   "$FB ('$A','$B','yes','prema_v1') returning 1"
check "feedback on B after a scheduled date"     A "rows=1" "$FB ('$A','$B','yes','prema_v1') returning 1" "$(ev $B $A date_scheduled)"
check "feedback about yourself"                  A denied   "$FB ('$A','$A','yes','prema_v1') returning 1"
check "feedback written as someone else"         A denied   "$FB ('$B','$A','yes','prema_v1') returning 1" "$(ev $B $A date_scheduled)"
check "read A's feedback about you"              B "rows=0" "select * from public.post_date_feedback" "$(ev $B $A date_scheduled) $FB ('$A','$B','no','prema_v1');"
check "had_scheduled_date_with() on own pair"    A "rows=1" "select public.had_scheduled_date_with('$B') as x"

echo "── 7: config tables ──────────────────────────────────────────"
check "read active matching_config"              A "rows=1" "select * from public.matching_config"
check "change matching_config"                   A denied   "update public.matching_config set astrology_weight=1 returning 1"

echo "── 8: function permissions ───────────────────────────────────"
for fn in handle_new_user sync_profile_age_from_birth_data is_mutual_match; do
  check "members can't execute $fn()"            A "rows=1" "select 1 from pg_proc where proname='$fn' and not has_function_privilege('authenticated', oid, 'execute')"
done
check "handle_new_user() search_path is pinned"  A "rows=1" "select 1 from pg_proc where proname='handle_new_user' and 'search_path=\"\"' = any(proconfig)"

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
