// The Compatibility quiz ("Compatibility DNA"): 30 one-tap questions that
// feed the matching engine's goals, values, lifestyle, personality and
// communication layers. Scale answers are 0–4 (five dots), stored as numbers.
import type {
  ChildrenPreference,
  CommunicationProfile,
  Habit,
  LifestyleProfile,
  MarriageTimeline,
  PersonalityProfile,
  RelationshipGoalsProfile,
  RelationshipIntention,
  ValuesProfile,
} from '@prema/compatibility';

export type SectionId = 'goals' | 'values' | 'lifestyle' | 'personality';

type Base = { id: string; section: SectionId; prompt: string };
export type ScaleQuestion = Base & { kind: 'scale'; left: string; right: string };
export type ChoiceQuestion = Base & { kind: 'choice'; options: { value: string; label: string }[] };
export type Question = ScaleQuestion | ChoiceQuestion;

/** Question id → 0–4 for scales, option value for choices. */
export type QuizAnswers = Record<string, number | string>;

export const QUIZ_SECTIONS: { id: SectionId; title: string; icon: string; blurb: string }[] = [
  { id: 'goals', title: 'Relationship goals', icon: 'flag', blurb: 'Timelines, children and family — the things that matter most long-term.' },
  { id: 'values', title: 'Values', icon: 'favorite', blurb: 'What you prioritise in life, money and faith.' },
  { id: 'lifestyle', title: 'Lifestyle', icon: 'spa', blurb: 'Your everyday rhythm, habits and weekends.' },
  { id: 'personality', title: 'Personality & communication', icon: 'chat', blurb: 'How you talk, disagree and show affection.' },
];

const HABITS = [
  { value: 'never', label: 'Never' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'regularly', label: 'Regularly' },
];

