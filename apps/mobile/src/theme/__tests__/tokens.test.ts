// Guards the colour system: every text/background pairing the tokens promise must
// meet WCAG 2.1 contrast, and the brand colours must stay exactly as they are.
// Run: npm test (from apps/mobile)
import { describe, expect, it } from 'vitest';
import { colors, ramps } from '../tokens';
import palette from '../palette.json';

const channel = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const AA_TEXT = 4.5;
const UI = 3; // icons, placeholders, borders that carry meaning

const { background: bg, text, action, status } = colors;

describe('text contrast (WCAG AA, 4.5:1)', () => {
  const pairs: [string, string, string][] = [];
  const add = (fgName: string, fg: string, bgName: string, b: string) => pairs.push([`${fgName} on ${bgName}`, fg, b]);
  for (const [fgName, fg] of Object.entries({ primary: text.primary, secondary: text.secondary, muted: text.muted, link: text.link })) {
    for (const [bgName, b] of Object.entries({ canvas: bg.canvas, surface: bg.surface, subtle: bg.subtle })) {
      add(`text.${fgName}`, fg, `background.${bgName}`, b);
    }
  }
  add('text.inverse', text.inverse, 'background.inverse', bg.inverse);
  add('text.primary', text.primary, 'background.brandSoft', bg.brandSoft);
  add('text.primary', text.primary, 'background.accentSoft', bg.accentSoft);
  for (const [name, a] of Object.entries(action)) add(`action.${name}.text`, a.text, `action.${name}.bg`, a.bg);
  for (const [name, a] of Object.entries(action)) add(`action.${name}.text`, a.text, `action.${name}.pressed`, a.pressed);
  for (const [name, s] of Object.entries(status)) {
    add(`status.${name}.text`, s.text, `status.${name}.bg`, s.bg);
    add(`status.${name}.text`, s.text, 'background.surface', bg.surface);
    add('white', '#FFFFFF', `status.${name}.solid`, s.solid);
  }

  it.each(pairs)('%s', (_label, fg, b) => {
    expect(contrast(fg, b)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe('non-text contrast (3:1)', () => {
  it('placeholder text on surfaces', () => {
    expect(contrast(text.placeholder, bg.surface)).toBeGreaterThanOrEqual(UI);
  });
});

describe('palette', () => {
  it('keeps the exact brand colours', () => {
    expect(ramps.primary['700']).toBe('#2C496A');
    expect(ramps.accent['300']).toBe('#74B4F2');
    expect(ramps.brand['300']).toBe('#FF6B8B');
    expect(ramps.neutral['400']).toBe('#8892A3');
    expect(ramps.danger['500']).toBe('#D64545');
    expect(ramps.success['300']).toBe('#3BB273');
  });

  it('every ramp runs from light (50) to dark (950)', () => {
    for (const ramp of Object.values(ramps)) {
      const l = Object.values(ramp).map(luminance);
      for (let i = 1; i < l.length; i++) expect(l[i]).toBeLessThan(l[i - 1]!);
    }
  });

  it('palette.json and ramps agree', () => {
    for (const [name, ramp] of Object.entries(ramps)) {
      expect(ramp).toEqual((palette as Record<string, unknown>)[name]);
    }
  });
});
