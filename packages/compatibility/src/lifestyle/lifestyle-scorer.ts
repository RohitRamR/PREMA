/**
 * @file lifestyle-scorer.ts
 * @description Lifestyle compatibility scorer for PREMA dating app.
 */

import type { LifestyleProfile } from '../types';

export interface LifestyleDimensionResult {
  dimension: string;
  displayName: string;
  valueA: number;
  valueB: number;
  score: number;
  interpretation: string;
}

export interface LifestyleCompatibilityResult {
  score: number; // 0-100
  dimensions: LifestyleDimensionResult[];
  strengths: string[];
  frictionPoints: string[];
  methodologyVersion: string;
}

/**
 * Calculates lifestyle compatibility between two profiles.
 * @param {LifestyleProfile} profileA - The first profile.
 * @param {LifestyleProfile} profileB - The second profile.
 * @returns {LifestyleCompatibilityResult} The compatibility result.
 */
export function calculateLifestyleCompatibility(profileA: LifestyleProfile, profileB: LifestyleProfile): LifestyleCompatibilityResult {
  const dimensions: LifestyleDimensionResult[] = [];
  const strengths: string[] = [];
  const frictionPoints: string[] = [];

  const generateInterpretation = (dimension: string, score: number): string => {
    if (dimension === 'sleepSchedule' && score > 80) return 'You share a similar sleep schedule, making daily routines easier.';
    if (dimension === 'socialActivity' && score < 50) return 'Your social energy levels differ — one prefers more quiet time while the other enjoys being out.';
    if (dimension === 'smokingPreference' && score < 30) return 'Your smoking preferences are quite different — this could be a practical friction point.';
    
    if (score > 80) return 'High similarity in this area.';
    if (score < 50) return 'Differences observed which could cause friction.';
    return 'Moderate compatibility.';
  };

  const addDimension = (
    dimension: string,
    displayName: string,
    valA: number,
    valB: number,
    weight: number
  ) => {
    const score = (1 - Math.abs(valA - valB)) * 100;
    const interpretation = generateInterpretation(dimension, score);
    
    dimensions.push({
      dimension,
      displayName,
      valueA: valA,
      valueB: valB,
      score,
      interpretation
    });

    if (score > 80) strengths.push(displayName);
    else if (score < 50) frictionPoints.push(displayName);

    return { score, weight };
  };

  const results = [
    addDimension('foodPreference', 'Food & Dining', profileA.foodPreference, profileB.foodPreference, 0.08),
    addDimension('travelFrequency', 'Travel', profileA.travelFrequency, profileB.travelFrequency, 0.10),
    addDimension('sleepSchedule', 'Sleep Schedule', profileA.sleepSchedule, profileB.sleepSchedule, 0.12),
    addDimension('exerciseFrequency', 'Fitness', profileA.exerciseFrequency, profileB.exerciseFrequency, 0.10),
    addDimension('socialActivity', 'Social Life', profileA.socialActivity, profileB.socialActivity, 0.12),
    addDimension('alcoholPreference', 'Drinking Habits', profileA.alcoholPreference, profileB.alcoholPreference, 0.08),
    addDimension('smokingPreference', 'Smoking', profileA.smokingPreference, profileB.smokingPreference, 0.10),
    addDimension('workStyle', 'Work Style', profileA.workStyle, profileB.workStyle, 0.08),
    addDimension('weekendStyle', 'Weekend Style', profileA.weekendStyle, profileB.weekendStyle, 0.12),
    addDimension('spendingStyle', 'Spending', profileA.spendingStyle, profileB.spendingStyle, 0.10)
  ];

  let totalScore = 0;
  let totalWeight = 0;
  for (const r of results) {
    totalScore += r.score * r.weight;
    totalWeight += r.weight;
  }

  return {
    score: Math.round(totalScore / totalWeight),
    dimensions,
    strengths,
    frictionPoints,
    methodologyVersion: '1.0'
  };
}
