import type { CompatibilityBreakdown } from '../types';
import type { FullCompatibilityOutput } from './scoring-engine';

/**
 * Explanation result containing human-readable compatibility insights.
 */
export interface ExplanationResult {
  strengths: string[];      // top 3 strongest areas
  frictionPoints: string[]; // areas below threshold
  reasons: string[];        // human-readable reason strings
  astrologyNarrative: string;
  numerologyNarrative: string;
}

/**
 * Generates an explanation based on the breakdown and detailed compatibility metrics.
 *
 * @param breakdown The overall dimension scores
 * @param detailedBreakdown The individual detailed breakdowns for each module
 * @returns Explanation string combinations mapping score thresholds
 */
export function generateExplanation(
  breakdown: CompatibilityBreakdown,
  detailedBreakdown: FullCompatibilityOutput['detailedBreakdown']
): ExplanationResult {
  // Rank all dimensions by score
  const dimensions = [
    { key: 'astrology', score: breakdown.astrology, display: 'Cosmic Compatibility' },
    { key: 'personality', score: breakdown.personality, display: 'Personality' },
    { key: 'communication', score: breakdown.communication, display: 'Communication Style' },
    { key: 'values', score: breakdown.values, display: 'Core Values' },
    { key: 'lifestyle', score: breakdown.lifestyle, display: 'Lifestyle' },
    { key: 'relationshipGoals', score: breakdown.relationshipGoals, display: 'Relationship Goals' },
    { key: 'interests', score: breakdown.interests, display: 'Shared Interests' },
  ];

  dimensions.sort((a, b) => b.score - a.score);

  // Top 3 scoring dimensions become strengths
  const strengths = dimensions.slice(0, 3).map((d) => d.display);

  // Dimensions scoring below 60 become friction points
  const frictionPoints = dimensions.filter((d) => d.score < 60).map((d) => d.display);

  const reasons: string[] = [];

  if (breakdown.relationshipGoals > 85) {
    reasons.push('Your long-term relationship intentions are strongly aligned.');
  }
  if (breakdown.communication > 85) {
    reasons.push('Your communication preferences are similar, which supports daily harmony.');
  }
  if (breakdown.values > 85) {
    reasons.push('Your core values and life priorities are closely aligned.');
  }
  if (breakdown.astrology > 85) {
    reasons.push('Your Vedic astrological profiles show strong harmony.');
  }
  if (breakdown.lifestyle > 85) {
    reasons.push('Your daily lifestyle preferences are well-matched.');
  }
  if (breakdown.personality > 85) {
    reasons.push('Your personality traits complement each other well.');
  }
  if (breakdown.interests > 80) {
    reasons.push('You share many common interests and hobbies.');
  }

  // Astrology narrative based on Guna Milan score out of 36
  const gunaTotal = detailedBreakdown?.astrology?.gunaMilan?.totalScore ?? 0;
  let astrologyNarrative = '';
  if (gunaTotal >= 30) {
    astrologyNarrative = 'Exceptionally aligned — your celestial profiles show deep harmony.';
  } else if (gunaTotal >= 25) {
    astrologyNarrative = 'Strongly aligned — your astrological compatibility is above average.';
  } else if (gunaTotal >= 18) {
    astrologyNarrative = 'Moderately aligned — your cosmic profiles show reasonable compatibility.';
  } else {
    astrologyNarrative = 'Some astrological differences — other compatibility factors may be more relevant.';
  }

  // Numerology narrative based on score
  const numerologyScore = detailedBreakdown?.numerology?.score ?? 0;
  let numerologyNarrative = '';
  if (numerologyScore >= 80) {
    numerologyNarrative = 'Your numerological profiles suggest strong energetic resonance.';
  } else if (numerologyScore >= 60) {
    numerologyNarrative = 'Moderate numerological alignment — your numbers show some natural affinity.';
  } else {
    numerologyNarrative = 'Different numerological energies — this can bring complementary perspectives.';
  }

  return {
    strengths,
    frictionPoints,
    reasons,
    astrologyNarrative,
    numerologyNarrative,
  };
}
