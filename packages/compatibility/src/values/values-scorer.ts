/**
 * @file values-scorer.ts
 * @description Values compatibility scorer for PREMA dating app.
 */

import type { ValuesProfile, ChildrenPreference, ConfidenceLevel } from '../types';

export interface ValueDimensionResult {
  dimension: string;
  displayName: string;
  valueA: number | string;
  valueB: number | string;
  score: number; // 0-100
  isHardConflict: boolean;
  interpretation: string;
}

export interface ValuesCompatibilityResult {
  score: number; // 0-100
  dimensions: ValueDimensionResult[];
  hardConflicts: string[];
  strengths: string[];
  frictionPoints: string[];
  methodologyVersion: string;
}

/**
 * Calculates values compatibility between two profiles.
 * @param {ValuesProfile} profileA - The first profile.
 * @param {ValuesProfile} profileB - The second profile.
 * @returns {ValuesCompatibilityResult} The compatibility result.
 */
export function calculateValuesCompatibility(profileA: ValuesProfile, profileB: ValuesProfile): ValuesCompatibilityResult {
  const dimensions: ValueDimensionResult[] = [];
  const hardConflicts: string[] = [];
  const strengths: string[] = [];
  const frictionPoints: string[] = [];

  const addDimension = (
    dimension: string,
    displayName: string,
    valA: number | string,
    valB: number | string,
    score: number,
    weight: number,
    isHardConflict: boolean = false
  ) => {
    let interpretation = `Similarity score: ${Math.round(score)}/100`;
    if (isHardConflict) interpretation = 'Significant conflict detected.';
    else if (score > 80) interpretation = 'Strong alignment.';
    else if (score < 50) interpretation = 'Potential area of friction.';

    dimensions.push({
      dimension,
      displayName,
      valueA: valA,
      valueB: valB,
      score,
      isHardConflict,
      interpretation
    });

    if (isHardConflict) hardConflicts.push(displayName);
    else if (score > 80) strengths.push(displayName);
    else if (score < 50) frictionPoints.push(displayName);

    return { score, weight, isHardConflict };
  };

  const getChildrenScore = (a: ChildrenPreference, b: ChildrenPreference): { score: number; conflict: boolean } => {
    const pair = [a, b].sort().join('+');
    switch (pair) {
      case 'wants_children+wants_children': return { score: 100, conflict: false };
      case 'does_not_want_children+wants_children': return { score: 0, conflict: true };
      case 'open_to_children+wants_children': return { score: 80, conflict: false };
      case 'has_children_wants_more+wants_children': return { score: 90, conflict: false };
      case 'has_children_no_more+wants_children': return { score: 30, conflict: false };
      case 'not_sure+wants_children': return { score: 60, conflict: false };
      
      case 'does_not_want_children+does_not_want_children': return { score: 100, conflict: false };
      case 'does_not_want_children+open_to_children': return { score: 60, conflict: false };
      case 'does_not_want_children+has_children_no_more': return { score: 80, conflict: false };
      case 'does_not_want_children+not_sure': return { score: 50, conflict: false };
      
      case 'open_to_children+open_to_children': return { score: 85, conflict: false };
      case 'not_sure+open_to_children': return { score: 70, conflict: false };
      
      case 'has_children_wants_more+has_children_wants_more': return { score: 95, conflict: false };
      case 'has_children_no_more+has_children_wants_more': return { score: 40, conflict: false };
      
      case 'has_children_no_more+has_children_no_more': return { score: 90, conflict: false };
      
      case 'not_sure+not_sure': return { score: 65, conflict: false };
      
      default: return { score: 50, conflict: false };
    }
  };

  const cScore = getChildrenScore(profileA.childrenExpectation, profileB.childrenExpectation);
  const results = [
    addDimension('familyImportance', 'Family Importance', profileA.familyImportance, profileB.familyImportance, (1 - Math.abs(profileA.familyImportance - profileB.familyImportance)) * 100, 0.15),
    addDimension('marriageExpectation', 'Marriage Expectation', profileA.marriageExpectation, profileB.marriageExpectation, (1 - Math.abs(profileA.marriageExpectation - profileB.marriageExpectation)) * 100, 0.12),
    addDimension('childrenExpectation', 'Children Expectation', profileA.childrenExpectation, profileB.childrenExpectation, cScore.score, 0.15, cScore.conflict),
    addDimension('careerPriority', 'Career Priority', profileA.careerPriority, profileB.careerPriority, (1 - Math.abs(profileA.careerPriority - profileB.careerPriority)) * 100, 0.10),
    addDimension('financialAttitude', 'Financial Attitude', profileA.financialAttitude, profileB.financialAttitude, (1 - Math.abs(profileA.financialAttitude - profileB.financialAttitude)) * 100, 0.10),
    addDimension('lifestylePriority', 'Lifestyle Priority', profileA.lifestylePriority, profileB.lifestylePriority, (1 - Math.abs(profileA.lifestylePriority - profileB.lifestylePriority)) * 100, 0.08),
    addDimension('religionSpirituality', 'Religion & Spirituality', profileA.religionSpirituality, profileB.religionSpirituality, (1 - Math.abs(profileA.religionSpirituality - profileB.religionSpirituality)) * 100, 0.12),
    addDimension('socialValues', 'Social Values', profileA.socialValues, profileB.socialValues, (1 - Math.abs(profileA.socialValues - profileB.socialValues)) * 100, 0.10),
    addDimension('personalIndependence', 'Personal Independence', profileA.personalIndependence, profileB.personalIndependence, (1 - Math.abs(profileA.personalIndependence - profileB.personalIndependence)) * 100, 0.08),
  ];

  let totalScore = 0;
  let totalWeight = 0;
  
  for (const r of results) {
    if (!r.isHardConflict) {
      totalScore += r.score * r.weight;
      totalWeight += r.weight;
    }
  }

  let finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  if (hardConflicts.length > 0) {
    finalScore = Math.min(finalScore, 30);
  }

  return {
    score: Math.round(finalScore),
    dimensions,
    hardConflicts,
    strengths,
    frictionPoints,
    methodologyVersion: '1.0'
  };
}
