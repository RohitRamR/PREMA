// =============================================================================
// PREMA Compatibility Engine — Matching Configuration
// =============================================================================
// Centralized, configurable weights and settings.
// All weights are stored here — NEVER hard-coded in application logic.
// =============================================================================

import type { MatchingConfig } from '../types';
export type { MatchingConfig } from '../types';

/**
 * Default V2 matching configuration — astrology-first.
 *
 *   Stars (60%)                     Everything else (40%)
 *   ─ Vedic Kundli        0.45      ─ Mutual preferences   0.12
 *   ─ Numerology          0.10      ─ Relationship goals   0.10
 *   ─ Western horoscope   0.05      ─ Values               0.07
 *                                   ─ Personality          0.04
 *                                   ─ Communication        0.03
 *                                   ─ Lifestyle            0.03
 *                                   ─ Interests            0.01
 *
 * Dealbreakers always run first; no score can rescue a pair that fails one.
 */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  algorithmVersion: 'prema_v2',
  weightsVersion: 'weights_v2',

  // Layer weights — MUST sum to 1.0
  astrologyWeight: 0.45,
  horoscopeWeight: 0.05,
  preferenceWeight: 0.12,
  personalityWeight: 0.04,
  communicationWeight: 0.03,
  valuesWeight: 0.07,
  relationshipGoalsWeight: 0.10,
  lifestyleWeight: 0.03,
  interestsWeight: 0.01,

  numerologyMode: 'small_weight',
  numerologyWeight: 0.10,

  // Discovery
  discoveryThreshold: 60,
  maxRecommendations: 5,

  // Kundli internal sub-weights
  astrologySubWeights: {
    gunaMilan: 0.70,
    vedicSignals: 0.15,
    manglik: 0.15,
  },
};

const LAYER_KEYS = [
  'astrologyWeight', 'horoscopeWeight', 'preferenceWeight', 'personalityWeight',
  'communicationWeight', 'valuesWeight', 'relationshipGoalsWeight',
  'lifestyleWeight', 'interestsWeight',
] as const;

/**
 * Validates that a matching configuration is internally consistent.
 * Throws if weights don't sum to 1.0 (±0.001) or any weight is negative / not finite.
 * Numerology counts toward the sum only in 'small_weight' mode.
 */
export function validateMatchingConfig(config: MatchingConfig): void {
  const weights: number[] = LAYER_KEYS.map((k) => config[k]);
  if (config.numerologyMode === 'small_weight') weights.push(config.numerologyWeight);

  for (const w of weights) {
    if (!Number.isFinite(w) || w < 0) throw new Error(`Invalid weight detected: ${w}`);
  }

  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1.0) > 0.001) {
    throw new Error(`Weights must sum to 1.0, but sum is ${sum.toFixed(4)}. Weights: ${JSON.stringify(weights)}`);
  }

  const sub = config.astrologySubWeights;
  const subSum = sub.gunaMilan + sub.vedicSignals + sub.manglik;
  if ([sub.gunaMilan, sub.vedicSignals, sub.manglik].some((w) => !Number.isFinite(w) || w < 0)) {
    throw new Error('Astrology sub-weights must be non-negative numbers');
  }
  if (Math.abs(subSum - 1.0) > 0.001) {
    throw new Error(`Astrology sub-weights must sum to 1.0, but sum is ${subSum.toFixed(4)}`);
  }

  if (config.discoveryThreshold < 0 || config.discoveryThreshold > 100) {
    throw new Error('discoveryThreshold must be between 0 and 100');
  }
  if (!Number.isInteger(config.maxRecommendations) || config.maxRecommendations < 1) {
    throw new Error('maxRecommendations must be a positive integer');
  }
}

/** The share of the score that comes from astrology + numerology + horoscope. */
export function starsShare(config: MatchingConfig): number {
  return config.astrologyWeight + config.horoscopeWeight +
    (config.numerologyMode === 'small_weight' ? config.numerologyWeight : 0);
}

/**
 * Creates a matching config by merging overrides onto defaults.
 * Validates the result before returning.
 */
export function createMatchingConfig(overrides: Partial<MatchingConfig> = {}): MatchingConfig {
  const config: MatchingConfig = {
    ...DEFAULT_MATCHING_CONFIG,
    ...overrides,
    astrologySubWeights: {
      ...DEFAULT_MATCHING_CONFIG.astrologySubWeights,
      ...(overrides.astrologySubWeights ?? {}),
    },
  };
  validateMatchingConfig(config);
  return config;
}
