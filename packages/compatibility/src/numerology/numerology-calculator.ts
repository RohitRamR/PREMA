// =============================================================================
// PREMA Compatibility Engine — Numerology Calculator
// =============================================================================

import type { NumerologyProfile } from './numerology-types';

/**
 * Reduces a number by summing its digits until it becomes a single digit OR a master number (11, 22, 33).
 * @param n - The number to reduce.
 * @returns The reduced single digit or master number.
 */
export function reduceToDigitOrMaster(n: number): number {
  if (n === 11 || n === 22 || n === 33) {
    return n;
  }
  let sum = n;
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

/**
 * Calculates the Life Path Number based on a date of birth.
 * Reduces month, day, and year SEPARATELY then sums and reduces.
 * @param dob - Date of birth.
 * @returns The calculated Life Path Number.
 */
export function calculateLifePathNumber(dob: Date): number {
  const month = reduceToDigitOrMaster(dob.getMonth() + 1);
  const day = reduceToDigitOrMaster(dob.getDate());
  const year = reduceToDigitOrMaster(dob.getFullYear());
  
  return reduceToDigitOrMaster(month + day + year);
}

/**
 * Calculates the Expression Number (Destiny Number) based on a full name.
 * Uses the Pythagorean system: A=1..I=9, J=1..R=9, S=1..Z=8.
 * @param fullName - The full name of the user.
 * @returns The calculated Expression Number.
 */
export function calculateExpressionNumber(fullName: string): number {
  const charMap: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  const nameUpper = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  let total = 0;
  for (const char of nameUpper) {
    if (charMap[char]) {
      total += charMap[char];
    }
  }

  return reduceToDigitOrMaster(total);
}

/**
 * Builds a comprehensive NumerologyProfile for a user.
 * @param userId - The ID of the user.
 * @param dob - Date of birth.
 * @param fullName - Full name.
 * @returns The resulting NumerologyProfile.
 */
export function buildNumerologyProfile(userId: string, dob: Date, fullName: string): NumerologyProfile {
  const lifePathNumber = calculateLifePathNumber(dob);
  const expressionNumber = calculateExpressionNumber(fullName);
  const isMasterNumber = [11, 22, 33].includes(lifePathNumber) || [11, 22, 33].includes(expressionNumber);

  return {
    userId,
    lifePathNumber,
    expressionNumber,
    isMasterNumber,
    methodologyVersion: 'numerology_v1'
  };
}
