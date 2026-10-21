// Compatibility feature: real Kundli, horoscope, numerology and preference
// matching from @prema/compatibility, adapted for the app's screens.
export { useCompatibility, compatibilityFor, useScoreOf, scoreOf, rankDeck, useRankedDeck, useMyChart, myChartFor } from './engine';
export { QUESTIONS, QUIZ_SECTIONS, QUESTION_COUNT, answeredCount, quizToProfiles, sampleAnswers } from './quiz';
export type { QuizAnswers } from './quiz';
export type { CompatView, ChartView, KootaView, PartView } from './view';
export { parseHeightCm, parseDiet, parseEducation, parseIntention } from './adapters';
