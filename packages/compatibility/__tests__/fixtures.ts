import type { UserProfile, UserPreferences, UserAttributes } from '../src/types';
import type { AstroProfile } from '../src/astrology/astrology-types';
import { NAKSHATRAS } from '../src/astrology/data/nakshatras';
import { RASHIS } from '../src/astrology/data/rashis';
import { buildMatchProfile, type MatchProfile, type MatchProfileInput } from '../src/matchmaking/match-profile';

export function makeUser(id: string, overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id,
    firstName: id,
    age: 28,
    gender: 'female',
    relationshipIntention: 'long_term',
    isVerified: true,
    isActive: true,
    isSafetyRestricted: false,
    blockedUserIds: [],
    ...overrides,
  };
}

export function makePrefs(userId: string, overrides: Partial<UserPreferences> = {}): UserPreferences {
  return {
    userId,
    targetGender: ['male'],
    minAge: 21,
    maxAge: 40,
    maxDistanceKm: 5000,
    ...overrides,
  };
}

/** Astro profile pinned to a nakshatra/pada (moon placed in the middle of that pada). */
export function astroAt(userId: string, nakshatraIndex: number, pada = 2, extra: Partial<AstroProfile> = {}): AstroProfile {
  const nak = NAKSHATRAS[nakshatraIndex - 1]!;
  const span = 360 / 27;
  const moonLongitude = (nakshatraIndex - 1) * span + (pada - 0.5) * (span / 4);
  const rashi = RASHIS[Math.floor(moonLongitude / 30)]!;
  return {
    userId,
    moonLongitude,
    rashi,
    nakshatra: nak,
    nakshatraPada: pada,
    hasBirthTime: true,
    confidence: 'strong',
    ...extra,
  };
}

export interface PersonSpec {
  id: string;
  gender: 'male' | 'female';
  dob: string;
  time?: string;
  age?: number;
  wants?: Array<'male' | 'female'>;
  attributes?: UserAttributes;
  prefs?: Partial<UserPreferences>;
  user?: Partial<UserProfile>;
  extra?: Partial<Omit<MatchProfileInput, 'user' | 'prefs' | 'birthData'>>;
}

export function person(spec: PersonSpec): MatchProfile {
  const user = makeUser(spec.id, {
    gender: spec.gender,
    age: spec.age ?? 28,
    attributes: spec.attributes,
    latitude: 19.076,
    longitude: 72.8777,
    ...spec.user,
  });
  const prefs = makePrefs(spec.id, {
    targetGender: spec.wants ?? [spec.gender === 'male' ? 'female' : 'male'],
    ...spec.prefs,
  });
  return buildMatchProfile({
    user,
    prefs,
    birthData: { dateOfBirth: spec.dob, exactBirthTime: spec.time ?? '10:30', birthPlaceLat: 19.076, birthPlaceLon: 72.8777 },
    fullName: `${spec.id} Sharma`,
    ...spec.extra,
  });
}

/** Deterministic pseudo-random generator (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random but reproducible pool of people. */
export function randomPool(n: number, seed = 42): MatchProfile[] {
  const rnd = seededRandom(seed);
  const diets = ['vegetarian', 'non_vegetarian', 'eggetarian'] as const;
  const habits = ['never', 'occasionally', 'regularly'] as const;
  const pool: MatchProfile[] = [];
  for (let i = 0; i < n; i++) {
    const gender = i % 2 === 0 ? 'female' : 'male';
    const year = 1988 + Math.floor(rnd() * 12);
    const month = 1 + Math.floor(rnd() * 12);
    const day = 1 + Math.floor(rnd() * 28);
    const hh = Math.floor(rnd() * 24);
    const mm = Math.floor(rnd() * 60);
    const diet = diets[Math.floor(rnd() * diets.length)]!;
    const smoking = habits[Math.floor(rnd() * habits.length)]!;
    const strictVeg = rnd() < 0.25;
    pool.push(person({
      id: `u${String(i).padStart(3, '0')}`,
      gender,
      age: 2026 - year,
      dob: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
      attributes: { diet, smoking },
      prefs: {
        minAge: 22, maxAge: 40,
        ...(strictVeg ? { diet: { accepted: ['vegetarian'], importance: 'dealbreaker' as const } } : {}),
        ...(rnd() < 0.3 ? { smoking: { accepted: ['never'], importance: 'important' as const } } : {}),
      },
    }));
  }
  return pool;
}
