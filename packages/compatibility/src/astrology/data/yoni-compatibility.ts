/**
 * @file yoni-compatibility.ts
 * @description Yoni Koota (4 points) — the classical 14×14 animal table.
 *
 * Source: the Yoni table implemented in Maitreya (open-source Vedic software),
 * as published at saravali.github.io/astrology/koota_yoni.html.
 * Rows = bride's yoni, columns = groom's yoni. The table is very slightly
 * asymmetric (e.g. Deer-bride/Horse-groom = 1, Horse-bride/Deer-groom = 3).
 * Same animal = 4, the seven sworn-enemy pairs = 0.
 */

import type { YoniAnimal } from '../astrology-types';

export const YONI_ORDER: YoniAnimal[] = [
    'Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat',
    'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion',
];

// prettier-ignore
const YONI_TABLE: number[][] = [
    //Ho El Sh Se Do Ca Ra Co Bu Ti De Mo Mn Li   ← groom
    [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1], // Horse    (bride)
    [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], // Elephant
    [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1], // Sheep
    [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], // Serpent
    [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], // Dog
    [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1], // Cat
    [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], // Rat
    [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], // Cow
    [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1], // Buffalo
    [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], // Tiger
    [1, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], // Deer
    [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2], // Monkey
    [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2], // Mongoose
    [1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 4], // Lion
];

export const YONI_ENEMY_PAIRS: Array<[YoniAnimal, YoniAnimal]> = [
    ['Horse', 'Buffalo'],
    ['Elephant', 'Lion'],
    ['Sheep', 'Monkey'],
    ['Serpent', 'Mongoose'],
    ['Dog', 'Deer'],
    ['Cat', 'Rat'],
    ['Cow', 'Tiger'],
];

/** Bride-row / groom-column Yoni points (0–4). */
export function getYoniScoreDirected(brideAnimal: YoniAnimal, groomAnimal: YoniAnimal): number {
    const r = YONI_ORDER.indexOf(brideAnimal);
    const c = YONI_ORDER.indexOf(groomAnimal);
    if (r < 0 || c < 0) throw new RangeError(`Unknown yoni animal: ${brideAnimal} / ${groomAnimal}`);
    return YONI_TABLE[r]![c]!;
}

/** Orientation-free Yoni points: average of both directions (for same-gender pairs). */
export function getYoniScore(animalA: YoniAnimal, animalB: YoniAnimal): number {
    return (getYoniScoreDirected(animalA, animalB) + getYoniScoreDirected(animalB, animalA)) / 2;
}
