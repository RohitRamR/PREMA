# @prema/compatibility

PREMA's matching engine. Given two people's birth details and preferences it
returns a 0–100 match score, a full Vedic Kundli (Guna Milan) breakdown and
plain-language reasons. Given a whole pool, it finds the best pairs.

**All birth times are Indian Standard Time (IST, UTC+05:30) by default.**
"06:30" means 6:30 AM in India. Births abroad can pass `birthTimezone`
(e.g. `"America/New_York"`).

## How the score is built

| Layer | Weight | What it measures |
|---|---|---|
| Vedic Kundli | 45% | Guna Milan out of 36, Manglik, doshas, Vedic signals |
| Numerology | 10% | Moolank, Bhagyank / Life Path, name numbers |
| Western horoscope | 5% | Sun-sign aspect and element harmony |
| **Stars total** | **60%** | |
| Mutual preferences | 12% | Each person fits what the other wants (both ways) |
| Relationship goals | 10% | Intent, marriage timeline, children |
| Values | 7% | Family, career, money, spirituality… |
| Personality + communication | 7% | Questionnaire traits |
| Lifestyle | 3% | Sleep, food, social life… |
| Interests | 1% | Shared hobbies |

Rules that always apply:

- **Dealbreakers first.** Diet, smoking, religion, height, education,
  "18+ Guna only" or "no Manglik mismatch" marked as a dealbreaker remove a
  person completely, in both directions. No score can rescue them.
- **Missing questionnaires are skipped, not guessed.** Their weight is shared
  among the layers both people filled in.
- **Serious doshas are penalised.** An uncancelled Nadi or Bhakoot dosha
  lowers the Kundli score; below the traditional 18 Guna it is capped.
- **Uncertain charts count less.** Without a birth time, if the Moon changed
  nakshatra that day, the Kundli score is pulled toward neutral.

## Usage

```ts
import { buildMatchProfile, findBestMatches, allocateDailyMatches } from '@prema/compatibility';

const priya = buildMatchProfile({
  user: { id: 'priya', firstName: 'Priya', age: 26, gender: 'female', relationshipIntention: 'long_term',
          isVerified: true, isActive: true, isSafetyRestricted: false, blockedUserIds: [] },
  prefs: { userId: 'priya', targetGender: ['male'], minAge: 25, maxAge: 34, maxDistanceKm: 50 },
  birthData: { dateOfBirth: '1999-04-12', exactBirthTime: '08:45', birthPlaceLat: 13.08, birthPlaceLon: 80.27 },
});

const top = findBestMatches(priya, pool);            // one person's best matches
const today = allocateDailyMatches(pool, undefined, { capacity: 3 }); // everyone, at once
```

`allocateDailyMatches` has two strategies:

- `stable` (default): highest-scoring pairs first. No two people would both
  rather be with each other than with the match they were given.
- `max_total`: maximises the sum of all scores (exact for up to 20 people).

## Layout

```
src/
├── astrology/       Ephemeris (IST, Lahiri), Kundli, Guna Milan, Manglik
├── horoscope/       Western sun sign and compatibility
├── numerology/      Moolank, Bhagyank, Life Path, name numbers
├── preferences/     Two-way preference fit
├── filters/         Hard filters and dealbreakers
├── personality/ values/ lifestyle/ relationship-goals/ interests/
├── scoring/         Combines every layer, confidence, explanations
├── matchmaking/     Match profiles, best matches, daily pairing
└── config/          Weights (must sum to 1)
```

## Verification

```bash
npx vitest run                          # 125 tests
npx vite-node scripts/demo-match.ts     # 20 sample people → best pairs
npx vite-node scripts/quality-report.ts # 400 mock users → quality report
```

The tests cover reference charts (India 1947, Ram Mandir 2024 and
N. Modi 1950 all match published Kundlis), every nakshatra/pada combination,
every birth date 1950–2010, all filters and dealbreakers, messy data, and
best-pair optimality against brute force.

Kundli tables follow OnlineJyotish (Gana, Vashya) and Maitreya (Yoni).
Calculators differ slightly by tradition, so a site may show ±2 Guna.
