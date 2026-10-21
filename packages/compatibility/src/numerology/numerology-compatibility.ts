// =============================================================================
// PREMA Compatibility Engine — Numerology Compatibility
// =============================================================================
// Score = Moolank 35% + Life Path 35% + Expression 20% + Soul Urge 10%.
// Missing name-based numbers are dropped and the weights re-normalised.
//
// Moolank uses Indian (Vedic) numerology: each number is ruled by a planet
// (1 Sun, 2 Moon, 3 Jupiter, 4 Rahu, 5 Mercury, 6 Venus, 7 Ketu, 8 Saturn,
// 9 Mars) and compatibility follows planetary friendship (as in Graha Maitri).
// Life Path / Expression / Soul Urge use the Western 9×9 harmony table.
// =============================================================================

import type { Planet } from '../astrology/astrology-types';
import { getGrahaMaitriPoints } from '../astrology/data/planetary-relationships';
import type {
  NumerologyProfile,
  NumerologyCompatibilityResult,
  NumerologyComponentResult,
  NumerologyCategory,
} from './numerology-types';

const METHODOLOGY = 'numerology_v2';

/** Western number-harmony table. Must stay symmetric (enforced by tests). */
export const NUMBER_HARMONY_MATRIX: Record<number, Record<number, number>> = {
  1: { 1: 80, 2: 65, 3: 75, 4: 55, 5: 90, 6: 60, 7: 85, 8: 50, 9: 70 },
  2: { 1: 65, 2: 80, 3: 70, 4: 85, 5: 55, 6: 90, 7: 50, 8: 80, 9: 65 },
  3: { 1: 75, 2: 70, 3: 75, 4: 50, 5: 80, 6: 90, 7: 60, 8: 45, 9: 85 },
  4: { 1: 55, 2: 85, 3: 50, 4: 70, 5: 55, 6: 75, 7: 60, 8: 85, 9: 50 },
  5: { 1: 90, 2: 55, 3: 80, 4: 55, 5: 75, 6: 55, 7: 85, 8: 60, 9: 70 },
  6: { 1: 60, 2: 90, 3: 90, 4: 75, 5: 55, 6: 85, 7: 45, 8: 65, 9: 90 },
  7: { 1: 85, 2: 50, 3: 60, 4: 60, 5: 85, 6: 45, 7: 80, 8: 45, 9: 55 },
  8: { 1: 50, 2: 80, 3: 45, 4: 85, 5: 60, 6: 65, 7: 45, 8: 75, 9: 50 },
  9: { 1: 70, 2: 65, 3: 85, 4: 50, 5: 70, 6: 90, 7: 55, 8: 50, 9: 80 },
};

export const NUMBER_PLANETS: Record<number, Planet> = {
  1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
  6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars',
};

/** How Rahu (4) and Ketu (7) relate to the other planets (classical Jyotish view). */
const SHADOW_RELATIONS: Record<'Rahu' | 'Ketu', { friends: Planet[]; enemies: Planet[] }> = {
  Rahu: { friends: ['Mercury', 'Venus', 'Saturn'], enemies: ['Sun', 'Moon', 'Mars'] },
  Ketu: { friends: ['Mars', 'Venus', 'Saturn'], enemies: ['Sun', 'Moon'] },
};

/** Planetary friendship points 0–5 between two Moolank numbers. Symmetric. */
export function moolankFriendshipPoints(a: number, b: number): number {
  const pa = NUMBER_PLANETS[a]!;
  const pb = NUMBER_PLANETS[b]!;
  if (pa === pb) return 5;
  const shadow = pa === 'Rahu' || pa === 'Ketu' ? pa : pb === 'Rahu' || pb === 'Ketu' ? pb : null;
  if (shadow) {
    const other = shadow === pa ? pb : pa;
    if (other === 'Rahu' || other === 'Ketu') return 3; // Rahu–Ketu: neutral axis
    const rel = SHADOW_RELATIONS[shadow];
    if (rel.friends.includes(other)) return 5;
    if (rel.enemies.includes(other)) return 0;
    return 3;
  }
  return getGrahaMaitriPoints(pa, pb);
}

function getCategory(score: number): NumerologyCategory {
  if (score >= 85) return 'natural_match';
  if (score >= 70) return 'compatible';
  if (score >= 58) return 'neutral';
  return 'challenging';
}

function toBase(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function harmonyComponent(label: string, numA: number, numB: number): NumerologyComponentResult {
  let score = NUMBER_HARMONY_MATRIX[toBase(numA)]?.[toBase(numB)] ?? 50;
  if (numA > 9 || numB > 9) score = Math.min(100, score + 5); // master-number bonus
  const compatibility = getCategory(score);
  return {
    numberA: numA,
    numberB: numB,
    compatibility,
    score,
    interpretation: `${label} ${numA} and ${numB}: ${compatibility.replace('_', ' ')}.`,
  };
}

export function calculateMoolankCompatibility(numA: number, numB: number): NumerologyComponentResult {
  const points = moolankFriendshipPoints(numA, numB);
  const score = Math.round(40 + points * 12); // 0 → 40, 5 → 100
  const compatibility = getCategory(score);
  return {
    numberA: numA,
    numberB: numB,
    compatibility,
    score,
    interpretation: `Moolank ${numA} (${NUMBER_PLANETS[numA]}) and ${numB} (${NUMBER_PLANETS[numB]}): ${compatibility.replace('_', ' ')}.`,
  };
}

export function calculateLifePathCompatibility(numA: number, numB: number): NumerologyComponentResult {
  return harmonyComponent('Life Path', numA, numB);
}

export function calculateExpressionCompatibility(numA: number, numB: number): NumerologyComponentResult {
  return harmonyComponent('Expression', numA, numB);
}

export function calculateNumerologyCompatibility(
  profileA: NumerologyProfile,
  profileB: NumerologyProfile
): NumerologyCompatibilityResult {
  const moolank = calculateMoolankCompatibility(profileA.moolank, profileB.moolank);
  const lifePath = calculateLifePathCompatibility(profileA.lifePathNumber, profileB.lifePathNumber);
  const expression = profileA.expressionNumber != null && profileB.expressionNumber != null
    ? calculateExpressionCompatibility(profileA.expressionNumber, profileB.expressionNumber)
    : null;
  const soulUrge = profileA.soulUrgeNumber != null && profileB.soulUrgeNumber != null
    ? harmonyComponent('Soul Urge', profileA.soulUrgeNumber, profileB.soulUrgeNumber)
    : null;

  const parts: Array<[number, number]> = [
    [moolank.score, 0.35],
    [lifePath.score, 0.35],
    ...(expression ? [[expression.score, 0.20] as [number, number]] : []),
    ...(soulUrge ? [[soulUrge.score, 0.10] as [number, number]] : []),
  ];
  const weight = parts.reduce((s, [, w]) => s + w, 0);
  const score = Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / weight);

  return {
    score,
    moolankCompatibility: moolank,
    lifePathCompatibility: lifePath,
    expressionCompatibility: expression,
    soulUrgeCompatibility: soulUrge,
    overallInterpretation: `Overall numerology connection is ${getCategory(score).replace('_', ' ')}.`,
    methodologyVersion: METHODOLOGY,
  };
}
