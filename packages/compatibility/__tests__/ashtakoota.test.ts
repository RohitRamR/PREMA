import {
  calculateGunaMilan, calculateBhakoot, calculateNadi, calculateTara, taraNumber,
  getVashyaPointsDirected, getGanaPointsDirected, resolveOrientation,
} from '../src/astrology/ashtakoota';
import { calculateAstrologyScore } from '../src/astrology/astrology-scorer';
import { getYoniScoreDirected, YONI_ENEMY_PAIRS, YONI_ORDER } from '../src/astrology/data/yoni-compatibility';
import { GRAHA_MAITRI_MATRIX } from '../src/astrology/data/planetary-relationships';
import { NAKSHATRAS } from '../src/astrology/data/nakshatras';
import { RASHIS } from '../src/astrology/data/rashis';
import { astroAt } from './fixtures';

const rashi = (en: string) => RASHIS.find((r) => r.englishName === en)!;
const nak = (name: string) => NAKSHATRAS.find((n) => n.name === name)!;

describe('Guna Milan — worked example', () => {
  // Groom: Ashwini (Aries). Bride: Bharani (Aries).
  // Varna 1 · Vashya 2 · Tara 3 · Yoni 2 (Elephant bride/Horse groom) · Graha Maitri 5 (Mars–Mars)
  // Gana 5 (Manushya bride/Deva groom) · Bhakoot 7 (same sign) · Nadi 8 (Aadi vs Madhya) = 33
  it('scores Ashwini groom × Bharani bride = 33/36', () => {
    const groom = astroAt('g', 1, 2);
    const bride = astroAt('b', 2, 2);
    const r = calculateGunaMilan(groom, bride, { genderA: 'male', genderB: 'female' });
    const pts = Object.fromEntries(r.kootas.map((k) => [k.koota, k.score]));
    expect(pts).toEqual({ Varna: 1, Vashya: 2, Tara: 3, Yoni: 2, 'Graha Maitri': 5, Gana: 5, Bhakoot: 7, Nadi: 8 });
    expect(r.totalScore).toBe(33);
    expect(r.orientation).toBe('A_groom');
  });

  it('gives the same result when the users are passed in the other order', () => {
    const groom = astroAt('g', 1, 2);
    const bride = astroAt('b', 2, 2);
    const ab = calculateGunaMilan(groom, bride, { genderA: 'male', genderB: 'female' });
    const ba = calculateGunaMilan(bride, groom, { genderA: 'female', genderB: 'male' });
    expect(ba.totalScore).toBe(ab.totalScore);
  });
});

describe('Bhakoot', () => {
  it('1/7 (opposite signs) is auspicious — 7 points (previously a bug gave 0)', () => {
    expect(calculateBhakoot(rashi('Aries'), rashi('Libra')).score).toBe(7);
    expect(calculateBhakoot(rashi('Cancer'), rashi('Capricorn')).score).toBe(7);
  });
  it('3/11 and 4/10 are auspicious', () => {
    expect(calculateBhakoot(rashi('Aries'), rashi('Gemini')).score).toBe(7);
    expect(calculateBhakoot(rashi('Aries'), rashi('Cancer')).score).toBe(7);
  });
  it('2/12, 5/9, 6/8 are doshas', () => {
    for (const [a, b] of [['Aries', 'Taurus'], ['Aries', 'Leo'], ['Aries', 'Virgo']]) {
      const r = calculateBhakoot(rashi(a!), rashi(b!));
      expect(r.score).toBe(0);
      expect(r.hasDosha).toBe(true);
    }
  });
  it('is cancelled when both signs share a lord (Capricorn–Aquarius, Saturn)', () => {
    const r = calculateBhakoot(rashi('Capricorn'), rashi('Aquarius'));
    expect(r.hasDosha).toBe(true);
    expect(r.doshaCancelled).toBe(true);
  });
  it('is not cancelled for neutral lords (Aries–Taurus, Mars/Venus)', () => {
    expect(calculateBhakoot(rashi('Aries'), rashi('Taurus')).doshaCancelled).toBe(false);
  });
});

