/**
 * @file yoni-compatibility.ts
 * @description Yoni (animal) compatibility matrix for Yoni Koota scoring.
 */

import type { YoniAnimal } from '../astrology-types';

export const YONI_ENEMY_PAIRS: Array<[YoniAnimal, YoniAnimal]> = [
    ['Horse', 'Buffalo'],
    ['Elephant', 'Lion'],
    ['Sheep', 'Monkey'],
    ['Serpent', 'Mongoose'],
    ['Dog', 'Deer'],
    ['Cat', 'Rat'],
    ['Cow', 'Tiger']
];

export const YONI_COMPATIBILITY_MATRIX: Record<YoniAnimal, Record<YoniAnimal, number>> = {} as any;

const animals: YoniAnimal[] = [
    'Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 
    'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'
];

// Initialize matrix with 2 (neutral default)
for (const a of animals) {
    YONI_COMPATIBILITY_MATRIX[a] = {} as any;
    for (const b of animals) {
        YONI_COMPATIBILITY_MATRIX[a][b] = 2;
    }
}

// Self is 4
for (const a of animals) {
    YONI_COMPATIBILITY_MATRIX[a][a] = 4;
}

// Enemies are 0
for (const pair of YONI_ENEMY_PAIRS) {
    YONI_COMPATIBILITY_MATRIX[pair[0]][pair[1]] = 0;
    YONI_COMPATIBILITY_MATRIX[pair[1]][pair[0]] = 0;
}

// Some friendly pairs (3) based on standard Vedic defaults (approximated here)
const friendlyPairs: Array<[YoniAnimal, YoniAnimal]> = [
    ['Horse', 'Elephant'], ['Monkey', 'Elephant'],
    ['Deer', 'Cow'], ['Dog', 'Cat'],
    ['Rat', 'Mongoose'], ['Lion', 'Tiger']
];

for (const pair of friendlyPairs) {
    YONI_COMPATIBILITY_MATRIX[pair[0]][pair[1]] = 3;
    YONI_COMPATIBILITY_MATRIX[pair[1]][pair[0]] = 3;
}

/**
 * Returns Yoni Koota score for two animals.
 */
export function getYoniScore(animalA: YoniAnimal, animalB: YoniAnimal): number {
    return YONI_COMPATIBILITY_MATRIX[animalA]?.[animalB] ?? 2;
}
