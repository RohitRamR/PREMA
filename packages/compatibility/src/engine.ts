// =============================================================================
// PREMA Compatibility Engine — Main Entry Point
// =============================================================================
// This is the primary public API for the compatibility engine.
// It re-exports the scoring engine and provides convenience functions.
// =============================================================================

import type { CompatibilityResult, MatchingConfig, UserTraits } from './types';
import type { FullCompatibilityInput, FullCompatibilityOutput } from './scoring/scoring-engine';
import { calculateFullCompatibility } from './scoring/scoring-engine';
import { DEFAULT_MATCHING_CONFIG, createMatchingConfig } from './config/matching-config';

/**
 * PREMA Compatibility Engine V1.
 *
 * The primary class for calculating compatibility between two users.
 * Delegates to the modular scoring pipeline internally.
 */
export class PremaCompatibilityEngine {
  private config: MatchingConfig;

  constructor(config?: Partial<MatchingConfig>) {
    this.config = config ? createMatchingConfig(config) : DEFAULT_MATCHING_CONFIG;
  }

  /**
   * Calculate full compatibility between two users.
   * This is the primary entry point for the compatibility system.
   */
  calculateCompatibility(input: FullCompatibilityInput): FullCompatibilityOutput {
    return calculateFullCompatibility(input, this.config);
  }

  /**
   * Get the current matching configuration.
   */
  getConfig(): MatchingConfig {
    return { ...this.config };
  }

  /**
   * Update the matching configuration.
   * Validates the new config before applying.
   */
  updateConfig(overrides: Partial<MatchingConfig>): void {
    this.config = createMatchingConfig(overrides);
  }

  /**
   * Get the algorithm version string.
   */
  getAlgorithmVersion(): string {
    return this.config.algorithmVersion;
  }
}

// ---- Legacy compatibility ----

/**
 * @deprecated Use PremaCompatibilityEngine instead.
 * Preserved for backward compatibility with existing code.
 */
export class CompatibilityEngineV1 {
  calculate(userA: UserTraits, userB: UserTraits): CompatibilityResult {
    const WEIGHTS = {
      astrology: 0.55,
      personality: 0.15,
      relationshipGoals: 0.15,
      values: 0.10,
      lifestyle: 0.05,
    };

    const astrologyScore = userA.astrologyScore ?? 85;
    const personalityScore = this.calculateOverlap(userA.personalityTraits, userB.personalityTraits);
    const valuesScore = this.calculateOverlap(userA.values, userB.values);
    const lifestyleScore = this.calculateOverlap(userA.lifestyle, userB.lifestyle);
    const relationshipScore = userA.relationshipGoals === userB.relationshipGoals ? 100 : 40;

    const totalScore = Math.round(
      (astrologyScore * WEIGHTS.astrology) +
      (personalityScore * WEIGHTS.personality) +
      (valuesScore * WEIGHTS.values) +
      (lifestyleScore * WEIGHTS.lifestyle) +
      (relationshipScore * WEIGHTS.relationshipGoals)
    );

    const reasons: string[] = [];
    const frictionPoints: string[] = [];

    if (relationshipScore === 100) reasons.push('You share the same long-term relationship goals.');
    if (valuesScore > 80) reasons.push('You share similar priorities around fundamental values.');
    if (lifestyleScore < 50) frictionPoints.push('Lifestyle pace and daily habits may differ.');

    return {
      userAId: userA.id,
      userBId: userB.id,
      score: totalScore,
      confidence: 'moderate',
      breakdown: {
        astrology: astrologyScore,
        numerology: 0,
        personality: personalityScore,
        communication: 0,
        values: valuesScore,
        lifestyle: lifestyleScore,
        relationshipGoals: relationshipScore,
        interests: 0,
      },
      strengths: reasons,
      frictionPoints,
      reasons,
      algorithmVersion: 'v1_legacy',
      astrologyMethodologyVersion: 'none',
      numerologyMethodologyVersion: 'none',
      weightsVersion: 'legacy',
      generatedAt: new Date(),
    };
  }

  private calculateOverlap(listA: string[], listB: string[]): number {
    if (!listA.length || !listB.length) return 50;
    const intersection = listA.filter(x => listB.includes(x));
    const overlapPercentage = (intersection.length / Math.max(listA.length, listB.length)) * 100;
    return 40 + (overlapPercentage * 0.6);
  }
}
