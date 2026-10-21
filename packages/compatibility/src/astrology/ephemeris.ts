// =============================================================================
// PREMA Compatibility Engine — Ephemeris & Birth-Time Handling
// =============================================================================
// Single source of truth for:
//   * turning a user's birth date + time into an exact UTC instant
//     (birth times are IST / UTC+05:30 unless the user says otherwise),
//   * geocentric planetary longitudes (Moon, Sun, Mars) and the Ascendant,
//   * the Lahiri (Chitrapaksha) ayanamsa for tropical → sidereal conversion.
//
// All astronomy comes from `astronomy-engine` (arc-second level accuracy).
// =============================================================================

import * as Astronomy from 'astronomy-engine';
import type { UserBirthData } from '../types';

/** Indian Standard Time, UTC+05:30. The default for every birth time. */
export const IST_OFFSET_MINUTES = 330;
export const IST_TIMEZONE = 'Asia/Kolkata';

/** Time used when the exact birth time is unknown (local noon). */
export const UNKNOWN_TIME_DEFAULT = { hour: 12, minute: 0, second: 0 };

export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface ResolvedBirthMoment {
  /** The exact UTC instant of birth (or local noon if time unknown). */
  instant: Date;
  /** Birth calendar date in the birth time zone (IST by default). */
  localDate: CalendarDate;
  /** True only when a valid HH:mm birth time was supplied. */
  hasBirthTime: boolean;
  /** UTC offset (minutes) that was applied at the moment of birth. */
  utcOffsetMinutes: number;
  /** Human-readable label of the zone used, e.g. "IST (UTC+05:30)". */
  timezoneLabel: string;
  /** Non-fatal input problems (e.g. an unparseable birth time). */
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Date / time parsing
// ---------------------------------------------------------------------------

function isValidCalendarDate(d: CalendarDate): boolean {
  if (!Number.isInteger(d.year) || !Number.isInteger(d.month) || !Number.isInteger(d.day)) return false;
  if (d.month < 1 || d.month > 12 || d.day < 1) return false;
  const daysInMonth = new Date(Date.UTC(d.year, d.month, 0)).getUTCDate();
  return d.day <= daysInMonth;
}

/**
 * Parses "HH:mm" or "HH:mm:ss" (24h). Returns null when invalid.
 */
export function parseBirthTime(timeStr: string): { hour: number; minute: number; second: number } | null {
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/.exec(timeStr);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] !== undefined ? Number(m[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

/**
 * Returns the UTC offset (minutes) of an IANA time zone at a given instant.
 */
export function getTimezoneOffsetMinutes(timeZone: string, at: Date): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts: Record<string, number> = {};
  for (const p of fmt.formatToParts(at)) {
    if (p.type !== 'literal') parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(parts.year!, parts.month! - 1, parts.day!, parts.hour!, parts.minute!, parts.second!);
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the birth calendar date.
 *
 * - "YYYY-MM-DD" strings (and ISO strings) use their literal date part.
 * - Date objects at exactly 00:00:00.000 UTC are date-only values (JSON / DB
 *   `date` columns) → their UTC date is used.
 * - Any other Date object is read on the birth time zone's calendar
 *   (IST by default), so a device in India that built `new Date(1995, 2, 10)`
 *   still yields 10 March 1995.
 */
export function getBirthCalendarDate(
  dob: Date | string,
  offsetMinutes: number = IST_OFFSET_MINUTES
): CalendarDate {
  if (typeof dob === 'string') {
    const m = /^\s*(\d{4})-(\d{2})-(\d{2})/.exec(dob);
    if (!m) throw new RangeError(`Invalid date of birth "${dob}". Expected YYYY-MM-DD.`);
    const d = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
    if (!isValidCalendarDate(d)) throw new RangeError(`Invalid date of birth "${dob}".`);
    return d;
  }
  if (!(dob instanceof Date) || isNaN(dob.getTime())) {
    throw new RangeError('Invalid date of birth.');
  }
  const isDateOnly =
    dob.getUTCHours() === 0 && dob.getUTCMinutes() === 0 &&
    dob.getUTCSeconds() === 0 && dob.getUTCMilliseconds() === 0;
  const shifted = isDateOnly ? dob : new Date(dob.getTime() + offsetMinutes * 60000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

/**
 * Converts local wall-clock birth date/time into an exact UTC instant.
 *
 * Time-zone priority:
 *   1. `birthUtcOffsetMinutes` (explicit fixed offset),
 *   2. `birthTimezone` (IANA name, DST-aware, e.g. "America/New_York"),
 *   3. IST — UTC+05:30 (default for every PREMA user).
 */
export function resolveBirthMoment(birthData: UserBirthData): ResolvedBirthMoment {
  const warnings: string[] = [];

  let fixedOffset: number | null = null;
  let ianaZone: string | null = null;

  if (typeof birthData.birthUtcOffsetMinutes === 'number' && Number.isFinite(birthData.birthUtcOffsetMinutes)) {
    if (Math.abs(birthData.birthUtcOffsetMinutes) > 14 * 60) {
      warnings.push(`UTC offset ${birthData.birthUtcOffsetMinutes} min is out of range; using IST.`);
    } else {
      fixedOffset = Math.round(birthData.birthUtcOffsetMinutes);
    }
  }
  if (fixedOffset === null && birthData.birthTimezone && birthData.birthTimezone !== IST_TIMEZONE) {
    if (isValidTimeZone(birthData.birthTimezone)) ianaZone = birthData.birthTimezone;
    else warnings.push(`Unknown time zone "${birthData.birthTimezone}"; using IST.`);
  }
  if (fixedOffset === null && ianaZone === null) fixedOffset = IST_OFFSET_MINUTES;

  // Offset used only to read the calendar day of a non-date-only Date object.
  const dayOffset = fixedOffset ?? getTimezoneOffsetMinutes(ianaZone!, birthData.dateOfBirth instanceof Date ? birthData.dateOfBirth : new Date());
  const localDate = getBirthCalendarDate(birthData.dateOfBirth, dayOffset);

  let time = UNKNOWN_TIME_DEFAULT;
  let hasBirthTime = false;
  if (birthData.exactBirthTime != null && birthData.exactBirthTime !== '') {
    const parsed = parseBirthTime(birthData.exactBirthTime);
    if (parsed) {
      time = parsed;
      hasBirthTime = true;
    } else {
      warnings.push(`Birth time "${birthData.exactBirthTime}" is not valid HH:mm; treated as unknown.`);
    }
  }

  const wallClockAsUtc = Date.UTC(localDate.year, localDate.month - 1, localDate.day, time.hour, time.minute, time.second);

  let offset: number;
  if (fixedOffset !== null) {
    offset = fixedOffset;
  } else {
    // Two-pass resolution handles DST transitions correctly.
    offset = getTimezoneOffsetMinutes(ianaZone!, new Date(wallClockAsUtc));
    offset = getTimezoneOffsetMinutes(ianaZone!, new Date(wallClockAsUtc - offset * 60000));
  }

  const instant = new Date(wallClockAsUtc - offset * 60000);
  const timezoneLabel = ianaZone
    ? `${ianaZone} (${formatOffset(offset)})`
    : offset === IST_OFFSET_MINUTES ? 'IST (UTC+05:30)' : formatOffset(offset);

  return { instant, localDate, hasBirthTime, utcOffsetMinutes: offset, timezoneLabel, warnings };
}

/**
 * The UTC instants of the first and last minute of the local birth day.
 * Used to test whether the Moon's sign/nakshatra is certain when the birth
 * time is unknown.
 */
export function birthDayBounds(moment: ResolvedBirthMoment): { start: Date; end: Date } {
  const { year, month, day } = moment.localDate;
  const startWall = Date.UTC(year, month - 1, day, 0, 0, 0);
  const endWall = Date.UTC(year, month - 1, day, 23, 59, 59);
  return {
    start: new Date(startWall - moment.utcOffsetMinutes * 60000),
    end: new Date(endWall - moment.utcOffsetMinutes * 60000),
  };
}

// ---------------------------------------------------------------------------
// Ayanamsa
// ---------------------------------------------------------------------------

const J2000 = 2451545.0;
/** Lahiri reference epoch: 21 March 1956, 0h TT (JD 2435553.5). */
const LAHIRI_T0_JD = 2435553.5;
/** Mean Lahiri ayanamsa at the reference epoch, in degrees (Swiss Ephemeris value). */
const LAHIRI_AYANAMSA_T0 = 23.245524743;

function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** General precession in longitude (arc-seconds) since J2000, IAU 2006. */
function precessionArcsec(jd: number): number {
  const t = (jd - J2000) / 36525;
  return 5028.796195 * t + 1.1054348 * t * t + 0.00007964 * t * t * t;
}

/**
 * Mean Lahiri (Chitrapaksha) ayanamsa in degrees.
 * Matches Swiss Ephemeris SE_SIDM_LAHIRI to within ~1 arc-second for 1900–2100
 * (≈ 23.857° at J2000, ≈ 24.2° in 2026).
 */
export function getLahiriAyanamsa(date: Date): number {
  const jd = julianDay(date);
  return LAHIRI_AYANAMSA_T0 + (precessionArcsec(jd) - precessionArcsec(LAHIRI_T0_JD)) / 3600;
}

// ---------------------------------------------------------------------------
// Planetary longitudes
// ---------------------------------------------------------------------------

function normalizeDegrees(deg: number): number {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
}

/** Nutation in longitude, degrees (true equinox − mean equinox). */
function nutationLongitude(date: Date): number {
  return Astronomy.e_tilt(Astronomy.MakeTime(date)).dpsi / 3600;
}

/** Converts a true-equinox-of-date tropical longitude to Lahiri sidereal. */
export function tropicalToSidereal(trueTropicalLongitude: number, date: Date): number {
  return normalizeDegrees(trueTropicalLongitude - nutationLongitude(date) - getLahiriAyanamsa(date));
}

/** Geocentric tropical Moon longitude (true ecliptic of date). */
export function tropicalMoonLongitude(date: Date): number {
  return normalizeDegrees(Astronomy.EclipticGeoMoon(date).lon);
}

/** Geocentric tropical (apparent) Sun longitude. */
export function tropicalSunLongitude(date: Date): number {
  return normalizeDegrees(Astronomy.SunPosition(date).elon);
}

/** Geocentric tropical Mars longitude (true ecliptic of date, light-time corrected). */
export function tropicalMarsLongitude(date: Date): number {
  return normalizeDegrees(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mars, date, true)).elon);
}

export function siderealMoonLongitude(date: Date): number {
  return tropicalToSidereal(tropicalMoonLongitude(date), date);
}

export function siderealSunLongitude(date: Date): number {
  return tropicalToSidereal(tropicalSunLongitude(date), date);
}

export function siderealMarsLongitude(date: Date): number {
  return tropicalToSidereal(tropicalMarsLongitude(date), date);
}

/**
 * Sidereal Ascendant (Lagna) longitude for a place and instant.
 *
 * λ_asc = atan2( cos RAMC, −(sin RAMC · cos ε + tan φ · sin ε) )
 * with RAMC from apparent sidereal time and ε the true obliquity.
 */
export function siderealAscendant(date: Date, latitude: number, longitude: number): number {
  if (Math.abs(latitude) >= 89.9) throw new RangeError('Ascendant is undefined at the poles.');
  const time = Astronomy.MakeTime(date);
  const gastHours = Astronomy.SiderealTime(time);
  const ramc = normalizeDegrees(gastHours * 15 + longitude) * Math.PI / 180;
  const eps = Astronomy.e_tilt(time).tobl * Math.PI / 180;
  const phi = latitude * Math.PI / 180;
  const asc = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))
  ) * 180 / Math.PI;
  return tropicalToSidereal(normalizeDegrees(asc), date);
}
