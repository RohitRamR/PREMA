/**
 * @file astrology-scorer.ts
 * @description Orchestrates the full Vedic astrology compatibility score.
 */

import type { ConfidenceLevel } from '../types';
import type { AstroProfile, AstrologyConfig, AstrologyCompatibilityResult } from './astrology-types';
import { calculateGunaMilan } from './ashtakoota';
import { checkManglikCompatibility } from './manglik';
import { calculateAllVedicSignals } from './vedic-signals';

const METHODOLOGY = 'vedic_v1';

const DEFAULT_CONFIG: AstrologyConfig = {
    gunaMilanWeight: 0.70,
    vedicSignalsWeight: 0.20,
    manglikWeight: 0.10
};

export function calculateAstrologyScore(profileA: AstroProfile, profileB: AstroProfile, config: AstrologyConfig = DEFAULT_CONFIG): AstrologyCompatibilityResult {
    // 1. Guna Milan
    const gunaMilan = calculateGunaMilan(profileA, profileB);
    const gunaMilanScoreRaw = gunaMilan.percentage; // 0 to 100

    // 2. Vedic Signals
    const vedicSignals = calculateAllVedicSignals(profileA, profileB);
    const signalValues = vedicSignals.map(s => {
        if (s.result === 'strong') return 100;
        if (s.result === 'moderate') return 75;
        if (s.result === 'neutral') return 50;
        return 25;
    });
    const signalsScoreRaw = signalValues.length > 0 ? (signalValues.reduce((a, b) => a + b, 0) / signalValues.length) : 50;

    // 3. Manglik Check
    const manglik = checkManglikCompatibility(profileA, profileB);
    let manglikScoreRaw = 100; // default compatible
    if (!manglik.compatible) {
        manglikScoreRaw = manglik.severity === 'strong' ? 0 : 50;
    } else if (manglik.explanation.includes('unknown')) {
        manglikScoreRaw = 75; // unknown baseline
    }

    // Weighted Combine
    const finalScore = Math.round(
        (gunaMilanScoreRaw * config.gunaMilanWeight) +
        (signalsScoreRaw * config.vedicSignalsWeight) +
        (manglikScoreRaw * config.manglikWeight)
    );

    // Combine confidence — map to ConfidenceLevel union
    let confidence: ConfidenceLevel = 'strong';
    if (profileA.confidence === 'insufficient_data' || profileB.confidence === 'insufficient_data') confidence = 'insufficient_data';
    else if (profileA.confidence === 'low' || profileB.confidence === 'low') confidence = 'low';
    else if (profileA.confidence === 'moderate' || profileB.confidence === 'moderate') confidence = 'moderate';

    return {
        score: Math.max(0, Math.min(100, finalScore)),
        gunaMilan,
        vedicSignals,
        manglik,
        confidence,
        methodologyVersion: METHODOLOGY
    };
}
