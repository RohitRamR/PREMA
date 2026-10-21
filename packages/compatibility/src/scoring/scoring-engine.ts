/**
 * @file scoring-engine.ts
 * @description Central orchestrator for the PREMA compatibility pipeline.
 *
 *   hard filters → Kundli → astro dealbreakers → every other layer
 *   → weighted score (missing layers re-normalised) → confidence → explanation
 */

import type {
  CompatibilityResult,
  HardFilterResult,
  UserProfile,
  UserPreferences,
  PersonalityProfile,
  CommunicationProfile,
  ValuesProfile,
  LifestyleProfile,
  RelationshipGoalsProfile,
  InterestsProfile,
  CompatibilityBreakdown,
  MatchingConfig,
  Importance,
} from '../types';
import { DEFAULT_MATCHING_CONFIG } from '../config/matching-config';
import type { AstroProfile, AstrologyCompatibilityResult } from '../astrology/astrology-types';
import { calculateAstrologyScore } from '../astrology/astrology-scorer';
import type { NumerologyProfile, NumerologyCompatibilityResult } from '../numerology/numerology-types';
import { calculateNumerologyCompatibility } from '../numerology/numerology-compatibility';
import type { SunSignProfile } from '../horoscope/sun-sign';
import { calculateSunSignCompatibility, type SunSignCompatibilityResult } from '../horoscope/sun-sign-compatibility';
import type { PersonalityCompatibilityResult, CommunicationCompatibilityResult } from '../personality/personality-types';
import { calculatePersonalityCompatibility } from '../personality/personality-scorer';
import { calculateCommunicationCompatibility } from '../personality/communication-scorer';
import { calculateValuesCompatibility, type ValuesCompatibilityResult } from '../values/values-scorer';
import { calculateLifestyleCompatibility, type LifestyleCompatibilityResult } from '../lifestyle/lifestyle-scorer';
import { calculateRelationshipGoalsCompatibility, type RelationshipGoalsResult } from '../relationship-goals/relationship-goals-scorer';
import { calculateInterestsCompatibility, type InterestsCompatibilityResult } from '../interests/interests-scorer';
import { calculateMutualPreferenceFit, type MutualPreferenceResult } from '../preferences/preference-scorer';
import { applyHardFilters, applyAstroDealbreakers } from '../filters/hard-filters';
import { calculateConfidence } from './confidence-engine';
import { generateExplanation } from './explanation-engine';
import { usableShare, clampScore } from '../utils/sanitize';

const LAYER_KEYS = {
  personality: ['communicationDirectness', 'socialEnergy', 'independence', 'conflictAvoidance', 'emotionalOpenness', 'adventurePreference', 'routinePreference', 'decisionMaking', 'affectionStyle'],
  communication: ['directness', 'frequencyPreference', 'conflictStyle', 'responseExpectation', 'emotionalOpenness', 'reassuranceNeed', 'affectionCommunication', 'disagreementHandling'],
  values: ['familyImportance', 'marriageExpectation', 'childrenExpectation', 'careerPriority', 'financialAttitude', 'lifestylePriority', 'religionSpirituality', 'socialValues', 'personalIndependence'],
  lifestyle: ['foodPreference', 'travelFrequency', 'sleepSchedule', 'exerciseFrequency', 'socialActivity', 'alcoholPreference', 'smokingPreference', 'workStyle', 'weekendStyle', 'spendingStyle'],
  goals: ['intention', 'marriageTimeline', 'childrenPreference', 'familyInvolvement', 'relocationWillingness', 'longDistanceWillingness'],
} as const;

/** Both profiles present AND at least half of their answers usable. */
function usable<T>(a: T | undefined, b: T | undefined, keys: readonly string[]): [T, T] | null {
  const pair = both(a, b);
  if (!pair) return null;
  return usableShare(pair[0], keys) >= 0.5 && usableShare(pair[1], keys) >= 0.5 ? pair : null;
}

