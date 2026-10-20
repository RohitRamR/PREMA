# PREMA Date — Architecture & Implementation Plan

Status: **proposal, awaiting review**. Nothing in this document has been built yet.

## 1. What exists today (inspected 18 Oct 2026)

| Area | Current state | Impact on PREMA Date |
|---|---|---|
| Monorepo | Turborepo: `apps/mobile` (Expo 57, RN 0.86, expo-router, NativeWind), `apps/web`, `apps/admin` (Next.js 16 starter), `packages/compatibility` | Mobile feature lives in `apps/mobile`; partner + admin portals go in `apps/admin` |
| Database | `supabase/migrations`: `profiles`, `birth_data`, `preferences`, astro/numerology/personality/values/lifestyle profiles, `compatibility_scores`, `compatibility_events`, `post_date_feedback` | Reuse `profiles` + `auth.users`. Birth/compat tables stay untouched and invisible to partners |
| Mutual match | Only an event row (`compatibility_events.event_type = 'mutual_match'`). **No `matches` table** | Need a canonical `matches` table so RLS and functions can check “mutually matched” cheaply and reliably |
| Mobile data | No Supabase client, no `.env`, all screens use in-memory mock stores (`src/store/*`) | Add `@supabase/supabase-js` client + typed queries; replace mocks per screen |
| Local backend tooling | Supabase CLI and Docker not installed; no hosted project keys found | Migrations/functions can be written now but **not executed or tested** until a project is available |
| Admin app | Default Next.js page | Build partner + admin dashboards here (Stage 5) |

Existing mobile screens to reuse/replace: `(tabs)/meet.tsx` (becomes PREMA Date home), `SanctuaryReservationConcierge`, `SanctuaryDateInvitation`, `DateCheckInSafety`, `PostDateReflection`, `CuratedDateConciergeItinerary`. Current venue data in `src/data/venues.ts` is **design mock data** and must be removed once the backend is live (the spec forbids fictional vendors/availability).

## 2. Principles carried into the design

- Compatibility engine (Vedic astrology + numerology) stays **completely separate**. Booking tables never reference birth data or scores; partners never read `profiles` beyond a first name on a booking they own.
- **Server decides**: eligibility, availability, pricing, payment status, QR validity. The client only displays.
- A private couple date is confirmed only when **both** participants have accepted (enforced in SQL, not UI).
- No invented data: no hardcoded vendors, ratings, reviews, seat counts or slots. Empty/unknown states are shown honestly (“Request a time”, “No reviews yet”).
- No AI features of any kind in this module.

## 3. Database schema (new migrations)

