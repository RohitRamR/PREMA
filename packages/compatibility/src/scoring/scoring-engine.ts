/**
 * @file scoring-engine.ts
 * @description Central orchestrator for the PREMA compatibility pipeline.
 * Runs hard filters, computes per-dimension scores, and produces the final weighted result.
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
} from '../types';
import { DEFAULT_MATCHING_CONFIG } from '../config/matching-config';
import type { AstroProfile, AstrologyCompatibilityResult } from '../astrology/astrology-types';
import { calculateAstrologyScore } from '../astrology/astrology-scorer';
import type { NumerologyProfile, NumerologyCompatibilityResult } from '../numerology/numerology-types';
import { calculateNumerologyCompatibility } from '../numerology/numerology-compatibility';
import type { PersonalityCompatibilityResult, CommunicationCompatibilityResult } from '../personality/personality-types';
import { calculatePersonalityCompatibility } from '../personality/personality-scorer';
import { calculateCommunicationCompatibility } from '../personality/communication-scorer';
import { calculateValuesCompatibility, type ValuesCompatibilityResult } from '../values/values-scorer';
import { calculateLifestyleCompatibility, type LifestyleCompatibilityResult } from '../lifestyle/lifestyle-scorer';
import { calculateRelationshipGoalsCompatibility, type RelationshipGoalsResult } from '../relationship-goals/relationship-goals-scorer';
import { calculateInterestsCompatibility, type InterestsCompatibilityResult } from '../interests/interests-scorer';
import { applyHardFilters } from '../filters/hard-filters';

/**
 * Input for the full compatibility pipeline.
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
  personalityA: PersonalityProfile;
  personalityB: PersonalityProfile;
  communicationA: CommunicationProfile;
  communicationB: CommunicationProfile;
  valuesA: ValuesProfile;
  valuesB: ValuesProfile;
  lifestyleA: LifestyleProfile;
  lifestyleB: LifestyleProfile;
  goalsA: RelationshipGoalsProfile;
  goalsB: RelationshipGoalsProfile;
  interestsA: InterestsProfile;
  interestsB: InterestsProfile;
}

/**
 * Output of the full compatibility pipeline.
 */
export interface FullCompatibilityOutput {
  result: CompatibilityResult;
  hardFilterResult: HardFilterResult;
  detailedBreakdown: {
    astrology: AstrologyCompatibilityResult;
    numerology: NumerologyCompatibilityResult;
    personality: PersonalityCompatibilityResult;
    communication: CommunicationCompatibilityResult;
    values: ValuesCompatibilityResult;
    lifestyle: LifestyleCompatibilityResult;
    relationshipGoals: RelationshipGoalsResult;
    interests: InterestsCompatibilityResult;
  } | null;
}

/**
 * Calculates full compatibility between two users.
 * Pipeline: hard filters → per-dimension scores → weighted combination → clamped output.
 */
