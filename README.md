# PREMA

An intentional, astrology-first dating app for India. Matches are ranked by a
real Vedic Kundli (Guna Milan), numerology and sun signs, combined with what
each person wants, so every introduction comes with a clear "why you match".

## Repository layout

```
prema/
├── apps/
│   ├── mobile/          Expo (React Native) app — the PREMA product
│   │   ├── app/         Screens (expo-router, file-based routes)
│   │   ├── components/  Shared UI (aura rings, icons, prema-ui kit)
│   │   └── src/
│   │       ├── features/compatibility/  Bridge to the matching engine
│   │       ├── features/date/           PREMA Date (venues, bookings)
│   │       └── store/                   Local state (profile, people, chats)
│   ├── web/             Next.js marketing site (starter)
│   └── admin/           Next.js partner/admin portal (starter)
├── packages/
│   ├── compatibility/   Matching engine: Kundli, horoscope, numerology,
│   │                    preferences and best-pair finder (fully tested)
│   ├── ui/              Shared React components for web/admin
│   ├── eslint-config/   Shared lint rules
│   └── typescript-config/
├── supabase/            Database schema, migrations and access-rule tests
├── docs/                Product and architecture plans
├── design-mockups/      Screen designs: a screenshot and HTML per screen,
│                        plus the design brief (warm_editorial_intent/DESIGN.md)
├── .github/
│   ├── workflows/       CI (type-check and tests on every PR)
│   └── skills/          PREMA engineering guidelines for AI coding assistants
│                        (one SKILL.md per area: auth, Supabase, testing…)
└── tools/codemods/      One-off scripts kept for history (not run)
```

The mockups are design references, not the source of truth: where a mockup
and the app disagree, the app wins.

## Getting started

Requires **Node 24+** and **npm 11+**.

```bash
npm install
```

### Run the mobile app

```bash
cd apps/mobile
npx expo start
```

Press `i` for the iOS simulator or scan the QR code with Expo Go.

### Matching engine

```bash
cd packages/compatibility
npx vitest run                          # 125 tests
npx vite-node scripts/demo-match.ts     # sample pool → best pairs
npx vite-node scripts/quality-report.ts # score distribution & quality
```

See [packages/compatibility/README.md](packages/compatibility/README.md) for
how matching works.

## How the app uses the engine

The app never hard-codes a match percentage. Every score, Guna total, moon
sign, Manglik status and "why you match" line comes from
`apps/mobile/src/features/compatibility`, which feeds your profile (birth
date, **birth time in IST**, birthplace, diet, interests, Kundli preferences)
and each person's profile into `@prema/compatibility`.

| Screen | What the engine provides |
|---|---|
| Discover | Hides people your filters or dealbreakers exclude; best match first |
| Why you match | Real Guna Milan (8 kootas), doshas, Manglik, sun signs, numerology |
| Profile (Match detail) | Score ring, Kundli/numbers bars, moon-sign card |
| Likes, Chats, It's a match | Aura ring colours from the real score |
| Edit profile | Birth date, birth time (IST) and birthplace |
| Discovery & distance | "18+ Guna only" and "Avoid Manglik mismatch" |

People profiles are sample data until the Supabase API is connected; their
birth details live in `src/features/compatibility/sample-births.ts`.

## How data flows today

> **The mobile app isn't connected to a backend yet.** Everything runs on the
> phone: there's no sign-in, and nothing is sent to or saved on a server
> (the only network use is loading sample photos and, once a DSN is set,
> Sentry error reports). All state lives in memory and **resets when the app restarts**. The
> Supabase schema in `supabase/` exists, but the app doesn't use it yet.

```
 Onboarding ──saveOnboarding()──┐
 Edit profile, Settings, Quiz ──┴─updateProfile()──▶ store/profile.ts   (you)
                                                            │
 store/people.ts + sample-births.ts  (sample people) ───────┤
                                                            ▼
                                       features/compatibility  (adapters → @prema/compatibility engine)
                                                            │  cached per profile version
                                                            ▼
                         Discover deck, Match detail, Why you match, Likes, Chats  (scores, Kundli, "why you match")

 Chat, Match detail ──sendMessage()──▶ store/chats.ts        (conversations, new matches)
 Report, Hide ─blockPerson()/reportPerson()─▶ store/safety.ts  (also removes their chat)
 PREMA Date screens ─────────────────▶ features/date/store.ts (saves, invitations, bookings, passes)
                                         └─ catalogue from features/date/mock.ts (venues, activities, events)
```

