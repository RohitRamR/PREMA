// Saves what a new member entered during onboarding into their profile, so
// their own birth details (IST), gender, intent and bio drive matching.
// Only valid, non-empty answers overwrite the profile.
import { BIRTH_PLACES, INTENT_OPTIONS, updateProfile, getProfile, type Gender, type Profile } from '../../store/profile';

export type OnboardingAnswers = {
  name: string;
  dob: string;        // DD/MM/YYYY
  birthTime: string;  // free text, e.g. "6:30 AM", "18:45"; '' if unknown (IST)
  birthCity: string;  // free text, e.g. "Mumbai, India"
  gender: string;     // 'Woman' | 'Man' | 'Nonbinary'
  targetGenders: string[]; // 'Men' | 'Women' | 'Nonbinary people'
  intent: string;     // onboarding intent id
  anchors: string[];  // chosen resonance anchors (names)
  bio: string;
};

/** "DD/MM/YYYY" → "YYYY-MM-DD", or null if not a real date. */
export function parseOnboardingDob(dob: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  if (y < 1900 || date.getTime() > Date.now()) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/**
 * Free-text birth time (Indian Standard Time) → "HH:mm" (24h), or '' if unknown.
 * Accepts "6:30 AM", "06:30am", "6.30 pm", "18:45", "1845", "6 am".
 */
export function parseOnboardingTime(text: string): string {
  const t = text.trim().toLowerCase().replace(/\s+/g, '');
  if (!t) return '';
  const m = /^(\d{1,2})(?:[:.]?(\d{2}))?(am|pm|a\.m\.|p\.m\.)?$/.exec(t);
  if (!m) return '';
  let h = Number(m[1]);
  const min = m[2] !== undefined ? Number(m[2]) : 0;
  const mer = m[3]?.replace(/\./g, '');
  if (min > 59) return '';
  if (mer) {
    if (h < 1 || h > 12) return '';
    if (mer === 'am' && h === 12) h = 0;
    if (mer === 'pm' && h !== 12) h += 12;
  } else if (m[2] === undefined || h > 23) {
    return ''; // "6" alone is ambiguous
  }
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

const CITY_ALIASES: Record<string, string> = {
  bombay: 'Mumbai', bangalore: 'Bengaluru', madras: 'Chennai', calcutta: 'Kolkata',
  'new delhi': 'Delhi', 'delhi ncr': 'Delhi', gurgaon: 'Delhi', gurugram: 'Delhi', noida: 'Delhi',
  cochin: 'Kochi', ernakulam: 'Kochi', poona: 'Pune', secunderabad: 'Hyderabad',
};

/** Matches free-text birthplace to a known city (for Lagna coordinates). */
export function matchBirthPlace(text: string): { name: string; lat?: number; lon?: number } {
  const t = text.trim().toLowerCase();
  if (!t) return { name: '' };
  for (const [alias, city] of Object.entries(CITY_ALIASES)) {
    if (t.includes(alias)) {
      const p = BIRTH_PLACES.find((b) => b.name === city)!;
      return { name: p.name, lat: p.lat, lon: p.lon };
    }
  }
  const p = BIRTH_PLACES.find((b) => t.includes(b.name.toLowerCase()));
  return p ? { name: p.name, lat: p.lat, lon: p.lon } : { name: text.trim() };
}

const GENDER: Record<string, Gender> = { Woman: 'female', Man: 'male', Nonbinary: 'non_binary' };
const TARGET: Record<string, Gender> = { Women: 'female', Men: 'male', 'Nonbinary people': 'non_binary' };
const INTENT: Record<string, string> = {
  'Life Partner': INTENT_OPTIONS[0]!,
  'Marriage & Family': INTENT_OPTIONS[1]!,
  'Long-term Relationship': INTENT_OPTIONS[2]!,
  'Deep Connection': INTENT_OPTIONS[2]!,
  'Mindful Cadence': INTENT_OPTIONS[3]!,
};

function ageFrom(isoDate: string): number {
  const now = new Date(Date.now() + 330 * 60000); // IST
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];
  let age = now.getUTCFullYear() - y;
  if (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d)) age -= 1;
  return age;
}

/** Builds the profile patch from onboarding answers (pure — easy to test). */
export function onboardingPatch(a: OnboardingAnswers, current: Profile): Partial<Profile> {
  const patch: Partial<Profile> = {};
  if (a.name.trim()) patch.name = a.name.trim();

  const date = parseOnboardingDob(a.dob);
  if (date) {
    const place = matchBirthPlace(a.birthCity);
    patch.birth = {
      date,
      time: parseOnboardingTime(a.birthTime),
      place: place.name || current.birth.place,
      lat: place.name ? place.lat : current.birth.lat,
      lon: place.name ? place.lon : current.birth.lon,
    };
    patch.age = ageFrom(date);
  }

  const gender = GENDER[a.gender];
  if (gender) patch.gender = gender;
  const wants = a.targetGenders.map((g) => TARGET[g]).filter((g): g is Gender => !!g);
  if (wants.length) patch.interestedIn = wants;

  if (INTENT[a.intent]) patch.intent = INTENT[a.intent];
  if (a.anchors.length) patch.interests = a.anchors.slice(0, 10);
  if (a.bio.trim()) patch.about = a.bio.trim();
  return patch;
}

export function saveOnboarding(a: OnboardingAnswers): void {
  updateProfile(onboardingPatch(a, getProfile()));
}
