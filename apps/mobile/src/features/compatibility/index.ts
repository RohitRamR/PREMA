// Compatibility feature: real Kundli, horoscope, numerology and preference
// matching from @prema/compatibility, adapted for the app's screens.
export { useCompatibility, compatibilityFor, useScoreOf, scoreOf, rankDeck, useRankedDeck } from './engine';
export type { CompatView, ChartView, KootaView, PartView } from './view';
export { parseHeightCm, parseDiet, parseEducation, parseIntention } from './adapters';
