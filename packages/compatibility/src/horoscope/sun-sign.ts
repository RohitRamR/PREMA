// =============================================================================
// PREMA Compatibility Engine — Western Horoscope (Sun Sign)
// =============================================================================
// Tropical Sun sign from the real Sun position (astronomy-engine), so cusp
// birthdays (e.g. 20–23 of a month) resolve correctly instead of relying on a
// fixed date table. Birth time is IST by default, like the Kundli.
// =============================================================================

import type { UserBirthData } from '../types';
import { resolveBirthMoment, birthDayBounds, tropicalSunLongitude } from '../astrology/ephemeris';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ELEMENTS: Element[] = ['Fire', 'Earth', 'Air', 'Water'];
const MODALITIES: Modality[] = ['Cardinal', 'Fixed', 'Mutable'];

export interface SunSignProfile {
  userId: string;
  sign: ZodiacSign;
  signIndex: number; // 0–11
  element: Element;
  modality: Modality;
  sunLongitude: number; // tropical, degrees
  /** True when the Sun changed sign during the birth day and the time is unknown. */
  onCusp: boolean;
  /** The other possible sign when `onCusp` is true. */
  alternateSign?: ZodiacSign;
}

export function signFromLongitude(longitude: number): number {
  const n = ((longitude % 360) + 360) % 360;
  return Math.min(11, Math.floor(n / 30));
}

export function elementOf(signIndex: number): Element {
  return ELEMENTS[signIndex % 4]!;
}

export function modalityOf(signIndex: number): Modality {
  return MODALITIES[signIndex % 3]!;
}

export function buildSunSignProfile(birthData: UserBirthData): SunSignProfile {
  const moment = resolveBirthMoment(birthData);
  const sunLongitude = tropicalSunLongitude(moment.instant);
  const signIndex = signFromLongitude(sunLongitude);

  let onCusp = false;
  let alternateSign: ZodiacSign | undefined;
  if (!moment.hasBirthTime) {
    const { start, end } = birthDayBounds(moment);
    const s = signFromLongitude(tropicalSunLongitude(start));
    const e = signFromLongitude(tropicalSunLongitude(end));
    if (s !== e) {
      onCusp = true;
      alternateSign = ZODIAC_SIGNS[s === signIndex ? e : s];
    }
  }

  return {
    userId: birthData.userId,
    sign: ZODIAC_SIGNS[signIndex]!,
    signIndex,
    element: elementOf(signIndex),
    modality: modalityOf(signIndex),
    sunLongitude,
    onCusp,
    alternateSign,
  };
}