export const QUESTIONS: Question[] = [
  // Relationship goals
  { id: 'g_timeline', section: 'goals', kind: 'choice', prompt: 'When would you like to be married?', options: [
    { value: 'within_1_year', label: 'Within a year' }, { value: 'within_2_3_years', label: 'In 2–3 years' },
    { value: 'within_5_years', label: 'Within 5 years' }, { value: 'no_timeline', label: 'No timeline' },
  ] },
  { id: 'g_children', section: 'goals', kind: 'choice', prompt: 'Children?', options: [
    { value: 'wants_children', label: 'I want children' }, { value: 'open_to_children', label: 'Open to it' },
    { value: 'does_not_want_children', label: 'I don’t want children' }, { value: 'has_children_wants_more', label: 'Have kids, want more' },
    { value: 'has_children_no_more', label: 'Have kids, no more' }, { value: 'not_sure', label: 'Not sure yet' },
  ] },
  { id: 'g_family', section: 'goals', kind: 'scale', prompt: 'How involved is family in big decisions?', left: 'We decide alone', right: 'Family is central' },
  { id: 'g_relocate', section: 'goals', kind: 'scale', prompt: 'Would you move cities for the right person?', left: 'Not at all', right: 'Happily' },
  { id: 'g_distance', section: 'goals', kind: 'scale', prompt: 'How do you feel about long distance?', left: 'Not for me', right: 'Totally fine' },

  // Values
  { id: 'v_marriage', section: 'values', kind: 'scale', prompt: 'How central is marriage to your life plan?', left: 'Nice to have', right: 'Essential' },
  { id: 'v_career', section: 'values', kind: 'scale', prompt: 'How much does your career drive you?', left: 'Balanced', right: 'Very ambitious' },
  { id: 'v_money', section: 'values', kind: 'scale', prompt: 'With money, you are a…', left: 'Saver', right: 'Spender' },
  { id: 'v_spiritual', section: 'values', kind: 'scale', prompt: 'How important are faith and spirituality?', left: 'Not much', right: 'Very' },
  { id: 'v_social', section: 'values', kind: 'scale', prompt: 'Your outlook on traditions', left: 'Traditional', right: 'Progressive' },
  { id: 'v_space', section: 'values', kind: 'scale', prompt: 'Time together vs. personal space', left: 'Always together', right: 'Lots of space' },
  { id: 'v_comfort', section: 'values', kind: 'scale', prompt: 'Simple living or comfort and experiences?', left: 'Simple', right: 'Comfort & experiences' },

  // Lifestyle
  { id: 'l_sleep', section: 'lifestyle', kind: 'scale', prompt: 'Early bird or night owl?', left: 'Early bird', right: 'Night owl' },
  { id: 'l_travel', section: 'lifestyle', kind: 'scale', prompt: 'How often do you travel?', left: 'Homebody', right: 'Always packing' },
  { id: 'l_fitness', section: 'lifestyle', kind: 'scale', prompt: 'How active are you?', left: 'Relaxed', right: 'Very active' },
  { id: 'l_social', section: 'lifestyle', kind: 'scale', prompt: 'Social energy', left: 'Introvert', right: 'Extrovert' },
  { id: 'l_weekend', section: 'lifestyle', kind: 'scale', prompt: 'Your ideal weekend', left: 'Quiet at home', right: 'Out and about' },
  { id: 'l_food', section: 'lifestyle', kind: 'scale', prompt: 'With food, you are…', left: 'Simple & familiar', right: 'Adventurous' },
  { id: 'l_work', section: 'lifestyle', kind: 'scale', prompt: 'Your work rhythm', left: 'Fixed 9–5', right: 'Flexible / founder' },
  { id: 'l_drink', section: 'lifestyle', kind: 'choice', prompt: 'Do you drink?', options: HABITS },
  { id: 'l_smoke', section: 'lifestyle', kind: 'choice', prompt: 'Do you smoke?', options: HABITS },

  // Personality & communication
  { id: 'p_direct', section: 'personality', kind: 'scale', prompt: 'How do you say what you think?', left: 'Gently, between the lines', right: 'Directly' },
  { id: 'p_conflict', section: 'personality', kind: 'scale', prompt: 'When there’s a problem, you…', left: 'Give it time', right: 'Talk it out now' },
  { id: 'p_open', section: 'personality', kind: 'scale', prompt: 'Sharing feelings', left: 'Private', right: 'Open book' },
  { id: 'p_adventure', section: 'personality', kind: 'scale', prompt: 'Routine or spontaneity?', left: 'Love routine', right: 'Spontaneous' },
  { id: 'p_decide', section: 'personality', kind: 'scale', prompt: 'How do you decide?', left: 'Gut feeling', right: 'Analyse everything' },
  { id: 'p_affection', section: 'personality', kind: 'scale', prompt: 'Showing affection', left: 'Reserved', right: 'Very expressive' },
  { id: 'p_texting', section: 'personality', kind: 'scale', prompt: 'Texting while dating', left: 'A few messages', right: 'All day' },
  { id: 'p_reassure', section: 'personality', kind: 'scale', prompt: 'How much reassurance do you like?', left: 'Very little', right: 'Quite a lot' },
  { id: 'p_disagree', section: 'personality', kind: 'scale', prompt: 'In a disagreement you…', left: 'Compromise first', right: 'Debate it out' },
];

export const QUESTION_COUNT = QUESTIONS.length;

export function answeredCount(answers: QuizAnswers, section?: SectionId): number {
  return QUESTIONS.filter((q) => (!section || q.section === section) && isAnswered(answers[q.id], q)).length;
}

export function sectionTotal(section: SectionId): number {
  return QUESTIONS.filter((q) => q.section === section).length;
}

function isAnswered(v: unknown, q: Question): boolean {
  if (q.kind === 'scale') return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 4;
  return typeof v === 'string' && q.options.some((o) => o.value === v);
}

/** 0–1 value of a scale answer, NaN when unanswered (the engine skips it). */
function scale(a: QuizAnswers, id: string): number {
  const v = a[id];
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v / 4)) : NaN;
}
const inverse = (n: number) => (Number.isNaN(n) ? NaN : 1 - n);
const habit = (v: unknown) => (v === 'never' ? 0 : v === 'occasionally' ? 0.5 : v === 'regularly' ? 1 : NaN);
const choice = <T extends string>(a: QuizAnswers, id: string): T | undefined => {
  const q = QUESTIONS.find((x) => x.id === id) as ChoiceQuestion | undefined;
  const v = a[id];
  return q && typeof v === 'string' && q.options.some((o) => o.value === v) ? (v as T) : undefined;
};

/** A section counts only once at least half of its questions are answered. */
const enough = (a: QuizAnswers, section: SectionId) => answeredCount(a, section) * 2 >= sectionTotal(section);

