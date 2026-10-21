/**
 * @file manglik.ts
 * @description Manglik (Kuja) dosha detection and Manglik compatibility.
 *
 * Detection: Mars in houses 1, 2, 4, 7, 8 or 12 (whole-sign) counted from the
 * Lagna (needs birth time + place) and from the Moon (always available).
 *   both references → strong · one reference → mild (anshik) · none → none
 * Classical exceptions that cancel the dosha are applied per reference.
 */

import type { AstroProfile, ManglikProfile, ManglikResult, ManglikSeverity } from './astrology-types';
import { getRashiFromDegree } from './data/rashis';

const METHODOLOGY = 'manglik_v2';

export const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

const SIGN_NAMES = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

/** House-specific sign exceptions (Mars in house H in one of these signs → no dosha). */
const HOUSE_SIGN_EXCEPTIONS: Record<number, number[]> = {
    1: [5, 11],   // Leo, Aquarius
    2: [3, 6],    // Gemini, Virgo
    4: [1, 8],    // Aries, Scorpio
    7: [4, 10],   // Cancer, Capricorn
    8: [9, 12],   // Sagittarius, Pisces
    12: [2, 7],   // Taurus, Libra
};

/** Whole-sign house (1–12) of a planet's sign counted from a reference sign. */
export function houseFrom(referenceSign: number, planetSign: number): number {
    return ((planetSign - referenceSign + 12) % 12) + 1;
}

/**
 * Computes the Manglik profile from sidereal longitudes.
 * @param moonLongitude sidereal Moon longitude
 * @param marsLongitude sidereal Mars longitude
 * @param lagnaLongitude sidereal Ascendant (omit when birth time/place unknown)
 */
export function computeManglikProfile(moonLongitude: number, marsLongitude: number, lagnaLongitude?: number): ManglikProfile {
    const marsSign = getRashiFromDegree(marsLongitude).index;
    const moonSign = getRashiFromDegree(moonLongitude).index;
    const marsHouseFromMoon = houseFrom(moonSign, marsSign);
    const marsHouseFromLagna = lagnaLongitude !== undefined ? houseFrom(getRashiFromDegree(lagnaLongitude).index, marsSign) : undefined;

    const doshaFrom: Array<'lagna' | 'moon'> = [];
    if (marsHouseFromLagna !== undefined && MANGLIK_HOUSES.includes(marsHouseFromLagna)) doshaFrom.push('lagna');
    if (MANGLIK_HOUSES.includes(marsHouseFromMoon)) doshaFrom.push('moon');

    const cancellations: string[] = [];
    let remaining = doshaFrom.length;

    if (doshaFrom.length > 0) {
        if (marsSign === 1 || marsSign === 8) {
            cancellations.push(`Mars is in its own sign (${SIGN_NAMES[marsSign]}).`);
            remaining = 0;
        } else if (marsSign === 10) {
            cancellations.push('Mars is exalted in Capricorn.');
            remaining = 0;
        } else {
            for (const ref of doshaFrom) {
                const house = ref === 'lagna' ? marsHouseFromLagna! : marsHouseFromMoon;
                if (HOUSE_SIGN_EXCEPTIONS[house]?.includes(marsSign)) {
                    cancellations.push(`Mars in house ${house} from the ${ref === 'lagna' ? 'Lagna' : 'Moon'} in ${SIGN_NAMES[marsSign]} is a classical exception.`);
                    remaining -= 1;
                }
            }
        }
    }

    const severity: ManglikSeverity = remaining >= 2 ? 'strong' : remaining === 1 ? 'mild' : 'none';

    return {
        isManglik: severity !== 'none',
        severity,
        marsHouseFromMoon,
        marsHouseFromLagna,
        doshaFrom,
        cancellations,
        lagnaChecked: lagnaLongitude !== undefined,
    };
}

/** Returns the Manglik severity of a profile, or 'unknown' if never computed. */
export function checkManglik(profile: AstroProfile): ManglikSeverity | 'unknown' {
    if (profile.manglik) return profile.manglik.severity;
    if (profile.isManglik === true) return profile.manglikSeverity && profile.manglikSeverity !== 'none' ? profile.manglikSeverity : 'strong';
    if (profile.isManglik === false) return 'none';
    return 'unknown';
}

/**
 * Manglik compatibility.
 *   neither Manglik → 100 · both Manglik → 100 (dosha cancels mutually)
 *   one mild → 60 · one strong → 20 · unknown → 75
 */
export function checkManglikCompatibility(profileA: AstroProfile, profileB: AstroProfile): ManglikResult {
    const severityA = checkManglik(profileA);
    const severityB = checkManglik(profileB);
    const aIs = severityA === 'mild' || severityA === 'strong';
    const bIs = severityB === 'mild' || severityB === 'strong';

    const base = {
        userAIsManglik: aIs,
        userBIsManglik: bIs,
        severityA,
        severityB,
        methodologyVersion: METHODOLOGY,
    };

    if (severityA === 'unknown' || severityB === 'unknown') {
        return { ...base, compatible: true, status: 'unknown', score: 75, severity: 'none', cancellations: [],
            explanation: 'Manglik status could not be determined for one partner.' };
    }
    if (aIs && bIs) {
        return { ...base, compatible: true, status: 'mutual_cancellation', score: 100, severity: 'none',
            cancellations: ['Both partners are Manglik — the dosha cancels out.'],
            explanation: 'Both partners are Manglik, so the dosha cancels out.' };
    }
    if (!aIs && !bIs) {
        return { ...base, compatible: true, status: 'no_dosha', score: 100, severity: 'none', cancellations: [],
            explanation: 'Neither partner has Manglik dosha.' };
    }
    const severity = (aIs ? severityA : severityB) as ManglikSeverity;
    return {
        ...base,
        compatible: severity === 'mild',
        status: 'mismatch',
        score: severity === 'strong' ? 20 : 60,
        severity,
        cancellations: [],
        explanation: severity === 'strong'
            ? 'Only one partner is Manglik (strong) — traditionally a significant mismatch.'
            : 'Only one partner is mildly Manglik — a minor, commonly accepted mismatch.',
    };
}
