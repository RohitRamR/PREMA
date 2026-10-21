// Fuzz / property tests: thousands of random mock profiles, including messy data.
import { calculateFullCompatibility } from '../src/scoring/scoring-engine';
import { toCompatibilityInput } from '../src/matchmaking/match-profile';
import { allocateDailyMatches, buildPairEdges } from '../src/matchmaking/daily-pairing';
import { findBestMatches, PairScoreCache } from '../src/matchmaking/matchmaker';
import { DEFAULT_MATCHING_CONFIG } from '../src/config/matching-config';
import { buildAstroProfile } from '../src/astrology/moon-calculator';
import { buildNumerologyProfile } from '../src/numerology/numerology-calculator';
import { calculateNumerologyCompatibility } from '../src/numerology/numerology-compatibility';
import { buildSunSignProfile } from '../src/horoscope/sun-sign';
import { calculateSunSignCompatibility } from '../src/horoscope/sun-sign-compatibility';
import { computeManglikProfile } from '../src/astrology/manglik';
import { seededRandom } from './fixtures';
import { randomProfile, pad } from './fuzz-gen';

const cfg = DEFAULT_MATCHING_CONFIG;

function checkResult(out: ReturnType<typeof calculateFullCompatibility>) {
  const r = out.result;
  expect(Number.isFinite(r.score)).toBe(true);
  expect(Number.isInteger(r.score)).toBe(true);
  expect(r.score).toBeGreaterThanOrEqual(0);
  expect(r.score).toBeLessThanOrEqual(100);
  for (const [k, v] of Object.entries(r.breakdown)) {
    if (!Number.isFinite(v) || v < 0 || v > 100) throw new Error(`breakdown.${k} = ${v}`);
  }
  if (!r.isEligible) {
    expect(r.score).toBe(0);
    expect(r.reasons.length).toBeGreaterThan(0);
  } else {
    const w = Object.values(out.appliedWeights).reduce((s, x) => s + (x ?? 0), 0);
    expect(w).toBeCloseTo(1, 3);
  }
}

describe('Fuzz: every pair in a 200-person pool (20,100 pairs) with clean data', () => {
  const rnd = seededRandom(2026);
  const pool = Array.from({ length: 200 }, (_, i) => randomProfile(rnd, i));

  it('every score is a finite integer 0–100, symmetric, and dealbreakers are honoured', () => {
    let checked = 0;
    let eligible = 0;
    for (let x = 0; x < pool.length; x++) for (let y = x; y < pool.length; y++) {
      const a = pool[x]!;
      const b = pool[y]!;
      const ab = calculateFullCompatibility(toCompatibilityInput(a, b), cfg);
      const ba = calculateFullCompatibility(toCompatibilityInput(b, a), cfg);
      checkResult(ab);
      expect(ab.result.score).toBe(ba.result.score);
      expect(ab.result.isEligible).toBe(ba.result.isEligible);
      if (a.user.id === b.user.id) expect(ab.result.isEligible).toBe(false);
      if (ab.result.isEligible) {
        eligible++;
        // No dealbreaker may be violated in an eligible pair.
        const pre = ab.detailedBreakdown!.preferences;
        expect(pre.aToB.failedDealbreakers).toEqual([]);
        expect(pre.bToA.failedDealbreakers).toEqual([]);
        const astro = ab.detailedBreakdown!.astrology;
        for (const p of [a.prefs, b.prefs]) {
          if (p.minGunaScore?.importance === 'dealbreaker') expect(astro.gunaMilan.totalScore).toBeGreaterThanOrEqual(p.minGunaScore.score);
          if (p.manglik?.importance === 'dealbreaker') expect(astro.manglik?.status).not.toBe('mismatch');
        }
      }
      checked++;
    }
    expect(checked).toBe(200 * 201 / 2);
    expect(eligible).toBeGreaterThan(400);
  });
});

describe('Fuzz: messy data (NaN, out-of-range, missing fields)', () => {
  it('never produces NaN or out-of-range scores', () => {
    const rnd = seededRandom(99);
    const pool = Array.from({ length: 80 }, (_, i) => randomProfile(rnd, i, true));
    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j += 3) {
        checkResult(calculateFullCompatibility(toCompatibilityInput(pool[i]!, pool[j]!), cfg));
      }
    }
  });
});