Every store follows the same pattern: a module-level value, a `useX()` hook
built on `useSyncExternalStore`, and functions that replace the value and
notify subscribers. Screens never talk to the engine directly; they go
through `src/features/compatibility` (see above).

| Store | Holds | Seeded from |
|---|---|---|
| `src/store/profile.ts` | Your profile, birth details, quiz answers, discovery filters, settings | A built-in sample profile, then whatever you enter |
| `src/store/people.ts` | Everyone you can see (read-only) | Hard-coded sample people |
| `src/store/chats.ts` | Conversations and new matches | Hard-coded sample chats |
| `src/store/safety.ts` | Who you've blocked or reported | Empty |
| `src/features/date/store.ts` | Saved places, date invitations, bookings, QR passes | `features/date/mock.ts` |

**What's simulated, and must move to the server before launch:**

- **Sign-up checks are off.** `SKIP_SIGNUP_CHECKS = true` in
  `app/(onboarding)/index.tsx` skips phone/OTP and all required fields.
- **Invite codes** are accepted if they're 6–12 characters; nothing checks
  them.
- **The other person** never really replies: buttons such as
  `simulateTheyAccept`, `previewPartnerPaysHalf` and `previewVenueConfirms`
  in `features/date/store.ts` stand in for them.
- **Payments** aren't connected to a payment provider; paying just flips a
  flag in the date store.
- **QR date passes** are generated on the phone with `Math.random()`.
- **Photos** you pick stay as local file paths on the device.

**When the backend lands**, each store's body becomes Supabase calls behind
the same hooks and functions, so screens shouldn't need to change. Server
rules are already defined: see [Database access rules](#database-access-rules).

## Colours

Use the semantic tokens in `apps/mobile/src/theme` (`colors.text.primary`,
`colors.action.primary.bg`…) instead of hex values. The palette, the tokens, the
accessibility decisions and the plan for migrating the existing hard-coded
colours are in [docs/colour-system.md](docs/colour-system.md).

## Error tracking

The mobile app reports errors to [Sentry](https://sentry.io).

- **Turn it on:** copy `apps/mobile/.env.example` to `apps/mobile/.env` and set
  `EXPO_PUBLIC_SENTRY_DSN`. With no DSN, Sentry stays off.
- **Crashes:** a screen that throws shows a "Something went wrong" page with a
  Try again button (`ErrorBoundary` in `apps/mobile/app/_layout.tsx`), and the
  error is sent to Sentry.
- **Recovered errors:** code that catches an error and shows a fallback calls
  `reportError()` from `apps/mobile/src/lib/report-error.ts`, so those reach
  Sentry too, as warnings. Use it in any new `catch`, and keep personal data
  (names, birth details, messages) out of the context.
- **Readable stack traces in release builds:** set `SENTRY_ORG`,
  `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` as EAS secrets so source maps are
  uploaded. Never commit the auth token.

## Database access rules

Who can see and change what in Supabase is enforced by Row Level Security
and grants in `supabase/migrations/`. `supabase/tests/access_rules.sh`
checks them as a logged-out visitor, member A and member B: for example,
that members can't verify themselves, can't see who passed on them, and
only see a match's written breakdown after a mutual match.

Run it against the local stack (needs Docker):

```bash
npx supabase start
bash supabase/tests/access_rules.sh
```

It creates its own test members, rolls back every check, and deletes the
test members when it finishes. It exits non-zero if any check fails. Run it
after changing a migration, and add a check whenever you add a table or
policy.

CI runs it too: the **Database** workflow (`.github/workflows/database.yml`)
applies every migration to a fresh database and runs these checks on any pull
request that changes `supabase/`.

## Scripts (from the repo root)

| Command | What it does |
|---|---|
| `npm run dev` | Start every app in dev mode (Turborepo) |
| `npm run build` | Build all packages and apps |
| `npm run check-types` | Type-check everything |
| `npm run format` | Prettier on all TS/TSX/MD files |

## Branches and commits

- Work on a branch: `feat/…`, `fix/…`, `chore/…`, `test/…`.
- Commit messages follow the same prefixes, e.g. `feat: …`, `fix: …`.
- Open a pull request into `main`; keep each PR to one topic.
