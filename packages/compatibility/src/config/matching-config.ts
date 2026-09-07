// =============================================================================
// PREMA Compatibility Engine — Matching Configuration
// =============================================================================
// Centralized, configurable weights and settings.
// All weights are stored here — NEVER hard-coded in application logic.
// =============================================================================

import type { MatchingConfig } from '../types';
export type { MatchingConfig } from '../types';

/**
 * Default V1 matching configuration.
 *
 * Product hypothesis weights:
 * - Astrology: 50% (core cultural differentiator)
 * - Personality + Communication: 20%
 * - Relationship Goals: 15% (strong practical filter)
 * - Lifestyle: 10%
 * - Interests: 5%
 *
 * Communication is embedded within the personality weight for V1.
 * The personality weight (0.20) is split internally: 60% personality, 40% communication.
 */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  algorithmVersion: 'prema_v1',
  weightsVersion: 'weights_v1',

  // Layer weights — MUST sum to 1.0
  astrologyWeight: 0.50,
  personalityWeight: 0.12,   // 60% of 0.20
  communicationWeight: 0.08, // 40% of 0.20
  valuesWeight: 0.00,        // values signals embedded in relationship goals for V1
  relationshipGoalsWeight: 0.15,
  lifestyleWeight: 0.10,
  interestsWeight: 0.05,

  // Numerology — metadata only for V1 (computed & displayed, not weighted)
  numerologyMode: 'metadata_only',
  numerologyWeight: 0.00,

  // Discovery
  discoveryThreshold: 70,
  maxRecommendations: 5,

  // Astrology internal sub-weights
  astrologySubWeights: {
    gunaMilan: 0.70,
    vedicSignals: 0.20,
    manglik: 0.10,
  },
};

/**
 * Validates that a matching configuration is internally consistent.
 * Throws if weights don't sum to 1.0 (within floating-point tolerance)
 * or if any weight is negative.
 */
export function validateMatchingConfig(config: MatchingConfig): void {
  const weights = [
    config.astrologyWeight,
    config.personalityWeight,
    config.communicationWeight,
    config.valuesWeight,
    config.relationshipGoalsWeight,
    config.lifestyleWeight,
    config.interestsWeight,
  ];

  // If numerology has a small weight, include it
  if (config.numerologyMode === 'small_weight') {
    weights.push(config.numerologyWeight);
  }

  for (const w of weights) {
    if (w < 0) {
      throw new Error(`Negative weight detected: ${w}`);
    }
  }

  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1.0) > 0.001) {
    throw new Error(
      `Weights must sum to 1.0, but sum is ${sum.toFixed(4)}. ` +
      `Weights: ${JSON.stringify(weights)}`
    );
  }

  // Validate astrology sub-weights
  const subSum =
    config.astrologySubWeights.gunaMilan +
    config.astrologySubWeights.vedicSignals +
    config.astrologySubWeights.manglik;

  if (Math.abs(subSum - 1.0) > 0.001) {
    throw new Error(
      `Astrology sub-weights must sum to 1.0, but sum is ${subSum.toFixed(4)}`
    );
  }
}

/**
 * Creates a matching config by merging overrides onto defaults.
 * Validates the result before returning.
 */
export function createMatchingConfig(
  overrides: Partial<MatchingConfig> = {}
): MatchingConfig {
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