All tables: `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (trigger), RLS **enabled**. Money is `integer` paise. Times are `timestamptz`; slots store venue-local times with `tz` on venue.

### 3.1 Core relationship
- **matches** — `user_low uuid`, `user_high uuid` (ordered pair, `CHECK user_low < user_high`), `status` (`active|unmatched|blocked`), `matched_at`. `UNIQUE(user_low,user_high)`. Backfilled from `compatibility_events`; written only by service role. Helper `is_active_match(a,b) returns boolean` (SECURITY DEFINER, stable).
- **user_blocks** — `blocker_id`, `blocked_id`, `UNIQUE`. Any block ⇒ `is_active_match` false.

### 3.2 Partners & catalogue
- **partners** — business name, legal name, contact email/phone, `verification_status` (`pending|verified|rejected|suspended`), `commission_bps` (nullable → platform default), settlement details reference (stored in a separate restricted table `partner_payout_accounts`).
- **partner_members** — `partner_id`, `user_id`, `role` (`owner|manager|staff`). Basis for partner RLS.
- **venues** — `partner_id`, name, address, city, lat/lng, `tz`, opening hours (jsonb), accessibility (jsonb), contact, `status` (`draft|in_review|live|paused`).
- **activity_categories** — seed: pottery, painting, candle, cooking, board_games, diy_crafts, coffee.
- **activities** — `venue_id`, `category_id`, title, description, `duration_min`, `price_for_two_paise` (nullable for request-only), includes/excludes/materials (text[]), `beginner_friendly`, accessibility notes, cancellation policy (jsonb), `booking_mode` (`instant|request`), `status`.
- **media** — polymorphic image rows (`owner_type`, `owner_id`, `url`, `sort`), URLs from Cloudinary.
- **availability_slots** — `activity_id`, `starts_at`, `ends_at`, `capacity_couples`, `booked_couples` (maintained transactionally), `status` (`open|closed`). `CHECK booked_couples <= capacity_couples`. Index `(activity_id, starts_at)`.

### 3.3 Free Coffee offers
- **offers** — `venue_id`, `type` (`two_coffees|coffee_min_spend|coffee_pastry|promo`), title, terms text, eligible items (text[]), `min_spend_paise`, `starts_on`, `expires_on`, `per_couple_limit`, `total_limit`, `redeemed_count`, booking requirements, cancellation/no-show policy, `funding` (`cafe` default | `prema_subsidy` requires admin flag), `status`.

### 3.4 Invitations & bookings
- **date_invitations** — `match_id`, `proposer_id`, `invitee_id`, `subject_type` (`offer|activity|event`), `subject_id`, `proposed_slot_id` / `proposed_time`, `message`, `status` (`draft|sent|accepted|declined|countered|expired|cancelled`), `responded_at`, `parent_invitation_id` (for counter-proposals). Insert allowed only if `is_active_match(proposer, invitee)`.
- **bookings** — `invitation_id` (nullable for events/open tickets), `subject_type`, `subject_id`, `slot_id`, `status` enum: `draft|invitation_sent|awaiting_response|payment_pending|confirmed|cancelled|completed|no_show|refunded`. `total_paise`, `currency`, `cancel_reason`, `cancelled_by`. **Constraint trigger**: transition to `confirmed`/`payment_pending` requires both attendees with `consented_at IS NOT NULL` (for private couple bookings).
- **booking_attendees** — `booking_id`, `user_id`, `consented_at`, `checked_in_at`. `UNIQUE(booking_id,user_id)`.
- **qr_passes** — `booking_id`, `token_hash` (sha256; raw token only returned once to clients), `valid_from`, `expires_at`, `redeemed_at`, `redeemed_by_member`, `UNIQUE(token_hash)`. Redemption via function only.
- **redemption_audit** — every validation attempt (`pass_id`, `partner_member_id`, `result`, `reason`, `ip`, `at`).

### 3.5 Events
- **events** — `partner_id` or PREMA-hosted flag, format (`clay_social|paint_picnic|coffee_club|game_night|dessert_lab|creative_weekend|other`), title, host, venue, `starts_at/ends_at`, `price_per_couple_paise`, `capacity`, `seats_taken`, `audience` (`couples_only|open`), includes/excludes, accessibility, photography & consent policy, rules, refund policy, `status`.
- **event_waitlist** — `event_id`, `booking_id`/`user_id`, `position`, `notified_at`.

### 3.6 Money
- **payments** — `booking_id`, `provider` (`razorpay`), `provider_order_id` UNIQUE, `provider_payment_id` UNIQUE, `amount_paise`, `status` (`created|authorized|captured|failed|refunded`), `idempotency_key` UNIQUE.
- **refunds** — `payment_id`, amount, reason, provider ref, status.
- **ledger_entries** — double-entry style rows (`account`: `customer|partner_payable|prema_commission|refund`), `booking_id`, `amount_paise`, `direction`. Free offers never create payments/ledger rows.
- **partner_settlements** — `partner_id`, period, gross, commission, net, status, payout ref.
- **platform_config** — default commission bps, redemption limits, rate limits (admin-editable, audited).

### 3.7 Trust, feedback, notifications
- **experience_reviews** — `booking_id`, `user_id`, venue/activity/host/accuracy/overall (1–5), `published` (false until rules met), private text.
- **safety_reports** — reporter, subject (`user|venue|partner|event`), booking, category, details, status, restricted RLS (admins only).
- **notifications** — `user_id`, type, payload (no sensitive dating content), `read_at`. Push via FCM with generic lock-screen copy by default.
- **saved_experiences** — `user_id` (or `match_id` for shared saves), subject.
- **admin_audit_log** — actor, action, target, before/after jsonb.

### 3.8 Access rules (RLS summary)
- Users: read live catalogue (`venues/activities/offers/events/slots` where status=`live`); read/write only their own invitations, bookings, saves, reviews.
- Partners: via `partner_members` — read/write only rows whose `venue.partner_id` they belong to; on bookings they see slot, status, party size and **first name only** through a dedicated view `partner_booking_view` (no profile, birth, compat or chat columns).
- Admins: `admin_users` table + `is_admin()`; sensitive actions logged to `admin_audit_log`.
- `birth_data`, `astro_profiles`, `compatibility_*`: no new policies; unreachable from any partner role.

## 4. Server functions (Supabase Edge Functions, TypeScript)

| Function | Purpose | Key guarantees |
|---|---|---|
| `date-invite` | create / respond / counter invitations | checks `is_active_match`, blocks, rate limit |
| `booking-create` | create booking from accepted invitation | single SQL transaction: `SELECT … FOR UPDATE` on slot, increment `booked_couples`, insert booking + attendees |
| `offer-redeem-request` | Free Coffee eligibility + booking | server-side eligibility (match, verification, limits, expiry), issues QR after both consent |
| `qr-validate` (partner) | validate & redeem pass | hash lookup, expiry, booking status, single-use (`UPDATE … WHERE redeemed_at IS NULL RETURNING`), audit row, rate limit |
| `payments-order` | create Razorpay order | server amount from DB, idempotency key |
| `payments-webhook` | verify signature, capture/fail | idempotent; only webhook/verified callback can move booking → `confirmed` |
| `booking-cancel` | cancel per policy | computes refund from policy, releases inventory, triggers refund |
| `event-book` / `waitlist-promote` | ticketing | transactional seat inventory, waitlist on full |
| `notify` | fan-out in-app + FCM | respects preferences, redacted lock-screen text |

## 5. Mobile screen architecture (`apps/mobile`)

Tab: the centre **Meet** tab becomes **PREMA Date**.

```
(tabs)/meet.tsx                 PREMA Date home
  ├─ hero “Your next memory starts here.”
  ├─ Free Coffee offer rail       → date/offer/[id]
  ├─ Upcoming bookings            → date/booking/[id]
  ├─ Recommended / Popular        → date/activity/[id]
  ├─ Couple events                → date/event/[id]
  ├─ Nearby cafés & studios       → date/venue/[id]
  └─ Saved                         → date/saved
