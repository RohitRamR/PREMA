// =============================================================================
// PREMA Compatibility Engine — Personality Scorer
// =============================================================================

import type { PersonalityProfile } from '../types';
import type { 
  TraitDimensionConfig, 
  TraitComparisonResult, 
  PersonalityCompatibilityResult,
  TraitComparisonMode
} from './personality-types';

/**
 * Default dimension configurations for personality traits.
 * The weights sum up to 1.0.
 */
export const DEFAULT_PERSONALITY_CONFIGS: TraitDimensionConfig[] = [
  { name: 'communicationDirectness', displayName: 'Communication Directness', comparisonMode: 'similarity', weight: 0.15 },
  { name: 'socialEnergy', displayName: 'Social Energy', comparisonMode: 'neutral', weight: 0.10 },
  { name: 'independence', displayName: 'Independence', comparisonMode: 'complementarity', weight: 0.10 },
  { name: 'conflictAvoidance', displayName: 'Conflict Avoidance', comparisonMode: 'similarity', weight: 0.12 },
  { name: 'emotionalOpenness', displayName: 'Emotional Openness', comparisonMode: 'similarity', weight: 0.15 },
  { name: 'adventurePreference', displayName: 'Adventure Preference', comparisonMode: 'neutral', weight: 0.08 },
  { name: 'routinePreference', displayName: 'Routine Preference', comparisonMode: 'similarity', weight: 0.08 },
  { name: 'decisionMaking', displayName: 'Decision Making', comparisonMode: 'complementarity', weight: 0.10 },
  { name: 'affectionStyle', displayName: 'Affection Style', comparisonMode: 'similarity', weight: 0.12 }
];

/**
 * Calculates a score for a single trait based on the comparison mode.
 * @param valueA - Trait value for user A (0.0 to 1.0)
 * @param valueB - Trait value for user B (0.0 to 1.0)
 * @param mode - The comparison mode
 * @returns Score from 0 to 100
 */
function scoreTrait(valueA: number, valueB: number, mode: TraitComparisonMode): number {
  const similarityScore = Math.max(0, (1 - Math.abs(valueA - valueB)) * 100);
  const complementarityScore = Math.max(0, 100 - Math.abs(Math.abs(valueA - valueB) - 0.4) * 250);

  switch (mode) {
    case 'similarity':
      return similarityScore;
    case 'complementarity':
      return complementarityScore;
    case 'neutral':
      return (similarityScore + complementarityScore) / 2;
    default:
      return similarityScore;
  }
}

/**
 * Generates an interpretation string for a given trait comparison.
 * @param displayName - The human-readable name of the trait
 * @param mode - The comparison mode
 * @param score - The calculated score (0-100)
 * @returns A descriptive interpretation
 */
function interpretTrait(displayName: string, mode: TraitComparisonMode, score: number): string {
  if (score >= 80) {
    return `Excellent harmony in ${displayName}.`;
  } else if (score >= 50) {
    return `Moderate alignment in ${displayName}.`;
  } else {
    return `Potential friction in ${displayName}.`;
  }
}

/**
 * Calculates the personality compatibility between two users.
 * 
 * @param profileA - Personality profile of user A
 * @param profileB - Personality profile of user B
 * @param dimensionConfigs - Optional custom dimension configurations
 * @returns Detailed personality compatibility result
 */
export function calculatePersonalityCompatibility(
  profileA: PersonalityProfile,
  profileB: PersonalityProfile,
  dimensionConfigs: TraitDimensionConfig[] = DEFAULT_PERSONALITY_CONFIGS
): PersonalityCompatibilityResult {
  const traitComparisons: TraitComparisonResult[] = [];
  const strengths: string[] = [];
  const frictionPoints: string[] = [];
  
  let totalScore = 0;
  let totalWeight = 0;

  for (const config of dimensionConfigs) {
    const valueA = (profileA as any)[config.name] as number;
    const valueB = (profileB as any)[config.name] as number;
    
    // Fallback to 0.5 if values are missing
    const safeValueA = typeof valueA === 'number' ? valueA : 0.5;
    const safeValueB = typeof valueB === 'number' ? valueB : 0.5;

    const score = Math.round(scoreTrait(safeValueA, safeValueB, config.comparisonMode));
    const interpretation = interpretTrait(config.displayName, config.comparisonMode, score);

    traitComparisons.push({
      dimension: config.name,
      displayName: config.displayName,
      valueA: safeValueA,
      valueB: safeValueB,
      score,
      mode: config.comparisonMode,
      interpretation
    });

    totalScore += score * config.weight;
    totalWeight += config.weight;

    if (score > 80) {
      strengths.push(`Strong alignment in ${config.displayName}`);
    } else if (score < 50) {
      frictionPoints.push(`Differences in ${config.displayName}`);
    }
  }

  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    traitComparisons,
    strengths,
    frictionPoints,
    confidence: 'strong',
    methodologyVersion: 'personality_v1'
  };
}
