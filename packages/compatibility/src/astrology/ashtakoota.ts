/**
 * @file ashtakoota.ts
 * @description Implementations of the 8 Kootas for Guna Milan.
 */

import type { RashiData, NakshatraData, KootaResult, GunaMilanResult, AstroProfile } from './astrology-types';
import { getVashyaGroup } from './data/rashis';
import { getYoniScore } from './data/yoni-compatibility';
import { getPlanetaryRelationship } from './data/planetary-relationships';

const METHODOLOGY = 'v1.0.0';

export function calculateVarna(rashiA: RashiData, rashiB: RashiData): KootaResult {
    let score = 0;
    if (rashiA.varnaRank >= rashiB.varnaRank) score += 0.5;
    if (rashiB.varnaRank >= rashiA.varnaRank) score += 0.5;

    return {
        koota: 'Varna', maxPoints: 1, score,
        valueA: rashiA.varna, valueB: rashiB.varna,
        interpretation: score === 1 ? 'Excellent work compatibility' : 'Average work compatibility',
        methodologyVersion: METHODOLOGY
    };
}

export function calculateVashya(rashiA: RashiData, rashiB: RashiData, degreeA?: number, degreeB?: number): KootaResult {
    const vGroupA = getVashyaGroup(rashiA, degreeA);
    const vGroupB = getVashyaGroup(rashiB, degreeB);

    const vashyaMatrix: Record<string, Record<string, number>> = {
        'Chatushpada': { 'Chatushpada': 2, 'Manava': 1, 'Jalachara': 1, 'Vanachara': 1.5, 'Keeta': 1 },
        'Manava': { 'Chatushpada': 1, 'Manava': 2, 'Jalachara': 1.5, 'Vanachara': 0, 'Keeta': 1 },
        'Jalachara': { 'Chatushpada': 1, 'Manava': 1.5, 'Jalachara': 2, 'Vanachara': 1, 'Keeta': 1 },
        'Vanachara': { 'Chatushpada': 0, 'Manava': 0, 'Jalachara': 0, 'Vanachara': 2, 'Keeta': 0 },
        'Keeta': { 'Chatushpada': 1, 'Manava': 1, 'Jalachara': 1, 'Vanachara': 0, 'Keeta': 2 }
    };

    let score = vashyaMatrix[vGroupA]?.[vGroupB] ?? 0;
    // For gender neutral, average both directions
    let scoreReverse = vashyaMatrix[vGroupB]?.[vGroupA] ?? 0;
    let finalScore = (score + scoreReverse) / 2;

    return {
        koota: 'Vashya', maxPoints: 2, score: finalScore,
        valueA: vGroupA, valueB: vGroupB,
        interpretation: `Vashya compatibility score: ${finalScore}/2`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateTara(nakshatraA: NakshatraData, nakshatraB: NakshatraData): KootaResult {
    const diffAB = (nakshatraB.index - nakshatraA.index + 27) % 27 + 1;
    const diffBA = (nakshatraA.index - nakshatraB.index + 27) % 27 + 1;

    const taraAB = ((diffAB - 1) % 9) + 1;
    const taraBA = ((diffBA - 1) % 9) + 1;

    const inauspicious = [3, 5, 7];
    const isAuspiciousAB = !inauspicious.includes(taraAB);
    const isAuspiciousBA = !inauspicious.includes(taraBA);

    let score = 0;
    if (isAuspiciousAB && isAuspiciousBA) score = 3;
    else if (isAuspiciousAB || isAuspiciousBA) score = 1.5;

    return {
        koota: 'Tara', maxPoints: 3, score,
        valueA: nakshatraA.name, valueB: nakshatraB.name,
        interpretation: `Tara score indicates destiny alignment: ${score}/3`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateYoni(nakshatraA: NakshatraData, nakshatraB: NakshatraData): KootaResult {
    const score = getYoniScore(nakshatraA.yoniAnimal, nakshatraB.yoniAnimal);
    return {
        koota: 'Yoni', maxPoints: 4, score,
        valueA: nakshatraA.yoniAnimal, valueB: nakshatraB.yoniAnimal,
        interpretation: `Yoni (intimacy/nature) compatibility: ${score}/4`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateGrahaMaitri(rashiA: RashiData, rashiB: RashiData): KootaResult {
    const { score: scoreA } = getPlanetaryRelationship(rashiA.lord, rashiB.lord);
    const { score: scoreB } = getPlanetaryRelationship(rashiB.lord, rashiA.lord);
    
    // Exact mapping for matrix to max 5
    // Actually our Graha Maitri matrix directly gives values out of 5
    let combinedScore = (scoreA + scoreB) / 2;

    return {
        koota: 'Graha Maitri', maxPoints: 5, score: combinedScore,
        valueA: rashiA.lord, valueB: rashiB.lord,
        interpretation: `Planetary friendship (mental compatibility): ${combinedScore}/5`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateGana(nakshatraA: NakshatraData, nakshatraB: NakshatraData): KootaResult {
    const getScore = (g1: string, g2: string) => {
        if (g1 === g2) return 6;
        if (g1 === 'Deva' && g2 === 'Manushya') return 5;
        if (g1 === 'Manushya' && g2 === 'Deva') return 5;
        if (g1 === 'Deva' && g2 === 'Rakshasa') return 1;
        if (g1 === 'Rakshasa' && g2 === 'Deva') return 1;
        return 0; // Manushya + Rakshasa
    };

    const score = (getScore(nakshatraA.gana, nakshatraB.gana) + getScore(nakshatraB.gana, nakshatraA.gana)) / 2;

    return {
        koota: 'Gana', maxPoints: 6, score,
        valueA: nakshatraA.gana, valueB: nakshatraB.gana,
        interpretation: `Temperament (Gana) alignment: ${score}/6`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateBhakoot(rashiA: RashiData, rashiB: RashiData): KootaResult {
    let distance = ((rashiB.index - rashiA.index + 12) % 12) + 1;
    let reciprocal = 14 - distance;

    const pairs = [Math.min(distance, reciprocal), Math.max(distance, reciprocal)];
    let isAuspicious = (pairs[0] === 1 && pairs[1] === 13) || // 1/1
                       (pairs[0] === 1 && pairs[1] === 7) || // 1/7
                       (pairs[0] === 3 && pairs[1] === 11) || // 3/11
                       (pairs[0] === 4 && pairs[1] === 10); // 4/10
    
    let score = isAuspicious ? 7 : 0;
    
    // Cancellation
    if (!isAuspicious && rashiA.lord === rashiB.lord) {
        score = 7;
    }

    return {
        koota: 'Bhakoot', maxPoints: 7, score,
        valueA: rashiA.name, valueB: rashiB.name,
        interpretation: `Bhakoot (love/health) alignment: ${score}/7`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateNadi(nakshatraA: NakshatraData, nakshatraB: NakshatraData, rashiA: RashiData, rashiB: RashiData): KootaResult {
    let score = (nakshatraA.nadi !== nakshatraB.nadi) ? 8 : 0;

    // Cancellations
    if (score === 0) {
        if (rashiA.index === rashiB.index && nakshatraA.index !== nakshatraB.index) {
            score = 8;
        } else if (nakshatraA.index === nakshatraB.index && rashiA.index !== rashiB.index) {
            score = 8;
        }
    }

    return {
        koota: 'Nadi', maxPoints: 8, score,
        valueA: nakshatraA.nadi, valueB: nakshatraB.nadi,
        interpretation: `Nadi (genetic/spiritual) alignment: ${score}/8`,
        methodologyVersion: METHODOLOGY
    };
}

export function calculateGunaMilan(profileA: AstroProfile, profileB: AstroProfile): GunaMilanResult {
    const kootas = [
        calculateVarna(profileA.rashi, profileB.rashi),
        calculateVashya(profileA.rashi, profileB.rashi, profileA.moonLongitude, profileB.moonLongitude),
        calculateTara(profileA.nakshatra, profileB.nakshatra),
        calculateYoni(profileA.nakshatra, profileB.nakshatra),
        calculateGrahaMaitri(profileA.rashi, profileB.rashi),
        calculateGana(profileA.nakshatra, profileB.nakshatra),
        calculateBhakoot(profileA.rashi, profileB.rashi),
        calculateNadi(profileA.nakshatra, profileB.nakshatra, profileA.rashi, profileB.rashi)
    ];

    const totalScore = kootas.reduce((sum, k) => sum + k.score, 0);
    const percentage = (totalScore / 36) * 100;

    let interpretation = '';
    if (totalScore < 18) interpretation = 'Low compatibility';
    else if (totalScore < 25) interpretation = 'Average compatibility';
    else if (totalScore < 33) interpretation = 'Strong compatibility';
    else interpretation = 'Exceptional compatibility';

    return {
        kootas,
        totalScore,
        maxScore: 36,
        percentage,
        interpretation,
        methodologyVersion: METHODOLOGY
    };
}
