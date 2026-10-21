// Turns the engine's raw output into exactly what the screens display.
import type { ConfidenceLevel, FullCompatibilityOutput, MatchProfile } from '@prema/compatibility';

export type KootaView = {
  name: string;
  got: number;
  max: number;
  note: string;
  dosha: 'none' | 'active' | 'cancelled';
};

export type ChartView = {
  moonSign: string;        // Sanskrit, e.g. "Vrishabha"
  moonSignEnglish: string; // e.g. "Taurus"
  nakshatra: string;
  pada: number;
  element: string;
  lagna?: string;          // English ascendant sign, when birth time + place are known
  sunSign: string;         // Western (tropical) sun sign
  moolank: number;
  lifePath: number;
  manglik: 'none' | 'mild' | 'strong';
  hasBirthTime: boolean;
};

/** A friendly headline rating (Cosmo or Heart) built from several engine layers. */
export type RatingView = { value: number; line: string };

export type PartView = { key: string; label: string; icon: string; value: number; note: string };

export type CompatView = {
  score: number;
  confidence: ConfidenceLevel;
  headline: string;
  /** False when your discovery filters or dealbreakers would hide this person. */
  eligible: boolean;
  excludedReasons: string[];
  guna: {
    total: number;
    kootas: KootaView[];
    verdict: 'Excellent' | 'Very good' | 'Good' | 'Needs care';
    summary: string;
  };
  me: ChartView;
  them: ChartView;
  manglik: { status: 'no_dosha' | 'mutual_cancellation' | 'mismatch' | 'unknown'; text: string };
  elements: string;
  numerology: { score: number; text: string };
  horoscope: { score: number; text: string } | null;
  /** Stars: Kundli, numerology and sun signs. */
  stars: PartView[];
  /** Everyday layers that both of you have filled in. */
  everyday: PartView[];
  /**
   * Plain ratings for the screen: Cosmo = Kundli + numerology + sun signs,
   * Heart = everything else (null until questionnaire or preference data exists).
   */
  ratings: { cosmo: RatingView; heart: RatingView | null };
  strengths: string[];
  reasons: string[];
};

export function chartOf(p: MatchProfile): ChartView {
  return {
    moonSign: p.astro.rashi.name,
    moonSignEnglish: p.astro.rashi.englishName,
    nakshatra: p.astro.nakshatra.name,
    pada: p.astro.nakshatraPada,
    element: p.astro.rashi.element,
    lagna: p.astro.lagnaRashi?.englishName,
    sunSign: p.sunSign.sign,
    moolank: p.numerology.moolank,
    lifePath: p.numerology.lifePathNumber,
    manglik: p.astro.manglik?.severity ?? 'none',
    hasBirthTime: p.astro.hasBirthTime,
  };
}

function elementsText(a: string, b: string): string {
  if (a === b) return `Both ${a}: you understand each other’s rhythm naturally.`;
  const pair = [a, b].sort().join('+');
  if (pair === 'Earth+Water') return `${a} and ${b}: nurturing, like soil and rain.`;
  if (pair === 'Air+Fire') return `${a} and ${b}: you energise each other.`;
  if (pair === 'Fire+Water') return `${a} and ${b}: passionate, but needs patience.`;
  return `${a} and ${b}: different temperaments that can balance each other.`;
}

function headlineFor(score: number): string {
  if (score >= 85) return 'An exceptional match on what matters most.';
  if (score >= 70) return 'A strong match on what matters most.';
  if (score >= 55) return 'A promising match, with things to discover.';
  return 'Different in some important ways.';
}

