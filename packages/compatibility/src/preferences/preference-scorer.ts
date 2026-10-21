// =============================================================================
// PREMA Compatibility Engine — Mutual Preference Fit
// =============================================================================
// "Does B fit what A asked for?" AND "does A fit what B asked for?"
//
// satisfaction(A→B) = importance-weighted share of A's rules that B meets
//   met = 1 · unknown (B left the field empty) = 0.5 · not met = 0
//   weights: dealbreaker 3 · important 2 · nice_to_have 1
// mutualFit = √(satisfaction(A→B) × satisfaction(B→A)) × 100
//
// The geometric mean means a one-sided match (A loves B's profile, B would
// never pick A) always scores lower than a pair where both are reasonably happy.
// =============================================================================

import type {
  UserProfile, UserPreferences, UserAttributes, Importance, EducationLevel,
} from '../types';
import { calculateHaversineDistance } from '../utils/geo';

export const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  dealbreaker: 3,
  important: 2,
  nice_to_have: 1,
};

export const EDUCATION_RANK: Record<EducationLevel, number> = {
  high_school: 1, diploma: 2, bachelors: 3, masters: 4, doctorate: 5,
};

export type RuleOutcome = 'met' | 'not_met' | 'unknown';

export interface RuleEvaluation {
  rule: string;
  importance: Importance;
  outcome: RuleOutcome;
  /** 0–1 satisfaction for this rule. */
  satisfaction: number;
  detail: string;
}

export interface OneWaySatisfaction {
  seekerId: string;
  candidateId: string;
  /** 0–1. */
  satisfaction: number;
  rules: RuleEvaluation[];
  failedDealbreakers: string[];
  unverifiedDealbreakers: string[];
}

export interface MutualPreferenceResult {
  score: number; // 0–100
  aToB: OneWaySatisfaction;
  bToA: OneWaySatisfaction;
  strengths: string[];
  frictionPoints: string[];
  methodologyVersion: string;
}

function norm(v: string): string {
  return v.trim().toLowerCase();
}

function categorical<T extends string>(
  rule: string,
  pref: { accepted: T[]; importance: Importance } | undefined,
  value: T | undefined,
  out: RuleEvaluation[]
): void {
  if (!pref || pref.accepted.length === 0) return;
  if (value === undefined || value === null || (value as string) === '') {
    out.push({ rule, importance: pref.importance, outcome: 'unknown', satisfaction: 0.5, detail: `${rule} not specified` });
    return;
  }
  const ok = pref.accepted.map((a) => norm(a)).includes(norm(value));
  out.push({
    rule, importance: pref.importance,
    outcome: ok ? 'met' : 'not_met',
    satisfaction: ok ? 1 : 0,
    detail: ok ? `${rule}: ${value} ✓` : `${rule}: ${value} is not in ${pref.accepted.join(', ')}`,
  });
}

/**
 * Evaluates every preference `seeker` has against `candidate`.
 * Age and distance are hard-filtered elsewhere; here they add a soft
 * preference for the centre of the range / closer distance.
 */
