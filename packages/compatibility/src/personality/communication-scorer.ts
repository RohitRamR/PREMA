// =============================================================================
// PREMA Compatibility Engine — Communication Scorer
// =============================================================================

import type { CommunicationProfile } from '../types';
import type { CommunicationDimensionResult, CommunicationCompatibilityResult } from './personality-types';

interface CommDimension {
  name: keyof CommunicationProfile;
  displayName: string;
}

const DIMENSIONS: CommDimension[] = [
  { name: 'directness', displayName: 'Directness' },
  { name: 'frequencyPreference', displayName: 'Frequency Preference' },
  { name: 'conflictStyle', displayName: 'Conflict Style' },
  { name: 'responseExpectation', displayName: 'Response Expectation' },
  { name: 'emotionalOpenness', displayName: 'Emotional Openness' },
  { name: 'reassuranceNeed', displayName: 'Reassurance Need' },
  { name: 'affectionCommunication', displayName: 'Affection Communication' },
  { name: 'disagreementHandling', displayName: 'Disagreement Handling' }
];

const DIMENSION_WEIGHT = 0.125; // 8 dimensions * 0.125 = 1.0

/**
 * Generates an interpretation string for a communication dimension.
 * @param displayName - Human readable name of the dimension
 * @param score - Dimension score (0-100)
 * @returns Interpretation string
 */
function interpretDimension(displayName: string, score: number): string {
  if (score >= 80) {
    return `Highly compatible ${displayName.toLowerCase()} styles.`;
  } else if (score >= 50) {
    return `Reasonably aligned ${displayName.toLowerCase()} preferences.`;
  } else {
    return `Differing approaches to ${displayName.toLowerCase()}.`;
  }
}

/**
 * Calculates the communication compatibility between two users.
 * 
 * @param profileA - Communication profile for user A
 * @param profileB - Communication profile for user B
 * @returns Detailed communication compatibility result
 */
export function calculateCommunicationCompatibility(
  profileA: CommunicationProfile,
  profileB: CommunicationProfile
): CommunicationCompatibilityResult {
  const dimensions: CommunicationDimensionResult[] = [];
  const strengths: string[] = [];
  const frictionPoints: string[] = [];
  
  let totalScore = 0;

  for (const dim of DIMENSIONS) {
    const valueA = profileA[dim.name] as number;
    const valueB = profileB[dim.name] as number;
    
    const safeValueA = typeof valueA === 'number' ? valueA : 0.5;
    const safeValueB = typeof valueB === 'number' ? valueB : 0.5;
    
    const score = Math.round((1 - Math.abs(safeValueA - safeValueB)) * 100);
    const interpretation = interpretDimension(dim.displayName, score);
    
    dimensions.push({
      dimension: dim.name,
      displayName: dim.displayName,
      valueA: safeValueA,
      valueB: safeValueB,
      score,
      interpretation
    });
    
    totalScore += score * DIMENSION_WEIGHT;
    
    if (score > 80) {
      strengths.push(`Compatible ${dim.displayName}`);
    } else if (score < 50) {
      frictionPoints.push(`Mismatched ${dim.displayName}`);
    }
  }

  const finalScore = Math.round(totalScore);
  
  let overallInterpretation = '';
  if (finalScore >= 80) {
    overallInterpretation = 'Exceptional communication compatibility with highly aligned styles.';
  } else if (finalScore >= 60) {
    overallInterpretation = 'Good communication compatibility. Some minor differences exist but are manageable.';
  } else {
    overallInterpretation = 'Communication styles differ significantly and may require conscious effort.';
  }

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    dimensions,
    strengths,
    frictionPoints,
    overallInterpretation,
    methodologyVersion: 'communication_v1'
  };
}