export function calculateFullCompatibility(
  input: FullCompatibilityInput,
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): FullCompatibilityOutput {
  const {
    userA, userB, prefsA, prefsB,
    astroProfileA, astroProfileB,
    numerologyProfileA, numerologyProfileB,
    personalityA, personalityB,
    communicationA, communicationB,
    valuesA, valuesB,
    lifestyleA, lifestyleB,
    goalsA, goalsB,
    interestsA, interestsB,
  } = input;

  // 1. Apply hard filters
  const filterResult = applyHardFilters(userA, userB, prefsA, prefsB);
  if (!filterResult.pass) {
    return {
      result: {
        userAId: userA.id,
        userBId: userB.id,
        score: 0,
        breakdown: {
          astrology: 0,
          numerology: 0,
          personality: 0,
          communication: 0,
          values: 0,
          lifestyle: 0,
          relationshipGoals: 0,
          interests: 0,
        },
        confidence: 'insufficient_data',
        strengths: [],
        frictionPoints: [],
        reasons: filterResult.rejectionReasons,
        algorithmVersion: config.algorithmVersion,
        astrologyMethodologyVersion: 'vedic_v1',
        numerologyMethodologyVersion: 'numerology_v1',
        weightsVersion: config.weightsVersion,
        generatedAt: new Date(),
      },
      hardFilterResult: filterResult,
      detailedBreakdown: null,
    };
  }

  // 2. Calculate each layer score
  const astrology = calculateAstrologyScore(astroProfileA, astroProfileB, {
    gunaMilanWeight: config.astrologySubWeights.gunaMilan,
    vedicSignalsWeight: config.astrologySubWeights.vedicSignals,
    manglikWeight: config.astrologySubWeights.manglik,
  });
  const numerology = calculateNumerologyCompatibility(numerologyProfileA, numerologyProfileB);
  const personality = calculatePersonalityCompatibility(personalityA, personalityB);
  const communication = calculateCommunicationCompatibility(communicationA, communicationB);
  const values = calculateValuesCompatibility(valuesA, valuesB);
  const lifestyle = calculateLifestyleCompatibility(lifestyleA, lifestyleB);
  const relationshipGoals = calculateRelationshipGoalsCompatibility(goalsA, goalsB);
  const interests = calculateInterestsCompatibility(interestsA, interestsB);

  // 3. Calculate weighted base score
  let baseScore = astrology.score * config.astrologyWeight
    + personality.score * config.personalityWeight
    + communication.score * config.communicationWeight
    + values.score * config.valuesWeight
    + relationshipGoals.score * config.relationshipGoalsWeight
    + lifestyle.score * config.lifestyleWeight
    + interests.score * config.interestsWeight;

  if (config.numerologyMode === 'small_weight') {
    baseScore += numerology.score * config.numerologyWeight;
  }

  // 4. Clamp to integer 0-100
  const finalScore = Math.round(Math.min(100, Math.max(0, baseScore)));

  // 5. Build Compatibility Breakdown
  const breakdown: CompatibilityBreakdown = {
    astrology: astrology.score,
    numerology: numerology.score,
    personality: personality.score,
    communication: communication.score,
    values: values.score,
    lifestyle: lifestyle.score,
    relationshipGoals: relationshipGoals.score,
    interests: interests.score,
  };

  // 6. Build reasons
  const strengths: string[] = [];
  const frictionPoints: string[] = [];
  const reasons: string[] = [];

  if (astrology.score > 85) { strengths.push('Cosmic Compatibility'); reasons.push('Your Vedic astrological profiles show strong harmony.'); }
  if (personality.score > 85) { strengths.push('Personality'); reasons.push('Your personality traits complement each other well.'); }
  if (communication.score > 85) { strengths.push('Communication Style'); reasons.push('Your communication preferences are similar.'); }
  if (values.score > 85) { strengths.push('Core Values'); reasons.push('Your core values and life priorities are closely aligned.'); }
  if (lifestyle.score > 85) { strengths.push('Lifestyle'); reasons.push('Your daily lifestyle preferences are well-matched.'); }
  if (relationshipGoals.score > 85) { strengths.push('Relationship Goals'); reasons.push('Your long-term relationship intentions are strongly aligned.'); }
  if (interests.score > 80) { strengths.push('Shared Interests'); reasons.push('You share many common interests and hobbies.'); }

  if (astrology.score < 60) frictionPoints.push('Cosmic Compatibility');
  if (personality.score < 60) frictionPoints.push('Personality');
  if (communication.score < 60) frictionPoints.push('Communication Style');
  if (values.score < 60) frictionPoints.push('Core Values');
  if (lifestyle.score < 60) frictionPoints.push('Lifestyle');
  if (relationshipGoals.score < 60) frictionPoints.push('Relationship Goals');

  return {
    result: {
      userAId: userA.id,
      userBId: userB.id,
      score: finalScore,
      breakdown,
      confidence: 'moderate', // V1 caps at moderate
      strengths,
      frictionPoints,
      reasons,
      algorithmVersion: config.algorithmVersion,
      astrologyMethodologyVersion: 'vedic_v1',
      numerologyMethodologyVersion: 'numerology_v1',
      weightsVersion: config.weightsVersion,
      generatedAt: new Date(),
    },
    hardFilterResult: filterResult,
    detailedBreakdown: {
      astrology, numerology, personality, communication,
      values, lifestyle, relationshipGoals, interests,
    },
  };
}
