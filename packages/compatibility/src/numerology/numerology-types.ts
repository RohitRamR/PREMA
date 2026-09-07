// =============================================================================
// PREMA Compatibility Engine — Numerology Types
// =============================================================================

export interface NumerologyProfile {
  userId: string;
  lifePathNumber: number;
  expressionNumber: number;
  isMasterNumber: boolean;
  methodologyVersion: string;
}

export interface NumerologyCompatibilityResult {
  score: number;
  lifePathCompatibility: {
    numberA: number;
    numberB: number;
    compatibility: 'natural_match' | 'compatible' | 'neutral' | 'challenging';
    score: number;
    interpretation: string;
  };
  expressionCompatibility: {
    numberA: number;
    numberB: number;
    compatibility: 'natural_match' | 'compatible' | 'neutral' | 'challenging';
    score: number;
    interpretation: string;
  };
  overallInterpretation: string;
  methodologyVersion: string;
}
