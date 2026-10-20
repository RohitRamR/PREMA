// Tiny in-memory store for the signed-in user's profile and preferences.
// Screens read with useProfile() and write with updateProfile(); every
// subscriber re-renders. Swap the body for Supabase calls when the API lands.
import { useSyncExternalStore } from 'react';

export type Profile = {
  name: string;
  age: number;
  location: string;
  occupation: string;
  intent: string;
  about: string;
  photos: string[]; // first photo is the main/avatar photo
  values: string[];
  boundary: string;
  lifestyle: string[];
  // Shown on your public profile (Match Detail) — all editable in Edit Profile.
  vitals: Vitals;
  prompt: { question: string; answer: string };
  interests: string[];
  photoCaption: string; // caption on your second photo
  voice: { question: string; recorded: boolean; seconds: number };
  discovery: {
    distanceKm: number;
    ageMin: number;
    ageMax: number;
    cities: string[];
    intents: string[];
    verifiedOnly: boolean;
  };
  settings: {
    pushIntros: boolean;
    pushMessages: boolean;
    dateReminders: boolean;
    showAge: boolean;
    readReceipts: boolean;
    incognito: boolean;
  };
  paused: boolean;
};

export type Vitals = {
  height: string;
  religion: string;
  languages: string;
  education: string;
  diet: string;
  family: string;
};

export const VITAL_FIELDS: { key: keyof Vitals; label: string; icon: string; placeholder: string }[] = [
  { key: 'height', label: 'Height', icon: 'height', placeholder: 'e.g. 5′10″' },
  { key: 'religion', label: 'Religion', icon: 'star_border', placeholder: 'e.g. Hindu' },
  { key: 'languages', label: 'Speaks', icon: 'translate', placeholder: 'e.g. Tamil, English' },
  { key: 'education', label: 'Studied', icon: 'school', placeholder: 'e.g. B.Arch, CEPT' },
  { key: 'diet', label: 'Diet', icon: 'restaurant', placeholder: 'e.g. Vegetarian' },
  { key: 'family', label: 'Family', icon: 'home', placeholder: 'e.g. Close-knit' },
];

export const PROMPT_OPTIONS = [
  'Sundays are sacred for…',
  'A perfect first date…',
  'I’m weirdly good at…',
  'My love language is…',
  'The way to win me over…',
];

export const VOICE_OPTIONS = [
  'My grandmother taught me…',
  'A song that feels like home…',
  'The best advice I ever got…',
];

export const INTEREST_SUGGESTIONS = [
  'Filter coffee', 'Architecture', 'Slow living', 'Carnatic music', 'Heritage walks',
  'Sketching', 'Road trips', 'Yoga', 'Reading', 'Cooking', 'Pottery', 'Photography',
];

export const INTEREST_MAX = 10;

export const INTENT_OPTIONS = [
  'Intentional life partnership',
  'Marriage within 1–2 years',
  'Long-term relationship',
  'Taking it slow',
];

export const VALUE_OPTIONS = [
  'Emotional Authenticity', 'Intellectual Curiosity', 'Family Closeness',
  'Spiritual Grounding', 'Financial Mindfulness', 'Creative Expression',
  'Adventure & Travel', 'Community Service',
];

export const LIFESTYLE_OPTIONS: { label: string; icon: string }[] = [
  { label: 'Early riser (6 AM)', icon: 'wb_twilight' },
  { label: 'Night owl', icon: 'bedtime' },
  { label: 'Filter coffee lover', icon: 'local_cafe' },
  { label: 'Courtyard weekends', icon: 'park' },
  { label: 'Vegetarian', icon: 'eco' },
  { label: 'Yoga & breathwork', icon: 'spa' },
  { label: 'Home cook', icon: 'restaurant' },
  { label: 'Architecture walks', icon: 'architecture' },
];

let state: Profile = {
  name: 'Vikram',
  age: 28,
  location: 'Bengaluru & Chennai',
  occupation: 'Senior Architect',
  intent: INTENT_OPTIONS[0],
  about: 'I design quiet homes by day and hunt for the best filter coffee in the city by evening. Looking for someone who values slow mornings and long conversations.',
  photos: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
  ],
  values: ['Emotional Authenticity', 'Intellectual Curiosity', 'Family Closeness'],
  boundary: 'Open communication during disagreements, and a shared dedication to quiet weekend downtime.',
  lifestyle: ['Early riser (6 AM)', 'Filter coffee lover', 'Courtyard weekends', 'Vegetarian'],
  vitals: {
    height: '5′11″',
    religion: 'Hindu',
    languages: 'Tamil, English, Kannada',
    education: 'B.Arch, CEPT',
    diet: 'Vegetarian',
    family: 'Close-knit',
  },
  prompt: {
    question: PROMPT_OPTIONS[0],
    answer: 'Long breakfasts, a stack of old architecture magazines, and a walk with no destination.',
  },
  interests: ['Filter coffee', 'Architecture', 'Slow living', 'Road trips', 'Photography'],
  photoCaption: 'Auroville, last winter',
  voice: { question: VOICE_OPTIONS[0], recorded: false, seconds: 0 },
  discovery: {
    distanceKm: 25,
    ageMin: 24,
    ageMax: 32,
    cities: ['Bengaluru', 'Chennai'],
    intents: ['Intentional life partnership', 'Marriage within 1–2 years'],
    verifiedOnly: true,
  },
  settings: {
    pushIntros: true,
    pushMessages: true,
    dateReminders: true,
    showAge: true,
    readReceipts: false,
    incognito: false,
  },
  paused: false,
};

const listeners = new Set<() => void>();

export function getProfile() {
  return state;
}

export function updateProfile(patch: Partial<Profile> | ((p: Profile) => Partial<Profile>)) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getProfile, getProfile);
}
