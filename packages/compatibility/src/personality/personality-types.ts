// =============================================================================
// PREMA Compatibility Engine — Personality & Communication Types
// =============================================================================

import type { ConfidenceLevel } from '../types';

export type TraitComparisonMode = 'similarity' | 'complementarity' | 'neutral';

export interface TraitDimensionConfig {
  name: string;
  displayName: string;
  comparisonMode: TraitComparisonMode;
  weight: number;
}

export interface TraitComparisonResult {
  dimension: string;
  displayName: string;
  valueA: number;
  valueB: number;
  score: number;
  mode: TraitComparisonMode;
  interpretation: string;
}

export interface PersonalityCompatibilityResult {
  score: number;
  traitComparisons: TraitComparisonResult[];
  strengths: string[];
  frictionPoints: string[];
  confidence: ConfidenceLevel;
  methodologyVersion: string;
}

export interface CommunicationDimensionResult {
  dimension: string;
  displayName: string;
  valueA: number;
  valueB: number;
  score: number;
  interpretation: string;
}

export interface CommunicationCompatibilityResult {
  score: number;
  dimensions: CommunicationDimensionResult[];
  strengths: string[];
  frictionPoints: string[];
  overallInterpretation: string;
  methodologyVersion: string;
}
