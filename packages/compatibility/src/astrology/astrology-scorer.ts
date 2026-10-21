/**
 * @file astrology-scorer.ts
 * @description Combines Guna Milan, Manglik and supporting Vedic signals into
 * one 0–100 Kundli compatibility score.
 */

import type { ConfidenceLevel } from '../types';
import type { AstroProfile, AstrologyConfig, AstrologyCompatibilityResult, GunaMilanOptions } from './astrology-types';
import { calculateGunaMilan } from './ashtakoota';
import { checkManglikCompatibility } from './manglik';
import { calculateAllVedicSignals } from './vedic-signals';

const METHODOLOGY = 'vedic_v2';

const DEFAULT_CONFIG: AstrologyConfig = {
    gunaMilanWeight: 0.70,
    vedicSignalsWeight: 0.15,
    manglikWeight: 0.15,
};

export const DOSHA_PENALTY = { nadi: 18, bhakoot: 8, gana: 4 } as const;
export const MIN_TRADITIONAL_GUNA = 18;
export const BELOW_THRESHOLD_CAP = 45;

const CONFIDENCE_RANK: Record<ConfidenceLevel, number> = { insufficient_data: 0, low: 1, moderate: 2, strong: 3 };

/** How much of the raw astrology signal to trust, by data quality. */
const RELIABILITY: Record<ConfidenceLevel, number> = { strong: 1, moderate: 1, low: 0.6, insufficient_data: 0 };

function weakest(a: ConfidenceLevel, b: ConfidenceLevel): ConfidenceLevel {
    return CONFIDENCE_RANK[a] <= CONFIDENCE_RANK[b] ? a : b;
}

export function calculateAstrologyScore(
    profileA: AstroProfile,
    profileB: AstroProfile,
    config: AstrologyConfig = DEFAULT_CONFIG,
    options: GunaMilanOptions = {}
): AstrologyCompatibilityResult {
    const gunaMilan = calculateGunaMilan(profileA, profileB, options);

    const vedicSignals = calculateAllVedicSignals(profileA, profileB);
    const signalValue = { strong: 100, moderate: 75, neutral: 50, weak: 25 } as const;
    const signalsScore = vedicSignals.length
        ? vedicSignals.reduce((s, v) => s + signalValue[v.result], 0) / vedicSignals.length
        : 50;

    const manglik = checkManglikCompatibility(profileA, profileB);

    const totalWeight = config.gunaMilanWeight + config.vedicSignalsWeight + config.manglikWeight;
    let raw = (
        gunaMilan.effectivePercentage * config.gunaMilanWeight +
        signalsScore * config.vedicSignalsWeight +
        manglik.score * config.manglikWeight
    ) / (totalWeight || 1);

    // Uncancelled doshas are serious in tradition — penalise beyond the lost points.
    if (gunaMilan.hasNadiDosha) raw -= DOSHA_PENALTY.nadi;
    if (gunaMilan.hasBhakootDosha) raw -= DOSHA_PENALTY.bhakoot;
    if (gunaMilan.hasGanaDosha) raw -= DOSHA_PENALTY.gana;
    // Below the traditional 18-Guna threshold a match is "not recommended".
    if (gunaMilan.totalScore < MIN_TRADITIONAL_GUNA) raw = Math.min(raw, BELOW_THRESHOLD_CAP);

    const confidence = weakest(profileA.confidence, profileB.confidence);
    // Uncertain charts are shrunk toward neutral (50) so they can't win on noise.
    const reliability = RELIABILITY[confidence];
    const score = Math.round(Math.max(0, Math.min(100, 50 + (raw - 50) * reliability)));

    const notes: string[] = [`${gunaMilan.totalScore}/36 Guna`];
    const nadi = gunaMilan.kootas[7]!;
    const bhakoot = gunaMilan.kootas[6]!;
    if (nadi.hasDosha) notes.push(nadi.doshaCancelled ? 'Nadi dosha cancelled' : 'Nadi dosha');
    if (bhakoot.hasDosha) notes.push(bhakoot.doshaCancelled ? 'Bhakoot dosha cancelled' : 'Bhakoot dosha');
    if (manglik.status === 'mutual_cancellation') notes.push('both Manglik');
    if (manglik.status === 'mismatch') notes.push(`Manglik mismatch (${manglik.severity})`);

    return {
        score,
        gunaMilan,
        vedicSignals,
        manglik,
        confidence,
        summary: notes.join(' · '),
        methodologyVersion: METHODOLOGY,
    };
}