describe('Nadi', () => {
  it('same Nadi is a dosha (Ashwini–Ardra, both Aadi)', () => {
    const r = calculateNadi(nak('Ashwini'), nak('Ardra'), rashi('Aries'), rashi('Gemini'));
    expect(r.score).toBe(0);
    expect(r.hasDosha).toBe(true);
    expect(r.doshaCancelled).toBe(false);
  });
  it('is cancelled for the same rashi but different nakshatras (Krittika–Rohini in Taurus)', () => {
    const r = calculateNadi(nak('Krittika'), nak('Rohini'), rashi('Taurus'), rashi('Taurus'));
    expect(r.hasDosha).toBe(true);
    expect(r.doshaCancelled).toBe(true);
  });
  it('is cancelled for the same nakshatra in different padas', () => {
    const r = calculateNadi(nak('Rohini'), nak('Rohini'), rashi('Taurus'), rashi('Taurus'), 1, 3);
    expect(r.doshaCancelled).toBe(true);
  });
  it('is NOT cancelled for the same nakshatra and the same pada', () => {
    const r = calculateNadi(nak('Rohini'), nak('Rohini'), rashi('Taurus'), rashi('Taurus'), 2, 2);
    expect(r.doshaCancelled).toBe(false);
  });
  it('effectiveScore restores half of a cancelled dosha, totalScore stays classical', () => {
    const a = astroAt('a', 3, 3); // Krittika pada 3 → Taurus
    const b = astroAt('b', 4, 2); // Rohini → Taurus
    const r = calculateGunaMilan(a, b);
    expect(r.kootas[7]!.score).toBe(0);
    expect(r.effectiveScore - r.totalScore).toBe(4);
    expect(r.hasNadiDosha).toBe(false);
  });
  it('friendly Moon-sign lords do NOT cancel Nadi dosha (Ashwini/Aries – Mula/Sagittarius)', () => {
    // Both Aadi Nadi; lords Mars & Jupiter are mutual friends — still a dosha.
    const r = calculateNadi(nak('Ashwini'), nak('Mula'), rashi('Aries'), rashi('Sagittarius'));
    expect(r.hasDosha).toBe(true);
    expect(r.doshaCancelled).toBe(false);
  });
});

describe('Tara', () => {
  it('counts inclusively; 3, 5, 7 are inauspicious', () => {
    expect(taraNumber(nak('Ashwini'), nak('Ashwini'))).toBe(1);
    expect(taraNumber(nak('Ashwini'), nak('Krittika'))).toBe(3);
    expect(taraNumber(nak('Bharani'), nak('Ashwini'))).toBe(9);
    expect(calculateTara(nak('Ashwini'), nak('Krittika')).score).toBe(1.5);
  });
});

describe('Classical tables', () => {
  it('Yoni: same animal 4, all seven sworn-enemy pairs 0 in both directions', () => {
    for (const a of YONI_ORDER) expect(getYoniScoreDirected(a, a)).toBe(4);
    for (const [a, b] of YONI_ENEMY_PAIRS) {
      expect(getYoniScoreDirected(a, b)).toBe(0);
      expect(getYoniScoreDirected(b, a)).toBe(0);
    }
  });

  it('Graha Maitri reproduces the standard published table', () => {
    expect(GRAHA_MAITRI_MATRIX.Sun).toEqual({ Sun: 5, Moon: 5, Mars: 5, Mercury: 4, Jupiter: 5, Venus: 0, Saturn: 0 });
    expect(GRAHA_MAITRI_MATRIX.Moon).toEqual({ Sun: 5, Moon: 5, Mars: 4, Mercury: 1, Jupiter: 4, Venus: 0.5, Saturn: 0.5 });
    expect(GRAHA_MAITRI_MATRIX.Mars).toEqual({ Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 3, Saturn: 0.5 });
    expect(GRAHA_MAITRI_MATRIX.Mercury).toEqual({ Sun: 4, Moon: 1, Mars: 0.5, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 4 });
    expect(GRAHA_MAITRI_MATRIX.Jupiter).toEqual({ Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 0.5, Saturn: 3 });
    expect(GRAHA_MAITRI_MATRIX.Venus).toEqual({ Sun: 0, Moon: 0.5, Mars: 3, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 5 });
    expect(GRAHA_MAITRI_MATRIX.Saturn).toEqual({ Sun: 0, Moon: 0.5, Mars: 0.5, Mercury: 4, Jupiter: 3, Venus: 5, Saturn: 5 });
  });

  it('Gana: Deva bride × Rakshasa groom = 0, the reverse = 1', () => {
    expect(getGanaPointsDirected('Deva', 'Rakshasa')).toBe(0);
    expect(getGanaPointsDirected('Rakshasa', 'Deva')).toBe(1);
    expect(getGanaPointsDirected('Manushya', 'Deva')).toBe(5);
    expect(getGanaPointsDirected('Deva', 'Manushya')).toBe(6);
  });

  it('Vashya: same group = 2, Vanachara is unfavourable with most', () => {
    expect(getVashyaPointsDirected('Manava', 'Manava')).toBe(2);
    expect(getVashyaPointsDirected('Vanachara', 'Manava')).toBe(0);
  });

  it('orientation follows gender, neutral for same-gender pairs', () => {
    expect(resolveOrientation('Female', 'man')).toBe('A_bride');
    expect(resolveOrientation('male', 'female')).toBe('A_groom');
    expect(resolveOrientation('female', 'female')).toBe('neutral');
    expect(resolveOrientation(undefined, 'male')).toBe('neutral');
  });
});