describe('Exhaustive birth dates: every day 1950–2010 builds a valid chart', () => {
  it('Kundli, numerology and sun sign are valid for ~22,000 dates (time unknown)', () => {
    const start = Date.UTC(1950, 0, 1);
    const end = Date.UTC(2010, 11, 31);
    let count = 0;
    for (let t = start; t <= end; t += 86400000) {
      const d = new Date(t).toISOString().slice(0, 10);
      const astro = buildAstroProfile({ userId: 'x', dateOfBirth: d });
      expect(astro.moonLongitude).toBeGreaterThanOrEqual(0);
      expect(astro.moonLongitude).toBeLessThan(360);
      expect(astro.nakshatraPada).toBeGreaterThanOrEqual(1);
      expect(astro.nakshatraPada).toBeLessThanOrEqual(4);
      expect(astro.rashi.index).toBe(Math.floor(astro.moonLongitude / 30) + 1);
      const num = buildNumerologyProfile('x', d);
      expect(num.moolank).toBeGreaterThanOrEqual(1);
      expect(num.moolank).toBeLessThanOrEqual(9);
      expect(num.bhagyank).toBeGreaterThanOrEqual(1);
      expect(num.bhagyank).toBeLessThanOrEqual(9);
      count++;
    }
    expect(count).toBeGreaterThan(22000);
  }, 120_000);

  it('the Moon advances 11.5°–15.5° per day (no time-zone or ephemeris glitches)', () => {
    let prev = buildAstroProfile({ userId: 'x', dateOfBirth: '1990-01-01', exactBirthTime: '12:00' }).moonLongitude;
    for (let t = Date.UTC(1990, 0, 2); t <= Date.UTC(1992, 0, 1); t += 86400000) {
      const cur = buildAstroProfile({ userId: 'x', dateOfBirth: new Date(t).toISOString().slice(0, 10), exactBirthTime: '12:00' }).moonLongitude;
      const step = (cur - prev + 360) % 360;
      expect(step).toBeGreaterThan(11.5);
      expect(step).toBeLessThan(15.5);
      prev = cur;
    }
  });

  it('special dates: leap day, year boundaries and midnight births', () => {
    for (const [d, t] of [['1996-02-29', '00:00'], ['1999-12-31', '23:59'], ['2000-01-01', '00:00'], ['1960-01-01', '00:01'], ['2005-12-31', '23:59']]) {
      const p = buildAstroProfile({ userId: 'x', dateOfBirth: d!, exactBirthTime: t!, birthPlaceLat: 19.07, birthPlaceLon: 72.88 });
      expect(p.hasBirthTime).toBe(true);
      expect(p.lagnaRashi).toBeDefined();
      expect(buildNumerologyProfile('x', d!).moolank).toBeGreaterThan(0);
    }
  });
});

