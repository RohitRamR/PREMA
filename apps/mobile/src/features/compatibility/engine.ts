// The app's bridge to the PREMA matching engine (@prema/compatibility).
//
// Screens never call the engine directly. They use:
//   useCompatibility(id)  → full "why you match" view for one person
//   useScoreOf()          → (id, fallback) => match %, for rings and badges
//   scoreOf(id, fallback) → same, outside React (e.g. when saving a match)
//   rankDeck(me, items)   → Discover deck: filters applied, best match first
//
// Results are cached per version of your profile, so editing your profile
// (birth details, diet, interests, Kundli preferences…) recalculates everything.
import { useMemo } from 'react';
import {
  calculateFullCompatibility,
  toCompatibilityInput,
  type FullCompatibilityOutput,
  type MatchProfile,
} from '@prema/compatibility';
import { getProfile, useProfile, type Profile } from '../../store/profile';
import { buildMyProfile, buildTheirProfile, type Mode } from './adapters';
import { toCompatView, chartOf, type CompatView, type ChartView } from './view';
import { reportError } from '../../lib/report-error';

const myProfiles = new WeakMap<Profile, Partial<Record<Mode, MatchProfile>>>();
const theirProfiles = new Map<string, Partial<Record<Mode, MatchProfile | null>>>();
const views = new WeakMap<Profile, Map<string, CompatView | null>>();

function mine(me: Profile, mode: Mode): MatchProfile {
  let entry = myProfiles.get(me);
  if (!entry) myProfiles.set(me, (entry = {}));
  return (entry[mode] ??= buildMyProfile(me, mode));
}

function theirs(id: string, mode: Mode): MatchProfile | null {
  let entry = theirProfiles.get(id);
  if (!entry) theirProfiles.set(id, (entry = {}));
  if (!(mode in entry)) entry[mode] = buildTheirProfile(id, mode);
  return entry[mode] ?? null;
}

type Run = { output: FullCompatibilityOutput; me: MatchProfile; them: MatchProfile };

function run(me: Profile, id: string, mode: Mode): Run | null {
  try {
    const them = theirs(id, mode);
    if (!them) return null;
    const my = mine(me, mode);
    return { output: calculateFullCompatibility(toCompatibilityInput(my, them)), me: my, them };
  } catch (error) {
    // Bad profile data (e.g. an impossible birth date) must never crash a screen,
    // but we still want to hear about it.
    reportError(error, { where: 'compatibility.run', personId: id, mode });
    return null;
  }
}

/** Full compatibility view between you and person `id`, or null if we have no chart for them. */
export function compatibilityFor(me: Profile, id: string | undefined): CompatView | null {
  if (!id) return null;
  let cache = views.get(me);
  if (!cache) views.set(me, (cache = new Map()));
  if (cache.has(id)) return cache.get(id)!;
  const display = run(me, id, 'display');
  const discover = run(me, id, 'discover');
  let view: CompatView | null = null;
  // An excluded pair has no detailed breakdown; screens then fall back to their stored %.
  if (display?.output.detailedBreakdown) {
    try {
      view = toCompatView(display, discover);
    } catch (error) {
      reportError(error, { where: 'compatibility.toCompatView', personId: id });
      view = null;
    }
  }
  cache.set(id, view);
  return view;
}

export function useCompatibility(id: string | undefined): CompatView | null {
  const me = useProfile();
  return useMemo(() => compatibilityFor(me, id), [me, id]);
}

/** Match % for rings and badges; `fallback` is used when no chart exists yet. */
export function scoreOf(id: string, fallback: number): number {
  return compatibilityFor(getProfile(), id)?.score ?? fallback;
}

export function useScoreOf(): (id: string, fallback: number) => number {
  const me = useProfile();
  return useMemo(() => (id: string, fallback: number) => compatibilityFor(me, id)?.score ?? fallback, [me]);
}

/**
 * Discover deck: drops people your filters or dealbreakers exclude, uses the
 * engine's score, and puts the best match first. People without a chart keep
 * their place at the end with their existing score.
 */
export function rankDeck<T extends { id: string; match: number }>(me: Profile, items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index, view: compatibilityFor(me, item.id) }))
    .filter(({ view }) => !view || view.eligible)
    .map(({ item, index, view }) => ({ item: view ? { ...item, match: view.score } : item, index, ranked: !!view }))
    .sort((a, b) => Number(b.ranked) - Number(a.ranked) || b.item.match - a.item.match || a.index - b.index)
    .map(({ item }) => item);
}

export function useRankedDeck<T extends { id: string; match: number }>(items: T[]): T[] {
  const me = useProfile();
  return useMemo(() => rankDeck(me, items), [me, items]);
}

/** Your own Kundli summary (moon sign, nakshatra, Lagna, Manglik…), or null if your birth date is invalid. */
export function myChartFor(me: Profile): ChartView | null {
  try {
    return chartOf(mine(me, 'display'));
  } catch (error) {
    reportError(error, { where: 'compatibility.myChart' });
    return null;
  }
}

export function useMyChart(): ChartView | null {
  const me = useProfile();
  return useMemo(() => myChartFor(me), [me]);
}
