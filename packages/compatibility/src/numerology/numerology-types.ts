// =============================================================================
// PREMA Compatibility Engine — Numerology Types
// =============================================================================

export type NumerologyCategory = 'natural_match' | 'compatible' | 'neutral' | 'challenging';

export interface NumerologyProfile {
  userId: string;
  /** Moolank / psychic number: birth day reduced to 1–9. */
  moolank: number;
  /** Bhagyank / destiny number: all digits of the full DOB reduced to 1–9. */
  bhagyank: number;
  /** Western Life Path (keeps master numbers 11/22/33). */
  lifePathNumber: number;
  /** Pythagorean Expression number of the full name (null if no name). */
  expressionNumber: number | null;
  /** Pythagorean Soul Urge (vowels) of the full name (null if no name). */
  soulUrgeNumber: number | null;
  isMasterNumber: boolean;
  methodologyVersion: string;
}

export interface NumerologyComponentResult {
  numberA: number;
  numberB: number;
  compatibility: NumerologyCategory;
  score: number;
  interpretation: string;
}

export interface NumerologyCompatibilityResult {
  score: number;
  moolankCompatibility: NumerologyComponentResult;
  lifePathCompatibility: NumerologyComponentResult;
  expressionCompatibility: NumerologyComponentResult | null;
  soulUrgeCompatibility: NumerologyComponentResult | null;
  overallInterpretation: string;
  methodologyVersion: string;
}
