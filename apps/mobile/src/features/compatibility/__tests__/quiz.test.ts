import { beforeEach, describe, expect, it } from 'vitest';
import { QUESTIONS, QUESTION_COUNT, answeredCount, quizToProfiles, sampleAnswers, type QuizAnswers } from '../quiz';
import { compatibilityFor, rankDeck } from '..';
import { getProfile, updateProfile, type Profile } from '../../../store/profile';
import { SAMPLE_BIRTHS } from '../sample-births';

const BASE: Profile = getProfile();
beforeEach(() => updateProfile(BASE));

const all = (pick: (i: number) => number): QuizAnswers =>
  Object.fromEntries(QUESTIONS.map((q, i) => [q.id, q.kind === 'scale' ? pick(i) : q.options[0]!.value]));

describe('quiz → engine profiles', () => {
  it('has 30 unique questions', () => {
    expect(QUESTION_COUNT).toBe(30);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(30);
  });

  it('an empty quiz adds no questionnaire layers', () => {
    const p = quizToProfiles('x', {}, 'long_term');
    expect(p.goals ?? p.values ?? p.lifestyle ?? p.personality ?? p.communication).toBeUndefined();
  });

  it('a section counts once half of it is answered', () => {
    const a: QuizAnswers = { g_timeline: 'within_2_3_years', g_children: 'wants_children' };
    expect(quizToProfiles('x', a, 'long_term').goals).toBeUndefined();
    a.g_family = 3;
    expect(quizToProfiles('x', a, 'long_term').goals?.familyInvolvement).toBe(0.75);
  });

  it('maps every answer into 0–1 values (or NaN for skipped questions)', () => {
    const p = quizToProfiles('x', all(() => 4), 'marriage_oriented');
    for (const prof of [p.values, p.lifestyle, p.personality, p.communication]) {
      for (const [k, v] of Object.entries(prof!)) {
        if (typeof v === 'number') expect(v, k).toBeGreaterThanOrEqual(0);
        if (typeof v === 'number') expect(v, k).toBeLessThanOrEqual(1);
      }
    }
    expect(p.personality!.routinePreference).toBe(0); // inverse of "spontaneous" = 4
    expect(p.smoking).toBe('never');
  });

  it('counts answers and ignores junk values', () => {
    expect(answeredCount({ g_family: 2, l_smoke: 'never', g_relocate: 9, p_open: 'x' })).toBe(2);
  });

  it('sample answers are deterministic and complete', () => {
    expect(sampleAnswers('meera')).toEqual(sampleAnswers('meera'));
    expect(answeredCount(sampleAnswers('meera'))).toBe(30);
  });
});

describe('quiz and must-haves in the app', () => {
  it('answering the quiz turns on the everyday layers and raises confidence', () => {
    const before = compatibilityFor(getProfile(), 'priya')!;
    expect(before.everyday.some((p) => p.key === 'values')).toBe(false);
    updateProfile({ answers: all((i) => i % 5) });
    const after = compatibilityFor(getProfile(), 'priya')!;
    for (const k of ['relationshipGoals', 'values', 'lifestyle', 'communication', 'personality']) {
      expect(after.everyday.some((p) => p.key === k), k).toBe(true);
    }
    expect(['moderate', 'strong']).toContain(after.confidence);
  });

  it('must-haves hide people from Discover but never change their %', () => {
    const ids = Object.keys(SAMPLE_BIRTHS);
    const deck = (p: Profile) => rankDeck(p, ids.map((id) => ({ id, match: 0 }))).map((d) => d.id);
    const open = deck(getProfile());
    const scoreBefore = compatibilityFor(getProfile(), 'kavya')!.score;

    updateProfile({ discovery: { ...BASE.discovery, mustHaves: { vegetarianOnly: true, nonSmokersOnly: true, nonDrinkersOnly: false, sameReligionOnly: true } } });
    const strict = deck(getProfile());
    expect(strict.length).toBeLessThan(open.length);
    for (const id of strict) {
      expect(['vegetarian', 'vegan', 'jain']).toContain(SAMPLE_BIRTHS[id]!.diet);
      expect(SAMPLE_BIRTHS[id]!.religion).toBe('Hindu');
      expect(sampleAnswers(id).l_smoke).toBe('never');
    }
    expect(strict).not.toContain('kavya'); // non-vegetarian
    expect(compatibilityFor(getProfile(), 'kavya')!.score).toBe(scoreBefore);
    expect(compatibilityFor(getProfile(), 'kavya')!.excludedReasons.join(' ')).toMatch(/Diet/);
  });
});
