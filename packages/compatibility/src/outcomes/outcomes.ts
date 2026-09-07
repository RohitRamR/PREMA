/**
 * @file outcomes.ts
 * @description Outcome signal types and helper functions for V1 scaffolding.
 * Captures match events and post-date feedback for future outcome learning.
 */

import type { MatchEvent, PostDateFeedback, MatchEventType } from '../types';

/**
 * Outcome conversation details
 */
export interface ConversationOutcome {
  id: string;
  userAId: string;
  userBId: string;
  conversationStarted: boolean;
  messageCount?: number;
  qualityRating?: number; // 1-5, self-reported
  createdAt: Date;
}

/**
 * Aggregation of feedback signals
 */
export interface OutcomeSignal {
  matchEvent?: MatchEvent;
  conversationOutcome?: ConversationOutcome;
  dateFeedback?: PostDateFeedback;
}

/**
 * Creates a MatchEvent instance.
 */
export function createMatchEvent(
  userAId: string,
  userBId: string,
  eventType: MatchEventType,
  compatibilityScore: number,
  algorithmVersion: string
): MatchEvent {
  return {
    id: `me_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userAId,
    userBId,
    eventType,
    compatibilityScoreAtEvent: compatibilityScore,
    algorithmVersion,
    createdAt: new Date(),
  };
}

/**
 * Creates a PostDateFeedback record.
 */
export function createPostDateFeedback(
  userId: string,
  matchUserId: string,
  ratings: {
    conversation: number;
    comfort: number;
    humor: number;
    attraction: number;
    valuesAlignment: number;
    communication: number;
  },
  wouldMeetAgain: 'yes' | 'no' | 'maybe',
  compatibilityScore: number,
  algorithmVersion: string
): PostDateFeedback {
  return {
    id: `pdf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    matchUserId,
    conversation: ratings.conversation,
    comfort: ratings.comfort,
    humor: ratings.humor,
    attraction: ratings.attraction,
    valuesAlignment: ratings.valuesAlignment,
    communication: ratings.communication,
    wouldMeetAgain,
    compatibilityScoreAtDate: compatibilityScore,
    algorithmVersion,
    createdAt: new Date(),
  };
}

/**
 * Calculates an outcome quality score from 0-100 based on feedback ratings.
 */
export function calculateOutcomeQuality(feedback: PostDateFeedback): number {
  const values = [
    feedback.conversation,
    feedback.comfort,
    feedback.humor,
    feedback.attraction,
    feedback.valuesAlignment,
    feedback.communication,
  ];

  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  // Convert 1-5 scale to 0-100
  return ((avg - 1) / 4) * 100;
}

/**
 * Determines if an outcome was positive.
 * Positive = wouldMeetAgain is 'yes', OR 'maybe' with average rating >= 3.5
 */
export function isPositiveOutcome(feedback: PostDateFeedback): boolean {
  if (feedback.wouldMeetAgain === 'yes') {
    return true;
  }

  if (feedback.wouldMeetAgain === 'maybe') {
    const values = [
      feedback.conversation,
      feedback.comfort,
      feedback.humor,
      feedback.attraction,
      feedback.valuesAlignment,
      feedback.communication,
    ];
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    return avg >= 3.5;
  }

  return false;
}
