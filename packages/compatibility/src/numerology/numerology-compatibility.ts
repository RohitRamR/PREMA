// =============================================================================
// PREMA Compatibility Engine — Numerology Compatibility
// =============================================================================

import type { NumerologyProfile, NumerologyCompatibilityResult } from './numerology-types';

type CompatibilityCategory = 'natural_match' | 'compatible' | 'neutral' | 'challenging';

interface ComponentResult {
  numberA: number;
  numberB: number;
  compatibility: CompatibilityCategory;
  score: number;
  interpretation: string;
}

const matrix: Record<number, Record<number, number>> = {
  1: { 1: 80, 2: 65, 3: 75, 4: 55, 5: 90, 6: 60, 7: 85, 8: 50, 9: 70 },
  2: { 1: 65, 2: 80, 3: 70, 4: 85, 5: 55, 6: 90, 7: 50, 8: 80, 9: 65 },
  3: { 1: 75, 2: 70, 3: 75, 4: 50, 5: 80, 6: 90, 7: 60, 8: 45, 9: 85 },
  4: { 1: 55, 2: 85, 3: 50, 4: 70, 5: 55, 6: 75, 7: 60, 8: 85, 9: 50 },
  5: { 1: 90, 2: 55, 3: 80, 4: 55, 5: 75, 6: 55, 7: 85, 8: 60, 9: 70 },
  6: { 1: 60, 2: 90, 3: 90, 4: 75, 5: 55, 6: 85, 7: 45, 8: 65, 9: 90 },
  7: { 1: 85, 2: 50, 3: 60, 4: 60, 5: 85, 6: 45, 7: 80, 8: 45, 9: 55 },
  8: { 1: 50, 2: 80, 3: 45, 4: 85, 5: 60, 6: 65, 7: 45, 8: 75, 9: 50 },
  9: { 1: 70, 2: 65, 3: 85, 4: 50, 5: 70, 6: 90, 7: 55, 8: 50, 9: 80 }
};

/**
 * Helper to determine category based on score.
 */
function getCategory(score: number): CompatibilityCategory {
  if (score >= 85) return 'natural_match';
  if (score >= 70) return 'compatible';
  if (score >= 60) return 'neutral';
  return 'challenging';
}

/**
 * Calculates Life Path Compatibility between two numbers.
 * @param numA - First life path number.
 * @param numB - Second life path number.
 * @returns ComponentResult containing score and interpretation.
 */
export function calculateLifePathCompatibility(numA: number, numB: number): ComponentResult {
  const baseA = [11, 22, 33].includes(numA) ? (numA === 11 ? 2 : numA === 22 ? 4 : 6) : numA;
  const baseB = [11, 22, 33].includes(numB) ? (numB === 11 ? 2 : numB === 22 ? 4 : 6) : numB;

  let score = matrix[baseA]?.[baseB] ?? 50;

  if ([11, 22, 33].includes(numA) || [11, 22, 33].includes(numB)) {
    score = Math.min(100, score + 5);
  }

  const category = getCategory(score);
  return {
    numberA: numA,
    numberB: numB,
    compatibility: category,
    score,
    interpretation: `Life Path Numbers ${numA} and ${numB} have a ${category.replace('_', ' ')} connection.`
  };
}

/**
 * Calculates Expression Compatibility between two numbers.
 * @param numA - First expression number.
 * @param numB - Second expression number.
 * @returns ComponentResult containing score and interpretation.
 */
export function calculateExpressionCompatibility(numA: number, numB: number): ComponentResult {
  const baseA = [11, 22, 33].includes(numA) ? (numA === 11 ? 2 : numA === 22 ? 4 : 6) : numA;
  const baseB = [11, 22, 33].includes(numB) ? (numB === 11 ? 2 : numB === 22 ? 4 : 6) : numB;

  let score = matrix[baseA]?.[baseB] ?? 50;

  if ([11, 22, 33].includes(numA) || [11, 22, 33].includes(numB)) {
    score = Math.min(100, score + 5);
  }

  const category = getCategory(score);
  return {
    numberA: numA,
    numberB: numB,
    compatibility: category,
    score,
    interpretation: `Expression Numbers ${numA} and ${numB} show a ${category.replace('_', ' ')} dynamic.`
  };
}

/**
 * Calculates overall numerology compatibility between two profiles.
 * @param profileA - The first user's numerology profile.
 * @param profileB - The second user's numerology profile.
 * @returns The overall numerology compatibility result.
 */
export function calculateNumerologyCompatibility(
  profileA: NumerologyProfile,
  profileB: NumerologyProfile
): NumerologyCompatibilityResult {
  const lpComp = calculateLifePathCompatibility(profileA.lifePathNumber, profileB.lifePathNumber);
  const expComp = calculateExpressionCompatibility(profileA.expressionNumber, profileB.expressionNumber);

  // Combines life path (60%) and expression (40%)
  const overallScore = Math.round(lpComp.score * 0.6 + expComp.score * 0.4);

  return {
    score: overallScore,
    lifePathCompatibility: lpComp,
    expressionCompatibility: expComp,
    overallInterpretation: `Overall numerology connection is ${getCategory(overallScore).replace('_', ' ')}.`,
    methodologyVersion: 'numerology_v1'
  };
}
