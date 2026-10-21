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
├── supabase/            Database schema and migrations
├── docs/                Product and architecture plans
└── tools/codemods/      One-off scripts kept for history (not run)
```

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
