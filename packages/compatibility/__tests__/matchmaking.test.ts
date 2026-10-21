import { allocateDailyMatches, buildPairEdges, type PairEdge } from '../src/matchmaking/daily-pairing';
import { findBestMatches, PairScoreCache } from '../src/matchmaking/matchmaker';
import { DEFAULT_MATCHING_CONFIG } from '../src/config/matching-config';
import { person, randomPool } from './fixtures';
import type { MatchProfile } from '../src/matchmaking/match-profile';

const config = DEFAULT_MATCHING_CONFIG;

/** Brute-force maximum-weight matching (capacity 1) for small pools. */
function bruteForceBest(edges: PairEdge[]): number {
  let best = 0;
  const rec = (i: number, used: Set<string>, total: number) => {
    if (i === edges.length) { best = Math.max(best, total); return; }
    rec(i + 1, used, total);
    const e = edges[i]!;
    if (!used.has(e.a) && !used.has(e.b)) {
      used.add(e.a); used.add(e.b);
      rec(i + 1, used, total + e.adjustedScore);
      used.delete(e.a); used.delete(e.b);
    }
  };
  rec(0, new Set(), 0);
  return best;
}

describe('findBestMatches', () => {
  const pool = randomPool(40, 7);
  const seeker = pool[0]!;

  it('returns only eligible candidates, best first, deterministically', () => {
    const r1 = findBestMatches(seeker, pool, config, { limit: 10, minScore: 0 });
    const r2 = findBestMatches(seeker, [...pool].reverse(), config, { limit: 10, minScore: 0 });
    expect(r1.map((m) => m.candidateId)).toEqual(r2.map((m) => m.candidateId));
    for (let i = 1; i < r1.length; i++) expect(r1[i - 1]!.score).toBeGreaterThanOrEqual(r1[i]!.score);
    for (const m of r1) {
      expect(m.output.result.isEligible).toBe(true);
      expect(m.candidateId).not.toBe(seeker.user.id);
    }
  });

  it('never recommends someone who breaks a dealbreaker, however good the Kundli', () => {
    const vegSeeker = person({ id: 'veg', gender: 'female', dob: '1995-05-05', prefs: { diet: { accepted: ['vegetarian'], importance: 'dealbreaker' } } });
    const candidates = pool.filter((p) => p.user.gender === 'male');
    const res = findBestMatches(vegSeeker, candidates, config, { limit: 50, minScore: 0 });
    for (const m of res) {
      const c = candidates.find((p) => p.user.id === m.candidateId)!;
      expect(c.user.attributes?.diet).toBe('vegetarian');
    }
  });

  it('when everything else is equal, the better Kundli ranks first (astrology-first)', () => {
    const seekerF = person({ id: 'f', gender: 'female', dob: '1996-02-14', time: '07:00' });
    // Same profile data, different birth moments → only the stars differ.
    const men: MatchProfile[] = [];
    for (let d = 1; d <= 28; d += 3) men.push(person({ id: `m${d}`, gender: 'male', dob: `1994-06-${String(d).padStart(2, '0')}`, time: '12:00' }));
    const res = findBestMatches(seekerF, men, config, { limit: men.length, minScore: 0 });
    for (let i = 1; i < res.length; i++) {
      const prev = res[i - 1]!.output.result.breakdown;
      const cur = res[i]!.output.result.breakdown;
      const prevStars = prev.astrology * 0.45 + prev.numerology * 0.1 + prev.horoscope * 0.05;
      const curStars = cur.astrology * 0.45 + cur.numerology * 0.1 + cur.horoscope * 0.05;
      expect(prevStars).toBeGreaterThanOrEqual(curStars - 1); // ±1 for integer rounding
    }
  });
});

describe('allocateDailyMatches', () => {
  const pool = randomPool(200, 42);
  const cache = new PairScoreCache(config);

  it('handles a 200-person pool: valid pairs, capacity respected, no dealbreakers', () => {
    const r = allocateDailyMatches(pool, config, { capacity: 3, cache });
    const counts: Record<string, number> = {};
    const seen = new Set<string>();
    for (const e of r.pairs) {
      expect(seen.has(e.key)).toBe(false);
      seen.add(e.key);
      expect(e.output.result.isEligible).toBe(true);
      expect(e.output.hardFilterResult.pass).toBe(true);
      expect(e.score).toBeGreaterThanOrEqual(config.discoveryThreshold);
      counts[e.a] = (counts[e.a] ?? 0) + 1;
      counts[e.b] = (counts[e.b] ?? 0) + 1;
    }
    for (const c of Object.values(counts)) expect(c).toBeLessThanOrEqual(3);
    expect(r.pairs.length).toBeGreaterThan(0);
  });

  it("'stable' has no blocking pair and always includes the single best pair", () => {
    const edges = buildPairEdges(pool, config, { cache });
    const r = allocateDailyMatches(pool, config, { capacity: 1, cache });
    expect(r.pairs[0]!.key).toBe(edges[0]!.key);
    const bestOf: Record<string, number> = {};
    for (const e of r.pairs) { bestOf[e.a] = e.adjustedScore; bestOf[e.b] = e.adjustedScore; }
    const chosen = new Set(r.pairs.map((e) => e.key));
    for (const e of edges) {
      if (chosen.has(e.key)) continue;
      // A blocking pair would be two people who both prefer each other to their match.
      const aPrefers = (bestOf[e.a] ?? -Infinity) < e.adjustedScore;
      const bPrefers = (bestOf[e.b] ?? -Infinity) < e.adjustedScore;
      expect(aPrefers && bPrefers).toBe(false);
    }
  });

  it("'max_total' equals the brute-force optimum on small pools", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const small = randomPool(12, seed);
      const c = new PairScoreCache(config);
      const edges = buildPairEdges(small, config, { cache: c, minScore: 0 });
      const r = allocateDailyMatches(small, config, { strategy: 'max_total', cache: c, minScore: 0 });
      expect(r.totalAdjustedScore).toBeCloseTo(bruteForceBest(edges), 6);
    }
  });

  it("'max_total' is never worse than 'stable' on large pools", () => {
    const stable = allocateDailyMatches(pool, config, { capacity: 2, cache });
    const best = allocateDailyMatches(pool, config, { capacity: 2, cache, strategy: 'max_total' });
    expect(best.totalAdjustedScore).toBeGreaterThanOrEqual(stable.totalAdjustedScore);
  });

  it('is deterministic regardless of input order', () => {
    const a = allocateDailyMatches(pool, config, { capacity: 2, cache });
    const b = allocateDailyMatches([...pool].reverse(), config, { capacity: 2, cache });
    expect(a.pairs.map((p) => p.key)).toEqual(b.pairs.map((p) => p.key));
  });

  it('de-prioritises over-exposed profiles', () => {
    const edges = buildPairEdges(pool, config, { cache });
    const star = edges[0]!.a;
    const r = allocateDailyMatches(pool, config, { capacity: 1, cache, exposureCounts: { [star]: 30 } });
    expect(r.pairs[0]!.a !== star && r.pairs[0]!.b !== star).toBe(true);
  });
});