/**
 * Input for the full compatibility pipeline.
 * Kundli + numerology are required (they come from the date of birth).
 * Every other layer is optional: if either user hasn't filled it in, the
 * layer is skipped and its weight is shared among the layers that exist.
 */
export interface FullCompatibilityInput {
  userA: UserProfile;
  userB: UserProfile;
  prefsA: UserPreferences;
  prefsB: UserPreferences;
  astroProfileA: AstroProfile;
  astroProfileB: AstroProfile;
  numerologyProfileA: NumerologyProfile;
  numerologyProfileB: NumerologyProfile;
  sunSignA?: SunSignProfile;
  sunSignB?: SunSignProfile;
  personalityA?: PersonalityProfile;
  personalityB?: PersonalityProfile;
  communicationA?: CommunicationProfile;
  communicationB?: CommunicationProfile;
  valuesA?: ValuesProfile;
  valuesB?: ValuesProfile;
  lifestyleA?: LifestyleProfile;
  lifestyleB?: LifestyleProfile;
  goalsA?: RelationshipGoalsProfile;
  goalsB?: RelationshipGoalsProfile;
  interestsA?: InterestsProfile;
  interestsB?: InterestsProfile;
}

export interface DetailedBreakdown {
  astrology: AstrologyCompatibilityResult;
  numerology: NumerologyCompatibilityResult;
  horoscope: SunSignCompatibilityResult | null;
  preferences: MutualPreferenceResult;
  personality: PersonalityCompatibilityResult | null;
  communication: CommunicationCompatibilityResult | null;
  values: ValuesCompatibilityResult | null;
  lifestyle: LifestyleCompatibilityResult | null;
  relationshipGoals: RelationshipGoalsResult | null;
  interests: InterestsCompatibilityResult | null;
}

export interface FullCompatibilityOutput {
  result: CompatibilityResult;
  hardFilterResult: HardFilterResult;
  detailedBreakdown: DetailedBreakdown | null;
  /** Layer weights actually applied after re-normalising for missing data. */
  appliedWeights: Partial<Record<keyof CompatibilityBreakdown, number>>;
}

const EMPTY_BREAKDOWN: CompatibilityBreakdown = {
  astrology: 0, horoscope: 0, numerology: 0, preferences: 0, personality: 0,
  communication: 0, values: 0, lifestyle: 0, relationshipGoals: 0, interests: 0,
};

const SOFT_PENALTY: Record<Importance, number> = { dealbreaker: 0, important: 12, nice_to_have: 6 };

function both<T>(a: T | undefined, b: T | undefined): [T, T] | null {
  return a != null && b != null ? [a, b] : null;
}

function excluded(
  input: FullCompatibilityInput,
  config: MatchingConfig,
  filter: HardFilterResult
): FullCompatibilityOutput {
  return {
    result: {
      userAId: input.userA.id,
      userBId: input.userB.id,
      score: 0,
      isEligible: false,
      breakdown: { ...EMPTY_BREAKDOWN },
      confidence: 'insufficient_data',
      strengths: [],
      frictionPoints: [],
      reasons: filter.rejectionReasons,
      algorithmVersion: config.algorithmVersion,
      astrologyMethodologyVersion: 'vedic_v2',
      numerologyMethodologyVersion: 'numerology_v2',
      weightsVersion: config.weightsVersion,
      generatedAt: new Date(),
    },
    hardFilterResult: filter,
    detailedBreakdown: null,
    appliedWeights: {},
  };
}

/**
 * Calculates full compatibility between two users.
 */
