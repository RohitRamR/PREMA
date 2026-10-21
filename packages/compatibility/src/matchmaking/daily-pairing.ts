// =============================================================================
// PREMA Compatibility Engine — Daily Pairing (global best pairs)
// =============================================================================
// Pairs everyone in a pool at once, so the best pairs are made globally and no
// profile is handed to everybody.
//
// Strategies
//  • 'stable' (default) — take the highest-scoring available pair first.
//    Because every pair score is symmetric, this is a STABLE matching: no two
//    people would both rather be with each other than with whom they were
//    given, and the single best pair in the pool is always matched together.
//  • 'max_total' — maximise the sum of all match scores (overall happiness).
//    Exact for one-match-each pools of up to 20 people (bitmask DP);
//    otherwise greedy + local-improvement swaps.
//
// `capacity` = how many matches each person receives today.
// =============================================================================

import type { MatchingConfig } from '../types';
import { DEFAULT_MATCHING_CONFIG } from '../config/matching-config';
import type { FullCompatibilityOutput } from '../scoring/scoring-engine';
import type { MatchProfile } from './match-profile';
import { PairScoreCache, pairKey } from './matchmaker';

export type PairingStrategy = 'stable' | 'max_total';

export interface DailyPairingOptions {
  /** Matches per person (default 1). */
  capacity?: number;
  strategy?: PairingStrategy;
  /** Minimum score to be paired (default: config.discoveryThreshold). */
  minScore?: number;
  /** How often each user was shown recently — heavily shown users are de-prioritised. */
  exposureCounts?: Record<string, number>;
  cache?: PairScoreCache;
}

export interface PairEdge {
  key: string;
  a: string;
  b: string;
  score: number;
  /** Score after exposure penalties — what the allocator optimises. */
  adjustedScore: number;
  astrology: number;
  output: FullCompatibilityOutput;
}

export interface DailyPairingResult {
  pairs: PairEdge[];
  matchesByUser: Record<string, string[]>;
  unmatchedUserIds: string[];
  totalAdjustedScore: number;
  strategy: PairingStrategy;
  capacity: number;
  algorithmVersion: string;
  generatedAt: Date;
}

/** Same rule as ranking.ts: −5 per showing beyond 3 recent showings. */
export function exposurePenalty(count: number | undefined): number {
  return count && count > 3 ? (count - 3) * 5 : 0;
}

function compareEdges(x: PairEdge, y: PairEdge): number {
  return (
    y.adjustedScore - x.adjustedScore ||
    y.astrology - x.astrology ||
    (x.key < y.key ? -1 : x.key > y.key ? 1 : 0)
  );
}

/** All eligible pairs in the pool above the threshold, best first. */
export function buildPairEdges(
  profiles: MatchProfile[],
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG,
  options: DailyPairingOptions = {}
): PairEdge[] {
  const cache = options.cache ?? new PairScoreCache(config);
  const minScore = options.minScore ?? config.discoveryThreshold;
  const exposure = options.exposureCounts ?? {};

  const seen = new Set<string>();
  const unique = profiles.filter((p) => (seen.has(p.user.id) ? false : (seen.add(p.user.id), true)));

  const edges: PairEdge[] = [];
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const pa = unique[i]!;
      const pb = unique[j]!;
      const output = cache.score(pa, pb);
      const r = output.result;
      if (!r.isEligible || r.score < minScore) continue;
      const [a, b] = pa.user.id < pb.user.id ? [pa.user.id, pb.user.id] : [pb.user.id, pa.user.id];
      edges.push({
        key: pairKey(a, b), a, b,
        score: r.score,
        adjustedScore: r.score - exposurePenalty(exposure[a]) - exposurePenalty(exposure[b]),
        astrology: r.breakdown.astrology,
        output,
      });
    }
  }
  return edges.sort(compareEdges);
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

function greedy(edges: PairEdge[], capacity: number): PairEdge[] {
  const used = new Map<string, number>();
  const chosen: PairEdge[] = [];
  for (const e of edges) {
    if ((used.get(e.a) ?? 0) < capacity && (used.get(e.b) ?? 0) < capacity) {
      chosen.push(e);
      used.set(e.a, (used.get(e.a) ?? 0) + 1);
      used.set(e.b, (used.get(e.b) ?? 0) + 1);
    }
  }
  return chosen;
}

/** Exact maximum-weight matching (capacity 1) by bitmask DP. n ≤ 20. */
function exactMaxWeightMatching(edges: PairEdge[]): PairEdge[] {
  const ids = [...new Set(edges.flatMap((e) => [e.a, e.b]))].sort();
  const n = ids.length;
  const index = new Map(ids.map((id, i) => [id, i]));
  const adj: Array<Array<{ j: number; edge: PairEdge }>> = ids.map(() => []);
  for (const e of edges) {
    const i = index.get(e.a)!;
    const j = index.get(e.b)!;
    adj[i]!.push({ j, edge: e });
    adj[j]!.push({ j: i, edge: e });
  }

  const full = (1 << n) - 1;
  const memo = new Float64Array(1 << n).fill(NaN);
  const choice = new Int32Array(1 << n).fill(-2); // -1 = leave unmatched, else partner index

  const solve = (mask: number): number => {
    if (mask === full) return 0;
    if (!Number.isNaN(memo[mask]!)) return memo[mask]!;
    let i = 0;
    while (mask & (1 << i)) i++;
    let best = solve(mask | (1 << i));
    let bestChoice = -1;
    for (const { j, edge } of adj[i]!) {
      if (mask & (1 << j)) continue;
      const v = edge.adjustedScore + solve(mask | (1 << i) | (1 << j));
      if (v > best + 1e-9) {
        best = v;
        bestChoice = j;
      }
    }
    memo[mask] = best;
    choice[mask] = bestChoice;
    return best;
  };
  solve(0);

  const chosen: PairEdge[] = [];
  let mask = 0;
  while (mask !== full) {
    let i = 0;
    while (mask & (1 << i)) i++;
    const j = choice[mask]!;
    if (j < 0) {
      mask |= 1 << i;
    } else {
      chosen.push(adj[i]!.find((x) => x.j === j)!.edge);
      mask |= (1 << i) | (1 << j);
    }
  }
  return chosen;
}

