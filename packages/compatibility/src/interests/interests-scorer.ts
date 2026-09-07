/**
 * @file interests-scorer.ts
 * @description Interests compatibility scorer for PREMA dating app.
 */

import type { InterestsProfile } from '../types';

export interface InterestsCompatibilityResult {
  score: number; // 0-100
  sharedInterests: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  overlapPercentage: number;
  interpretation: string;
  methodologyVersion: string;
}

/**
 * Calculates interests compatibility between two profiles.
 * @param {InterestsProfile} profileA - The first profile.
 * @param {InterestsProfile} profileB - The second profile.
 * @returns {InterestsCompatibilityResult} The compatibility result.
 */
export function calculateInterestsCompatibility(profileA: InterestsProfile, profileB: InterestsProfile): InterestsCompatibilityResult {
  const normA = new Set(profileA.interests.map(i => i.toLowerCase().trim()));
  const normB = new Set(profileB.interests.map(i => i.toLowerCase().trim()));

  if (normA.size === 0 && normB.size === 0) {
    return {
      score: 50,
      sharedInterests: [],
      uniqueToA: [],
      uniqueToB: [],
      overlapPercentage: 0,
      interpretation: 'Neither has shared interests yet.',
      methodologyVersion: '1.0'
    };
  }

  const intersection = new Set([...normA].filter(x => normB.has(x)));
  const union = new Set([...normA, ...normB]);

  const jaccard = union.size === 0 ? 0 : intersection.size / union.size;
  const score = Math.max(40, Math.floor(40 + (jaccard * 60)));

  let interpretation = '';
  if (score > 80) interpretation = 'You share many common interests, providing plenty of activities to enjoy together.';
  else if (score >= 60) interpretation = "You have some shared interests with room to explore each other's passions.";
  else interpretation = 'Your interests differ, but shared hobbies are less important than shared values and goals.';

  const sharedInterests = Array.from(intersection);
  const uniqueToA = Array.from(normA).filter(x => !intersection.has(x));
  const uniqueToB = Array.from(normB).filter(x => !intersection.has(x));

  return {
    score,
    sharedInterests,
    uniqueToA,
    uniqueToB,
    overlapPercentage: Math.round(jaccard * 100),
    interpretation,
    methodologyVersion: '1.0'
  };
}