export function calculateFullCompatibility(
  input: FullCompatibilityInput,
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): FullCompatibilityOutput {
  const { userA, userB, prefsA, prefsB } = input;

  // 1. Hard filters
  const filterResult = applyHardFilters(userA, userB, prefsA, prefsB);
  if (!filterResult.pass) return excluded(input, config, filterResult);

  // 2. Kundli
  const astrology = calculateAstrologyScore(
    input.astroProfileA, input.astroProfileB,
    {
      gunaMilanWeight: config.astrologySubWeights.gunaMilan,
      vedicSignalsWeight: config.astrologySubWeights.vedicSignals,
      manglikWeight: config.astrologySubWeights.manglik,
    },
    { genderA: userA.gender, genderB: userB.gender }
  );

  // 3. Astro dealbreakers (Manglik / minimum Guna)
  const astroRejections = applyAstroDealbreakers(userA, userB, prefsA, prefsB, astrology);
  if (astroRejections.length > 0) {
    return excluded(input, config, {
      pass: false,
      rejectionReasons: astroRejections,
      unverifiedDealbreakers: filterResult.unverifiedDealbreakers,
    });
  }

  // 4. Every other layer
  const numerology = calculateNumerologyCompatibility(input.numerologyProfileA, input.numerologyProfileB);
  const sun = both(input.sunSignA, input.sunSignB);
  const horoscope = sun ? calculateSunSignCompatibility(sun[0], sun[1]) : null;

  const preferences = calculateMutualPreferenceFit(userA, prefsA, userB, prefsB);
  // Soft astro preferences (not dealbreakers) lower the preference fit.
  let preferenceScore = preferences.score;
  for (const prefs of [prefsA, prefsB]) {
    if (prefs.manglik && prefs.manglik.rule === 'avoid_mismatch' && astrology.manglik?.status === 'mismatch') {
      preferenceScore -= SOFT_PENALTY[prefs.manglik.importance];
    }
    if (prefs.minGunaScore && astrology.gunaMilan.totalScore < prefs.minGunaScore.score) {
      preferenceScore -= SOFT_PENALTY[prefs.minGunaScore.importance];
    }
  }
  preferenceScore = Math.max(0, preferenceScore);

  const p = usable(input.personalityA, input.personalityB, LAYER_KEYS.personality);
  const c = usable(input.communicationA, input.communicationB, LAYER_KEYS.communication);
  const v = usable(input.valuesA, input.valuesB, LAYER_KEYS.values);
  const l = usable(input.lifestyleA, input.lifestyleB, LAYER_KEYS.lifestyle);
  const g = usable(input.goalsA, input.goalsB, LAYER_KEYS.goals);
  const i = both(input.interestsA, input.interestsB);

  const personalityRaw = p ? calculatePersonalityCompatibility(p[0], p[1]) : null;
  // Final guard: every layer score is a finite integer 0–100.
  const safe = <T extends { score: number }>(r: T | null): T | null => (r ? { ...r, score: clampScore(r.score) } : null);
  const personality = safe(personalityRaw);
  const communication = safe(c ? calculateCommunicationCompatibility(c[0], c[1]) : null);
  const values = safe(v ? calculateValuesCompatibility(v[0], v[1]) : null);
  const lifestyle = safe(l ? calculateLifestyleCompatibility(l[0], l[1]) : null);
  const relationshipGoals = safe(g ? calculateRelationshipGoalsCompatibility(g[0], g[1]) : null);
  const interests = safe(i ? calculateInterestsCompatibility(i[0], i[1]) : null);

  // 5. Weighted score over the layers that have data
  const layers: Array<[keyof CompatibilityBreakdown, number | null, number]> = [
    ['astrology', astrology.score, config.astrologyWeight],
    ['horoscope', horoscope?.score ?? null, config.horoscopeWeight],
    ['numerology', numerology.score, config.numerologyMode === 'small_weight' ? config.numerologyWeight : 0],
    ['preferences', preferenceScore, config.preferenceWeight],
    ['personality', personality?.score ?? null, config.personalityWeight],
    ['communication', communication?.score ?? null, config.communicationWeight],
    ['values', values?.score ?? null, config.valuesWeight],
    ['lifestyle', lifestyle?.score ?? null, config.lifestyleWeight],
    ['relationshipGoals', relationshipGoals?.score ?? null, config.relationshipGoalsWeight],
    ['interests', interests?.score ?? null, config.interestsWeight],
  ];

  const active = layers.filter(([, s, w]) => s !== null && w > 0);
  const activeWeight = active.reduce((sum, [, , w]) => sum + w, 0);
  const appliedWeights: FullCompatibilityOutput['appliedWeights'] = {};
  let weighted = 0;
  for (const [key, s, w] of active) {
    const share = w / activeWeight;
    appliedWeights[key] = Math.round(share * 10000) / 10000;
    weighted += (s as number) * share;
  }
  let finalScore = Math.round(Math.min(100, Math.max(0, weighted)));

  // Values / goals hard conflicts (e.g. children) cap the score.
  if ((values?.hardConflicts.length ?? 0) > 0 || (relationshipGoals?.hardConflicts.length ?? 0) > 0) {
    finalScore = Math.min(finalScore, 40);
  }

  const breakdown: CompatibilityBreakdown = {
    astrology: astrology.score,
    horoscope: horoscope?.score ?? 0,
    numerology: numerology.score,
    preferences: preferenceScore,
    personality: personality?.score ?? 0,
    communication: communication?.score ?? 0,
    values: values?.score ?? 0,
    lifestyle: lifestyle?.score ?? 0,
    relationshipGoals: relationshipGoals?.score ?? 0,
    interests: interests?.score ?? 0,
  };

  // 6. Confidence
  const has = (x: unknown, keys?: readonly string[]) => (x == null ? 0 : keys ? usableShare(x, keys) : 1);
  const confidence = calculateConfidence({
    hasBirthTimeA: input.astroProfileA.hasBirthTime,
    hasBirthTimeB: input.astroProfileB.hasBirthTime,
    personalityCompletenessA: has(input.personalityA, LAYER_KEYS.personality),
    personalityCompletenessB: has(input.personalityB, LAYER_KEYS.personality),
    communicationCompletenessA: has(input.communicationA, LAYER_KEYS.communication),
    communicationCompletenessB: has(input.communicationB, LAYER_KEYS.communication),
    valuesCompletenessA: has(input.valuesA, LAYER_KEYS.values),
    valuesCompletenessB: has(input.valuesB, LAYER_KEYS.values),
    lifestyleCompletenessA: has(input.lifestyleA, LAYER_KEYS.lifestyle),
    lifestyleCompletenessB: has(input.lifestyleB, LAYER_KEYS.lifestyle),
    goalsCompletenessA: has(input.goalsA, LAYER_KEYS.goals),
    goalsCompletenessB: has(input.goalsB, LAYER_KEYS.goals),
    astrologyConfidence: astrology.confidence,
    algorithmVersion: config.algorithmVersion,
  });

  const detailedBreakdown: DetailedBreakdown = {
    astrology, numerology, horoscope, preferences, personality,
    communication, values, lifestyle, relationshipGoals, interests,
  };

  // 7. Explanation
  const explanation = generateExplanation(breakdown, detailedBreakdown, Object.keys(appliedWeights) as Array<keyof CompatibilityBreakdown>);

  return {
    result: {
      userAId: userA.id,
      userBId: userB.id,
      score: finalScore,
      isEligible: true,
      breakdown,
      confidence,
      astrologySummary: astrology.summary,
      strengths: explanation.strengths,
      frictionPoints: explanation.frictionPoints,
      reasons: explanation.reasons,
      algorithmVersion: config.algorithmVersion,
      astrologyMethodologyVersion: astrology.methodologyVersion,
      numerologyMethodologyVersion: numerology.methodologyVersion,
      weightsVersion: config.weightsVersion,
      generatedAt: new Date(),
    },
    hardFilterResult: filterResult,
    detailedBreakdown,
    appliedWeights,
  };
}
