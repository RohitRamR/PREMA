/**
 * @file planetary-relationships.ts
 * @description Data and logic for Graha Maitri (Planetary Friendship) koota.
 */

import type { Planet } from '../astrology-types';

export const GRAHA_MAITRI_MATRIX: Record<Planet, Record<Planet, number>> = {
    Sun: { Sun: 5, Moon: 5, Mars: 5, Mercury: 4, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Moon: { Sun: 5, Moon: 5, Mars: 4, Mercury: 1, Jupiter: 4, Venus: 0.5, Saturn: 0.5, Rahu: 0, Ketu: 0 },
    Mars: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 3, Saturn: 0.5, Rahu: 0, Ketu: 0 },
    Mercury: { Sun: 4, Moon: 1, Mars: 0.5, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 4, Rahu: 0, Ketu: 0 },
    Jupiter: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 0.5, Saturn: 3, Rahu: 0, Ketu: 0 },
    Venus: { Sun: 0, Moon: 0.5, Mars: 3, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 5, Rahu: 0, Ketu: 0 },
    Saturn: { Sun: 0, Moon: 0.5, Mars: 0.5, Mercury: 4, Jupiter: 3, Venus: 5, Saturn: 5, Rahu: 0, Ketu: 0 },
    Rahu: { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Ketu: { Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 }
};

/**
 * Returns relationship details between two planets.
 */
export function getPlanetaryRelationship(planetA: Planet, planetB: Planet): { score: number, relationship: 'friend' | 'neutral' | 'enemy' } {
    if (planetA === 'Rahu' || planetA === 'Ketu' || planetB === 'Rahu' || planetB === 'Ketu') {
        return { score: 0, relationship: 'enemy' }; // Simplifying Rahu/Ketu for baseline
    }
    const scoreA = GRAHA_MAITRI_MATRIX[planetA][planetB] ?? 0;
    const scoreB = GRAHA_MAITRI_MATRIX[planetB][planetA] ?? 0;
    
    // In Graha Maitri, the overall score is often drawn from a specific symmetric table based on lord pairs.
    // Assuming the user's provided matrix represents exact pair combinations mapped (Sun row = lord of A, Col = lord of B).
    const score = GRAHA_MAITRI_MATRIX[planetA][planetB] ?? 0;
    
    let relationship: 'friend' | 'neutral' | 'enemy';
    if (score >= 4) relationship = 'friend';
    else if (score >= 2) relationship = 'neutral';
    else relationship = 'enemy';
    
    return { score, relationship };
}
