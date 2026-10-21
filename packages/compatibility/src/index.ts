// =============================================================================
// PREMA Compatibility Engine — Public API
// =============================================================================

// Core types
export * from './types';

// Main engine
export * from './engine';

// Configuration
export { DEFAULT_MATCHING_CONFIG, validateMatchingConfig, createMatchingConfig, starsShare } from './config/matching-config';

// Birth time & ephemeris (IST by default)
export {
  IST_OFFSET_MINUTES, IST_TIMEZONE, resolveBirthMoment, getBirthCalendarDate, parseBirthTime,
  getLahiriAyanamsa, siderealMoonLongitude, siderealSunLongitude, siderealMarsLongitude, siderealAscendant,
} from './astrology/ephemeris';
export type { ResolvedBirthMoment, CalendarDate } from './astrology/ephemeris';

// Astrology (Kundli)
export type {
  AstroProfile, KootaResult, GunaMilanResult, VedicSignal, ManglikResult, ManglikProfile,
  AstrologyCompatibilityResult, AstrologyConfig, GunaMilanOptions,
} from './astrology/astrology-types';
export { calculateMoonPosition, buildAstroProfile } from './astrology/moon-calculator';
export { calculateGunaMilan, resolveOrientation, normalizeGender } from './astrology/ashtakoota';
export { computeManglikProfile, checkManglikCompatibility } from './astrology/manglik';
export { calculateAstrologyScore } from './astrology/astrology-scorer';

// Western horoscope
export type { SunSignProfile, ZodiacSign } from './horoscope/sun-sign';
export { buildSunSignProfile } from './horoscope/sun-sign';
export type { SunSignCompatibilityResult } from './horoscope/sun-sign-compatibility';
export { calculateSunSignCompatibility } from './horoscope/sun-sign-compatibility';

// Numerology
export type { NumerologyProfile, NumerologyCompatibilityResult } from './numerology/numerology-types';
export {
  calculateLifePathNumber, calculateExpressionNumber, calculateSoulUrgeNumber,
  calculateMoolank, calculateBhagyank, buildNumerologyProfile,
} from './numerology/numerology-calculator';
export { calculateNumerologyCompatibility } from './numerology/numerology-compatibility';

// Preferences
export { evaluatePreferences, calculateMutualPreferenceFit } from './preferences/preference-scorer';
export type { MutualPreferenceResult, OneWaySatisfaction, RuleEvaluation } from './preferences/preference-scorer';

// Personality & Communication
export type { PersonalityCompatibilityResult, CommunicationCompatibilityResult } from './personality/personality-types';
export { calculatePersonalityCompatibility } from './personality/personality-scorer';
export { calculateCommunicationCompatibility } from './personality/communication-scorer';

// Values
export { calculateValuesCompatibility } from './values/values-scorer';
export type { ValuesCompatibilityResult } from './values/values-scorer';

// Lifestyle
export { calculateLifestyleCompatibility } from './lifestyle/lifestyle-scorer';
export type { LifestyleCompatibilityResult } from './lifestyle/lifestyle-scorer';

// Relationship Goals
export { calculateRelationshipGoalsCompatibility } from './relationship-goals/relationship-goals-scorer';
export type { RelationshipGoalsResult } from './relationship-goals/relationship-goals-scorer';

// Interests
export { calculateInterestsCompatibility } from './interests/interests-scorer';
export type { InterestsCompatibilityResult } from './interests/interests-scorer';

// Filters
export { applyHardFilters, applyAstroDealbreakers } from './filters/hard-filters';

// Scoring
export { calculateFullCompatibility } from './scoring/scoring-engine';
export type { FullCompatibilityInput, FullCompatibilityOutput, DetailedBreakdown } from './scoring/scoring-engine';
export { calculateConfidence } from './scoring/confidence-engine';
export { generateExplanation } from './scoring/explanation-engine';

// Matchmaking — finding the best pairs
export { buildMatchProfile, toCompatibilityInput } from './matchmaking/match-profile';
export type { MatchProfile, MatchProfileInput } from './matchmaking/match-profile';
export { PairScoreCache, findBestMatches, compareMatches, pairKey } from './matchmaking/matchmaker';
export type { RankedMatch, FindBestMatchesOptions } from './matchmaking/matchmaker';
export { allocateDailyMatches, buildPairEdges, exposurePenalty } from './matchmaking/daily-pairing';
export type { DailyPairingOptions, DailyPairingResult, PairEdge, PairingStrategy } from './matchmaking/daily-pairing';

// Outcomes
export { createMatchEvent, createPostDateFeedback, calculateOutcomeQuality, isPositiveOutcome } from './outcomes/outcomes';

// Ranking
export { rankCandidates, applyDiversityRules, generateDailyRecommendations } from './ranking/ranking';
