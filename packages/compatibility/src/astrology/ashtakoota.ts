/**
 * @file ashtakoota.ts
 * @description Ashtakoota Guna Milan — the 8 kootas, 36 points.
 *
 * Classical tables are directional (bride vs groom). For a man–woman pair the
 * woman is the bride; for same-gender or unspecified pairs both orientations
 * are computed and averaged, so the result is symmetric.
 *
 * `totalScore` is the classical total (what any Kundli calculator prints).
 * `effectiveScore` additionally restores HALF the points of Nadi / Bhakoot
 * doshas cancelled by classical exceptions; PREMA's match score uses it.
 */

import type {
    RashiData, NakshatraData, KootaResult, GunaMilanResult, AstroProfile,
    VashyaGroup, GanaType, GunaMilanOptions,
} from './astrology-types';
import { getVashyaGroup } from './data/rashis';
import { getYoniScoreDirected } from './data/yoni-compatibility';
import { getGrahaMaitriPoints, areLordsFriendly } from './data/planetary-relationships';

const METHODOLOGY = 'ashtakoota_v2';

// ---------------------------------------------------------------------------
// Orientation helpers
// ---------------------------------------------------------------------------

export function normalizeGender(g?: string): 'male' | 'female' | null {
    if (!g) return null;
    const v = g.trim().toLowerCase();
    if (['male', 'man', 'men', 'm', 'boy', 'groom'].includes(v)) return 'male';
    if (['female', 'woman', 'women', 'f', 'girl', 'bride'].includes(v)) return 'female';
    return null;
}

export function resolveOrientation(genderA?: string, genderB?: string): GunaMilanResult['orientation'] {
    const a = normalizeGender(genderA);
    const b = normalizeGender(genderB);
    if (a === 'female' && b === 'male') return 'A_bride';
    if (a === 'male' && b === 'female') return 'A_groom';
    return 'neutral';
}

/** Applies a bride/groom-directed scorer according to the orientation. */
function directed<T>(
    a: T, b: T,
    orientation: GunaMilanResult['orientation'],
    fn: (bride: T, groom: T) => number
): number {
    if (orientation === 'A_bride') return fn(a, b);
    if (orientation === 'A_groom') return fn(b, a);
    return (fn(a, b) + fn(b, a)) / 2;
}

// ---------------------------------------------------------------------------
// 1. Varna (1)
// ---------------------------------------------------------------------------

function varnaDirected(bride: RashiData, groom: RashiData): number {
    return groom.varnaRank >= bride.varnaRank ? 1 : 0;
}

