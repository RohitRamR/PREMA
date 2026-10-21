// Sample birth details and basics for the mock people, so the real matching
// engine can compute their Kundli until profiles come from the API.
// All times are local Indian Standard Time (IST).
import type { Diet, EducationLevel } from '@prema/compatibility';

export type SampleBirth = {
  gender: 'male' | 'female';
  date: string;        // YYYY-MM-DD
  time: string | null; // HH:mm IST, null when unknown
  place: { name: string; lat: number; lon: number };
  diet?: Diet;
  religion?: string;
  heightCm?: number;
  education?: EducationLevel;
};

const CHENNAI = { name: 'Chennai', lat: 13.0827, lon: 80.2707 };
const BENGALURU = { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 };
const HYDERABAD = { name: 'Hyderabad', lat: 17.385, lon: 78.4867 };
const MADURAI = { name: 'Madurai', lat: 9.9252, lon: 78.1198 };
const MYSURU = { name: 'Mysuru', lat: 12.2958, lon: 76.6394 };

export const SAMPLE_BIRTHS: Record<string, SampleBirth> = {
  ananya: { gender: 'female', date: '2002-05-22', time: '07:45', place: CHENNAI, diet: 'vegetarian', religion: 'Hindu', heightCm: 163, education: 'masters' },
  meera: { gender: 'female', date: '1999-06-11', time: '21:10', place: BENGALURU, diet: 'vegetarian', religion: 'Hindu', heightCm: 160, education: 'bachelors' },
  kavya: { gender: 'female', date: '2000-01-27', time: '04:35', place: HYDERABAD, diet: 'non_vegetarian', religion: 'Hindu', heightCm: 165, education: 'masters' },
  priya: { gender: 'female', date: '2002-09-08', time: '13:20', place: CHENNAI, diet: 'vegetarian', religion: 'Hindu', heightCm: 158, education: 'bachelors' },
  neha: { gender: 'female', date: '2003-04-30', time: null, place: BENGALURU, diet: 'eggetarian', religion: 'Hindu', heightCm: 162, education: 'bachelors' },
  riya: { gender: 'female', date: '1999-11-02', time: '10:05', place: MYSURU, diet: 'vegetarian', religion: 'Hindu', heightCm: 157, education: 'bachelors' },
  diya: { gender: 'female', date: '2001-07-23', time: '05:50', place: CHENNAI, diet: 'non_vegetarian', religion: 'Christian', heightCm: 166, education: 'bachelors' },
  isha: { gender: 'female', date: '1998-12-14', time: '18:40', place: BENGALURU, diet: 'non_vegetarian', religion: 'Hindu', heightCm: 168, education: 'diploma' },
  tara: { gender: 'female', date: '2000-05-05', time: '08:15', place: MADURAI, diet: 'vegetarian', religion: 'Hindu', heightCm: 161, education: 'masters' },
  nila: { gender: 'female', date: '2000-02-17', time: '23:30', place: CHENNAI, diet: 'vegetarian', religion: 'Hindu', heightCm: 159, education: 'masters' },
  aarohi: { gender: 'female', date: '1997-08-29', time: '15:55', place: BENGALURU, diet: 'vegetarian', religion: 'Jain', heightCm: 164, education: 'bachelors' },
};

/** Basics for sample people who are not in the shared people list. */
export const EXTRA_BASICS: Record<string, { name: string; age: number; interests: string[]; lookingFor: string }> = {
  ananya: {
    name: 'Ananya',
    age: 24,
    interests: ['Filter coffee', 'Architecture', 'Slow living', 'Carnatic music', 'Heritage walks', 'Sketching'],
    lookingFor: 'Life partner · in the next 1–2 years',
  },
};
