import { applyHardFilters } from '../src/filters/hard-filters';
import { calculateMutualPreferenceFit, evaluatePreferences } from '../src/preferences/preference-scorer';
import { calculateFullCompatibility } from '../src/scoring/scoring-engine';
import { DEFAULT_MATCHING_CONFIG, createMatchingConfig, starsShare } from '../src/config/matching-config';
import { toCompatibilityInput } from '../src/matchmaking/match-profile';
import { makeUser, makePrefs, person } from './fixtures';

describe('Dealbreakers', () => {
  const vegOnly = makePrefs('a', { targetGender: ['male'], diet: { accepted: ['vegetarian', 'jain'], importance: 'dealbreaker' } });
  const anyPrefs = makePrefs('b', { targetGender: ['female'] });
  const a = makeUser('a', { gender: 'female', attributes: { diet: 'vegetarian' } });
  const nonVeg = makeUser('b', { gender: 'male', attributes: { diet: 'non_vegetarian' } });
  const veg = makeUser('c', { gender: 'male', attributes: { diet: 'vegetarian' } });
  const unknownDiet = makeUser('d', { gender: 'male' });

  it('rejects a broken dealbreaker in either argument order', () => {
    expect(applyHardFilters(a, nonVeg, vegOnly, anyPrefs).pass).toBe(false);
    expect(applyHardFilters(nonVeg, a, anyPrefs, vegOnly).pass).toBe(false);
  });
  it('passes when the dealbreaker is met', () => {
    expect(applyHardFilters(a, veg, vegOnly, anyPrefs).pass).toBe(true);
  });
  it('does not silently pass or fail an empty field — it is reported as unverified', () => {
    const r = applyHardFilters(a, unknownDiet, vegOnly, anyPrefs);
    expect(r.pass).toBe(true);
    expect(r.unverifiedDealbreakers?.length).toBe(1);
  });
  it('gender, blocks, safety, inactivity and intention conflicts are excluded', () => {
    const b = makeUser('b', { gender: 'male' });
    const pb = makePrefs('b', { targetGender: ['female'] });
    const pa = makePrefs('a', { targetGender: ['male'] });
    const f = makeUser('a', { gender: 'female' });
    expect(applyHardFilters(f, b, pa, pb).pass).toBe(true);
    expect(applyHardFilters(f, b, makePrefs('a', { targetGender: ['female'] }), pb).pass).toBe(false);
    expect(applyHardFilters({ ...f, blockedUserIds: ['b'] }, b, pa, pb).pass).toBe(false);
    expect(applyHardFilters(f, { ...b, isSafetyRestricted: true }, pa, pb).pass).toBe(false);
    expect(applyHardFilters(f, { ...b, isActive: false }, pa, pb).pass).toBe(false);
    expect(applyHardFilters({ ...f, relationshipIntention: 'casual' }, { ...b, relationshipIntention: 'marriage_oriented' }, pa, pb).pass).toBe(false);
    expect(applyHardFilters(f, f, pa, pa).pass).toBe(false);
  });
});

describe('Mutual preference fit', () => {
  it('a one-sided match scores lower than a mutual one', () => {
    const a = makeUser('a', { gender: 'female', attributes: { smoking: 'never', diet: 'vegetarian' } });
    const b = makeUser('b', { gender: 'male', attributes: { smoking: 'regularly', diet: 'vegetarian' } });
    const c = makeUser('c', { gender: 'male', attributes: { smoking: 'never', diet: 'vegetarian' } });
    const prefsA = makePrefs('a', { smoking: { accepted: ['never'], importance: 'important' } });
    const prefsOther = makePrefs('x', { targetGender: ['female'], diet: { accepted: ['vegetarian'], importance: 'important' } });
    const oneSided = calculateMutualPreferenceFit(a, prefsA, b, prefsOther);
    const mutual = calculateMutualPreferenceFit(a, prefsA, c, prefsOther);
    expect(mutual.score).toBeGreaterThan(oneSided.score);
    expect(oneSided.bToA.satisfaction).toBe(1);
  });
  it('age softly prefers the middle of the range', () => {
    const seeker = makeUser('s');
    const prefs = makePrefs('s', { minAge: 25, maxAge: 35 });
    const mid = evaluatePreferences(seeker, prefs, makeUser('m', { age: 30 })).rules.find((r) => r.rule === 'Age')!;
    const edge = evaluatePreferences(seeker, prefs, makeUser('e', { age: 25 })).rules.find((r) => r.rule === 'Age')!;
    expect(mid.satisfaction).toBe(1);
    expect(edge.satisfaction).toBeCloseTo(0.8, 5);
  });
});

describe('Configuration', () => {
  it('default weights sum to 1 and astrology-related layers carry 60%', () => {
    expect(() => createMatchingConfig()).not.toThrow();
    expect(starsShare(DEFAULT_MATCHING_CONFIG)).toBeCloseTo(0.6, 6);
    expect(DEFAULT_MATCHING_CONFIG.astrologyWeight).toBeGreaterThan(DEFAULT_MATCHING_CONFIG.preferenceWeight);
  });
  it('rejects weights that do not sum to 1', () => {
    expect(() => createMatchingConfig({ astrologyWeight: 0.9 })).toThrow();
    expect(() => createMatchingConfig({ interestsWeight: -0.01, valuesWeight: 0.09 })).toThrow();
  });
});

