/**
 * @file astrology-types.ts
 * @description Core types for the PREMA Vedic astrology (Kundli) compatibility module.
 */

import type { ConfidenceLevel } from '../types';

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export type GanaType = 'Deva' | 'Manushya' | 'Rakshasa';
export type NadiType = 'Aadi' | 'Madhya' | 'Antya';
export type VarnaType = 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
export type VashyaGroup = 'Chatushpada' | 'Manava' | 'Jalachara' | 'Vanachara' | 'Keeta';
export type YoniAnimal = 'Horse' | 'Elephant' | 'Sheep' | 'Serpent' | 'Dog' | 'Cat' | 'Rat' | 'Cow' | 'Buffalo' | 'Tiger' | 'Deer' | 'Monkey' | 'Mongoose' | 'Lion';

/** Which partner plays the "bride" / "groom" role in the classical tables. */
export type KundliRole = 'bride' | 'groom' | 'neutral';

export type ManglikSeverity = 'none' | 'mild' | 'strong';

export interface NakshatraData {
    index: number;
    name: string;
    degreesStart: number;
    degreesEnd: number;
    lord: Planet;
    gana: GanaType;
    nadi: NadiType;
    yoniAnimal: YoniAnimal;
    yoniSex: 'M' | 'F';
}

export interface RashiData {
    index: number;
    name: string;
    englishName: string;
    degreesStart: number;
    degreesEnd: number;
    lord: Planet;
    element: string;
    varnaRank: number;
    varna: VarnaType;
    vashyaGroup: VashyaGroup;
}

export interface ManglikProfile {
    isManglik: boolean;
    severity: ManglikSeverity;
    /** Houses Mars occupies counted from each reference point (whole-sign). */
    marsHouseFromMoon: number;
    marsHouseFromLagna?: number;
    /** Which references produced the dosha before cancellations. */
    doshaFrom: Array<'lagna' | 'moon'>;
    /** Classical cancellation reasons that neutralised the dosha. */
    cancellations: string[];
    /** False when computed from the Moon only (birth time/place unknown). */
    lagnaChecked: boolean;
}

export interface AstroProfile {
    userId: string;
    /** Sidereal (Lahiri) Moon longitude, degrees 0–360. */
    moonLongitude: number;
    rashi: RashiData;
    nakshatra: NakshatraData;
    nakshatraPada: number;
    hasBirthTime: boolean;
    /** UTC instant of birth that was used for the chart. */
    birthInstantUtc?: string;
    /** Time zone applied to the birth time (IST by default). */
    timezoneLabel?: string;
    /** False when birth time is unknown AND the Moon changed rashi during that day. */
    rashiCertain?: boolean;
    /** False when birth time is unknown AND the Moon changed nakshatra during that day. */
    nakshatraCertain?: boolean;
    lagnaRashi?: RashiData;
    lagnaLongitude?: number;
    marsLongitude?: number;
    manglik?: ManglikProfile;
    /** @deprecated kept for older callers — use `manglik`. */
    isManglik?: boolean;
    /** @deprecated kept for older callers — use `manglik`. */
    manglikSeverity?: ManglikSeverity;
    /** @deprecated kept for older callers — use `manglik`. */
    manglikCancellations?: string[];
    confidence: ConfidenceLevel;
    warnings?: string[];
}

export interface KootaResult {
    koota: string;
    maxPoints: number;
    score: number;
    valueA: string;
    valueB: string;
    interpretation: string;
    /** True when this koota is a dosha (e.g. Nadi 0/8, Bhakoot 0/7). */
    hasDosha?: boolean;
    /** True when a classical exception neutralises the dosha. */
    doshaCancelled?: boolean;
    cancellationReason?: string;
    methodologyVersion: string;
}

export interface GunaMilanResult {
    kootas: KootaResult[];
    /** Classical total out of 36 — what every Kundli calculator prints. */
    totalScore: number;
    /** Total after restoring points for doshas that are classically cancelled. */
    effectiveScore: number;
    maxScore: 36;
    percentage: number;
    effectivePercentage: number;
    interpretation: string;
    hasNadiDosha: boolean;
    hasBhakootDosha: boolean;
    hasGanaDosha: boolean;
    /** How bride/groom were assigned (or 'neutral' for same-gender pairs). */
    orientation: 'A_bride' | 'A_groom' | 'neutral';
    methodologyVersion: string;
}

export interface VedicSignal {
    signal: string;
    valueA: string;
    valueB: string;
    result: 'strong' | 'moderate' | 'weak' | 'neutral';
    interpretation: string;
    methodologyVersion: string;
}

export interface ManglikResult {
    userAIsManglik: boolean;
    userBIsManglik: boolean;
    severityA: ManglikSeverity | 'unknown';
    severityB: ManglikSeverity | 'unknown';
    compatible: boolean;
    status: 'no_dosha' | 'mutual_cancellation' | 'mismatch' | 'unknown';
    /** 0–100 contribution to the astrology score. */
    score: number;
    severity: ManglikSeverity;
    explanation: string;
    cancellations: string[];
    methodologyVersion: string;
}

export interface AstrologyCompatibilityResult {
    score: number;
    gunaMilan: GunaMilanResult;
    vedicSignals: VedicSignal[];
    manglik: ManglikResult | null;
    confidence: ConfidenceLevel;
    summary: string;
    methodologyVersion: string;
}

export interface AstrologyConfig {
    gunaMilanWeight: number;
    vedicSignalsWeight: number;
    manglikWeight: number;
}

export interface GunaMilanOptions {
    /** Gender of user A / B as stored on the profile ("male", "female", "man", "woman"…). */
    genderA?: string;
    genderB?: string;
}
