// =============================================================================
// PREMA Compatibility Engine — Core Types
// =============================================================================
// All shared type definitions for the compatibility system.
// Every module imports from this file for consistency.
// =============================================================================

// ---------------------------------------------------------------------------
// Enums & Unions
// ---------------------------------------------------------------------------

export type ConfidenceLevel = 'low' | 'moderate' | 'strong' | 'insufficient_data';

export type RelationshipIntention =
  | 'casual'
  | 'long_term'
  | 'marriage_oriented'
  | 'open_to_either'
  | 'not_sure';

export type ChildrenPreference =
  | 'wants_children'
  | 'does_not_want_children'
  | 'open_to_children'
  | 'has_children_wants_more'
  | 'has_children_no_more'
  | 'not_sure';

export type MarriageTimeline =
  | 'within_1_year'
  | 'within_2_3_years'
  | 'within_5_years'
  | 'no_timeline'
  | 'not_applicable';

export type NumerologyMode = 'disabled' | 'metadata_only' | 'small_weight';

export type MatchEventType =
  | 'impression'
  | 'like'
  | 'pass'
  | 'mutual_match'
  | 'conversation_started'
  | 'date_scheduled';

// ---------------------------------------------------------------------------
// User Profile Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  firstName: string;
  age: number;
  gender: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  relationshipIntention: RelationshipIntention;
  isVerified: boolean;
  isActive: boolean;
  isSafetyRestricted: boolean;
  blockedUserIds: string[];
  /** Facts about this user that other people's preferences are checked against. */
  attributes?: UserAttributes;
}

// ---------------------------------------------------------------------------
// Attributes & Preferences (what a user IS vs what a user WANTS)
// ---------------------------------------------------------------------------

export type Importance = 'dealbreaker' | 'important' | 'nice_to_have';
export type Diet = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain' | 'eggetarian';
export type Habit = 'never' | 'occasionally' | 'regularly';
export type EducationLevel = 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'doctorate';

export interface UserAttributes {
  heightCm?: number;
  diet?: Diet;
  smoking?: Habit;
  drinking?: Habit;
  religion?: string;
  community?: string;
  motherTongue?: string;
  education?: EducationLevel;
}

/** "I accept any of these values", with how much it matters. */
export interface PreferenceRule<T> {
  accepted: T[];
  importance: Importance;
}

export interface RangePreference {
  min?: number;
  max?: number;
  importance: Importance;
}

/**
 * Manglik preference:
 *  - 'any': doesn't matter
 *  - 'avoid_mismatch': only one partner being Manglik is not OK
 */
export interface ManglikPreference {
  rule: 'any' | 'avoid_mismatch';
  importance: Importance;
}

export interface UserBirthData {
  userId: string;
  /** Prefer a "YYYY-MM-DD" string. Date objects are read on the IST calendar day. */
  dateOfBirth: Date | string;
  /** Local wall-clock birth time "HH:mm" (24h). Interpreted as IST unless a zone is given. */
  exactBirthTime?: string | null;
  /** Optional IANA zone for births outside India, e.g. "America/New_York". Default: IST. */
  birthTimezone?: string;
  /** Optional fixed UTC offset in minutes (takes priority over birthTimezone). IST = 330. */
  birthUtcOffsetMinutes?: number;
  birthPlaceCity?: string;
  birthPlaceLat?: number;
  birthPlaceLon?: number;
}

export interface UserPreferences {
  userId: string;
  targetGender: string[];
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  relationshipIntention?: RelationshipIntention;
  childrenPreference?: ChildrenPreference;
  marriageTimeline?: MarriageTimeline;

  // Optional detailed preferences — each rule carries its own importance.
  diet?: PreferenceRule<Diet>;
  smoking?: PreferenceRule<Habit>;
  drinking?: PreferenceRule<Habit>;
  religion?: PreferenceRule<string>;
  community?: PreferenceRule<string>;
  motherTongue?: PreferenceRule<string>;
  heightCm?: RangePreference;
  minEducation?: { level: EducationLevel; importance: Importance };
  manglik?: ManglikPreference;
  /** Minimum classical Guna Milan total (out of 36). */
  minGunaScore?: { score: number; importance: Importance };
}

// ---------------------------------------------------------------------------
// Personality & Communication Profiles
// ---------------------------------------------------------------------------

/**
 * Normalized personality traits, each 0.0–1.0.
 */
export interface PersonalityProfile {
  userId: string;
  communicationDirectness: number;
  socialEnergy: number;
  independence: number;
  conflictAvoidance: number;
  emotionalOpenness: number;
  adventurePreference: number;
  routinePreference: number;
  decisionMaking: number; // 0 = intuitive, 1 = analytical
  affectionStyle: number; // 0 = reserved, 1 = expressive
}

/**
 * Communication style preferences, each 0.0–1.0.
 */
export interface CommunicationProfile {
  userId: string;
  directness: number;         // 0 = indirect, 1 = very direct
  frequencyPreference: number; // 0 = minimal, 1 = constant
  conflictStyle: number;       // 0 = avoidant, 1 = confrontational
  responseExpectation: number; // 0 = relaxed, 1 = expects quick replies
  emotionalOpenness: number;   // 0 = guarded, 1 = very open
  reassuranceNeed: number;     // 0 = independent, 1 = needs frequent reassurance
  affectionCommunication: number; // 0 = reserved, 1 = very affectionate
  disagreementHandling: number;   // 0 = compromise-first, 1 = debate-first
}

