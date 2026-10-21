import type { CompatibilityBreakdown } from '../types';
import type { DetailedBreakdown } from './scoring-engine';

/**
 * Explanation result containing human-readable compatibility insights.
 */
export interface ExplanationResult {
  strengths: string[];      // top strongest areas (score ≥ 70)
  frictionPoints: string[]; // areas below 55
  reasons: string[];        // human-readable reason strings
  astrologyNarrative: string;
  numerologyNarrative: string;
}

const DISPLAY: Record<keyof CompatibilityBreakdown, string> = {
  astrology: 'Kundli (Guna Milan)',
  horoscope: 'Sun Sign Harmony',
  numerology: 'Numerology',
  preferences: 'What You Both Want',
  personality: 'Personality',
  communication: 'Communication Style',
  values: 'Core Values',
  lifestyle: 'Lifestyle',
  relationshipGoals: 'Relationship Goals',
  interests: 'Shared Interests',
};

/**
 * Builds strengths, friction points and narrative text.
 * Only layers that were actually scored (`scoredLayers`) are considered,
 * so a missing questionnaire never shows up as a "friction point".
 */
export function generateExplanation(
  breakdown: CompatibilityBreakdown,
  detailed: DetailedBreakdown | null,
  scoredLayers: Array<keyof CompatibilityBreakdown> = Object.keys(breakdown) as Array<keyof CompatibilityBreakdown>
): ExplanationResult {
  const dims = scoredLayers
    .map((key) => ({ key, score: breakdown[key], display: DISPLAY[key] }))
    .sort((a, b) => b.score - a.score);

  const strengths = dims.filter((d) => d.score >= 70).slice(0, 3).map((d) => d.display);
  const frictionPoints = dims.filter((d) => d.score < 55).map((d) => d.display);

  const reasons: string[] = [];
  const guna = detailed?.astrology.gunaMilan;

  if (guna) {
    reasons.push(`Kundli: ${guna.totalScore}/36 Guna — ${guna.interpretation.toLowerCase()}.`);
    const nadi = guna.kootas[7]!;
    const bhakoot = guna.kootas[6]!;
    if (nadi.hasDosha) reasons.push(nadi.interpretation);
    if (bhakoot.hasDosha) reasons.push(bhakoot.interpretation);
  }
  const manglik = detailed?.astrology.manglik;
  if (manglik && manglik.status !== 'no_dosha') reasons.push(manglik.explanation);
  if (detailed?.horoscope) reasons.push(`${detailed.horoscope.signA} & ${detailed.horoscope.signB}: ${detailed.horoscope.interpretation}`);

  const has = (k: keyof CompatibilityBreakdown) => scoredLayers.includes(k);
  if (has('preferences') && breakdown.preferences >= 85) reasons.push('You each match what the other is looking for.');
  if (has('relationshipGoals') && breakdown.relationshipGoals >= 85) reasons.push('Your long-term relationship intentions are strongly aligned.');
  if (has('values') && breakdown.values >= 85) reasons.push('Your core values and life priorities are closely aligned.');
  if (has('communication') && breakdown.communication >= 85) reasons.push('Your communication styles are similar, which supports daily harmony.');
  if (has('personality') && breakdown.personality >= 85) reasons.push('Your personality traits complement each other well.');
  if (has('lifestyle') && breakdown.lifestyle >= 85) reasons.push('Your daily lifestyles are well-matched.');
  if (has('interests') && breakdown.interests >= 80) reasons.push('You share many common interests.');

  const gunaTotal = guna?.totalScore ?? 0;
  const astrologyNarrative =
    gunaTotal > 32 ? 'Exceptional Kundli match — your charts show deep harmony.'
    : gunaTotal >= 25 ? 'Very good Kundli match — well above the traditional threshold.'
    : gunaTotal >= 18 ? 'Acceptable Kundli match — meets the traditional 18-point threshold.'
    : 'Below the traditional 18-point threshold — other strengths matter more here.';

  const n = detailed?.numerology;
  const numerologyNarrative = !n ? ''
    : n.score >= 80 ? `Strong numerology resonance (Moolank ${n.moolankCompatibility.numberA} & ${n.moolankCompatibility.numberB}).`
    : n.score >= 60 ? 'Moderate numerology alignment — your numbers show natural affinity.'
    : 'Different numerological energies — this can bring complementary perspectives.';

  return { strengths, frictionPoints, reasons, astrologyNarrative, numerologyNarrative };
}
