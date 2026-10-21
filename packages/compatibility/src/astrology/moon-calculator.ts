// =============================================================================
// PREMA Compatibility Engine — Kundli Profile Builder
// =============================================================================
// Birth date + time (IST by default) → sidereal Moon, Rashi, Nakshatra, Pada,
// Lagna, Mars and Manglik status. All positions are geocentric and Lahiri.
// =============================================================================

import type { UserBirthData, ConfidenceLevel } from '../types';
import type { AstroProfile } from './astrology-types';
import { getNakshatraFromDegree } from './data/nakshatras';
import { getRashiFromDegree } from './data/rashis';
import {
  resolveBirthMoment,
  birthDayBounds,
  siderealMoonLongitude,
  siderealMarsLongitude,
  siderealAscendant,
} from './ephemeris';
import { computeManglikProfile } from './manglik';

/**
 * Sidereal (Lahiri) Moon longitude at the moment of birth.
 * Birth time is read as IST unless `birthTimezone` / `birthUtcOffsetMinutes` is set.
 * Unknown birth time → local noon.
 */
export function calculateMoonPosition(birthData: UserBirthData): { siderealLongitude: number; hasBirthTime: boolean; instant: Date } {
  const moment = resolveBirthMoment(birthData);
  return {
    siderealLongitude: siderealMoonLongitude(moment.instant),
    hasBirthTime: moment.hasBirthTime,
    instant: moment.instant,
  };
}

function hasValidCoordinates(b: UserBirthData): boolean {
  return typeof b.birthPlaceLat === 'number' && typeof b.birthPlaceLon === 'number' &&
    Number.isFinite(b.birthPlaceLat) && Number.isFinite(b.birthPlaceLon) &&
    Math.abs(b.birthPlaceLat) < 89.9 && Math.abs(b.birthPlaceLon) <= 180;
}

/**
 * Builds the full Kundli profile used for matching.
 *
 * Confidence:
 *   strong   — exact birth time known
 *   moderate — time unknown but the Moon stayed in one nakshatra all day
 *   low      — time unknown and the nakshatra changed during the birth day
 */
export function buildAstroProfile(birthData: UserBirthData): AstroProfile {
  const moment = resolveBirthMoment(birthData);
  const warnings = [...moment.warnings];

  const moonLongitude = siderealMoonLongitude(moment.instant);
  const rashi = getRashiFromDegree(moonLongitude);
  const { nakshatra, pada } = getNakshatraFromDegree(moonLongitude);

  let rashiCertain = true;
  let nakshatraCertain = true;
  if (!moment.hasBirthTime) {
    const { start, end } = birthDayBounds(moment);
    const moonStart = siderealMoonLongitude(start);
    const moonEnd = siderealMoonLongitude(end);
    rashiCertain = getRashiFromDegree(moonStart).index === getRashiFromDegree(moonEnd).index;
    nakshatraCertain = getNakshatraFromDegree(moonStart).nakshatra.index === getNakshatraFromDegree(moonEnd).nakshatra.index;
    if (!nakshatraCertain) {
      warnings.push('Birth time unknown and the Moon changed nakshatra that day — add a birth time for an accurate Kundli.');
    }
  }

  const marsLongitude = siderealMarsLongitude(moment.instant);

  let lagnaLongitude: number | undefined;
  if (moment.hasBirthTime && hasValidCoordinates(birthData)) {
    lagnaLongitude = siderealAscendant(moment.instant, birthData.birthPlaceLat!, birthData.birthPlaceLon!);
  } else if (moment.hasBirthTime) {
    warnings.push('Birth place coordinates missing — Lagna not computed; Manglik checked from the Moon only.');
  }

  const manglik = computeManglikProfile(moonLongitude, marsLongitude, lagnaLongitude);

  const confidence: ConfidenceLevel = moment.hasBirthTime ? 'strong' : nakshatraCertain ? 'moderate' : 'low';

  return {
    userId: birthData.userId,
    moonLongitude,
    rashi,
    nakshatra,
    nakshatraPada: pada,
    hasBirthTime: moment.hasBirthTime,
    birthInstantUtc: moment.instant.toISOString(),
    timezoneLabel: moment.timezoneLabel,
    rashiCertain,
    nakshatraCertain,
    lagnaLongitude,
    lagnaRashi: lagnaLongitude !== undefined ? getRashiFromDegree(lagnaLongitude) : undefined,
    marsLongitude,
    manglik,
    isManglik: manglik.isManglik,
    manglikSeverity: manglik.severity,
    manglikCancellations: manglik.cancellations,
    confidence,
    warnings,
  };
}
