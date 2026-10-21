import { buildMatchProfile, type MatchProfile } from '../src/matchmaking/match-profile';
import { makeUser, makePrefs } from './fixtures';
import type { Diet, Habit, EducationLevel, RelationshipIntention, ChildrenPreference, Importance, UserProfile } from '../src/types';

export function pick<T>(rnd: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rnd() * xs.length)]!;
}
export const pad = (n: number) => String(n).padStart(2, '0');

/** Random profile; `messy` injects out-of-range, NaN and missing values. */
export function randomProfile(rnd: () => number, i: number, messy = false): MatchProfile {
  const gender = pick(rnd, ['male', 'female', 'female', 'male', 'non_binary'] as const);
  const year = 1986 + Math.floor(rnd() * 19); // ages 22–40
  const month = 1 + Math.floor(rnd() * 12);
  const dim = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = 1 + Math.floor(rnd() * dim);
  const time = rnd() < 0.2 ? null : `${pad(Math.floor(rnd() * 24))}:${pad(Math.floor(rnd() * 60))}`;
  const v = () => {
    if (messy && rnd() < 0.05) return pick(rnd, [NaN, -0.4, 1.7, Infinity] as const);
    return Math.round(rnd() * 100) / 100;
  };
  const id = `p${String(i).padStart(4, '0')}`;
  const age = 2026 - year;
  const importance = (): Importance => pick(rnd, ['dealbreaker', 'important', 'nice_to_have'] as const);
  const has = (p: number) => rnd() < p;

  const user: UserProfile = makeUser(id, {
    gender,
    age,
    relationshipIntention: pick(rnd, ['casual', 'long_term', 'long_term', 'marriage_oriented', 'marriage_oriented', 'open_to_either', 'not_sure'] as RelationshipIntention[]),
    // 75% Mumbai, 15% Pune, 5% Delhi, 5% no location shared
    ...(() => {
      const r = rnd();
      const [lat, lon] = r < 0.75 ? [19.07, 72.88] : r < 0.9 ? [18.52, 73.86] : r < 0.95 ? [28.61, 77.21] : [NaN, NaN];
      return Number.isNaN(lat) ? {} : { latitude: lat + (rnd() - 0.5) * 0.3, longitude: lon + (rnd() - 0.5) * 0.3 };
    })(),
    attributes: {
      diet: has(0.85) ? pick(rnd, ['vegetarian', 'non_vegetarian', 'vegan', 'jain', 'eggetarian'] as Diet[]) : undefined,
      smoking: has(0.85) ? pick(rnd, ['never', 'occasionally', 'regularly'] as Habit[]) : undefined,
      drinking: has(0.85) ? pick(rnd, ['never', 'occasionally', 'regularly'] as Habit[]) : undefined,
      religion: has(0.8) ? pick(rnd, ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain']) : undefined,
      heightCm: has(0.8) ? 150 + Math.floor(rnd() * 40) : undefined,
      education: has(0.8) ? pick(rnd, ['high_school', 'diploma', 'bachelors', 'masters', 'doctorate'] as EducationLevel[]) : undefined,
    },
  });
  const minAge = Math.max(21, age - 2 - Math.floor(rnd() * 6));
  const prefs = makePrefs(id, {
    targetGender: gender === 'non_binary' ? ['everyone'] : [pick(rnd, gender === 'male' ? ['female', 'female', 'male'] : ['male', 'male', 'female'])],
    minAge,
    maxAge: age + 3 + Math.floor(rnd() * 8),
    maxDistanceKm: pick(rnd, [25, 50, 100, 200, 2000]),
    childrenPreference: has(0.5) ? pick(rnd, ['wants_children', 'does_not_want_children', 'open_to_children', 'not_sure'] as ChildrenPreference[]) : undefined,
    ...(has(0.3) ? { diet: { accepted: [pick(rnd, ['vegetarian', 'non_vegetarian'] as Diet[])], importance: importance() } } : {}),
    ...(has(0.3) ? { smoking: { accepted: ['never' as Habit], importance: importance() } } : {}),
    ...(has(0.2) ? { religion: { accepted: [pick(rnd, ['Hindu', 'Muslim', 'Christian'])], importance: importance() } } : {}),
    ...(has(0.2) ? { heightCm: { min: 160 + Math.floor(rnd() * 15), importance: importance() } } : {}),
    ...(has(0.15) ? { manglik: { rule: 'avoid_mismatch' as const, importance: importance() } } : {}),
    ...(has(0.15) ? { minGunaScore: { score: 14 + Math.floor(rnd() * 10), importance: importance() } } : {}),
  });

  return buildMatchProfile({
    user,
    prefs,
    birthData: {
      dateOfBirth: `${year}-${pad(month)}-${pad(day)}`,
      exactBirthTime: time,
      birthPlaceLat: has(0.8) ? 8 + rnd() * 25 : undefined,
      birthPlaceLon: has(0.8) ? 68 + rnd() * 28 : undefined,
    },
    fullName: has(0.8) ? `${id} Kumar` : null,
    personality: has(0.7) ? { userId: id, communicationDirectness: v(), socialEnergy: v(), independence: v(), conflictAvoidance: v(), emotionalOpenness: v(), adventurePreference: v(), routinePreference: v(), decisionMaking: v(), affectionStyle: v() } : undefined,
    communication: has(0.7) ? { userId: id, directness: v(), frequencyPreference: v(), conflictStyle: v(), responseExpectation: v(), emotionalOpenness: v(), reassuranceNeed: v(), affectionCommunication: v(), disagreementHandling: v() } : undefined,
    values: has(0.7) ? { userId: id, familyImportance: v(), marriageExpectation: v(), childrenExpectation: pick(rnd, ['wants_children', 'does_not_want_children', 'open_to_children', 'has_children_wants_more', 'has_children_no_more', 'not_sure'] as ChildrenPreference[]), careerPriority: v(), financialAttitude: v(), lifestylePriority: v(), religionSpirituality: v(), socialValues: v(), personalIndependence: v() } : undefined,
    lifestyle: has(0.7) ? { userId: id, foodPreference: v(), travelFrequency: v(), sleepSchedule: v(), exerciseFrequency: v(), socialActivity: v(), alcoholPreference: v(), smokingPreference: v(), workStyle: v(), weekendStyle: v(), spendingStyle: v() } : undefined,
    goals: has(0.7) ? { userId: id, intention: pick(rnd, ['casual', 'long_term', 'marriage_oriented', 'open_to_either', 'not_sure'] as RelationshipIntention[]), marriageTimeline: pick(rnd, ['within_1_year', 'within_2_3_years', 'within_5_years', 'no_timeline', 'not_applicable'] as const), childrenPreference: pick(rnd, ['wants_children', 'does_not_want_children', 'open_to_children', 'not_sure'] as ChildrenPreference[]), familyInvolvement: v(), relocationWillingness: v(), longDistanceWillingness: v() } : undefined,
    interests: has(0.7) ? { userId: id, interests: Array.from({ length: Math.floor(rnd() * 6) }, () => pick(rnd, ['Music', 'music ', 'travel', 'yoga', 'cricket', 'books', 'cooking', 'films'])) } : undefined,
  });
}

