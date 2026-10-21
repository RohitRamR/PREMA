// Translates the app's profile fields (free text like "5′11″" or "Vegetarian")
// into the structured inputs the matching engine expects.
import {
  buildMatchProfile,
  type Diet,
  type EducationLevel,
  type MatchProfile,
  type RelationshipIntention,
  type UserPreferences,
} from '@prema/compatibility';
import type { Profile } from '../../store/profile';
import { person } from '../../store/people';
import { SAMPLE_BIRTHS, EXTRA_BASICS } from './sample-births';
import { quizToProfiles, sampleAnswers } from './quiz';

/**
 * 'display' scores the couple — always produces a score, so account status
 * (e.g. a paused profile) and intent filters never hide a %.
 * 'discover' applies your filters, intent and dealbreakers to decide who appears.
 */
export type Mode = 'display' | 'discover';

const OPEN_PREFS: Omit<UserPreferences, 'userId'> = {
  targetGender: ['everyone'],
  minAge: 18,
  maxAge: 99,
  maxDistanceKm: 100000,
};

export function parseHeightCm(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const cm = /(\d{3})\s*cm/i.exec(text);
  if (cm) return Number(cm[1]);
  const ft = /(\d)\s*(?:′|'|’|ft)\s*(\d{1,2})?/i.exec(text);
  if (!ft) return undefined;
  return Math.round(Number(ft[1]) * 30.48 + Number(ft[2] ?? 0) * 2.54);
}

export function parseDiet(text: string | undefined): Diet | undefined {
  const t = (text ?? '').toLowerCase();
  if (!t) return undefined;
  if (t.includes('jain')) return 'jain';
  if (t.includes('vegan')) return 'vegan';
  if (t.includes('egg')) return 'eggetarian';
  if (t.includes('non')) return 'non_vegetarian';
  if (t.includes('veg')) return 'vegetarian';
  return undefined;
}

export function parseEducation(text: string | undefined): EducationLevel | undefined {
  const t = (text ?? '').toLowerCase();
  if (!t) return undefined;
  if (/ph\.?d|doctorate/.test(t)) return 'doctorate';
  if (/\bm\.|master|mba|\bms\b|\bmtech|\bmsc/.test(t)) return 'masters';
  if (/\bb\.|bachelor|btech|\bbsc|\bba\b|\bbcom|mbbs/.test(t)) return 'bachelors';
  if (/diploma/.test(t)) return 'diploma';
  return undefined;
}

export function parseIntention(text: string | undefined): RelationshipIntention {
  const t = (text ?? '').toLowerCase();
  if (/marriage|life partner|partnership/.test(t)) return 'marriage_oriented';
  if (/long[- ]term/.test(t)) return 'long_term';
  if (/casual/.test(t)) return 'casual';
  if (/slow|open/.test(t)) return 'open_to_either';
  return 'not_sure';
}

const ME_ID = 'me';

/** Your must-haves become dealbreakers in Discover (never in the couple's %). */
function mustHaveRules(me: Profile): Partial<UserPreferences> {
  const m = me.discovery.mustHaves;
  const rules: Partial<UserPreferences> = {};
  if (m?.vegetarianOnly) rules.diet = { accepted: ['vegetarian', 'vegan', 'jain'], importance: 'dealbreaker' };
  if (m?.nonSmokersOnly) rules.smoking = { accepted: ['never'], importance: 'dealbreaker' };
  if (m?.nonDrinkersOnly) rules.drinking = { accepted: ['never'], importance: 'dealbreaker' };
  if (m?.sameReligionOnly && me.vitals.religion.trim()) {
    rules.religion = { accepted: [me.vitals.religion.trim()], importance: 'dealbreaker' };
  }
  return rules;
}

/** Your own engine profile, rebuilt whenever your profile changes. */
export function buildMyProfile(me: Profile, mode: Mode): MatchProfile {
  const prefs: UserPreferences =
    mode === 'display'
      ? { userId: ME_ID, ...OPEN_PREFS }
      : {
          userId: ME_ID,
          targetGender: me.interestedIn,
          minAge: me.discovery.ageMin,
          maxAge: me.discovery.ageMax,
          maxDistanceKm: me.discovery.distanceKm,
          ...(me.discovery.kundli.minGuna18 ? { minGunaScore: { score: 18, importance: 'dealbreaker' as const } } : {}),
          ...(me.discovery.kundli.avoidManglikMismatch ? { manglik: { rule: 'avoid_mismatch' as const, importance: 'dealbreaker' as const } } : {}),
          ...mustHaveRules(me),
        };
  const quiz = quizToProfiles(ME_ID, me.answers ?? {}, parseIntention(me.intent));

  return buildMatchProfile({
    user: {
      id: ME_ID,
      firstName: me.name || 'You',
      age: me.age,
      gender: me.gender,
      relationshipIntention: mode === 'display' ? 'open_to_either' : parseIntention(me.intent),
      isVerified: true,
      isActive: mode === 'display' ? true : !me.paused,
      isSafetyRestricted: false,
      blockedUserIds: [],
      attributes: {
        diet: parseDiet(me.vitals.diet),
        religion: me.vitals.religion || undefined,
        heightCm: parseHeightCm(me.vitals.height),
        education: parseEducation(me.vitals.education),
        smoking: quiz.smoking,
        drinking: quiz.drinking,
      },
    },
    prefs,
    birthData: {
      dateOfBirth: me.birth.date,
      exactBirthTime: me.birth.time || null, // IST
      birthPlaceLat: me.birth.lat,
      birthPlaceLon: me.birth.lon,
    },
    fullName: me.name,
    interests: { userId: ME_ID, interests: me.interests },
    personality: quiz.personality,
    communication: quiz.communication,
    values: quiz.values,
    lifestyle: quiz.lifestyle,
    goals: quiz.goals,
  });
}

/** Someone else's engine profile (sample data until the API lands). */
export type PersonBasics = { name: string; age: number; interests?: string[]; lookingFor?: string };

export function buildTheirProfile(id: string, mode: Mode, given?: PersonBasics): MatchProfile | null {
  const b = SAMPLE_BIRTHS[id];
  if (!b) return null;
  const p = person(id);
  const fallback = given ?? EXTRA_BASICS[id];
  const name = p?.name ?? fallback?.name ?? id;
  const age = p?.age ?? fallback?.age ?? 25;
  const intention = parseIntention(p?.lookingFor ?? fallback?.lookingFor ?? 'Long-term relationship');
  const quiz = quizToProfiles(id, sampleAnswers(id), intention);
  return buildMatchProfile({
    user: {
      id,
      firstName: name,
      age,
      gender: b.gender,
      relationshipIntention: mode === 'display' ? 'open_to_either' : intention,
      isVerified: true,
      isActive: true,
      isSafetyRestricted: false,
      blockedUserIds: [],
      attributes: { diet: b.diet, religion: b.religion, heightCm: b.heightCm, education: b.education, smoking: quiz.smoking, drinking: quiz.drinking },
    },
    prefs:
      mode === 'display'
        ? { userId: id, ...OPEN_PREFS }
        : { userId: id, targetGender: [b.gender === 'female' ? 'male' : 'female', 'non_binary'], minAge: 21, maxAge: 40, maxDistanceKm: 100000 },
    birthData: { dateOfBirth: b.date, exactBirthTime: b.time, birthPlaceLat: b.place.lat, birthPlaceLon: b.place.lon },
    fullName: name,
    interests: { userId: id, interests: p?.interests ?? fallback?.interests ?? [] },
    personality: quiz.personality,
    communication: quiz.communication,
    values: quiz.values,
    lifestyle: quiz.lifestyle,
    goals: quiz.goals,
  });
}