describe('Kundli score (0–100)', () => {
  it('caps matches below the traditional 18-Guna threshold at 45 and penalises uncancelled Nadi dosha', () => {
    for (let i = 1; i <= 27; i++) {
      for (let j = 1; j <= 27; j++) {
        const a = astroAt('a', i, 1);
        const b = astroAt('b', j, 3);
        const r = calculateAstrologyScore(a, b);
        if (r.gunaMilan.totalScore < 18) expect(r.score).toBeLessThanOrEqual(45);
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
      }
    }
    // Identical nakshatra + pada → uncancelled Nadi dosha.
    const same = calculateAstrologyScore(astroAt('a', 3, 3), astroAt('b', 3, 3));
    expect(same.gunaMilan.hasNadiDosha).toBe(true);
    expect(same.summary).toMatch(/Nadi dosha$|Nadi dosha ·/);
  });

  it('shrinks toward neutral when the nakshatra is uncertain (unknown birth time)', () => {
    const a = astroAt('a', 1, 2);
    const b = astroAt('b', 2, 2);
    const sure = calculateAstrologyScore(a, b);
    const unsure = calculateAstrologyScore({ ...a, confidence: 'low' }, b);
    expect(Math.abs(unsure.score - 50)).toBeLessThan(Math.abs(sure.score - 50));
  });
});

describe('Invariants over all 27 × 27 × 4 × 4 nakshatra/pada combinations', () => {
  it('every koota stays within its maximum, total ≤ 36, and gendered/neutral scores are symmetric', () => {
    for (let i = 1; i <= 27; i++) {
      for (let j = 1; j <= 27; j++) {
        for (const pa of [1, 4]) {
          for (const pb of [1, 4]) {
            const a = astroAt('a', i, pa);
            const b = astroAt('b', j, pb);
            const neutral = calculateGunaMilan(a, b);
            const neutralRev = calculateGunaMilan(b, a);
            expect(neutral.totalScore).toBeCloseTo(neutralRev.totalScore, 9);

            const mf = calculateGunaMilan(a, b, { genderA: 'male', genderB: 'female' });
            const fm = calculateGunaMilan(b, a, { genderA: 'female', genderB: 'male' });
            expect(mf.totalScore).toBe(fm.totalScore);

            for (const r of [neutral, mf]) {
              expect(r.totalScore).toBeGreaterThanOrEqual(0);
              expect(r.totalScore).toBeLessThanOrEqual(36);
              expect(r.effectiveScore).toBeGreaterThanOrEqual(r.totalScore);
              expect(r.effectiveScore).toBeLessThanOrEqual(36);
              for (const k of r.kootas) {
                expect(k.score).toBeGreaterThanOrEqual(0);
                expect(k.score).toBeLessThanOrEqual(k.maxPoints);
              }
            }
          }
        }
      }
    }
  });
});
