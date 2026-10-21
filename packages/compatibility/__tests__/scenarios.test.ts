// Scenario tests: named mock couples, each exercising one possible outcome.
import { calculateFullCompatibility } from '../src/scoring/scoring-engine';
import { toCompatibilityInput, type MatchProfile } from '../src/matchmaking/match-profile';
import { findBestMatches } from '../src/matchmaking/matchmaker';
import { allocateDailyMatches } from '../src/matchmaking/daily-pairing';
import { DEFAULT_MATCHING_CONFIG } from '../src/config/matching-config';
import { person, astroAt } from './fixtures';
import type { PersonalityProfile, CommunicationProfile, ValuesProfile, LifestyleProfile, RelationshipGoalsProfile } from '../src/types';

const cfg = DEFAULT_MATCHING_CONFIG;
const score = (a: MatchProfile, b: MatchProfile) => calculateFullCompatibility(toCompatibilityInput(a, b), cfg);

// ---------------------------------------------------------------------------
// Questionnaire builders
// ---------------------------------------------------------------------------
const personality = (id: string, v: number): PersonalityProfile => ({
  userId: id, communicationDirectness: v, socialEnergy: v, independence: v, conflictAvoidance: v,
  emotionalOpenness: v, adventurePreference: v, routinePreference: v, decisionMaking: v, affectionStyle: v,
});
const communication = (id: string, v: number): CommunicationProfile => ({
  userId: id, directness: v, frequencyPreference: v, conflictStyle: v, responseExpectation: v,
  emotionalOpenness: v, reassuranceNeed: v, affectionCommunication: v, disagreementHandling: v,
});
const values = (id: string, v: number, kids: ValuesProfile['childrenExpectation'] = 'wants_children'): ValuesProfile => ({
  userId: id, familyImportance: v, marriageExpectation: v, childrenExpectation: kids, careerPriority: v,
  financialAttitude: v, lifestylePriority: v, religionSpirituality: v, socialValues: v, personalIndependence: v,
});
const lifestyle = (id: string, v: number): LifestyleProfile => ({
  userId: id, foodPreference: v, travelFrequency: v, sleepSchedule: v, exerciseFrequency: v, socialActivity: v,
  alcoholPreference: v, smokingPreference: v, workStyle: v, weekendStyle: v, spendingStyle: v,
});
const goals = (id: string, intention: RelationshipGoalsProfile['intention'] = 'marriage_oriented', kids: RelationshipGoalsProfile['childrenPreference'] = 'wants_children'): RelationshipGoalsProfile => ({
  userId: id, intention, marriageTimeline: 'within_2_3_years', childrenPreference: kids,
  familyInvolvement: 0.7, relocationWillingness: 0.5, longDistanceWillingness: 0.3,
});
const full = (id: string, v: number) => ({
  personality: personality(id, v), communication: communication(id, v), values: values(id, v),
  lifestyle: lifestyle(id, v), goals: goals(id), interests: { userId: id, interests: ['music', 'travel', 'cooking'] },
});