export type QuizProfiles = {
  goals?: RelationshipGoalsProfile;
  values?: ValuesProfile;
  lifestyle?: LifestyleProfile;
  personality?: PersonalityProfile;
  communication?: CommunicationProfile;
  smoking?: Habit;
  drinking?: Habit;
};

/** Turns quiz answers into the engine's questionnaire profiles. */
export function quizToProfiles(userId: string, a: QuizAnswers, intention: RelationshipIntention): QuizProfiles {
  const out: QuizProfiles = {
    smoking: choice<Habit>(a, 'l_smoke'),
    drinking: choice<Habit>(a, 'l_drink'),
  };
  const children = choice<ChildrenPreference>(a, 'g_children');

  if (enough(a, 'goals')) {
    out.goals = {
      userId,
      intention,
      marriageTimeline: choice<MarriageTimeline>(a, 'g_timeline') ?? 'not_applicable',
      childrenPreference: children ?? 'not_sure',
      familyInvolvement: scale(a, 'g_family'),
      relocationWillingness: scale(a, 'g_relocate'),
      longDistanceWillingness: scale(a, 'g_distance'),
    };
  }
  if (enough(a, 'values')) {
    out.values = {
      userId,
      familyImportance: scale(a, 'g_family'),
      marriageExpectation: scale(a, 'v_marriage'),
      childrenExpectation: children ?? 'not_sure',
      careerPriority: scale(a, 'v_career'),
      financialAttitude: scale(a, 'v_money'),
      lifestylePriority: scale(a, 'v_comfort'),
      religionSpirituality: scale(a, 'v_spiritual'),
      socialValues: scale(a, 'v_social'),
      personalIndependence: scale(a, 'v_space'),
    };
  }
  if (enough(a, 'lifestyle')) {
    out.lifestyle = {
      userId,
      foodPreference: scale(a, 'l_food'),
      travelFrequency: scale(a, 'l_travel'),
      sleepSchedule: scale(a, 'l_sleep'),
      exerciseFrequency: scale(a, 'l_fitness'),
      socialActivity: scale(a, 'l_social'),
      alcoholPreference: habit(a.l_drink),
      smokingPreference: habit(a.l_smoke),
      workStyle: scale(a, 'l_work'),
      weekendStyle: scale(a, 'l_weekend'),
      spendingStyle: scale(a, 'v_money'),
    };
  }
  if (enough(a, 'personality')) {
    out.personality = {
      userId,
      communicationDirectness: scale(a, 'p_direct'),
      socialEnergy: scale(a, 'l_social'),
      independence: scale(a, 'v_space'),
      conflictAvoidance: inverse(scale(a, 'p_conflict')),
      emotionalOpenness: scale(a, 'p_open'),
      adventurePreference: scale(a, 'p_adventure'),
      routinePreference: inverse(scale(a, 'p_adventure')),
      decisionMaking: scale(a, 'p_decide'),
      affectionStyle: scale(a, 'p_affection'),
    };
    out.communication = {
      userId,
      directness: scale(a, 'p_direct'),
      frequencyPreference: scale(a, 'p_texting'),
      conflictStyle: scale(a, 'p_conflict'),
      responseExpectation: scale(a, 'p_texting'),
      emotionalOpenness: scale(a, 'p_open'),
      reassuranceNeed: scale(a, 'p_reassure'),
      affectionCommunication: scale(a, 'p_affection'),
      disagreementHandling: scale(a, 'p_disagree'),
    };
  }
  return out;
}

/** Deterministic sample answers for the mock people (same person → same answers). */
export function sampleAnswers(id: string): QuizAnswers {
  let seed = 0;
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a: QuizAnswers = {};
  for (const q of QUESTIONS) {
    if (q.kind === 'scale') {
      a[q.id] = Math.min(4, Math.max(0, Math.round(1 + rnd() * 3 - (rnd() < 0.2 ? 1 : 0))));
    } else if (q.id === 'g_children') {
      a[q.id] = rnd() < 0.7 ? 'wants_children' : rnd() < 0.8 ? 'open_to_children' : 'not_sure';
    } else if (q.id === 'g_timeline') {
      a[q.id] = q.options[Math.floor(rnd() * 3)]!.value;
    } else if (q.id === 'l_smoke') {
      a[q.id] = rnd() < 0.85 ? 'never' : 'occasionally';
    } else {
      a[q.id] = rnd() < 0.5 ? 'never' : rnd() < 0.85 ? 'occasionally' : 'regularly';
    }
  }
  return a;
}
