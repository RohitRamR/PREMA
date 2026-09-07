import type { ConfidenceLevel } from '../types';

/**
 * Input needed to calculate confidence.
 */
export interface ConfidenceInput {
  hasBirthTimeA: boolean;
  hasBirthTimeB: boolean;
  personalityCompletenessA: number; // 0-1, fraction of traits filled
  personalityCompletenessB: number;
  communicationCompletenessA: number;
  communicationCompletenessB: number;
  valuesCompletenessA: number;
  valuesCompletenessB: number;
  lifestyleCompletenessA: number;
  lifestyleCompletenessB: number;
  goalsCompletenessA: number;
  goalsCompletenessB: number;
  algorithmVersion: string;
}

/**
 * Calculates the confidence level based on available data completeness.
 *
 * @param input The confidence input data
 * @returns The confidence level
 */
export function calculateConfidence(input: ConfidenceInput): ConfidenceLevel {
  let score = 0;

  // Birth time points
  if (input.hasBirthTimeA) score += 15;
  if (input.hasBirthTimeB) score += 15;

  // Average completeness per dimension * weight
  const getAvg = (a: number, b: number) => (a + b) / 2;

  score += getAvg(input.personalityCompletenessA, input.personalityCompletenessB) * 15;
  score += getAvg(input.communicationCompletenessA, input.communicationCompletenessB) * 10;
  score += getAvg(input.valuesCompletenessA, input.valuesCompletenessB) * 15;
  score += getAvg(input.lifestyleCompletenessA, input.lifestyleCompletenessB) * 10;
  score += getAvg(input.goalsCompletenessA, input.goalsCompletenessB) * 20;

  // Map to confidence level
  // V1 algorithm cap at moderate
  if (score < 30) {
    return 'insufficient_data';
  } else if (score < 55) {
    return 'low';
  } else {
    // V1 caps at moderate even if > 80
    return 'moderate';
  }
}

/**
 * Helper to calculate the completeness of a profile given required fields.
 *
 * @param profile The profile object to check
 * @param requiredFields The keys that should be present
 * @returns Completeness fraction (0-1)
 */
export function calculateProfileCompleteness(profile: any, requiredFields: string[]): number {
  if (!profile) return 0;
  if (requiredFields.length === 0) return 1;

  let filled = 0;
  for (const field of requiredFields) {
    if (profile[field] !== undefined && profile[field] !== null) {
      filled++;
    }
  }

  return filled / requiredFields.length;
}
