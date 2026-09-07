/**
 * @file hard-filters.ts
 * @description Hard filters for PREMA dating app compatibility engine.
 * These are strict exclusion criteria — if any filter fails,
 * the pair is excluded from matching entirely.
 */

import type { UserProfile, UserPreferences, HardFilterResult } from '../types';

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns The distance in kilometers.
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Applies hard filters between two users to determine if they can be matched.
 * Checks are run in priority order: blocking → safety → activity → gender → age → distance → intention → children.
 *
 * @param userA - The first user profile
 * @param userB - The second user profile
 * @param prefsA - The first user's match preferences
 * @param prefsB - The second user's match preferences
 * @returns Result of the hard filter checks
 */
export function applyHardFilters(
  userA: UserProfile,
  userB: UserProfile,
  prefsA: UserPreferences,
  prefsB: UserPreferences
): HardFilterResult {
  const rejectionReasons: string[] = [];

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

  // 4. Gender preference
  if (!prefsA.targetGender.includes(userB.gender) || !prefsB.targetGender.includes(userA.gender)) {
    rejectionReasons.push('Gender preference mismatch');
  }

  // 5. Age preference
  if (userB.age < prefsA.minAge || userB.age > prefsA.maxAge ||
      userA.age < prefsB.minAge || userA.age > prefsB.maxAge) {
    rejectionReasons.push('Age preference mismatch');
  }

  // 6. Distance (requires both users to have location data)
  if (userA.latitude != null && userA.longitude != null &&
      userB.latitude != null && userB.longitude != null) {
    const distance = calculateHaversineDistance(
      userA.latitude, userA.longitude,
      userB.latitude, userB.longitude
    );
    if (distance > prefsA.maxDistanceKm || distance > prefsB.maxDistanceKm) {
      rejectionReasons.push('Distance exceeds preference');
    }
  }

  // 7. Relationship intention
  const intentionPair = [userA.relationshipIntention, userB.relationshipIntention].sort().join('+');
  if (
    intentionPair === 'casual+marriage_oriented' ||
    intentionPair === 'casual+long_term'
  ) {
    rejectionReasons.push('Relationship intention conflict');
  }

  // 8. Children conflict (via preferences)
  if (prefsA.childrenPreference && prefsB.childrenPreference) {
    const childrenPair = [prefsA.childrenPreference, prefsB.childrenPreference].sort().join('+');
    if (childrenPair === 'does_not_want_children+wants_children') {
      rejectionReasons.push('Children preference conflict');
    }
  }

  return {
    pass: rejectionReasons.length === 0,
    rejectionReasons,
  };
}