describe('Full compatibility', () => {
  const her = person({ id: 'priya', gender: 'female', dob: '1996-04-12', time: '08:45', attributes: { diet: 'vegetarian' } });
  const him = person({ id: 'arjun', gender: 'male', dob: '1994-09-30', time: '19:10', attributes: { diet: 'vegetarian' } });

  it('produces an eligible, bounded, explained result', () => {
    const out = calculateFullCompatibility(toCompatibilityInput(her, him));
    expect(out.result.isEligible).toBe(true);
    expect(out.result.score).toBeGreaterThanOrEqual(0);
    expect(out.result.score).toBeLessThanOrEqual(100);
    expect(out.result.astrologySummary).toMatch(/\/36 Guna/);
    expect(out.result.reasons.some((r) => r.startsWith('Kundli:'))).toBe(true);
    const sum = Object.values(out.appliedWeights).reduce((s, w) => s + (w ?? 0), 0);
    expect(sum).toBeCloseTo(1, 3);
  });

  it('is symmetric — A vs B equals B vs A', () => {
    const ab = calculateFullCompatibility(toCompatibilityInput(her, him)).result;
    const ba = calculateFullCompatibility(toCompatibilityInput(him, her)).result;
    expect(ab.score).toBe(ba.score);
    expect(ab.breakdown).toEqual(ba.breakdown);
  });

  it('skips missing questionnaire layers instead of guessing, and gives Kundli more share', () => {
    const out = calculateFullCompatibility(toCompatibilityInput(her, him));
    expect(out.appliedWeights.personality).toBeUndefined();
    expect(out.appliedWeights.astrology!).toBeGreaterThan(DEFAULT_MATCHING_CONFIG.astrologyWeight);
    expect(out.result.frictionPoints).not.toContain('Personality');
  });

  it('a Manglik dealbreaker excludes a mismatched pair; "important" only lowers the score', () => {
    const base = toCompatibilityInput(her, him);
    const mismatch = {
      ...base,
      astroProfileA: { ...base.astroProfileA, manglik: { isManglik: true, severity: 'strong' as const, marsHouseFromMoon: 7, doshaFrom: ['moon' as const], cancellations: [], lagnaChecked: true } },
      astroProfileB: { ...base.astroProfileB, manglik: { isManglik: false, severity: 'none' as const, marsHouseFromMoon: 3, doshaFrom: [], cancellations: [], lagnaChecked: true } },
    };
    const deal = calculateFullCompatibility({ ...mismatch, prefsB: { ...base.prefsB, manglik: { rule: 'avoid_mismatch', importance: 'dealbreaker' } } });
    expect(deal.result.isEligible).toBe(false);
    expect(deal.result.score).toBe(0);
    const soft = calculateFullCompatibility({ ...mismatch, prefsB: { ...base.prefsB, manglik: { rule: 'avoid_mismatch', importance: 'important' } } });
    const none = calculateFullCompatibility(mismatch);
    expect(soft.result.isEligible).toBe(true);
    expect(soft.result.breakdown.preferences).toBeLessThan(none.result.breakdown.preferences);
  });

  it('a minimum-Guna dealbreaker is enforced', () => {
    const base = toCompatibilityInput(her, him);
    const out = calculateFullCompatibility({ ...base, prefsA: { ...base.prefsA, minGunaScore: { score: 37, importance: 'dealbreaker' } } });
    expect(out.result.isEligible).toBe(false);
  });

  it('confidence is strong only when birth times and questionnaires are complete', () => {
    const traits = { communicationDirectness: 0.5, socialEnergy: 0.5, independence: 0.5, conflictAvoidance: 0.5, emotionalOpenness: 0.5, adventurePreference: 0.5, routinePreference: 0.5, decisionMaking: 0.5, affectionStyle: 0.5 };
    const comm = { directness: 0.5, frequencyPreference: 0.5, conflictStyle: 0.5, responseExpectation: 0.5, emotionalOpenness: 0.5, reassuranceNeed: 0.5, affectionCommunication: 0.5, disagreementHandling: 0.5 };
    const values = { familyImportance: 0.7, marriageExpectation: 0.7, childrenExpectation: 'wants_children' as const, careerPriority: 0.5, financialAttitude: 0.5, lifestylePriority: 0.5, religionSpirituality: 0.5, socialValues: 0.5, personalIndependence: 0.5 };
    const life = { foodPreference: 0.5, travelFrequency: 0.5, sleepSchedule: 0.5, exerciseFrequency: 0.5, socialActivity: 0.5, alcoholPreference: 0.1, smokingPreference: 0, workStyle: 0.5, weekendStyle: 0.5, spendingStyle: 0.5 };
    const goals = { intention: 'long_term' as const, marriageTimeline: 'within_2_3_years' as const, childrenPreference: 'wants_children' as const, familyInvolvement: 0.6, relocationWillingness: 0.5, longDistanceWillingness: 0.3 };
    const full = (id: string, gender: 'male' | 'female', dob: string) => person({
      id, gender, dob,
      extra: {
        personality: { userId: id, ...traits }, communication: { userId: id, ...comm },
        values: { userId: id, ...values }, lifestyle: { userId: id, ...life },
        goals: { userId: id, ...goals }, interests: { userId: id, interests: ['music', 'travel'] },
      },
    });
    const out = calculateFullCompatibility(toCompatibilityInput(full('x', 'female', '1996-04-12'), full('y', 'male', '1994-09-30')));
    expect(out.result.confidence).toBe('strong');
    expect(out.detailedBreakdown?.relationshipGoals).not.toBeNull();
    const sparse = calculateFullCompatibility(toCompatibilityInput(her, him));
    expect(sparse.result.confidence).not.toBe('strong');
  });
});