export function calculateVarna(rashiA: RashiData, rashiB: RashiData, orientation: GunaMilanResult['orientation'] = 'neutral'): KootaResult {
    const score = directed(rashiA, rashiB, orientation, varnaDirected);
    return {
        koota: 'Varna', maxPoints: 1, score,
        valueA: rashiA.varna, valueB: rashiB.varna,
        interpretation: score === 1 ? 'Spiritual and work temperaments sit well together.' : score > 0 ? 'Partly aligned spiritual temperaments.' : 'Different spiritual temperaments.',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 2. Vashya (2) — rows = bride, columns = groom (OnlineJyotish table)
// ---------------------------------------------------------------------------

const VASHYA_ORDER: VashyaGroup[] = ['Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Keeta'];
// prettier-ignore
const VASHYA_TABLE: number[][] = [
    // Cha Man  Jal  Van Kee   ← groom
    [2,   1,   1,   0,  1], // Chatushpada (bride)
    [1,   2,   0.5, 0,  1], // Manava
    [1,   0.5, 2,   1,  1], // Jalachara
    [0,   0,   1,   2,  0], // Vanachara
    [1,   0,   1,   0,  2], // Keeta
];

export function getVashyaPointsDirected(bride: VashyaGroup, groom: VashyaGroup): number {
    return VASHYA_TABLE[VASHYA_ORDER.indexOf(bride)]![VASHYA_ORDER.indexOf(groom)]!;
}

export function calculateVashya(
    rashiA: RashiData, rashiB: RashiData,
    degreeA?: number, degreeB?: number,
    orientation: GunaMilanResult['orientation'] = 'neutral'
): KootaResult {
    const vA = getVashyaGroup(rashiA, degreeA);
    const vB = getVashyaGroup(rashiB, degreeB);
    const score = directed(vA, vB, orientation, getVashyaPointsDirected);
    return {
        koota: 'Vashya', maxPoints: 2, score,
        valueA: vA, valueB: vB,
        interpretation: score >= 2 ? 'Strong natural mutual attraction.' : score >= 1 ? 'Healthy mutual influence.' : 'Little natural pull — attraction builds slowly.',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 3. Tara (3)
// ---------------------------------------------------------------------------

/** Tara number (1–9) counting inclusively from `from` to `to`. */
export function taraNumber(from: NakshatraData, to: NakshatraData): number {
    const count = ((to.index - from.index + 27) % 27) + 1; // 1..27
    const rem = count % 9;
    return rem === 0 ? 9 : rem;
}

const INAUSPICIOUS_TARAS = [3, 5, 7]; // Vipat, Pratyak, Naidhana

export function calculateTara(nakshatraA: NakshatraData, nakshatraB: NakshatraData): KootaResult {
    const ab = taraNumber(nakshatraA, nakshatraB);
    const ba = taraNumber(nakshatraB, nakshatraA);
    const score = (INAUSPICIOUS_TARAS.includes(ab) ? 0 : 1.5) + (INAUSPICIOUS_TARAS.includes(ba) ? 0 : 1.5);
    return {
        koota: 'Tara', maxPoints: 3, score,
        valueA: nakshatraA.name, valueB: nakshatraB.name,
        interpretation: score === 3 ? 'Birth stars support each other’s well-being.' : score > 0 ? 'Birth stars are partly supportive.' : 'Birth stars are mutually challenging.',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 4. Yoni (4)
// ---------------------------------------------------------------------------

export function calculateYoni(nakshatraA: NakshatraData, nakshatraB: NakshatraData, orientation: GunaMilanResult['orientation'] = 'neutral'): KootaResult {
    const score = directed(nakshatraA.yoniAnimal, nakshatraB.yoniAnimal, orientation, getYoniScoreDirected);
    return {
        koota: 'Yoni', maxPoints: 4, score,
        valueA: nakshatraA.yoniAnimal, valueB: nakshatraB.yoniAnimal,
        interpretation: score >= 3 ? 'Strong physical and instinctive compatibility.' : score >= 2 ? 'Comfortable physical compatibility.' : score > 0 ? 'Instinctive natures differ.' : 'Natural rivals in instinct (Yoni enemies).',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 5. Graha Maitri (5)
// ---------------------------------------------------------------------------

export function calculateGrahaMaitri(rashiA: RashiData, rashiB: RashiData): KootaResult {
    const score = getGrahaMaitriPoints(rashiA.lord, rashiB.lord);
    return {
        koota: 'Graha Maitri', maxPoints: 5, score,
        valueA: rashiA.lord, valueB: rashiB.lord,
        interpretation: score >= 4 ? 'Moon-sign lords are friends — easy mental rapport.' : score >= 3 ? 'Neutral lords — rapport grows with effort.' : 'Moon-sign lords are at odds — different outlooks.',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 6. Gana (6) — rows = bride, columns = groom (OnlineJyotish table)
// ---------------------------------------------------------------------------

const GANA_ORDER: GanaType[] = ['Deva', 'Manushya', 'Rakshasa'];
// prettier-ignore
const GANA_TABLE: number[][] = [
    // Dev Man Rak   ← groom
    [6, 6, 0], // Deva (bride)
    [5, 6, 0], // Manushya
    [1, 0, 6], // Rakshasa
];

export function getGanaPointsDirected(bride: GanaType, groom: GanaType): number {
    return GANA_TABLE[GANA_ORDER.indexOf(bride)]![GANA_ORDER.indexOf(groom)]!;
}

export function calculateGana(nakshatraA: NakshatraData, nakshatraB: NakshatraData, orientation: GunaMilanResult['orientation'] = 'neutral'): KootaResult {
    const score = directed(nakshatraA.gana, nakshatraB.gana, orientation, getGanaPointsDirected);
    const hasDosha = score <= 1;
    return {
        koota: 'Gana', maxPoints: 6, score,
        valueA: nakshatraA.gana, valueB: nakshatraB.gana,
        hasDosha,
        interpretation: score >= 5 ? 'Temperaments are in harmony.' : hasDosha ? 'Very different temperaments (Gana dosha).' : 'Temperaments differ somewhat.',
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 7. Bhakoot (7)
// ---------------------------------------------------------------------------

/** Inclusive count from sign A to sign B (1–12). */
export function signDistance(from: RashiData, to: RashiData): number {
    return ((to.index - from.index + 12) % 12) + 1;
}

const BHAKOOT_DOSHA_DISTANCES = new Set([2, 12, 5, 9, 6, 8]);

export function calculateBhakoot(rashiA: RashiData, rashiB: RashiData): KootaResult {
    const ab = signDistance(rashiA, rashiB);
    const ba = signDistance(rashiB, rashiA);
    const hasDosha = BHAKOOT_DOSHA_DISTANCES.has(ab);
    const score = hasDosha ? 0 : 7;

    let doshaCancelled = false;
    let cancellationReason: string | undefined;
    if (hasDosha) {
        if (rashiA.lord === rashiB.lord) {
            doshaCancelled = true;
            cancellationReason = `Both Moon signs are ruled by ${rashiA.lord}.`;
        } else if (areLordsFriendly(rashiA.lord, rashiB.lord)) {
            doshaCancelled = true;
            cancellationReason = `Moon-sign lords ${rashiA.lord} and ${rashiB.lord} are mutual friends.`;
        }
    }

    const pairLabel = `${Math.min(ab, ba)}/${Math.max(ab, ba)}`;
    return {
        koota: 'Bhakoot', maxPoints: 7, score,
        valueA: rashiA.name, valueB: rashiB.name,
        hasDosha, doshaCancelled, cancellationReason,
        interpretation: !hasDosha
            ? `Moon signs sit ${pairLabel} — supportive for love, family and prosperity.`
            : doshaCancelled
                ? `Bhakoot dosha (${pairLabel}) is cancelled: ${cancellationReason}`
                : `Bhakoot dosha (${pairLabel}) — emotional and financial rhythms may clash.`,
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// 8. Nadi (8)
// ---------------------------------------------------------------------------

export function calculateNadi(
    nakshatraA: NakshatraData, nakshatraB: NakshatraData,
    rashiA: RashiData, rashiB: RashiData,
    padaA?: number, padaB?: number
): KootaResult {
    const hasDosha = nakshatraA.nadi === nakshatraB.nadi;
    const score = hasDosha ? 0 : 8;

    let doshaCancelled = false;
    let cancellationReason: string | undefined;
    if (hasDosha) {
        const sameNak = nakshatraA.index === nakshatraB.index;
        const sameRashi = rashiA.index === rashiB.index;
        if (sameRashi && !sameNak) {
            doshaCancelled = true;
            cancellationReason = 'Same Moon sign but different nakshatras.';
        } else if (sameNak && !sameRashi) {
            doshaCancelled = true;
            cancellationReason = 'Same nakshatra but different Moon signs.';
        } else if (sameNak && padaA !== undefined && padaB !== undefined && padaA !== padaB) {
            doshaCancelled = true;
            cancellationReason = 'Same nakshatra but different padas.';
        }
        // Note: the looser "friendly Moon-sign lords" exception is deliberately
        // NOT applied to Nadi (it is a Bhakoot exception in most traditions).
    }

    return {
        koota: 'Nadi', maxPoints: 8, score,
        valueA: nakshatraA.nadi, valueB: nakshatraB.nadi,
        hasDosha, doshaCancelled, cancellationReason,
        interpretation: !hasDosha
            ? 'Different Nadis — excellent for health and progeny.'
            : doshaCancelled
                ? `Nadi dosha is cancelled: ${cancellationReason}`
                : `Nadi dosha — both are ${nakshatraA.nadi} Nadi.`,
        methodologyVersion: METHODOLOGY,
    };
}

// ---------------------------------------------------------------------------
// Guna Milan
// ---------------------------------------------------------------------------

export function interpretGunaTotal(total: number): string {
    if (total < 18) return 'Below the traditional 18-point threshold';
    if (total <= 24) return 'Average match';
    if (total <= 32) return 'Very good match';
    return 'Excellent match';
}

export function calculateGunaMilan(profileA: AstroProfile, profileB: AstroProfile, options: GunaMilanOptions = {}): GunaMilanResult {
    const orientation = resolveOrientation(options.genderA, options.genderB);

    const kootas = [
        calculateVarna(profileA.rashi, profileB.rashi, orientation),
        calculateVashya(profileA.rashi, profileB.rashi, profileA.moonLongitude, profileB.moonLongitude, orientation),
        calculateTara(profileA.nakshatra, profileB.nakshatra),
        calculateYoni(profileA.nakshatra, profileB.nakshatra, orientation),
        calculateGrahaMaitri(profileA.rashi, profileB.rashi),
        calculateGana(profileA.nakshatra, profileB.nakshatra, orientation),
        calculateBhakoot(profileA.rashi, profileB.rashi),
        calculateNadi(profileA.nakshatra, profileB.nakshatra, profileA.rashi, profileB.rashi, profileA.nakshatraPada, profileB.nakshatraPada),
    ];

    const totalScore = kootas.reduce((sum, k) => sum + k.score, 0);
    // A cancelled dosha is neutralised, not "earned": restore half its points.
    const restored = kootas.reduce((sum, k) => sum + (k.hasDosha && k.doshaCancelled ? (k.maxPoints - k.score) / 2 : 0), 0);
    const effectiveScore = Math.min(36, totalScore + restored);

    const nadi = kootas[7]!;
    const bhakoot = kootas[6]!;
    const gana = kootas[5]!;

    return {
        kootas,
        totalScore,
        effectiveScore,
        maxScore: 36,
        percentage: (totalScore / 36) * 100,
        effectivePercentage: (effectiveScore / 36) * 100,
        interpretation: interpretGunaTotal(totalScore),
        hasNadiDosha: !!nadi.hasDosha && !nadi.doshaCancelled,
        hasBhakootDosha: !!bhakoot.hasDosha && !bhakoot.doshaCancelled,
        hasGanaDosha: !!gana.hasDosha,
        orientation,
        methodologyVersion: METHODOLOGY,
    };
}

