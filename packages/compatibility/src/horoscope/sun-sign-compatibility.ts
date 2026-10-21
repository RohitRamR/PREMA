// =============================================================================
// PREMA Compatibility Engine — Sun Sign Compatibility
// =============================================================================
// Classical Western synastry of the Sun signs, based on the angle between them:
//   conjunction (same sign) · sextile (2) · square (3) · trine (4)
//   quincunx (5) · opposition (6) · semi-sextile (1)
// Trines share an element, sextiles pair compatible elements (Fire–Air,
// Earth–Water), squares share a modality with clashing elements.
// =============================================================================

import type { SunSignProfile, ZodiacSign } from './sun-sign';
import { ZODIAC_SIGNS, elementOf } from './sun-sign';

export type SunAspect = 'conjunction' | 'semi-sextile' | 'sextile' | 'square' | 'trine' | 'quincunx' | 'opposition';

export interface SunSignCompatibilityResult {
  score: number; // 0–100
  signA: ZodiacSign;
  signB: ZodiacSign;
  aspect: SunAspect;
  elementHarmony: 'same' | 'complementary' | 'challenging';
  interpretation: string;
  /** True when either sign is uncertain (cusp birthday without birth time). */
  uncertain: boolean;
  methodologyVersion: string;
}

const ASPECT_BY_DISTANCE: SunAspect[] = ['conjunction', 'semi-sextile', 'sextile', 'square', 'trine', 'quincunx', 'opposition'];

const ASPECT_SCORE: Record<SunAspect, number> = {
  trine: 92,
  conjunction: 82,
  sextile: 85,
  opposition: 68, // magnetic, complementary polarity
  'semi-sextile': 55,
  square: 42,
  quincunx: 40,
};

const ASPECT_TEXT: Record<SunAspect, string> = {
  trine: 'Your Sun signs share an element — an easy, natural flow.',
  conjunction: 'Same Sun sign — you understand each other instinctively.',
  sextile: 'Complementary Sun signs — you energise and support each other.',
  opposition: 'Opposite Sun signs — a magnetic pull that balances each other.',
  'semi-sextile': 'Neighbouring Sun signs — different styles that can learn from each other.',
  square: 'Your Sun signs challenge each other — growth through friction.',
  quincunx: 'Your Sun signs see the world differently — it takes conscious adjustment.',
};

export function sunSignPairScore(signIndexA: number, signIndexB: number): { score: number; aspect: SunAspect } {
  const raw = Math.abs(signIndexA - signIndexB) % 12;
  const distance = Math.min(raw, 12 - raw);
  const aspect = ASPECT_BY_DISTANCE[distance]!;
  return { score: ASPECT_SCORE[aspect], aspect };
}

function elementHarmony(a: number, b: number): SunSignCompatibilityResult['elementHarmony'] {
  const ea = elementOf(a);
  const eb = elementOf(b);
  if (ea === eb) return 'same';
  const pair = [ea, eb].sort().join('+');
  return pair === 'Air+Fire' || pair === 'Earth+Water' ? 'complementary' : 'challenging';
}

export function calculateSunSignCompatibility(a: SunSignProfile, b: SunSignProfile): SunSignCompatibilityResult {
  const { aspect } = sunSignPairScore(a.signIndex, b.signIndex);
  let { score } = sunSignPairScore(a.signIndex, b.signIndex);
  const uncertain = a.onCusp || b.onCusp;

  // Cusp births: average over the possible sign combinations.
  if (uncertain) {
    const optsA = [a.signIndex, ...(a.alternateSign ? [ZODIAC_SIGNS.indexOf(a.alternateSign)] : [])];
    const optsB = [b.signIndex, ...(b.alternateSign ? [ZODIAC_SIGNS.indexOf(b.alternateSign)] : [])];
    let sum = 0;
    let n = 0;
    for (const x of optsA) for (const y of optsB) { sum += sunSignPairScore(x, y).score; n++; }
    score = Math.round(sum / n);
  }

  return {
    score,
    signA: a.sign,
    signB: b.sign,
    aspect,
    elementHarmony: elementHarmony(a.signIndex, b.signIndex),
    interpretation: ASPECT_TEXT[aspect],
    uncertain,
    methodologyVersion: 'sun_sign_v1',
  };
}