export function evaluatePreferences(
  seeker: UserProfile,
  prefs: UserPreferences,
  candidate: UserProfile
): OneWaySatisfaction {
  const attrs: UserAttributes = candidate.attributes ?? {};
  const rules: RuleEvaluation[] = [];

  // Age — inside the range: 1.0 in the middle 60 %, easing to 0.8 at the edges.
  if (Number.isFinite(prefs.minAge) && Number.isFinite(prefs.maxAge) && prefs.maxAge >= prefs.minAge) {
    const inRange = candidate.age >= prefs.minAge && candidate.age <= prefs.maxAge;
    let s = 0;
    if (inRange) {
      const span = Math.max(1, prefs.maxAge - prefs.minAge);
      const fromEdge = Math.min(candidate.age - prefs.minAge, prefs.maxAge - candidate.age) / span; // 0..0.5
      s = fromEdge >= 0.2 ? 1 : 0.8 + fromEdge;
    }
    rules.push({ rule: 'Age', importance: 'important', outcome: inRange ? 'met' : 'not_met', satisfaction: s, detail: `Age ${candidate.age} (wants ${prefs.minAge}–${prefs.maxAge})` });
  }

  // Distance — closer is better inside the radius.
  if (seeker.latitude != null && seeker.longitude != null && candidate.latitude != null && candidate.longitude != null && prefs.maxDistanceKm > 0) {
    const d = calculateHaversineDistance(seeker.latitude, seeker.longitude, candidate.latitude, candidate.longitude);
    const inRange = d <= prefs.maxDistanceKm;
    const s = inRange ? 1 - 0.3 * (d / prefs.maxDistanceKm) : 0;
    rules.push({ rule: 'Distance', importance: 'nice_to_have', outcome: inRange ? 'met' : 'not_met', satisfaction: s, detail: `${Math.round(d)} km away (max ${prefs.maxDistanceKm} km)` });
  }

  categorical('Diet', prefs.diet, attrs.diet, rules);
  categorical('Smoking', prefs.smoking, attrs.smoking, rules);
  categorical('Drinking', prefs.drinking, attrs.drinking, rules);
  categorical('Religion', prefs.religion, attrs.religion, rules);
  categorical('Community', prefs.community, attrs.community, rules);
  categorical('Mother tongue', prefs.motherTongue, attrs.motherTongue, rules);

  if (prefs.heightCm && (prefs.heightCm.min != null || prefs.heightCm.max != null)) {
    const h = attrs.heightCm;
    if (h == null) {
      rules.push({ rule: 'Height', importance: prefs.heightCm.importance, outcome: 'unknown', satisfaction: 0.5, detail: 'Height not specified' });
    } else {
      const ok = (prefs.heightCm.min == null || h >= prefs.heightCm.min) && (prefs.heightCm.max == null || h <= prefs.heightCm.max);
      rules.push({ rule: 'Height', importance: prefs.heightCm.importance, outcome: ok ? 'met' : 'not_met', satisfaction: ok ? 1 : 0, detail: `Height ${h} cm` });
    }
  }

  if (prefs.minEducation) {
    const e = attrs.education;
    if (!e) {
      rules.push({ rule: 'Education', importance: prefs.minEducation.importance, outcome: 'unknown', satisfaction: 0.5, detail: 'Education not specified' });
    } else {
      const ok = EDUCATION_RANK[e] >= EDUCATION_RANK[prefs.minEducation.level];
      rules.push({ rule: 'Education', importance: prefs.minEducation.importance, outcome: ok ? 'met' : 'not_met', satisfaction: ok ? 1 : 0, detail: `Education: ${e}` });
    }
  }

  let weighted = 0;
  let totalWeight = 0;
  for (const r of rules) {
    const w = IMPORTANCE_WEIGHT[r.importance];
    weighted += r.satisfaction * w;
    totalWeight += w;
  }

  return {
    seekerId: seeker.id,
    candidateId: candidate.id,
    // No stated preferences → open to anyone, mildly positive baseline.
    satisfaction: totalWeight > 0 ? weighted / totalWeight : 0.85,
    rules,
    failedDealbreakers: rules.filter((r) => r.importance === 'dealbreaker' && r.outcome === 'not_met').map((r) => r.detail),
    unverifiedDealbreakers: rules.filter((r) => r.importance === 'dealbreaker' && r.outcome === 'unknown').map((r) => r.detail),
  };
}

export function calculateMutualPreferenceFit(
  userA: UserProfile, prefsA: UserPreferences,
  userB: UserProfile, prefsB: UserPreferences
): MutualPreferenceResult {
  const aToB = evaluatePreferences(userA, prefsA, userB);
  const bToA = evaluatePreferences(userB, prefsB, userA);
  const score = Math.round(Math.sqrt(aToB.satisfaction * bToA.satisfaction) * 100);

  const strengths: string[] = [];
  const frictionPoints: string[] = [];
  if (aToB.satisfaction >= 0.9 && bToA.satisfaction >= 0.9) strengths.push('You both match what the other is looking for');
  for (const r of [...aToB.rules, ...bToA.rules]) {
    if (r.outcome === 'not_met' && r.importance !== 'dealbreaker') frictionPoints.push(r.detail);
  }

  return { score, aToB, bToA, strengths, frictionPoints, methodologyVersion: 'preferences_v1' };
}
