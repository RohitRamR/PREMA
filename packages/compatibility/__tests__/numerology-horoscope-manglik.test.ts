import {
  calculateLifePathNumber, calculateMoolank, calculateBhagyank, calculateExpressionNumber,
  calculateSoulUrgeNumber, buildNumerologyProfile,
} from '../src/numerology/numerology-calculator';
import {
  calculateNumerologyCompatibility, NUMBER_HARMONY_MATRIX, moolankFriendshipPoints,
} from '../src/numerology/numerology-compatibility';
import { buildSunSignProfile } from '../src/horoscope/sun-sign';
import { calculateSunSignCompatibility, sunSignPairScore } from '../src/horoscope/sun-sign-compatibility';
import { computeManglikProfile, checkManglikCompatibility } from '../src/astrology/manglik';
import { astroAt } from './fixtures';

describe('Numerology', () => {
  it('Life Path: 1990-07-15 → 5', () => {
    expect(calculateLifePathNumber('1990-07-15')).toBe(5);
  });
  it('Life Path keeps master number 11 (1979-01-02)', () => {
    expect(calculateLifePathNumber('1979-01-02')).toBe(11);
  });
  it('Moolank and Bhagyank (Indian numerology)', () => {
    expect(calculateMoolank('1990-07-15')).toBe(6);  // 1+5
    expect(calculateMoolank('1990-07-29')).toBe(2);  // 2+9=11 → 2
    expect(calculateBhagyank('1990-07-15')).toBe(5); // 1+5+0+7+1+9+9+0 = 32 → 5
  });
  it('never shifts the birthday because of time zones', () => {
    // 10 March 1995 created on a phone in India = 9 March 18:30 UTC.
    expect(calculateMoolank(new Date('1995-03-09T18:30:00Z'))).toBe(1);
    expect(calculateMoolank('1995-03-10')).toBe(1);
  });
  it('Expression and Soul Urge from the name', () => {
    expect(calculateExpressionNumber('ABC')).toBe(6);
    expect(calculateSoulUrgeNumber('Rohit')).toBe(6); // O6 + I9 = 15 → 6
    expect(calculateExpressionNumber('  ')).toBeNull();
  });
  it('harmony matrix is symmetric', () => {
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      expect(NUMBER_HARMONY_MATRIX[a]![b]).toBe(NUMBER_HARMONY_MATRIX[b]![a]);
    }
  });
  it('Moolank friendship is symmetric and follows planets (1 Sun – 9 Mars friends, 1 Sun – 8 Saturn enemies)', () => {
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      expect(moolankFriendshipPoints(a, b)).toBe(moolankFriendshipPoints(b, a));
    }
    expect(moolankFriendshipPoints(1, 9)).toBe(5);
    expect(moolankFriendshipPoints(1, 8)).toBe(0);
  });
  it('overall score is symmetric, 0–100, and works without names', () => {
    const a = buildNumerologyProfile('a', '1990-07-15', 'Priya Sharma');
    const b = buildNumerologyProfile('b', '1992-11-03', 'Arjun Mehta');
    const ab = calculateNumerologyCompatibility(a, b);
    const ba = calculateNumerologyCompatibility(b, a);
    expect(ab.score).toBe(ba.score);
    expect(ab.score).toBeGreaterThanOrEqual(0);
    expect(ab.score).toBeLessThanOrEqual(100);
    const noName = calculateNumerologyCompatibility(buildNumerologyProfile('a', '1990-07-15'), buildNumerologyProfile('b', '1992-11-03'));
    expect(noName.expressionCompatibility).toBeNull();
    expect(noName.score).toBeGreaterThan(0);
  });
});

describe('Western horoscope (sun sign)', () => {
  it('uses the real Sun position', () => {
    expect(buildSunSignProfile({ userId: 'x', dateOfBirth: '1990-07-15' }).sign).toBe('Cancer');
    expect(buildSunSignProfile({ userId: 'x', dateOfBirth: '1990-12-25' }).sign).toBe('Capricorn');
  });
  it('handles cusp days with the IST birth time (equinox 20 Mar 2000, 13:05 IST)', () => {
    expect(buildSunSignProfile({ userId: 'x', dateOfBirth: '2000-03-20', exactBirthTime: '09:00' }).sign).toBe('Pisces');
    expect(buildSunSignProfile({ userId: 'x', dateOfBirth: '2000-03-20', exactBirthTime: '18:00' }).sign).toBe('Aries');
    const unknown = buildSunSignProfile({ userId: 'x', dateOfBirth: '2000-03-20' });
    expect(unknown.onCusp).toBe(true);
  });
  it('aspect scores: trine > sextile > conjunction > opposition > square', () => {
    expect(sunSignPairScore(0, 4).aspect).toBe('trine');
    expect(sunSignPairScore(0, 6).aspect).toBe('opposition');
    expect(sunSignPairScore(0, 3).aspect).toBe('square');
    expect(sunSignPairScore(0, 4).score).toBeGreaterThan(sunSignPairScore(0, 3).score);
    expect(sunSignPairScore(11, 1).aspect).toBe('sextile'); // Pisces–Taurus wraps around
  });
  it('is symmetric', () => {
    const a = buildSunSignProfile({ userId: 'a', dateOfBirth: '1990-04-10' });
    const b = buildSunSignProfile({ userId: 'b', dateOfBirth: '1991-08-10' });
    expect(calculateSunSignCompatibility(a, b).score).toBe(calculateSunSignCompatibility(b, a).score);
  });
});

describe('Manglik dosha', () => {
  const deg = (signIndex1: number) => (signIndex1 - 1) * 30 + 15;

  it('Mars in the 4th from the Moon only → mild', () => {
    const m = computeManglikProfile(deg(1), deg(4)); // Moon Aries, Mars Cancer
    expect(m.marsHouseFromMoon).toBe(4);
    expect(m.severity).toBe('mild');
  });
  it('Mars in a dosha house from both Lagna and Moon → strong', () => {
    const m = computeManglikProfile(deg(1), deg(4), deg(4)); // 4th from Moon, 1st from Lagna
    expect(m.severity).toBe('strong');
  });
  it('Mars exalted in Capricorn cancels the dosha', () => {
    const m = computeManglikProfile(deg(10), deg(10), deg(10));
    expect(m.isManglik).toBe(false);
    expect(m.cancellations.length).toBeGreaterThan(0);
  });
  it('no dosha when Mars is in a neutral house', () => {
    expect(computeManglikProfile(deg(1), deg(3), deg(1)).severity).toBe('none'); // 3rd house
  });
  it('compatibility: both Manglik cancel; one strong Manglik is a mismatch', () => {
    const strong = astroAt('a', 1, 1, { manglik: computeManglikProfile(deg(1), deg(4), deg(4)) });
    const strong2 = astroAt('b', 5, 1, { manglik: computeManglikProfile(deg(1), deg(4), deg(4)) });
    const none = astroAt('c', 9, 1, { manglik: computeManglikProfile(deg(1), deg(3), deg(1)) });
    expect(checkManglikCompatibility(strong, strong2).status).toBe('mutual_cancellation');
    const mm = checkManglikCompatibility(strong, none);
    expect(mm.status).toBe('mismatch');
    expect(mm.score).toBe(20);
    expect(checkManglikCompatibility(none, none).score).toBe(100);
  });
});
