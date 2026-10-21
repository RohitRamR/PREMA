// =============================================================================
// PREMA Compatibility Engine — Matchmaker
// =============================================================================
// Pairwise scoring with a symmetric cache, and "best matches for one user".
// =============================================================================

import type { MatchingConfig } from '../types';
import { DEFAULT_MATCHING_CONFIG } from '../config/matching-config';
import { calculateFullCompatibility, type FullCompatibilityOutput } from '../scoring/scoring-engine';
import { type MatchProfile, toCompatibilityInput } from './match-profile';

export function pairKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;
}

/**
 * Caches pair results. Every layer is symmetric (A↔B gives the same score), so
 * one computation serves both directions.
 */
export class PairScoreCache {
  private readonly cache = new Map<string, FullCompatibilityOutput>();

  constructor(private readonly config: MatchingConfig = DEFAULT_MATCHING_CONFIG) {}

  get size(): number {
    return this.cache.size;
  }

  score(a: MatchProfile, b: MatchProfile): FullCompatibilityOutput {
    const key = pairKey(a.user.id, b.user.id);
    let out = this.cache.get(key);
    if (!out) {
      const [first, second] = a.user.id < b.user.id ? [a, b] : [b, a];
      out = calculateFullCompatibility(toCompatibilityInput(first, second), this.config);
      this.cache.set(key, out);
    }
    return out;
  }

  clear(): void {
    this.cache.clear();
  }
}

export interface RankedMatch {
  candidateId: string;
  score: number;
  output: FullCompatibilityOutput;
}

/** Deterministic ordering: score ↓, Kundli ↓, relationship goals ↓, preference fit ↓, id ↑. */
export function compareMatches(a: RankedMatch, b: RankedMatch): number {
  const ra = a.output.result;
  const rb = b.output.result;
  return (
    rb.score - ra.score ||
    rb.breakdown.astrology - ra.breakdown.astrology ||
    rb.breakdown.relationshipGoals - ra.breakdown.relationshipGoals ||
    rb.breakdown.preferences - ra.breakdown.preferences ||
    (a.candidateId < b.candidateId ? -1 : a.candidateId > b.candidateId ? 1 : 0)
  );
}

export interface FindBestMatchesOptions {
  /** Max results (default: config.maxRecommendations). */
  limit?: number;
  /** Minimum score (default: config.discoveryThreshold). */
  minScore?: number;
  cache?: PairScoreCache;
}

/**
 * Best matches for one user: dealbreakers removed, ranked by mutual score.
 */
export function findBestMatches(
  seeker: MatchProfile,
  candidates: MatchProfile[],
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG,
  options: FindBestMatchesOptions = {}
): RankedMatch[] {
  const cache = options.cache ?? new PairScoreCache(config);
  const minScore = options.minScore ?? config.discoveryThreshold;
  const limit = options.limit ?? config.maxRecommendations;

  const ranked: RankedMatch[] = [];
  for (const c of candidates) {
    if (c.user.id === seeker.user.id) continue;
    const output = cache.score(seeker, c);
    if (!output.result.isEligible || output.result.score < minScore) continue;
    ranked.push({ candidateId: c.user.id, score: output.result.score, output });
  }
  return ranked.sort(compareMatches).slice(0, limit);
}
