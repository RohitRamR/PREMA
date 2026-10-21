/**
 * @file planetary-relationships.ts
 * @description Natural (naisargika) planetary friendships and the Graha Maitri
 * Koota table (5 points) derived from them.
 *
 * Graha Maitri points from the two one-way relationships:
 *   friend+friend 5 · friend+neutral 4 · neutral+neutral 3
 *   friend+enemy 1  · neutral+enemy 0.5 · enemy+enemy 0
 * This reproduces the standard table printed by mainstream Kundli software.
 */

import type { Planet } from '../astrology-types';

export type Relationship = 'friend' | 'neutral' | 'enemy';

type Graha = Exclude<Planet, 'Rahu' | 'Ketu'>;

/** How the ROW planet regards the COLUMN planet (Brihat Parashara Hora Shastra). */
export const NATURAL_RELATIONSHIPS: Record<Graha, { friends: Graha[]; neutrals: Graha[]; enemies: Graha[] }> = {
    Sun:     { friends: ['Moon', 'Mars', 'Jupiter'],     neutrals: ['Mercury'],                    enemies: ['Venus', 'Saturn'] },
    Moon:    { friends: ['Sun', 'Mercury'],              neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
    Mars:    { friends: ['Sun', 'Moon', 'Jupiter'],      neutrals: ['Venus', 'Saturn'],            enemies: ['Mercury'] },
    Mercury: { friends: ['Sun', 'Venus'],                neutrals: ['Mars', 'Jupiter', 'Saturn'],  enemies: ['Moon'] },
    Jupiter: { friends: ['Sun', 'Moon', 'Mars'],         neutrals: ['Saturn'],                     enemies: ['Mercury', 'Venus'] },
    Venus:   { friends: ['Mercury', 'Saturn'],           neutrals: ['Mars', 'Jupiter'],            enemies: ['Sun', 'Moon'] },
    Saturn:  { friends: ['Mercury', 'Venus'],            neutrals: ['Jupiter'],                    enemies: ['Sun', 'Moon', 'Mars'] },
};

const GRAHAS = Object.keys(NATURAL_RELATIONSHIPS) as Graha[];

function isGraha(p: Planet): p is Graha {
    return (GRAHAS as Planet[]).includes(p);
}

/** One-way natural relationship: how `from` regards `to`. */
export function getOneWayRelationship(from: Planet, to: Planet): Relationship {
    if (!isGraha(from) || !isGraha(to)) return 'neutral';
    if (from === to) return 'friend';
    const rel = NATURAL_RELATIONSHIPS[from];
    if (rel.friends.includes(to)) return 'friend';
    if (rel.enemies.includes(to)) return 'enemy';
    return 'neutral';
}

const PAIR_POINTS: Record<string, number> = {
    'friend+friend': 5,
    'friend+neutral': 4,
    'neutral+neutral': 3,
    'enemy+friend': 1,
    'enemy+neutral': 0.5,
    'enemy+enemy': 0,
};

/** Graha Maitri points (0–5) between two Rashi lords. Symmetric. */
export function getGrahaMaitriPoints(lordA: Planet, lordB: Planet): number {
    const key = [getOneWayRelationship(lordA, lordB), getOneWayRelationship(lordB, lordA)].sort().join('+');
    return PAIR_POINTS[key]!;
}

/** Full 7×7 Graha Maitri table, derived (never hand-typed). */
export const GRAHA_MAITRI_MATRIX: Record<Graha, Record<Graha, number>> = Object.fromEntries(
    GRAHAS.map((a) => [a, Object.fromEntries(GRAHAS.map((b) => [b, getGrahaMaitriPoints(a, b)]))])
) as Record<Graha, Record<Graha, number>>;

/**
 * Combined relationship between two planets plus Graha Maitri points.
 * 'friend' when points ≥ 4, 'enemy' when points ≤ 1, otherwise 'neutral'.
 */
export function getPlanetaryRelationship(planetA: Planet, planetB: Planet): { score: number; relationship: Relationship } {
    const score = getGrahaMaitriPoints(planetA, planetB);
    const relationship: Relationship = score >= 4 ? 'friend' : score <= 1 ? 'enemy' : 'neutral';
    return { score, relationship };
}

/** True when the two lords are the same planet or MUTUAL natural friends. */
export function areLordsFriendly(lordA: Planet, lordB: Planet): boolean {
    return lordA === lordB || getGrahaMaitriPoints(lordA, lordB) === 5;
}
