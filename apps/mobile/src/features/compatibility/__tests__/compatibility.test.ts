// Regression tests for the app's bridge to the matching engine.
// Run: npm test (from apps/mobile)
import { describe, expect, it, beforeEach } from 'vitest';
import { compatibilityFor, rankDeck, parseHeightCm, parseDiet, parseEducation, parseIntention } from '..';
import { getProfile, updateProfile, INTENT_OPTIONS, type Profile } from '../../../store/profile';
import { SAMPLE_BIRTHS } from '../sample-births';

const IDS = Object.keys(SAMPLE_BIRTHS);
const BASE: Profile = getProfile();

beforeEach(() => updateProfile(BASE));

const VARIANTS: Array<[string, Partial<Profile>]> = [
  ['default profile', {}],
  ['paused profile', { paused: true }],
  ...INTENT_OPTIONS.map((intent): [string, Partial<Profile>] => [`intent: ${intent}`, { intent }]),
  ['casual intent (conflicts with marriage-minded people)', { intent: 'Something casual' }],
  ['no birth time', { birth: { ...BASE.birth, time: '' } }],
  ['impossible birth date', { birth: { ...BASE.birth, date: '1998-02-30' } }],
  ['no birthplace coordinates', { birth: { date: BASE.birth.date, time: BASE.birth.time, place: '' } }],
  ['interested in men', { interestedIn: ['male'] }],
  ['both Kundli switches on', { discovery: { ...BASE.discovery, kundli: { minGuna18: true, avoidManglikMismatch: true } } }],
  ['empty vitals', { vitals: { height: '', religion: '', languages: '', education: '', diet: '', family: '' } }],
];

describe('compatibilityFor never crashes a screen', () => {
  it.each(VARIANTS)('%s', (_name, patch) => {
    updateProfile(patch);
    for (const id of [...IDS, 'not-a-person', '']) {
      const view = compatibilityFor(getProfile(), id);
      if (view) {
        expect(Number.isInteger(view.score)).toBe(true);
        expect(view.score).toBeGreaterThanOrEqual(0);
        expect(view.score).toBeLessThanOrEqual(100);
        expect(view.guna.kootas).toHaveLength(8);
        expect(view.guna.total).toBeLessThanOrEqual(36);
      }
    }
  });
});

describe('score vs discover', () => {
  it('a paused profile still sees scores, but is hidden from the deck', () => {
    updateProfile({ paused: true });
    const v = compatibilityFor(getProfile(), 'ananya');
    expect(v).not.toBeNull();
    expect(v!.eligible).toBe(false);
    expect(v!.excludedReasons.join(' ')).toMatch(/Inactive/);
    expect(rankDeck(getProfile(), [{ id: 'ananya', match: 96 }])).toEqual([]);
  });

  it('a conflicting intent keeps the % but explains why they are hidden', () => {
    updateProfile({ intent: 'Something casual' });
    const v = compatibilityFor(getProfile(), 'kavya')!;
    expect(v.score).toBeGreaterThan(0);
    expect(v.eligible).toBe(false);
    expect(v.excludedReasons.join(' ')).toMatch(/intention/i);
  });

  it('the deck is sorted best match first and only shows eligible people', () => {
    const deck = rankDeck(getProfile(), IDS.map((id) => ({ id, match: 0 })));
    for (let i = 1; i < deck.length; i++) expect(deck[i - 1]!.match).toBeGreaterThanOrEqual(deck[i]!.match);
    for (const d of deck) expect(compatibilityFor(getProfile(), d.id)!.eligible).toBe(true);
  });

  it('editing your profile recalculates scores', () => {
    const before = compatibilityFor(getProfile(), 'meera')!.score;
    updateProfile({ birth: { ...BASE.birth, date: '1995-08-01' } });
    const after = compatibilityFor(getProfile(), 'meera')!.score;
    expect(after).not.toBe(before);
  });
});

describe('profile text parsers', () => {
  it('reads heights, diets, education and intent written the way people type them', () => {
    expect(parseHeightCm('5′11″')).toBe(180);
    expect(parseHeightCm("5'4\"")).toBe(163);
    expect(parseHeightCm('172 cm')).toBe(172);
    expect(parseHeightCm('')).toBeUndefined();
    expect(parseDiet('Non-veg')).toBe('non_vegetarian');
    expect(parseDiet('Pure Jain')).toBe('jain');
    expect(parseDiet('Eggetarian')).toBe('eggetarian');
    expect(parseEducation('B.Arch, CEPT')).toBe('bachelors');
    expect(parseEducation('MBA, IIM')).toBe('masters');
    expect(parseEducation('PhD')).toBe('doctorate');
    expect(parseIntention('Marriage within 1–2 years')).toBe('marriage_oriented');
    expect(parseIntention('Taking it slow')).toBe('open_to_either');
  });
});

describe('Cosmo & Heart ratings', () => {
  it('are bounded, carry a friendly line, and Cosmo follows the stars', () => {
    for (const id of IDS) {
      const v = compatibilityFor(getProfile(), id);
      if (!v) continue;
      for (const r of [v.ratings.cosmo, v.ratings.heart]) {
        if (!r) continue;
        expect(r.value).toBeGreaterThanOrEqual(0);
        expect(r.value).toBeLessThanOrEqual(100);
        expect(r.line.length).toBeGreaterThan(0);
      }
      const stars = v.stars.map((p) => p.value);
      expect(v.ratings.cosmo.value).toBeGreaterThanOrEqual(Math.min(...stars));
      expect(v.ratings.cosmo.value).toBeLessThanOrEqual(Math.max(...stars));
    }
  });
});
