// =============================================================================
// PREMA Compatibility Engine — Public API
// =============================================================================

// Core types
export * from './types';

// Main engine
export * from './engine';

// Configuration
export { DEFAULT_MATCHING_CONFIG, validateMatchingConfig, createMatchingConfig } from './config/matching-config';

// Astrology
export type { AstroProfile, KootaResult, GunaMilanResult, VedicSignal, ManglikResult, AstrologyCompatibilityResult, AstrologyConfig } from './astrology/astrology-types';
export { calculateMoonPosition, buildAstroProfile } from './astrology/moon-calculator';
export { calculateGunaMilan } from './astrology/ashtakoota';
export { calculateAstrologyScore } from './astrology/astrology-scorer';

// Numerology
export type { NumerologyProfile, NumerologyCompatibilityResult } from './numerology/numerology-types';
export { calculateLifePathNumber, calculateExpressionNumber, buildNumerologyProfile } from './numerology/numerology-calculator';
export { calculateNumerologyCompatibility } from './numerology/numerology-compatibility';

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
export { applyHardFilters } from './filters/hard-filters';

// Scoring
export { calculateFullCompatibility } from './scoring/scoring-engine';
export type { FullCompatibilityInput, FullCompatibilityOutput } from './scoring/scoring-engine';
export { calculateConfidence } from './scoring/confidence-engine';
export { generateExplanation } from './scoring/explanation-engine';

// Outcomes
export { createMatchEvent, createPostDateFeedback, calculateOutcomeQuality, isPositiveOutcome } from './outcomes/outcomes';

// Ranking
export { rankCandidates, applyDiversityRules, generateDailyRecommendations } from './ranking/ranking';
