-- =============================================================================
-- PREMA — Access-control fixes
-- =============================================================================
-- Closes the gaps found in the October 2026 handoff audit (items 1–8):
--
--   1. profiles were readable by anyone, including logged-out visitors
--   2. users could set their own is_verified flag and age
--   3. person B could see that person A passed on them (compatibility_events)
--   4. users could write their own computed astrology/trait scores
--   5. both users saw strengths/friction text built from the other's private data
--   6. post-date feedback could be filed about anyone, with or without a date
--   7. matching_config / algorithm_versions were readable while logged out
--   8. handle_new_user() had no fixed search_path and trusted the client's age
--
-- Role model used throughout:
--   anon           logged-out visitor        → no access to member data
--   authenticated  signed-in member          → own rows + what RLS allows
--   service_role   Edge Functions / matching → bypasses RLS (unchanged)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Shared: pin search_path on the existing updated_at helper (Supabase linter
-- "function_search_path_mutable"). Behaviour is unchanged.
-- -----------------------------------------------------------------------------
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';


-- =============================================================================
-- 1. profiles — members only, never logged-out visitors
-- =============================================================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY "Signed-in members can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
-- TODO when blocks / pause / incognito land: replace USING (true) with a check
-- that hides blocked, paused and incognito members from each other.

REVOKE ALL ON public.profiles FROM anon;


-- =============================================================================
-- 2. profiles — users can edit their own profile, but not is_verified or age
-- =============================================================================
-- Column privileges: members may only UPDATE the columns they own. is_verified
-- is set by the verification flow (service_role); age is derived from
-- birth_data below. id / created_at / updated_at are never client-writable.
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM authenticated;
GRANT UPDATE (first_name, gender, city, bio, lifestyle_tags, relationship_intention)
  ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Keep profiles.age in sync with the member's date of birth. Because
-- profiles.age has CHECK (age >= 18), saving an under-18 date of birth fails,
-- which also rolls back the birth_data write.
CREATE OR REPLACE FUNCTION public.sync_profile_age_from_birth_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles
     SET age = date_part('year', age(current_date, NEW.date_of_birth))::integer
   WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_profile_age_from_birth_data() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER sync_profile_age_on_birth_data
  AFTER INSERT OR UPDATE OF date_of_birth ON public.birth_data
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_age_from_birth_data();

-- birth_data / preferences: owner-only policies are already correct; just make
-- sure logged-out visitors have no table privileges at all.
REVOKE ALL ON public.birth_data FROM anon;
REVOKE ALL ON public.preferences FROM anon;

CREATE TRIGGER update_birth_data_updated_at
  BEFORE UPDATE ON public.birth_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- 3. compatibility_events — you see your own actions, never the other
--    person's private ones (impressions, likes, passes)
-- =============================================================================
-- user_a_id is the member who acted. Only mutual, already-visible outcomes are
-- shown to user_b.
DROP POLICY IF EXISTS "Users can view their events" ON public.compatibility_events;

CREATE POLICY "Users can view events they performed"
  ON public.compatibility_events FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_a_id);

CREATE POLICY "Users can view mutual outcomes involving them"
  ON public.compatibility_events FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_b_id
    AND event_type IN ('mutual_match', 'conversation_started', 'date_scheduled')
  );

REVOKE ALL ON public.compatibility_events FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.compatibility_events FROM authenticated;
-- Writes stay service_role only (Edge Functions).


-- =============================================================================
-- 4. Computed profile tables — readable by the owner, written only by the
--    server so nobody can game matching by editing their own scores
-- =============================================================================
-- astro_profiles and numerology_profiles are computed from birth data and
-- name; personality / communication / values / lifestyle are normalised 0–1
-- scores computed from quiz answers. An Edge Function (service_role) writes
-- all six.
--
-- relationship_goals and user_interests are things the member chooses
-- directly, so they stay owner-writable (their existing policies are kept).

-- astro_profiles
DROP POLICY IF EXISTS "Users can update own astro profile" ON public.astro_profiles;
DROP POLICY IF EXISTS "Users can insert own astro profile" ON public.astro_profiles;
-- numerology_profiles
DROP POLICY IF EXISTS "Users can update own numerology profile" ON public.numerology_profiles;
DROP POLICY IF EXISTS "Users can insert own numerology profile" ON public.numerology_profiles;
-- personality_profiles
DROP POLICY IF EXISTS "Users can update own personality profile" ON public.personality_profiles;
DROP POLICY IF EXISTS "Users can insert own personality profile" ON public.personality_profiles;
-- communication_profiles
DROP POLICY IF EXISTS "Users can update own communication profile" ON public.communication_profiles;
DROP POLICY IF EXISTS "Users can insert own communication profile" ON public.communication_profiles;
-- values_profiles
DROP POLICY IF EXISTS "Users can update own values profile" ON public.values_profiles;
DROP POLICY IF EXISTS "Users can insert own values profile" ON public.values_profiles;
-- lifestyle_profiles
DROP POLICY IF EXISTS "Users can update own lifestyle profile" ON public.lifestyle_profiles;
DROP POLICY IF EXISTS "Users can insert own lifestyle profile" ON public.lifestyle_profiles;

REVOKE ALL ON
  public.astro_profiles,
  public.numerology_profiles,
  public.personality_profiles,
  public.communication_profiles,
  public.values_profiles,
  public.lifestyle_profiles,
  public.relationship_goals,
  public.user_interests
FROM anon;