describe('Exhaustive small tables', () => {
  it('all 12 × 12 sun-sign pairs are symmetric and bounded', () => {
    const signs = Array.from({ length: 12 }, (_, i) => buildSunSignProfile({ userId: 'x', dateOfBirth: `2001-${pad(((i + 3) % 12) + 1)}-05`, exactBirthTime: '12:00' }));
    for (const a of signs) for (const b of signs) {
      const ab = calculateSunSignCompatibility(a, b).score;
      expect(ab).toBe(calculateSunSignCompatibility(b, a).score);
      expect(ab).toBeGreaterThanOrEqual(0);
      expect(ab).toBeLessThanOrEqual(100);
    }
  });
  it('all Moolank × Life Path combinations via 400 random date pairs stay symmetric', () => {
    const rnd = seededRandom(5);
    for (let n = 0; n < 400; n++) {
      const d1 = `19${50 + Math.floor(rnd() * 50)}-${pad(1 + Math.floor(rnd() * 12))}-${pad(1 + Math.floor(rnd() * 28))}`;
      const d2 = `19${50 + Math.floor(rnd() * 50)}-${pad(1 + Math.floor(rnd() * 12))}-${pad(1 + Math.floor(rnd() * 28))}`;
      const a = buildNumerologyProfile('a', d1, 'Asha Rao');
      const b = buildNumerologyProfile('b', d2, 'Vikram Singh');
      expect(calculateNumerologyCompatibility(a, b).score).toBe(calculateNumerologyCompatibility(b, a).score);
    }
  });
  it('all 12 × 12 × 12 Moon/Mars/Lagna sign combinations give a consistent Manglik status', () => {
    for (let moon = 0; moon < 12; moon++) for (let mars = 0; mars < 12; mars++) for (let lagna = 0; lagna < 12; lagna++) {
      const m = computeManglikProfile(moon * 30 + 15, mars * 30 + 15, lagna * 30 + 15);
      expect(m.isManglik).toBe(m.severity !== 'none');
      if (m.doshaFrom.length === 0) expect(m.severity).toBe('none');
      if ([0, 7, 9].includes(mars)) expect(m.severity).toBe('none'); // Aries, Scorpio own; Capricorn exalted
      if (m.severity === 'strong') expect(m.doshaFrom).toEqual(['lagna', 'moon']);
    }
  });
});

describe('Fuzz: matchmaking at scale', () => {
  const rnd = seededRandom(7);
  const pool = Array.from({ length: 300 }, (_, i) => randomProfile(rnd, i));
  const cache = new PairScoreCache(cfg);

  it.each([1, 2, 3, 5])('capacity %i: no person over capacity, no duplicates, only eligible pairs', (capacity) => {
    for (const strategy of ['stable', 'max_total'] as const) {
      const r = allocateDailyMatches(pool, cfg, { capacity, strategy, cache, minScore: 0 });
      const deg: Record<string, number> = {};
      const keys = new Set<string>();
      for (const e of r.pairs) {
        expect(keys.has(e.key)).toBe(false);
        keys.add(e.key);
        expect(e.output.result.isEligible).toBe(true);
        expect(e.a).not.toBe(e.b);
        deg[e.a] = (deg[e.a] ?? 0) + 1;
        deg[e.b] = (deg[e.b] ?? 0) + 1;
      }
      for (const d of Object.values(deg)) expect(d).toBeLessThanOrEqual(capacity);
      expect(r.pairs.length).toBeGreaterThan(40 * Math.min(capacity, 2));
      // matchesByUser agrees with pairs
      for (const [u, list] of Object.entries(r.matchesByUser)) expect(list.length).toBe(deg[u] ?? 0);
    }
  });

  it('stable matching has no blocking pair at capacity 2', () => {
    const edges = buildPairEdges(pool, cfg, { cache, minScore: 0 });
    const r = allocateDailyMatches(pool, cfg, { capacity: 2, cache, minScore: 0 });
    const worst: Record<string, number> = {};
    const deg: Record<string, number> = {};
    for (const e of r.pairs) for (const u of [e.a, e.b]) {
      deg[u] = (deg[u] ?? 0) + 1;
      worst[u] = Math.min(worst[u] ?? Infinity, e.adjustedScore);
    }
    const chosen = new Set(r.pairs.map((e) => e.key));
    for (const e of edges) {
      if (chosen.has(e.key)) continue;
      const wantsA = (deg[e.a] ?? 0) < 2 || worst[e.a]! < e.adjustedScore;
      const wantsB = (deg[e.b] ?? 0) < 2 || worst[e.b]! < e.adjustedScore;
      expect(wantsA && wantsB).toBe(false);
    }
  });

  it('findBestMatches agrees with brute force for 25 random seekers', () => {
    for (let s = 0; s < 25; s++) {
      const seeker = pool[s * 11]!;
      const best = findBestMatches(seeker, pool, cfg, { limit: 5, minScore: 0, cache });
      const all = pool
        .filter((p) => p.user.id !== seeker.user.id)
        .map((p) => cache.score(seeker, p).result)
        .filter((r) => r.isEligible)
        .map((r) => r.score)
        .sort((x, y) => y - x)
        .slice(0, 5);
      expect(best.map((b) => b.score)).toEqual(all);
    }
  });
});
