/**
 * @file relationship-goals-scorer.ts
 * @description Relationship goals compatibility scorer for PREMA dating app.
 */

import type { RelationshipGoalsProfile, RelationshipIntention, ChildrenPreference, MarriageTimeline } from '../types';

export interface RelationshipGoalsResult {
  score: number; // 0-100
  intentionMatch: {
    intentionA: RelationshipIntention;
    intentionB: RelationshipIntention;
    score: number;
    isHardConflict: boolean;
    interpretation: string;
  };
  dimensionScores: {
    marriageTimeline: number;
    childrenAlignment: number;
    familyInvolvement: number;
    relocation: number;
    longDistance: number;
  };
  hardConflicts: string[];
  strengths: string[];
  frictionPoints: string[];
  methodologyVersion: string;
}

/**
 * Calculates relationship goals compatibility between two profiles.
 * @param {RelationshipGoalsProfile} profileA - The first profile.
 * @param {RelationshipGoalsProfile} profileB - The second profile.
 * @returns {RelationshipGoalsResult} The compatibility result.
 */
export function calculateRelationshipGoalsCompatibility(profileA: RelationshipGoalsProfile, profileB: RelationshipGoalsProfile): RelationshipGoalsResult {
  const hardConflicts: string[] = [];
  const strengths: string[] = [];
  const frictionPoints: string[] = [];

  const getIntentionScore = (a: RelationshipIntention, b: RelationshipIntention): { score: number; conflict: boolean; interpretation: string } => {
    const pair = [a, b].sort().join('+');
    switch (pair) {
      case 'casual+casual': return { score: 90, conflict: false, interpretation: 'Both seeking casual.' };
      case 'casual+long_term': return { score: 20, conflict: true, interpretation: 'Mismatched intentions.' };
      case 'casual+marriage_oriented': return { score: 0, conflict: true, interpretation: 'Highly mismatched intentions.' };
      case 'casual+open_to_either': return { score: 60, conflict: false, interpretation: 'Potential mismatch in long-term goals.' };
      case 'casual+not_sure': return { score: 50, conflict: false, interpretation: 'Uncertain alignment.' };
      case 'long_term+long_term': return { score: 95, conflict: false, interpretation: 'Both seeking long-term.' };
      case 'long_term+marriage_oriented': return { score: 80, conflict: false, interpretation: 'Generally aligned.' };
      case 'long_term+open_to_either': return { score: 75, conflict: false, interpretation: 'Good alignment.' };
      case 'long_term+not_sure': return { score: 60, conflict: false, interpretation: 'One is unsure.' };
      case 'marriage_oriented+marriage_oriented': return { score: 100, conflict: false, interpretation: 'Perfectly aligned on marriage.' };
      case 'marriage_oriented+open_to_either': return { score: 70, conflict: false, interpretation: 'One open, one oriented.' };
      case 'marriage_oriented+not_sure': return { score: 45, conflict: false, interpretation: 'One oriented, one unsure.' };
      case 'open_to_either+open_to_either': return { score: 80, conflict: false, interpretation: 'Both open.' };
      case 'not_sure+open_to_either': return { score: 65, conflict: false, interpretation: 'Both somewhat uncertain.' };
      case 'not_sure+not_sure': return { score: 55, conflict: false, interpretation: 'Both unsure.' };
      default: return { score: 50, conflict: false, interpretation: 'Neutral alignment.' };
    }
  };

  const getMarriageTimelineScore = (a: MarriageTimeline, b: MarriageTimeline): number => {
    if (a === 'not_applicable' || b === 'not_applicable') return 50; // Neutral
    const timelines: MarriageTimeline[] = ['within_1_year', 'within_2_3_years', 'within_5_years', 'no_timeline', 'not_applicable'];
    const idxA = timelines.indexOf(a);
    const idxB = timelines.indexOf(b);
    if (idxA === -1 || idxB === -1) return 50;
    if (idxA === idxB) return 100;
    if (Math.abs(idxA - idxB) === 1) return 75;
    return 40;
  };

  const getChildrenScore = (a: ChildrenPreference, b: ChildrenPreference): number => {
    const pair = [a, b].sort().join('+');
    switch (pair) {
      case 'wants_children+wants_children': return 100;
      case 'does_not_want_children+wants_children': return 0;
      case 'open_to_children+wants_children': return 80;
      case 'has_children_wants_more+wants_children': return 90;
      case 'has_children_no_more+wants_children': return 30;
      case 'not_sure+wants_children': return 60;
      case 'does_not_want_children+does_not_want_children': return 100;
      case 'does_not_want_children+open_to_children': return 60;
      case 'does_not_want_children+has_children_no_more': return 80;
      case 'does_not_want_children+not_sure': return 50;
      case 'open_to_children+open_to_children': return 85;
      case 'not_sure+open_to_children': return 70;
      case 'has_children_wants_more+has_children_wants_more': return 95;
      case 'has_children_no_more+has_children_wants_more': return 40;
      case 'has_children_no_more+has_children_no_more': return 90;
      case 'not_sure+not_sure': return 65;
      default: return 50;
    }
  };

  const intentionMatch = getIntentionScore(profileA.intention, profileB.intention);
  if (intentionMatch.conflict) hardConflicts.push('Relationship Intention');
  else if (intentionMatch.score > 80) strengths.push('Relationship Intention');
  else if (intentionMatch.score < 50) frictionPoints.push('Relationship Intention');

  const dimensionScores = {
    marriageTimeline: getMarriageTimelineScore(profileA.marriageTimeline, profileB.marriageTimeline),
    childrenAlignment: getChildrenScore(profileA.childrenPreference, profileB.childrenPreference),
    familyInvolvement: (1 - Math.abs(profileA.familyInvolvement - profileB.familyInvolvement)) * 100,
    relocation: (1 - Math.abs(profileA.relocationWillingness - profileB.relocationWillingness)) * 100,
    longDistance: (1 - Math.abs(profileA.longDistanceWillingness - profileB.longDistanceWillingness)) * 100
  };

  const weights = {
    intention: 0.40,
    marriageTimeline: 0.15,
    childrenAlignment: 0.20,
    familyInvolvement: 0.10,
    relocation: 0.08,
    longDistance: 0.07
  };

  let score = 
    intentionMatch.score * weights.intention +
    dimensionScores.marriageTimeline * weights.marriageTimeline +
    dimensionScores.childrenAlignment * weights.childrenAlignment +
    dimensionScores.familyInvolvement * weights.familyInvolvement +
    dimensionScores.relocation * weights.relocation +
    dimensionScores.longDistance * weights.longDistance;

  if (intentionMatch.conflict) {
    score = Math.min(score, 15);
  }

  return {
    score: Math.round(score),
    intentionMatch: {
      intentionA: profileA.intention,
      intentionB: profileB.intention,
      score: intentionMatch.score,
      isHardConflict: intentionMatch.conflict,
      interpretation: intentionMatch.interpretation
    },
    dimensionScores,
    hardConflicts,
    strengths,
    frictionPoints,
    methodologyVersion: '1.0'
  };
}
