// =============================================================================
// PREMA Compatibility Engine — Match Profile
// =============================================================================
// Everything the engine needs about ONE user, computed once (Kundli, numerology
// and sun sign are expensive astronomy calls) and reused for every pairing.
// =============================================================================

import type {
  UserProfile, UserPreferences, UserBirthData, PersonalityProfile, CommunicationProfile,
  ValuesProfile, LifestyleProfile, RelationshipGoalsProfile, InterestsProfile,
} from '../types';
import type { AstroProfile } from '../astrology/astrology-types';
import type { NumerologyProfile } from '../numerology/numerology-types';
import type { SunSignProfile } from '../horoscope/sun-sign';
import { buildAstroProfile } from '../astrology/moon-calculator';
import { buildNumerologyProfile } from '../numerology/numerology-calculator';
import { buildSunSignProfile } from '../horoscope/sun-sign';
import type { FullCompatibilityInput } from '../scoring/scoring-engine';

export interface MatchProfile {
  user: UserProfile;
  prefs: UserPreferences;
  astro: AstroProfile;
  numerology: NumerologyProfile;
  sunSign: SunSignProfile;
  personality?: PersonalityProfile;
  communication?: CommunicationProfile;
  values?: ValuesProfile;
  lifestyle?: LifestyleProfile;
  goals?: RelationshipGoalsProfile;
  interests?: InterestsProfile;
}

export interface MatchProfileInput {
  user: UserProfile;
  prefs: UserPreferences;
  /** Birth date + time. Time is IST unless birthTimezone / birthUtcOffsetMinutes is set. */
  birthData: Omit<UserBirthData, 'userId'> & { userId?: string };
  /** Full name for Expression / Soul Urge numbers (optional). */
  fullName?: string | null;
  personality?: PersonalityProfile;
  communication?: CommunicationProfile;
  values?: ValuesProfile;
  lifestyle?: LifestyleProfile;
  goals?: RelationshipGoalsProfile;
  interests?: InterestsProfile;
}

export function buildMatchProfile(input: MatchProfileInput): MatchProfile {
  const birthData: UserBirthData = { ...input.birthData, userId: input.user.id };
  return {
    user: input.user,
    prefs: input.prefs,
    astro: buildAstroProfile(birthData),
    numerology: buildNumerologyProfile(input.user.id, birthData.dateOfBirth, input.fullName ?? null),
    sunSign: buildSunSignProfile(birthData),
    personality: input.personality,
    communication: input.communication,
    values: input.values,
    lifestyle: input.lifestyle,
    goals: input.goals,
    interests: input.interests,
  };
}

export function toCompatibilityInput(a: MatchProfile, b: MatchProfile): FullCompatibilityInput {
  return {
    userA: a.user, userB: b.user,
    prefsA: a.prefs, prefsB: b.prefs,
    astroProfileA: a.astro, astroProfileB: b.astro,
    numerologyProfileA: a.numerology, numerologyProfileB: b.numerology,
    sunSignA: a.sunSign, sunSignB: b.sunSign,
    personalityA: a.personality, personalityB: b.personality,
    communicationA: a.communication, communicationB: b.communication,
    valuesA: a.values, valuesB: b.values,
    lifestyleA: a.lifestyle, lifestyleB: b.lifestyle,
    goalsA: a.goals, goalsB: b.goals,
    interestsA: a.interests, interestsB: b.interests,
  };
}
