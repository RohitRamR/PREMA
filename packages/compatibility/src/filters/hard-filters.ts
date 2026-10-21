/**
 * @file hard-filters.ts
 * @description Strict exclusion rules. If any rule fails, the pair is never
 * shown to each other — no astrology score can override a dealbreaker.
 *
 * Every preference-based rule is checked in BOTH directions.
 */

import type { UserProfile, UserPreferences, HardFilterResult, RelationshipIntention } from '../types';
import type { AstrologyCompatibilityResult } from '../astrology/astrology-types';
import { calculateHaversineDistance } from '../utils/geo';
import { evaluatePreferences } from '../preferences/preference-scorer';

export { calculateHaversineDistance };

const INTENTION_CONFLICTS = new Set(['casual+marriage_oriented', 'casual+long_term']);

function genderMatches(targets: string[], gender: string): boolean {
  const g = gender.trim().toLowerCase();
  return targets.some((t) => {
    const v = t.trim().toLowerCase();
    return v === 'everyone' || v === 'any' || v === g;
  });
}

function effectiveIntention(user: UserProfile, prefs: UserPreferences): RelationshipIntention {
  return prefs.relationshipIntention ?? user.relationshipIntention;
}

/**
 * Applies hard filters between two users.
 * Order: blocking → safety → activity → gender → age → distance → intention
 *        → children → personal dealbreakers (diet, smoking, religion, …).
 */
export function applyHardFilters(
  userA: UserProfile,
  userB: UserProfile,
  prefsA: UserPreferences,
  prefsB: UserPreferences
): HardFilterResult {
  const rejectionReasons: string[] = [];
  const unverifiedDealbreakers: string[] = [];

  if (userA.id === userB.id) rejectionReasons.push('Same user');

  // 1. Blocked users
  if (userA.blockedUserIds.includes(userB.id) || userB.blockedUserIds.includes(userA.id)) {
    rejectionReasons.push('Blocked user');
  }

  // 2. Safety
  if (userA.isSafetyRestricted || userB.isSafetyRestricted) {
    rejectionReasons.push('Safety restriction active');
  }

  // 3. Account eligibility
  if (!userA.isActive || !userB.isActive) {
    rejectionReasons.push('Inactive account');
  }

  // 4. Gender preference (mutual)
  if (!genderMatches(prefsA.targetGender, userB.gender) || !genderMatches(prefsB.targetGender, userA.gender)) {
    rejectionReasons.push('Gender preference mismatch');
  }

  // 5. Age preference (mutual)
  if (userB.age < prefsA.minAge || userB.age > prefsA.maxAge ||
      userA.age < prefsB.minAge || userA.age > prefsB.maxAge) {
    rejectionReasons.push('Age preference mismatch');
  }

  // 6. Distance (only when both locations are known)
  if (userA.latitude != null && userA.longitude != null &&
      userB.latitude != null && userB.longitude != null) {
    const distance = calculateHaversineDistance(userA.latitude, userA.longitude, userB.latitude, userB.longitude);
    if (distance > prefsA.maxDistanceKm || distance > prefsB.maxDistanceKm) {
      rejectionReasons.push('Distance exceeds preference');
    }
  }

  // 7. Relationship intention
  const intentionPair = [effectiveIntention(userA, prefsA), effectiveIntention(userB, prefsB)].sort().join('+');
  if (INTENTION_CONFLICTS.has(intentionPair)) {
    rejectionReasons.push('Relationship intention conflict');
  }

  // 8. Children conflict
  if (prefsA.childrenPreference && prefsB.childrenPreference) {
    const childrenPair = [prefsA.childrenPreference, prefsB.childrenPreference].sort().join('+');
    if (childrenPair === 'does_not_want_children+wants_children') {
      rejectionReasons.push('Children preference conflict');
    }
  }

  // 9. Personal dealbreakers, both directions
  const aToB = evaluatePreferences(userA, prefsA, userB);
  const bToA = evaluatePreferences(userB, prefsB, userA);
  for (const d of aToB.failedDealbreakers) rejectionReasons.push(`Dealbreaker for ${userA.firstName}: ${d}`);
  for (const d of bToA.failedDealbreakers) rejectionReasons.push(`Dealbreaker for ${userB.firstName}: ${d}`);
  for (const d of aToB.unverifiedDealbreakers) unverifiedDealbreakers.push(`${userA.firstName}: ${d}`);
  for (const d of bToA.unverifiedDealbreakers) unverifiedDealbreakers.push(`${userB.firstName}: ${d}`);

  return {
    pass: rejectionReasons.length === 0,
    rejectionReasons,
    unverifiedDealbreakers,
  };
}

/**
 * Astrology-based dealbreakers (Manglik, minimum Guna). These need the Kundli
 * result, so they run right after the astrology layer is computed.
 * Only rules marked 'dealbreaker' reject; softer importances are scored.
 */
export function applyAstroDealbreakers(
  userA: UserProfile,
  userB: UserProfile,
  prefsA: UserPreferences,
  prefsB: UserPreferences,
  astrology: AstrologyCompatibilityResult
): string[] {
  const reasons: string[] = [];
  const check = (user: UserProfile, prefs: UserPreferences) => {
    if (prefs.manglik?.importance === 'dealbreaker' && prefs.manglik.rule === 'avoid_mismatch' &&
        astrology.manglik?.status === 'mismatch') {
      reasons.push(`Dealbreaker for ${user.firstName}: Manglik mismatch`);
    }
    if (prefs.minGunaScore?.importance === 'dealbreaker' &&
        astrology.gunaMilan.totalScore < prefs.minGunaScore.score) {
      reasons.push(`Dealbreaker for ${user.firstName}: Guna ${astrology.gunaMilan.totalScore}/36 below required ${prefs.minGunaScore.score}`);
    }
  };
  check(userA, prefsA);
  check(userB, prefsB);
  return reasons;
}