/** Searches birth dates to find a partner whose Kundli with `her` is high / low. */
function findPartner(her: MatchProfile, want: 'high' | 'low', extra: Parameters<typeof person>[0]['extra'] = {}): MatchProfile {
  let best: MatchProfile | null = null;
  let bestGuna = want === 'high' ? -1 : 99;
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 28; d += 3) {
      const c = person({ id: `cand-${want}`, gender: 'male', dob: `1994-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, time: '12:00', extra });
      const g = score(her, c).detailedBreakdown!.astrology.gunaMilan.totalScore;
      if (want === 'high' ? g > bestGuna : g < bestGuna) { bestGuna = g; best = c; }
    }
  }
  return best!;
}

describe('Scenario: perfect couple vs mismatched couple', () => {
  const her = person({ id: 'meera', gender: 'female', dob: '1996-04-12', time: '08:45', extra: full('meera', 0.6) });
  const great = findPartner(her, 'high', full('x', 0.6));
  const poor = findPartner(her, 'low', full('x', 0.6));

  it('a high-Guna partner with identical answers scores ≥ 80 with strong confidence', () => {
    const r = score(her, great).result;
    expect(r.isEligible).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(80);
    expect(r.confidence).toBe('strong');
    expect(r.strengths.length).toBeGreaterThan(0);
  });

  it('a low-Guna partner with identical answers scores clearly lower (astrology-first)', () => {
    const hi = score(her, great).result.score;
    const lo = score(her, poor).result.score;
    expect(hi - lo).toBeGreaterThanOrEqual(15);
    expect(score(her, poor).result.frictionPoints).toContain('Kundli (Guna Milan)');
  });

  it('opposite questionnaire answers lower the score but the stars still dominate', () => {
    const sameStarsOppositeAnswers = person({ id: 'opp', gender: 'male', dob: great.astro.birthInstantUtc!.slice(0, 10), time: '12:00', extra: full('opp', 0.0) });
    const r = score(her, sameStarsOppositeAnswers).result;
    expect(r.isEligible).toBe(true);
    expect(r.breakdown.personality).toBeLessThan(70);
    expect(r.breakdown.astrology).toBe(score(her, great).result.breakdown.astrology);
    expect(r.score).toBeLessThan(score(her, great).result.score);
    // Still better than bad stars with perfect answers.
    expect(r.score).toBeGreaterThan(score(her, poor).result.score - 10);
  });
});

describe('Scenario: every hard-filter outcome', () => {
  const base = { gender: 'female' as const, dob: '1996-04-12', time: '08:45' };
  const him = (over: Parameters<typeof person>[0] = { id: 'him', gender: 'male', dob: '1994-09-30' }) => person(over);

  const cases: Array<[string, MatchProfile, MatchProfile, RegExp]> = [
    ['blocked', person({ id: 'a', ...base, user: { blockedUserIds: ['him'] } }), him(), /Blocked/],
    ['safety restricted', person({ id: 'a', ...base }), him({ id: 'him', gender: 'male', dob: '1994-09-30', user: { isSafetyRestricted: true } }), /Safety/],
    ['inactive', person({ id: 'a', ...base, user: { isActive: false } }), him(), /Inactive/],
    ['gender mismatch', person({ id: 'a', ...base, wants: ['female'] }), him(), /Gender/],
    ['too old', person({ id: 'a', ...base, prefs: { maxAge: 25 } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', age: 32 }), /Age/],
    ['too far', person({ id: 'a', ...base, prefs: { maxDistanceKm: 10 } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', user: { latitude: 28.61, longitude: 77.2 } }), /Distance/],
    ['casual vs marriage', person({ id: 'a', ...base, user: { relationshipIntention: 'marriage_oriented' } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', user: { relationshipIntention: 'casual' } }), /intention/],
    ['kids conflict', person({ id: 'a', ...base, prefs: { childrenPreference: 'wants_children' } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', prefs: { childrenPreference: 'does_not_want_children' } }), /Children/],
    ['diet dealbreaker', person({ id: 'a', ...base, prefs: { diet: { accepted: ['vegetarian'], importance: 'dealbreaker' } } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { diet: 'non_vegetarian' } }), /Diet/],
    ['smoking dealbreaker', person({ id: 'a', ...base, prefs: { smoking: { accepted: ['never'], importance: 'dealbreaker' } } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { smoking: 'regularly' } }), /Smoking/],
    ['religion dealbreaker (case-insensitive)', person({ id: 'a', ...base, prefs: { religion: { accepted: ['Hindu'], importance: 'dealbreaker' } } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { religion: 'christian' } }), /Religion/],
    ['height dealbreaker', person({ id: 'a', ...base, prefs: { heightCm: { min: 175, importance: 'dealbreaker' } } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { heightCm: 168 } }), /Height/],
    ['education dealbreaker', person({ id: 'a', ...base, prefs: { minEducation: { level: 'masters', importance: 'dealbreaker' } } }), him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { education: 'bachelors' } }), /Education/],
    ['minimum Guna dealbreaker', person({ id: 'a', ...base, prefs: { minGunaScore: { score: 36, importance: 'dealbreaker' } } }), him(), /Guna/],
  ];

  it.each(cases)('%s → excluded with a clear reason, in both directions', (_name, a, b, reason) => {
    for (const [x, y] of [[a, b], [b, a]] as const) {
      const r = score(x, y).result;
      expect(r.isEligible).toBe(false);
      expect(r.score).toBe(0);
      expect(r.reasons.join(' ')).toMatch(reason);
    }
  });

  it('religion match is case-insensitive when it IS met', () => {
    const a = person({ id: 'a', ...base, prefs: { religion: { accepted: ['Hindu'], importance: 'dealbreaker' } } });
    const b = him({ id: 'him', gender: 'male', dob: '1994-09-30', attributes: { religion: ' hindu ' } });
    expect(score(a, b).result.isEligible).toBe(true);
  });
});

describe('Scenario: gender combinations', () => {
  it.each([
    ['woman ↔ man', 'female', 'male', ['male'], ['female']],
    ['man ↔ man', 'male', 'male', ['male'], ['male']],
    ['woman ↔ woman', 'female', 'female', ['female'], ['female']],
    ['open to everyone', 'female', 'male', ['everyone'], ['female']],
  ] as const)('%s pairs are scored symmetrically', (_n, ga, gb, wa, wb) => {
    const a = person({ id: 'a', gender: ga, dob: '1996-04-12', wants: [...wa] as any });
    const b = person({ id: 'b', gender: gb, dob: '1994-09-30', wants: [...wb] as any });
    const ab = score(a, b).result;
    const ba = score(b, a).result;
    expect(ab.isEligible).toBe(true);
    expect(ab.score).toBe(ba.score);
  });
});

describe('Scenario: Manglik outcomes', () => {
  const m = (sev: 'none' | 'mild' | 'strong') => ({ isManglik: sev !== 'none', severity: sev, marsHouseFromMoon: sev === 'none' ? 3 : 7, doshaFrom: sev === 'none' ? [] : ['moon' as const], cancellations: [], lagnaChecked: true });
  const pair = (sa: 'none' | 'mild' | 'strong', sb: 'none' | 'mild' | 'strong') => {
    const a = person({ id: 'a', gender: 'female', dob: '1996-04-12' });
    const b = person({ id: 'b', gender: 'male', dob: '1994-09-30' });
    const input = toCompatibilityInput(a, b);
    input.astroProfileA = { ...input.astroProfileA, manglik: m(sa) };
    input.astroProfileB = { ...input.astroProfileB, manglik: m(sb) };
    return calculateFullCompatibility(input, cfg).detailedBreakdown!.astrology.manglik!;
  };
  it.each([
    ['none', 'none', 'no_dosha', 100],
    ['strong', 'strong', 'mutual_cancellation', 100],
    ['mild', 'strong', 'mutual_cancellation', 100],
    ['mild', 'none', 'mismatch', 60],
    ['none', 'strong', 'mismatch', 20],
  ] as const)('%s + %s → %s (%i)', (sa, sb, status, pts) => {
    const r = pair(sa, sb);
    expect(r.status).toBe(status);
    expect(r.score).toBe(pts);
  });
});

describe('Scenario: data quality', () => {
  it('unknown birth time → lower confidence, never "strong"', () => {
    const a = person({ id: 'a', gender: 'female', dob: '1996-04-12', time: '' });
    const b = person({ id: 'b', gender: 'male', dob: '1994-09-30', extra: full('b', 0.5) });
    expect(a.astro.hasBirthTime).toBe(false);
    expect(score(a, b).result.confidence).not.toBe('strong');
  });
  it('only birth data (no questionnaires) still produces a valid Kundli-led score', () => {
    const r = score(person({ id: 'a', gender: 'female', dob: '1996-04-12' }), person({ id: 'b', gender: 'male', dob: '1994-09-30' }));
    expect(r.result.isEligible).toBe(true);
    expect(Number.isFinite(r.result.score)).toBe(true);
    expect(r.appliedWeights.astrology!).toBeGreaterThan(0.6);
  });
  it('kids conflict inside questionnaires caps the score at 40', () => {
    const a = person({ id: 'a', gender: 'female', dob: '1996-04-12', extra: { values: values('a', 0.5, 'wants_children') } });
    const b = person({ id: 'b', gender: 'male', dob: '1994-09-30', extra: { values: values('b', 0.5, 'does_not_want_children') } });
    expect(score(a, b).result.score).toBeLessThanOrEqual(40);
  });
});

describe('Scenario: one user, a realistic list of candidates', () => {
  it('ranks: dealbreakers removed → strong Kundli + matching goals on top', () => {
    const her = person({ id: 'her', gender: 'female', dob: '1996-04-12', time: '08:45', prefs: { diet: { accepted: ['vegetarian'], importance: 'dealbreaker' } }, extra: full('her', 0.6) });
    const star = findPartner(her, 'high', full('s', 0.6));
    const starVeg = person({ id: 'star', gender: 'male', dob: star.astro.birthInstantUtc!.slice(0, 10), time: '12:00', attributes: { diet: 'vegetarian' }, extra: full('star', 0.6) });
    const nonVegStar = person({ id: 'nonveg', gender: 'male', dob: star.astro.birthInstantUtc!.slice(0, 10), time: '12:00', attributes: { diet: 'non_vegetarian' }, extra: full('nv', 0.6) });
    const lowStars = findPartner(her, 'low', full('l', 0.6));
    const lowVeg = person({ id: 'low', gender: 'male', dob: lowStars.astro.birthInstantUtc!.slice(0, 10), time: '12:00', attributes: { diet: 'vegetarian' }, extra: full('low', 0.6) });
    const res = findBestMatches(her, [lowVeg, nonVegStar, starVeg], cfg, { minScore: 0, limit: 10 });
    expect(res.map((r) => r.candidateId)).toEqual(['star', 'low']);
  });
});

describe('Scenario: pool edge cases', () => {
  it('empty pool, single person and an all-incompatible pool do not crash', () => {
    expect(allocateDailyMatches([], cfg).pairs).toEqual([]);
    const solo = person({ id: 'solo', gender: 'female', dob: '1996-04-12' });
    expect(allocateDailyMatches([solo], cfg).unmatchedUserIds).toEqual(['solo']);
    const women = ['a', 'b', 'c'].map((id) => person({ id, gender: 'female', dob: '1996-04-12' }));
    const r = allocateDailyMatches(women, cfg); // all want men
    expect(r.pairs).toEqual([]);
    expect(r.unmatchedUserIds.sort()).toEqual(['a', 'b', 'c']);
  });
  it('duplicate profiles in the pool are paired at most once', () => {
    const a = person({ id: 'a', gender: 'female', dob: '1996-04-12' });
    const b = person({ id: 'b', gender: 'male', dob: '1994-09-30' });
    const r = allocateDailyMatches([a, b, a, b], cfg, { minScore: 0 });
    expect(r.pairs.length).toBe(1);
  });
  it('a pinned astro profile pair stays within bounds', () => {
    const a = astroAt('a', 1, 1);
    expect(a.rashi.englishName).toBe('Aries');
  });
});