date/explore.tsx                filters: city, date, price, type, duration
date/activity/[id].tsx          gallery, details, includes/excludes, slots, policy, reviews (if any)
date/offer/[id].tsx             exact terms, eligibility, propose coffee date
date/event/[id].tsx             event details, live seats, propose / waitlist
date/venue/[id].tsx             venue profile + its activities/offers
date/plan/new.tsx               Shared planner: pick match → slot → message → send
date/invitations.tsx            incoming/outgoing: accept / decline / counter
date/booking/[id].tsx           status timeline, price for two, directions, contact, cancel
date/booking/[id]/pass.tsx      QR pass (brightness up, expiry countdown)
date/booking/[id]/review.tsx    private feedback + separate “report conduct”
```

Every list/detail implements loading, empty, error and success states. Availability badges: **Live slots** (from `availability_slots`) vs **Request a time** (`booking_mode = request`) — never synthesised.

## 6. Partner & admin portal (`apps/admin`, Next.js)

- `/partner` — onboarding wizard, venues, activities, offers, slots/capacity, bookings inbox (accept/reject requests), QR scan (camera via `BarcodeDetector`/zxing) + manual code, check-in, completions/no-shows, performance, settlements, support.
- `/admin` — partner approvals & verification, listing review, offers, bookings/refunds, commission & redemption config, reports & incidents, suspensions, transactions/settlements, CSV exports, audit log. Admin routes require MFA (Supabase Auth AAL2).

## 7. Stages & definition of done

| Stage | Scope | Done when |
|---|---|---|
| **1** | `matches` table + backfill, catalogue tables, offers, seed categories, RLS, mobile Supabase client, PREMA Date home + explore + activity/venue/offer detail reading **real rows** | Home renders live catalogue with loading/empty/error; no hardcoded vendors remain |
| **2** | Invitations (send/accept/decline/counter), bookings + attendees + consent trigger, Free Coffee redemption request, QR passes, `qr-validate` | Confirmation impossible without both consents; QR single-use + expiry tested |
| **3** | Razorpay orders, webhook verification, ledger, cancellations, refunds | Unverified payment never confirms; refunds update status |
| **4** | Events, seat inventory, waitlist, event check-in | Concurrent booking test cannot oversell |
| **5** | Partner + admin dashboards, settlements, analytics, exports, audit | Partner can only see own venues; admin actions audited |

Tests: SQL tests with `pgTAP` for RLS/consent/inventory; Deno tests for edge functions (QR replay, expiry, webhook signature, idempotency); Jest/RTL for key mobile states.

## 8. Decisions needed before Stage 1

1. **Backend target** — a hosted Supabase project (URL + anon key in `apps/mobile/.env`, service key only in function secrets), or install Supabase CLI + Docker for a local stack. Without one, code can be written but not run.
2. **Payment provider** — Razorpay assumed (already referenced in the UI); confirm before Stage 3.
3. **Launch city/partners** — real partner records must be entered via the partner portal or an admin seed you supply; I will not invent vendors. For development I can create clearly-labelled `TEST –` fixtures in a separate seed file that never ships.
4. **`matches` table** — adding it touches core matching; confirm it is acceptable to introduce (with backfill from `compatibility_events`).

## 9. Frontend status (18 Oct 2026)

The mobile UI is built against a **local preview data layer** — no backend is connected yet.

- Data layer: `apps/mobile/src/features/date/` — `types.ts` (mirrors §3), `mock.ts` (clearly-labelled fictional preview data; delete when the API lands), `store.ts` (client state + lifecycle rules), `ui.tsx` (shared components).
- Screens: `app/(tabs)/meet.tsx` (PREMA Date home) and `app/date/*` — explore, activity/offer/event/venue details, planner, invitations, booking, QR pass, private review/report, saved.
- Consent rule enforced client-side: a booking is only created once both people accept. Request-mode listings wait for the venue; paid ones wait for payment.
- Buttons labelled **“Preview: …”** (match accepts, venue confirms, pay) stand in for server events and must be removed when wiring Stage 2–3.
- To connect the backend: replace the `catalogue` getters and store actions in `store.ts` with Supabase queries / Edge Function calls; screens should need no structural changes.
