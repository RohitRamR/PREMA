import { describe, expect, it } from 'vitest';
import { parseOnboardingDob, parseOnboardingTime, matchBirthPlace, onboardingPatch } from '../save-onboarding';
import { getProfile } from '../../../store/profile';

describe('onboarding → profile', () => {
  it('reads DD/MM/YYYY birth dates and rejects impossible ones', () => {
    expect(parseOnboardingDob('14/02/1998')).toBe('1998-02-14');
    expect(parseOnboardingDob('30/02/1998')).toBeNull();
    expect(parseOnboardingDob('14/02')).toBeNull();
    expect(parseOnboardingDob('01/01/2999')).toBeNull();
  });

  it('reads birth times the way people type them (IST, 24h output)', () => {
    expect(parseOnboardingTime('6:30 AM')).toBe('06:30');
    expect(parseOnboardingTime('6:30pm')).toBe('18:30');
    expect(parseOnboardingTime('12:15 am')).toBe('00:15');
    expect(parseOnboardingTime('12:00 PM')).toBe('12:00');
    expect(parseOnboardingTime('6.45 p.m.')).toBe('18:45');
    expect(parseOnboardingTime('18:45')).toBe('18:45');
    expect(parseOnboardingTime('1845')).toBe('18:45');
    expect(parseOnboardingTime('6 am')).toBe('06:00');
    expect(parseOnboardingTime('')).toBe('');
    expect(parseOnboardingTime('6')).toBe('');
    expect(parseOnboardingTime('25:00')).toBe('');
    expect(parseOnboardingTime('13:00 pm')).toBe('');
    expect(parseOnboardingTime('dunno')).toBe('');
  });

  it('matches birthplaces including old names', () => {
    expect(matchBirthPlace('Mumbai, India').name).toBe('Mumbai');
    expect(matchBirthPlace('bombay').name).toBe('Mumbai');
    expect(matchBirthPlace('Bangalore').lat).toBeCloseTo(12.97, 1);
    expect(matchBirthPlace('Madras').name).toBe('Chennai');
    expect(matchBirthPlace('Tirunelveli')).toEqual({ name: 'Tirunelveli' });
  });

  it('builds a full profile patch from complete answers', () => {
    const p = onboardingPatch({
      name: ' Asha ', dob: '05/11/1997', birthTime: '7:10 PM', birthCity: 'Calcutta', gender: 'Woman',
      targetGenders: ['Men'], intent: 'Marriage & Family', anchors: ['Family & Roots'], bio: 'Hi there',
    }, getProfile());
    expect(p.name).toBe('Asha');
    expect(p.birth).toMatchObject({ date: '1997-11-05', time: '19:10', place: 'Kolkata' });
    expect(p.gender).toBe('female');
    expect(p.interestedIn).toEqual(['male']);
    expect(p.intent).toBe('Marriage within 1–2 years');
    expect(p.interests).toEqual(['Family & Roots']);
    expect(p.about).toBe('Hi there');
    expect(p.age).toBeGreaterThanOrEqual(28);
  });

  it('skipped or invalid answers never overwrite the existing profile', () => {
    const p = onboardingPatch({ name: '', dob: '99/99/9999', birthTime: '', birthCity: '', gender: '', targetGenders: [], intent: '', anchors: [], bio: '  ' }, getProfile());
    expect(p).toEqual({});
  });
});
