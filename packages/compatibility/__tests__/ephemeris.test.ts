import {
  resolveBirthMoment, getBirthCalendarDate, getLahiriAyanamsa, parseBirthTime, IST_OFFSET_MINUTES,
} from '../src/astrology/ephemeris';
import { buildAstroProfile, calculateMoonPosition } from '../src/astrology/moon-calculator';

describe('IST birth-time handling', () => {
  it('reads a bare HH:mm birth time as IST (UTC+05:30)', () => {
    const m = resolveBirthMoment({ userId: 'x', dateOfBirth: '1995-03-10', exactBirthTime: '06:30' });
    expect(m.instant.toISOString()).toBe('1995-03-10T01:00:00.000Z');
    expect(m.utcOffsetMinutes).toBe(IST_OFFSET_MINUTES);
    expect(m.timezoneLabel).toBe('IST (UTC+05:30)');
    expect(m.hasBirthTime).toBe(true);
  });

  it('keeps the correct date for a birth just after midnight IST', () => {
    const m = resolveBirthMoment({ userId: 'x', dateOfBirth: '1995-03-10', exactBirthTime: '00:15' });
    expect(m.instant.toISOString()).toBe('1995-03-09T18:45:00.000Z');
    expect(m.localDate).toEqual({ year: 1995, month: 3, day: 10 });
  });

  it('uses 12:00 IST when the birth time is unknown', () => {
    const m = resolveBirthMoment({ userId: 'x', dateOfBirth: '1995-03-10' });
    expect(m.instant.toISOString()).toBe('1995-03-10T06:30:00.000Z');
    expect(m.hasBirthTime).toBe(false);
  });

  it('treats an invalid time as unknown with a warning instead of guessing', () => {
    const m = resolveBirthMoment({ userId: 'x', dateOfBirth: '1995-03-10', exactBirthTime: '25:99' });
    expect(m.hasBirthTime).toBe(false);
    expect(m.warnings.length).toBe(1);
  });

  it('reads Date objects on the IST calendar day', () => {
    // A device in India building new Date(1995, 2, 10) → 1995-03-09T18:30Z.
    expect(getBirthCalendarDate(new Date('1995-03-09T18:30:00Z'))).toEqual({ year: 1995, month: 3, day: 10 });
    // Date-only values from JSON / DB (UTC midnight) keep their date.
    expect(getBirthCalendarDate(new Date('1995-03-10T00:00:00Z'))).toEqual({ year: 1995, month: 3, day: 10 });
  });

  it('supports births outside India via an IANA zone (DST-aware)', () => {
    const m = resolveBirthMoment({ userId: 'x', dateOfBirth: '1995-07-04', exactBirthTime: '09:00', birthTimezone: 'America/New_York' });
    expect(m.instant.toISOString()).toBe('1995-07-04T13:00:00.000Z'); // EDT = UTC-4
  });

  it('rejects impossible dates', () => {
    expect(() => getBirthCalendarDate('1995-02-30')).toThrow();
    expect(() => getBirthCalendarDate('not-a-date')).toThrow();
  });

  it('parses HH:mm and HH:mm:ss', () => {
    expect(parseBirthTime('7:05')).toEqual({ hour: 7, minute: 5, second: 0 });
    expect(parseBirthTime('23:59:59')).toEqual({ hour: 23, minute: 59, second: 59 });
    expect(parseBirthTime('24:00')).toBeNull();
  });
});

describe('Lahiri ayanamsa', () => {
  it('matches the Swiss Ephemeris value at J2000 (23°51′25″)', () => {
    expect(getLahiriAyanamsa(new Date('2000-01-01T12:00:00Z'))).toBeCloseTo(23.857, 2);
  });
  it('grows by about 50″ per year', () => {
    const d = getLahiriAyanamsa(new Date('2001-01-01T12:00:00Z')) - getLahiriAyanamsa(new Date('2000-01-01T12:00:00Z'));
    expect(d * 3600).toBeGreaterThan(49);
    expect(d * 3600).toBeLessThan(51.5);
  });
});

describe('Reference Kundlis (published charts, times in IST)', () => {
  it("India's independence — 15 Aug 1947 00:00 IST, Delhi: Taurus Lagna, Moon in Cancer, Pushya", () => {
    const p = buildAstroProfile({ userId: 'india', dateOfBirth: '1947-08-15', exactBirthTime: '00:00', birthPlaceLat: 28.6139, birthPlaceLon: 77.209 });
    expect(p.lagnaRashi?.englishName).toBe('Taurus');
    expect(p.rashi.englishName).toBe('Cancer');
    expect(p.nakshatra.name).toBe('Pushya');
    expect(Math.floor(p.marsLongitude! / 30) + 1).toBe(3); // Mars in Gemini
  });

  it('Ram Mandir Pran Pratishtha — 22 Jan 2024 12:29 IST, Ayodhya: Mrigashira, Aries Lagna', () => {
    const p = buildAstroProfile({ userId: 'ram', dateOfBirth: '2024-01-22', exactBirthTime: '12:29', birthPlaceLat: 26.7922, birthPlaceLon: 82.1998 });
    expect(p.nakshatra.name).toBe('Mrigashira');
    expect(p.lagnaRashi?.englishName).toBe('Aries');
  });

  it('Narendra Modi — 17 Sep 1950 11:00 IST, Vadnagar: Scorpio Lagna & Moon, Anuradha, Mars in Scorpio', () => {
    const p = buildAstroProfile({ userId: 'modi', dateOfBirth: '1950-09-17', exactBirthTime: '11:00', birthPlaceLat: 23.7846, birthPlaceLon: 72.6397 });
    expect(p.lagnaRashi?.englishName).toBe('Scorpio');
    expect(p.rashi.englishName).toBe('Scorpio');
    expect(p.nakshatra.name).toBe('Anuradha');
    expect(p.manglik?.cancellations.join(' ')).toMatch(/own sign/);
    expect(p.manglik?.isManglik).toBe(false);
  });

  it('a 5h30m error would change the result — IST is applied, not UTC', () => {
    const ist = calculateMoonPosition({ userId: 'x', dateOfBirth: '1950-09-17', exactBirthTime: '11:00' });
    const utc = calculateMoonPosition({ userId: 'x', dateOfBirth: '1950-09-17', exactBirthTime: '11:00', birthUtcOffsetMinutes: 0 });
    // Moon moves ~0.55°/hour → ~3° apart.
    expect(Math.abs(utc.siderealLongitude - ist.siderealLongitude)).toBeGreaterThan(2.5);
  });
});

describe('Unknown birth time', () => {
  it('lowers confidence and flags an uncertain nakshatra', () => {
    const p = buildAstroProfile({ userId: 'x', dateOfBirth: '1950-09-17' });
    expect(p.hasBirthTime).toBe(false);
    expect(['moderate', 'low']).toContain(p.confidence);
    expect(p.lagnaRashi).toBeUndefined();
    expect(p.manglik?.lagnaChecked).toBe(false);
  });
});