export function toCompatView(
  display: { output: FullCompatibilityOutput; me: MatchProfile; them: MatchProfile },
  discover: { output: FullCompatibilityOutput } | null
): CompatView {
  const { output, me, them } = display;
  const d = output.detailedBreakdown;
  if (!d) throw new Error(`No breakdown for an excluded pair: ${output.result.reasons.join('; ')}`);
  const r = output.result;
  const g = d.astrology.gunaMilan;
  const total = g.totalScore;

  const kootas: KootaView[] = g.kootas.map((k) => ({
    name: k.koota,
    got: k.score,
    max: k.maxPoints,
    note: k.interpretation,
    dosha: k.hasDosha ? (k.doshaCancelled ? 'cancelled' : 'active') : 'none',
  }));

  const myChart = chartOf(me);
  const theirChart = chartOf(them);

  const stars: PartView[] = [
    { key: 'astrology', label: 'Kundli', icon: 'auto_awesome', value: r.breakdown.astrology, note: d.astrology.summary },
    { key: 'numerology', label: 'Numerology', icon: 'tag', value: r.breakdown.numerology, note: d.numerology.overallInterpretation },
  ];
  if (d.horoscope) {
    stars.push({ key: 'horoscope', label: 'Sun signs', icon: 'wb_sunny', value: d.horoscope.score, note: d.horoscope.interpretation });
  }

  const everyday: PartView[] = [];
  const add = (key: keyof typeof r.breakdown, label: string, icon: string, note: string) => {
    if (output.appliedWeights[key] !== undefined) everyday.push({ key, label, icon, value: r.breakdown[key], note });
  };
  add('preferences', 'What you both want', 'favorite',
    r.breakdown.preferences >= 85 ? 'You each fit what the other is looking for.' : 'Some of what you each want is different.');
  if (d.relationshipGoals) add('relationshipGoals', 'Relationship intent', 'flag', d.relationshipGoals.intentionMatch.interpretation);
  if (d.values) add('values', 'Core values', 'home', d.values.strengths.length ? `Aligned on ${d.values.strengths.slice(0, 2).join(' and ').toLowerCase()}.` : 'Your priorities differ in places.');
  if (d.lifestyle) add('lifestyle', 'Lifestyle rhythm', 'spa', d.lifestyle.strengths.length ? `Similar ${d.lifestyle.strengths.slice(0, 2).join(' and ').toLowerCase()}.` : 'Your daily rhythms differ.');
  if (d.communication) add('communication', 'Communication', 'chat', d.communication.overallInterpretation);
  if (d.personality) add('personality', 'Personality', 'person', d.personality.strengths[0] ?? 'Different personalities that can complement each other.');
  if (d.interests) add('interests', 'Shared interests', 'interests', d.interests.interpretation);

  const verdict = total > 32 ? 'Excellent' : total >= 25 ? 'Very good' : total >= 18 ? 'Good' : 'Needs care';
  const manglik = d.astrology.manglik;

  return {
    score: r.score,
    confidence: r.confidence,
    headline: headlineFor(r.score),
    eligible: discover ? discover.output.result.isEligible : true,
    excludedReasons: discover && !discover.output.result.isEligible ? discover.output.result.reasons : [],
    guna: { total, kootas, verdict, summary: d.astrology.summary },
    me: myChart,
    them: theirChart,
    manglik: { status: manglik?.status ?? 'unknown', text: manglik?.explanation ?? '' },
    elements: elementsText(myChart.element, theirChart.element),
    numerology: { score: d.numerology.score, text: d.numerology.moolankCompatibility.interpretation },
    horoscope: d.horoscope ? { score: d.horoscope.score, text: d.horoscope.interpretation } : null,
    stars,
    everyday,
    ratings: {
      cosmo: rating(output, COSMO_KEYS, COSMO_LINES),
      heart: hasAny(output, HEART_KEYS) ? rating(output, HEART_KEYS, HEART_LINES) : null,
    },
    strengths: r.strengths,
    reasons: r.reasons,
  };
}

// ---------------------------------------------------------------------------
// Cosmo & Heart ratings
// ---------------------------------------------------------------------------

type Key = keyof FullCompatibilityOutput['result']['breakdown'];

const COSMO_KEYS: Key[] = ['astrology', 'numerology', 'horoscope'];
const HEART_KEYS: Key[] = ['preferences', 'relationshipGoals', 'values', 'lifestyle', 'communication', 'personality', 'interests'];

const COSMO_LINES: [number, string][] = [
  [85, 'Written in the stars'],
  [70, 'Your stars align beautifully'],
  [55, 'A gentle cosmic pull'],
  [0, 'Different skies, open hearts'],
];
const HEART_LINES: [number, string][] = [
  [85, 'You want the same life'],
  [70, 'So much in common'],
  [55, 'Plenty of common ground'],
  [0, 'Different paths to explore'],
];

function hasAny(output: FullCompatibilityOutput, keys: Key[]): boolean {
  return keys.some((k) => output.appliedWeights[k] !== undefined);
}

/** Weighted average of the given layers, using the weights the engine actually applied. */
function rating(output: FullCompatibilityOutput, keys: Key[], lines: [number, string][]): RatingView {
  let sum = 0;
  let w = 0;
  for (const k of keys) {
    const weight = output.appliedWeights[k];
    if (weight === undefined) continue;
    sum += output.result.breakdown[k] * weight;
    w += weight;
  }
  const value = w > 0 ? Math.round(sum / w) : 0;
  return { value, line: lines.find(([min]) => value >= min)![1] };
}
