// =============================================================================
// PREMA Compatibility Engine — Numerology Calculator
// =============================================================================
// Dates are read on the IST calendar day (or the literal YYYY-MM-DD string),
// so a birthday never shifts by one because of server/device time zones.
// =============================================================================

import type { NumerologyProfile } from './numerology-types';
import { getBirthCalendarDate } from '../astrology/ephemeris';

const MASTER_NUMBERS = [11, 22, 33];

function digitSum(n: number): number {
  return String(Math.abs(Math.trunc(n))).split('').reduce((acc, d) => acc + Number(d), 0);
}

/** Reduces to a single digit, preserving master numbers 11, 22, 33. */
export function reduceToDigitOrMaster(n: number): number {
  let sum = Math.abs(Math.trunc(n));
  while (sum > 9 && !MASTER_NUMBERS.includes(sum)) sum = digitSum(sum);
  return sum;
}

/** Reduces to a single digit 1–9 (no master numbers). 0 stays 0. */
export function reduceToSingleDigit(n: number): number {
  let sum = Math.abs(Math.trunc(n));
  while (sum > 9) sum = digitSum(sum);
  return sum;
}

/**
 * Western Life Path: reduce month, day and year separately (keeping masters),
 * then sum and reduce. Example: 1990-07-15 → 7 + 6 + 1 = 14 → 5.
 */
export function calculateLifePathNumber(dob: Date | string): number {
  const { year, month, day } = getBirthCalendarDate(dob);
  return reduceToDigitOrMaster(
    reduceToDigitOrMaster(month) + reduceToDigitOrMaster(day) + reduceToDigitOrMaster(year)
  );
}

/** Moolank (psychic number): birth day reduced to 1–9. 29th → 2. */
export function calculateMoolank(dob: Date | string): number {
  return reduceToSingleDigit(getBirthCalendarDate(dob).day);
}

/** Bhagyank (destiny number): every digit of DD-MM-YYYY summed, reduced to 1–9. */
export function calculateBhagyank(dob: Date | string): number {
  const { year, month, day } = getBirthCalendarDate(dob);
  return reduceToSingleDigit(digitSum(day) + digitSum(month) + digitSum(year));
}

const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

function lettersOf(name: string): string[] {
  // normalize() strips accents (é → e); guarded for JS engines without it.
  const base = typeof name.normalize === 'function' ? name.normalize('NFKD') : name;
  return base
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('');
}

/** Expression (destiny) number of a full name — Pythagorean. Null if no letters. */
export function calculateExpressionNumber(fullName: string): number | null {
  const letters = lettersOf(fullName);
  if (letters.length === 0) return null;
  return reduceToDigitOrMaster(letters.reduce((t, c) => t + (PYTHAGOREAN[c] ?? 0), 0));
}

/** Soul Urge (heart's desire) number — vowels only. Null if no vowels. */
export function calculateSoulUrgeNumber(fullName: string): number | null {
  const vowels = lettersOf(fullName).filter((c) => VOWELS.has(c));
  if (vowels.length === 0) return null;
  return reduceToDigitOrMaster(vowels.reduce((t, c) => t + (PYTHAGOREAN[c] ?? 0), 0));
}

/**
 * Builds a full numerology profile.
 * @param dob "YYYY-MM-DD" (preferred) or Date (read on the IST calendar day)
 * @param fullName optional — enables Expression and Soul Urge numbers
 */
export function buildNumerologyProfile(userId: string, dob: Date | string, fullName?: string | null): NumerologyProfile {
  const lifePathNumber = calculateLifePathNumber(dob);
  const expressionNumber = fullName ? calculateExpressionNumber(fullName) : null;
  const soulUrgeNumber = fullName ? calculateSoulUrgeNumber(fullName) : null;
  const isMasterNumber = [lifePathNumber, expressionNumber, soulUrgeNumber].some(
    (n) => n !== null && MASTER_NUMBERS.includes(n)
  );

  return {
    userId,
    moolank: calculateMoolank(dob),
    bhagyank: calculateBhagyank(dob),
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    isMasterNumber,
    methodologyVersion: 'numerology_v2',
  };
}
