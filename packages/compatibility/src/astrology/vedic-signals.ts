/**
 * @file vedic-signals.ts
 * @description Generates additional astrological compatibility signals.
 */

import type { AstroProfile, VedicSignal } from './astrology-types';
import { getPlanetaryRelationship } from './data/planetary-relationships';

const METHODOLOGY = 'v1.0.0';

export function calculateRashiRelationship(profileA: AstroProfile, profileB: AstroProfile): VedicSignal {
    const rel = getPlanetaryRelationship(profileA.rashi.lord, profileB.rashi.lord);
    
    let result: VedicSignal['result'] = 'neutral';
    if (rel.score >= 4) result = 'strong';
    else if (rel.score <= 1) result = 'weak';
    
    return {
        signal: 'Rashi Lord Friendship',
        valueA: profileA.rashi.lord,
        valueB: profileB.rashi.lord,
        result,
        interpretation: `Rashi lords share a ${rel.relationship} relationship.`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateElementCompatibility(profileA: AstroProfile, profileB: AstroProfile): VedicSignal {
    const elA = profileA.rashi.element;
    const elB = profileB.rashi.element;

    let result: VedicSignal['result'] = 'neutral';
    let interpretation = '';

    if (elA === elB) {
        result = 'strong';
        interpretation = 'Both share the same element, indicating deep innate understanding.';
    } else if ((elA === 'Fire' && elB === 'Air') || (elA === 'Air' && elB === 'Fire')) {
        result = 'strong';
        interpretation = 'Fire and Air are highly complementary elements.';
    } else if ((elA === 'Earth' && elB === 'Water') || (elA === 'Water' && elB === 'Earth')) {
        result = 'strong';
        interpretation = 'Earth and Water nourish each other wonderfully.';
    } else if ((elA === 'Fire' && elB === 'Water') || (elA === 'Water' && elB === 'Fire')) {
        result = 'weak';
        interpretation = 'Fire and Water have inherently contrasting natures.';
    } else {
        interpretation = 'Elements are mildly different but manageable.';
    }

    return {
        signal: 'Elemental Balance',
        valueA: elA,
        valueB: elB,
        result,
        interpretation,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateNakshatraCompatibility(profileA: AstroProfile, profileB: AstroProfile): VedicSignal {
    const nA = profileA.nakshatra;
    const nB = profileB.nakshatra;

    let result: VedicSignal['result'] = 'neutral';
    let interpretation = 'Different nakshatras, standard dynamics.';

    if (nA.index === nB.index) {
        result = 'strong';
        interpretation = 'Sharing the same Nakshatra creates profound psychic bonding (ensure Nadi dosha is checked).';
    } else if (nA.lord === nB.lord) {
        result = 'moderate';
        interpretation = 'Sharing the same Nakshatra lord brings similar emotional processing styles.';
    }

    return {
        signal: 'Nakshatra Alignment',
        valueA: nA.name,
        valueB: nB.name,
        result,
        interpretation,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateAllVedicSignals(profileA: AstroProfile, profileB: AstroProfile): VedicSignal[] {
    return [
        calculateRashiRelationship(profileA, profileB),
        calculateElementCompatibility(profileA, profileB),
        calculateNakshatraCompatibility(profileA, profileB)
    ];
}
