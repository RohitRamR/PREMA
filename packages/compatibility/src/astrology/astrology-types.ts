/**
 * @file astrology-types.ts
 * @description Core types for the PREMA Vedic astrology compatibility module.
 */

import type { ConfidenceLevel, UserBirthData } from '../types';

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export type GanaType = 'Deva' | 'Manushya' | 'Rakshasa';
export type NadiType = 'Aadi' | 'Madhya' | 'Antya';
export type VarnaType = 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
export type VashyaGroup = 'Chatushpada' | 'Manava' | 'Jalachara' | 'Vanachara' | 'Keeta';
export type YoniAnimal = 'Horse' | 'Elephant' | 'Sheep' | 'Serpent' | 'Dog' | 'Cat' | 'Rat' | 'Cow' | 'Buffalo' | 'Tiger' | 'Deer' | 'Monkey' | 'Mongoose' | 'Lion';

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

export interface AstroProfile {
    userId: string;
    moonLongitude: number;
    rashi: RashiData;
    nakshatra: NakshatraData;
    nakshatraPada: number;
    hasBirthTime: boolean;
    lagnaRashi?: RashiData;
    isManglik?: boolean;
    manglikSeverity?: 'none' | 'mild' | 'strong';
    manglikCancellations?: string[];
    confidence: ConfidenceLevel;
}

export interface KootaResult {
    koota: string;
    maxPoints: number;
    score: number;
    valueA: string;
    valueB: string;
    interpretation: string;
    methodologyVersion: string;
}

export interface GunaMilanResult {
    kootas: KootaResult[];
    totalScore: number;
    maxScore: 36;
    percentage: number;
    interpretation: string;
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
    compatible: boolean;
    severity: 'none' | 'mild' | 'strong';
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
    methodologyVersion: string;
}

export interface AstrologyConfig {
    gunaMilanWeight: number;
    vedicSignalsWeight: number;
    manglikWeight: number;
}
