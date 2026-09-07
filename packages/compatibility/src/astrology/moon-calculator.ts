// =============================================================================
// PREMA Compatibility Engine — Moon Calculator
// =============================================================================
// Computes sidereal Moon longitude from birth data using astronomy-engine.
// Applies Lahiri Ayanamsa correction (tropical → sidereal).
// =============================================================================

import * as Astronomy from 'astronomy-engine';
import type { UserBirthData } from '../types';
import type { AstroProfile } from './astrology-types';
import { getNakshatraFromDegree } from './data/nakshatras';
import { getRashiFromDegree } from './data/rashis';
import type { ConfidenceLevel } from '../types';

const METHODOLOGY = 'vedic_v1';

/**
 * Calculates Lahiri Ayanamsa for a given date.
 * Uses the standard linear approximation based on the Lahiri reference epoch.
 */
function getLahiriAyanamsa(date: Date): number {
  const year = date.getUTCFullYear() + (date.getUTCMonth() / 12) + (date.getUTCDate() / 365.25);
  return 23.856 + 0.01396 * (year - 2000);
}

/**
 * Parses exact birth time from HH:mm format string.
 */
function parseBirthTime(timeStr: string): { hour: number; minute: number } | null {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return null;
  const hour = parseInt(parts[0]!, 10);
  const minute = parseInt(parts[1]!, 10);
  if (isNaN(hour) || isNaN(minute)) return null;
  return { hour, minute };
}

/**
 * Calculates the sidereal Moon position from birth data.
 *
 * @param birthData - User's birth data including date of birth and optional exact birth time
 * @returns Object containing sidereal longitude (0-360 degrees) and whether birth time was available
 */
export function calculateMoonPosition(birthData: UserBirthData): { siderealLongitude: number; hasBirthTime: boolean } {
  const dob = birthData.dateOfBirth;
  let date: Date;
  let hasBirthTime = false;

  if (birthData.exactBirthTime) {
    const time = parseBirthTime(birthData.exactBirthTime);
    if (time) {
      date = new Date(Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate(), time.hour, time.minute));
      hasBirthTime = true;
    } else {
      // Fallback to noon if time parsing fails
      date = new Date(Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate(), 12, 0));
    }
  } else {
    // Default to noon (12:00 UTC) when birth time is unknown
    date = new Date(Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate(), 12, 0));
  }

  const tropicalLongitude = Astronomy.EclipticLongitude(Astronomy.Body.Moon, date);
  const ayanamsa = getLahiriAyanamsa(date);

  let siderealLongitude = tropicalLongitude - ayanamsa;
  if (siderealLongitude < 0) siderealLongitude += 360;
  if (siderealLongitude >= 360) siderealLongitude %= 360;

  return { siderealLongitude, hasBirthTime };
}

/**
 * Builds a full astrology profile from birth data.
 * Derives Rashi, Nakshatra, and Pada from sidereal Moon longitude.
 *
 * @param birthData - User's birth data
 * @returns Complete AstroProfile for compatibility calculations
 */
export function buildAstroProfile(birthData: UserBirthData): AstroProfile {
  const { siderealLongitude, hasBirthTime } = calculateMoonPosition(birthData);

  const rashi = getRashiFromDegree(siderealLongitude);
  const { nakshatra, pada } = getNakshatraFromDegree(siderealLongitude);

  const confidence: ConfidenceLevel = hasBirthTime ? 'strong' : 'moderate';

  return {
    userId: birthData.userId,
    moonLongitude: siderealLongitude,
    rashi,
    nakshatra,
    nakshatraPada: pada,
    hasBirthTime,
    confidence,
  };
}