REVOKE INSERT, UPDATE, DELETE ON
  public.astro_profiles,
  public.numerology_profiles,
  public.personality_profiles,
  public.communication_profiles,
  public.values_profiles,
  public.lifestyle_profiles
FROM authenticated;


-- =============================================================================
-- 5. compatibility_scores — scores for both, the written "why" only after a
--    mutual match
-- =============================================================================
-- strengths / friction_points / reasons are written from both people's private
-- answers and birth data. Before a mutual match, members see the numbers only.
-- Clients must select columns explicitly (no `select *`) on this table.
REVOKE ALL ON public.compatibility_scores FROM anon;
REVOKE ALL ON public.compatibility_scores FROM authenticated;
GRANT SELECT (
  id, user_a_id, user_b_id,
  overall_score, astrology_score, numerology_score, personality_score,
  communication_score, values_score, lifestyle_score,
  relationship_goal_score, interests_score,
  confidence, algorithm_version, astrology_version, numerology_version,
  weights_version, created_at, updated_at
) ON public.compatibility_scores TO authenticated;
-- The existing "both users in the pair can read" row policy is kept.

-- True when the two members have a recorded mutual match (either direction).
CREATE OR REPLACE FUNCTION public.is_mutual_match(a uuid, b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.compatibility_events e
     WHERE e.event_type = 'mutual_match'
       AND ((e.user_a_id = a AND e.user_b_id = b)
         OR (e.user_a_id = b AND e.user_b_id = a))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_mutual_match(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- Written breakdown for the signed-in member and `other`, only once they've
-- mutually matched. Returns no rows otherwise.
CREATE OR REPLACE FUNCTION public.get_compatibility_details(other uuid)
RETURNS TABLE (
  algorithm_version text,
  strengths text[],
  friction_points text[],
  reasons text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT s.algorithm_version, s.strengths, s.friction_points, s.reasons
    FROM public.compatibility_scores s
   WHERE (SELECT auth.uid()) IS NOT NULL
     AND ((s.user_a_id = (SELECT auth.uid()) AND s.user_b_id = other)
       OR (s.user_b_id = (SELECT auth.uid()) AND s.user_a_id = other))
     AND public.is_mutual_match((SELECT auth.uid()), other);
$$;

REVOKE EXECUTE ON FUNCTION public.get_compatibility_details(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_compatibility_details(uuid) TO authenticated;


-- =============================================================================
-- 6. post_date_feedback — only about someone you actually had a date with
-- =============================================================================
-- Until a bookings table exists, a 'date_scheduled' event between the pair is
-- the proof that a date happened. Swap this for a confirmed booking check when
-- PREMA Date bookings move to the database.
ALTER TABLE public.post_date_feedback
  ADD CONSTRAINT post_date_feedback_not_self CHECK (user_id <> match_user_id);

-- True when the signed-in member has a scheduled date with `other`. It only
-- ever checks the caller's own pairs, so it can't be used to probe whether two
-- other members went on a date.
CREATE OR REPLACE FUNCTION public.had_scheduled_date_with(other uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.compatibility_events e
     WHERE (SELECT auth.uid()) IS NOT NULL
       AND e.event_type = 'date_scheduled'
       AND ((e.user_a_id = (SELECT auth.uid()) AND e.user_b_id = other)
         OR (e.user_a_id = other AND e.user_b_id = (SELECT auth.uid())))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.had_scheduled_date_with(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.had_scheduled_date_with(uuid) TO authenticated;

DROP POLICY IF EXISTS "Users can view own feedback" ON public.post_date_feedback;
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.post_date_feedback;

CREATE POLICY "Users can view own feedback"
  ON public.post_date_feedback FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can leave feedback on their own dates"
  ON public.post_date_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND public.had_scheduled_date_with(match_user_id)
  );

REVOKE ALL ON public.post_date_feedback FROM anon;
REVOKE UPDATE, DELETE ON public.post_date_feedback FROM authenticated;
-- match_user_id still cannot read this feedback.


-- =============================================================================
-- 7. matching_config / algorithm_versions — signed-in members only
-- =============================================================================
DROP POLICY IF EXISTS "Authenticated users can view active config" ON public.matching_config;
CREATE POLICY "Authenticated users can view active config"
  ON public.matching_config FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Authenticated users can view versions" ON public.algorithm_versions;
CREATE POLICY "Authenticated users can view versions"
  ON public.algorithm_versions FOR SELECT
  TO authenticated
  USING (TRUE);

REVOKE ALL ON public.matching_config, public.algorithm_versions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.matching_config, public.algorithm_versions FROM authenticated;


-- =============================================================================
-- 8. handle_new_user() — fixed search_path, age from date of birth
-- =============================================================================
-- Prefers a date_of_birth in sign-up metadata (YYYY-MM-DD) over a typed age.
-- Either way, profiles.age is overwritten from birth_data once the member
-- saves their birth details (trigger above), and CHECK (age >= 18) still
-- rejects under-18 sign-ups. A real age check (ID / KYC) remains future work.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  meta    jsonb := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
  dob     date;
  new_age integer;
BEGIN
  BEGIN
    dob := nullif(meta->>'date_of_birth', '')::date;
  EXCEPTION WHEN others THEN
    dob := NULL;
  END;

  IF dob IS NOT NULL THEN
    new_age := date_part('year', age(current_date, dob))::integer;
  ELSE
    new_age := nullif(meta->>'age', '')::integer;
  END IF;

  INSERT INTO public.profiles (id, first_name, age, gender)
  VALUES (NEW.id, meta->>'first_name', new_age, meta->>'gender');
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
