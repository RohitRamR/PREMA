import type { ConfidenceLevel } from '../types';

/**
 * Input needed to calculate confidence. Completeness values are 0–1.
 */
export interface ConfidenceInput {
  hasBirthTimeA: boolean;
  hasBirthTimeB: boolean;
  personalityCompletenessA: number;
  personalityCompletenessB: number;
  communicationCompletenessA: number;
  communicationCompletenessB: number;
  valuesCompletenessA: number;
  valuesCompletenessB: number;
  lifestyleCompletenessA: number;
  lifestyleCompletenessB: number;
  goalsCompletenessA: number;
  goalsCompletenessB: number;
  /** Confidence of the Kundli layer; the overall result can never exceed it. */
  astrologyConfidence?: ConfidenceLevel;
  algorithmVersion: string;
}

const RANK: Record<ConfidenceLevel, number> = { insufficient_data: 0, low: 1, moderate: 2, strong: 3 };

/**
 * Calculates the confidence level of a match from data completeness.
 *   < 30 insufficient_data · < 55 low · < 80 moderate · ≥ 80 strong
 * then capped by the astrology layer's own confidence.
 */
export function calculateConfidence(input: ConfidenceInput): ConfidenceLevel {
  let score = 0;
  if (input.hasBirthTimeA) score += 15;
  if (input.hasBirthTimeB) score += 15;

  const avg = (a: number, b: number) => (clamp01(a) + clamp01(b)) / 2;
  score += avg(input.personalityCompletenessA, input.personalityCompletenessB) * 15;
  score += avg(input.communicationCompletenessA, input.communicationCompletenessB) * 10;
  score += avg(input.valuesCompletenessA, input.valuesCompletenessB) * 15;
  score += avg(input.lifestyleCompletenessA, input.lifestyleCompletenessB) * 10;
  score += avg(input.goalsCompletenessA, input.goalsCompletenessB) * 20;

  let level: ConfidenceLevel =
    score < 30 ? 'insufficient_data' : score < 55 ? 'low' : score < 80 ? 'moderate' : 'strong';

  if (input.astrologyConfidence && RANK[input.astrologyConfidence] < RANK[level]) {
    level = input.astrologyConfidence;
  }
  return level;
}

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
}

/**
 * Fraction (0–1) of `requiredFields` that are present (not null/undefined) on `profile`.
 */
export function calculateProfileCompleteness(profile: unknown, requiredFields: string[]): number {
  if (!profile || typeof profile !== 'object') return 0;
  if (requiredFields.length === 0) return 1;
  const rec = profile as Record<string, unknown>;
  const filled = requiredFields.filter((f) => rec[f] !== undefined && rec[f] !== null).length;
  return filled / requiredFields.length;
}