// ---------------------------------------------------------------------------
// Values & Lifestyle Profiles
// ---------------------------------------------------------------------------

/**
 * Core value dimensions, each 0.0–1.0 representing importance/intensity.
 */
export interface ValuesProfile {
  userId: string;
  familyImportance: number;
  marriageExpectation: number;
  childrenExpectation: ChildrenPreference;
  careerPriority: number;
  financialAttitude: number;  // 0 = frugal/saver, 1 = generous/spender
  lifestylePriority: number;
  religionSpirituality: number;
  socialValues: number;       // 0 = traditional, 1 = progressive
  personalIndependence: number;
}

export interface LifestyleProfile {
  userId: string;
  foodPreference: number;     // 0 = strict diet, 1 = adventurous eater
  travelFrequency: number;    // 0 = homebody, 1 = frequent traveler
  sleepSchedule: number;      // 0 = early bird, 1 = night owl
  exerciseFrequency: number;  // 0 = sedentary, 1 = very active
  socialActivity: number;     // 0 = introverted, 1 = very social
  alcoholPreference: number;  // 0 = never, 1 = regularly
  smokingPreference: number;  // 0 = never, 1 = regularly
  workStyle: number;          // 0 = strict 9-5, 1 = flexible/entrepreneur
  weekendStyle: number;       // 0 = quiet/home, 1 = active/out
  spendingStyle: number;      // 0 = frugal, 1 = generous
}

// ---------------------------------------------------------------------------
// Relationship Goals
// ---------------------------------------------------------------------------

export interface RelationshipGoalsProfile {
  userId: string;
  intention: RelationshipIntention;
  marriageTimeline: MarriageTimeline;
  childrenPreference: ChildrenPreference;
  familyInvolvement: number;  // 0 = independent, 1 = very family-involved
  relocationWillingness: number; // 0 = not willing, 1 = very willing
  longDistanceWillingness: number; // 0 = not willing, 1 = very willing
}

// ---------------------------------------------------------------------------
// Interests
// ---------------------------------------------------------------------------

export interface InterestsProfile {
  userId: string;
  interests: string[]; // normalized interest tags
}

// ---------------------------------------------------------------------------
// Compatibility Results
// ---------------------------------------------------------------------------

export interface CompatibilityBreakdown {
  astrology: number;
  horoscope: number;
  numerology: number;
  preferences: number;
  personality: number;
  communication: number;
  values: number;
  lifestyle: number;
  relationshipGoals: number;
  interests: number;
}

export interface CompatibilityResult {
  userAId: string;
  userBId: string;

  score: number; // 0–100, integer
  confidence: ConfidenceLevel;
  /** False when a hard filter / dealbreaker excluded the pair. */
  isEligible: boolean;
  /** Short Kundli summary, e.g. "28/36 Guna · Nadi dosha cancelled". */
  astrologySummary?: string;

  breakdown: CompatibilityBreakdown;

  strengths: string[];
  frictionPoints: string[];
  reasons: string[];

  // Versioning
  algorithmVersion: string;
  astrologyMethodologyVersion: string;
  numerologyMethodologyVersion: string;
  weightsVersion: string;
  generatedAt: Date;
}

export interface HardFilterResult {
  pass: boolean;
  rejectionReasons: string[];
  /** Dealbreakers that could not be verified because the other user left the field empty. */
  unverifiedDealbreakers?: string[];
}

// ---------------------------------------------------------------------------
// Matching Configuration
// ---------------------------------------------------------------------------

export interface MatchingConfig {
  algorithmVersion: string;
  weightsVersion: string;

  // Layer weights (must sum to 1.0)
  astrologyWeight: number;   // Vedic Kundli
  horoscopeWeight: number;   // Western sun sign
  preferenceWeight: number;  // mutual preference fit
  personalityWeight: number;
  communicationWeight: number;
  valuesWeight: number;
  relationshipGoalsWeight: number;
  lifestyleWeight: number;
  interestsWeight: number;

  // Numerology
  numerologyMode: NumerologyMode;
  numerologyWeight: number; // only used when mode is 'small_weight'

  // Discovery
  discoveryThreshold: number; // minimum score for curated discovery
  maxRecommendations: number;

  // Astrology sub-weights
  astrologySubWeights: {
    gunaMilan: number;     // default 0.70
    vedicSignals: number;  // default 0.20
    manglik: number;       // default 0.10
  };
}

// ---------------------------------------------------------------------------
// Outcome / Learning Types
// ---------------------------------------------------------------------------

export interface MatchEvent {
  id: string;
  userAId: string;
  userBId: string;
  eventType: MatchEventType;
  compatibilityScoreAtEvent: number;
  algorithmVersion: string;
  createdAt: Date;
}

export interface PostDateFeedback {
  id: string;
  userId: string;      // the user giving feedback
  matchUserId: string;  // the match they went on a date with
  conversation: number; // 1–5
  comfort: number;      // 1–5
  humor: number;        // 1–5
  attraction: number;   // 1–5
  valuesAlignment: number; // 1–5
  communication: number;   // 1–5
  wouldMeetAgain: 'yes' | 'maybe' | 'no';
  compatibilityScoreAtDate: number;
  algorithmVersion: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Legacy compatibility — re-export old types for backward compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use UserProfile + PersonalityProfile + ValuesProfile instead */
export interface UserTraits {
  id: string;
  astrologyScore?: number;
  personalityTraits: string[];
  values: string[];
  lifestyle: string[];
  relationshipGoals: string;
}