/** Greedy start, then 2-swap and 1-replace improvements until no gain. */
function localImprove(edges: PairEdge[], capacity: number): PairEdge[] {
  const byKey = new Map(edges.map((e) => [e.key, e]));
  const selected = new Map<string, PairEdge>(greedy(edges, capacity).map((e) => [e.key, e]));
  const degree = new Map<string, number>();
  const bump = (id: string, d: number) => degree.set(id, (degree.get(id) ?? 0) + d);
  for (const e of selected.values()) { bump(e.a, 1); bump(e.b, 1); }

  const edgeBetween = (x: string, y: string) => byKey.get(pairKey(x, y));
  const EPS = 1e-9;

  for (let iter = 0; iter < 100; iter++) {
    let improved = false;

    // 2-swap: (a-b, c-d) → (a-c, b-d) or (a-d, b-c)
    const list = [...selected.values()];
    outer: for (let x = 0; x < list.length; x++) {
      for (let y = x + 1; y < list.length; y++) {
        const e1 = list[x]!;
        const e2 = list[y]!;
        if (!selected.has(e1.key) || !selected.has(e2.key)) continue;
        const ids = [e1.a, e1.b, e2.a, e2.b];
        if (new Set(ids).size < 4) continue;
        const old = e1.adjustedScore + e2.adjustedScore;
        for (const [p, q, r, s] of [[e1.a, e2.a, e1.b, e2.b], [e1.a, e2.b, e1.b, e2.a]] as const) {
          const n1 = edgeBetween(p, q);
          const n2 = edgeBetween(r, s);
          if (!n1 || !n2 || selected.has(n1.key) || selected.has(n2.key)) continue;
          if (n1.adjustedScore + n2.adjustedScore > old + EPS) {
            selected.delete(e1.key); selected.delete(e2.key);
            selected.set(n1.key, n1); selected.set(n2.key, n2);
            improved = true;
            break outer;
          }
        }
      }
    }

    // Add / replace: an unused edge whose endpoints have room, or where one
    // endpoint is full but the new edge beats its weakest current edge.
    for (const e of edges) {
      if (selected.has(e.key)) continue;
      const da = degree.get(e.a) ?? 0;
      const db = degree.get(e.b) ?? 0;
      if (da < capacity && db < capacity && e.adjustedScore > 0) {
        selected.set(e.key, e); bump(e.a, 1); bump(e.b, 1);
        improved = true;
        continue;
      }
      if ((da < capacity) !== (db < capacity)) {
        const full = da < capacity ? e.b : e.a;
        const open = full === e.a ? e.b : e.a;
        const weakest = [...selected.values()]
          .filter((s) => s.a === full || s.b === full)
          .sort((s1, s2) => s1.adjustedScore - s2.adjustedScore)[0];
        if (weakest && e.adjustedScore > weakest.adjustedScore + EPS) {
          selected.delete(weakest.key);
          bump(weakest.a, -1); bump(weakest.b, -1);
          selected.set(e.key, e);
          bump(open, 1); bump(full, 1);
          improved = true;
        }
      }
    }

    // Keep degrees consistent after swaps (swaps preserve degree; recompute defensively).
    degree.clear();
    for (const e of selected.values()) { bump(e.a, 1); bump(e.b, 1); }

    if (!improved) break;
  }
  return [...selected.values()].sort(compareEdges);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function allocateDailyMatches(
  profiles: MatchProfile[],
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG,
  options: DailyPairingOptions = {}
): DailyPairingResult {
  const capacity = Math.max(1, Math.floor(options.capacity ?? 1));
  const strategy = options.strategy ?? 'stable';
  const edges = buildPairEdges(profiles, config, options);

  let pairs: PairEdge[];
  if (strategy === 'stable') {
    pairs = greedy(edges, capacity);
  } else {
    const people = new Set(edges.flatMap((e) => [e.a, e.b])).size;
    pairs = capacity === 1 && people <= 20 ? exactMaxWeightMatching(edges) : localImprove(edges, capacity);
  }
  pairs = [...pairs].sort(compareEdges);

  const matchesByUser: Record<string, string[]> = {};
  for (const p of profiles) matchesByUser[p.user.id] = [];
  for (const e of pairs) {
    matchesByUser[e.a]!.push(e.b);
    matchesByUser[e.b]!.push(e.a);
  }

  return {
    pairs,
    matchesByUser,
    unmatchedUserIds: Object.keys(matchesByUser).filter((id) => matchesByUser[id]!.length === 0),
    totalAdjustedScore: pairs.reduce((s, e) => s + e.adjustedScore, 0),
    strategy,
    capacity,
    algorithmVersion: config.algorithmVersion,
    generatedAt: new Date(),
  };
}
