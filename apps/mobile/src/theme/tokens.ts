// PREMA semantic colour tokens.
//
// Screens should use these names (what a colour is FOR), not raw hex values or
// palette shades. Each token points at a shade in palette.json, which is
// generated from the brand colours by tools/colour/generate_palette.py.
//
// "Was" notes show the hard-coded colour each token replaces, so migrating a
// screen is a lookup. See docs/colour-system.md for the full plan.
import palette from './palette.json';

type Ramp = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950', string>;

/** Full shade ramps (50 = lightest, 950 = darkest). Prefer `colors` below in screens. */
export const ramps = {
  primary: palette.primary as Ramp, // navy
  accent: palette.accent as Ramp, // sky blue
  brand: palette.brand as Ramp, // PREMA pink
  neutral: palette.neutral as Ramp, // cool grey
  danger: palette.danger as Ramp,
  success: palette.success as Ramp,
} as const;

const { primary, accent, brand, neutral, danger, success } = ramps;
const white = '#FFFFFF';

export const colors = {
  background: {
    canvas: primary['50'], // app background. Was #F1F7FD (C.bg)
    surface: white, // cards and sheets
    subtle: neutral['50'], // dividers and quiet panels. Was #EEF3F8 (C.line), #F6F9FC
    inverse: primary['800'], // dark cards and bars. Was #1A2E44 (C.navy)
    brandSoft: brand['50'], // pink-tinted panels. Was #FFE8EE (C.pinkSoft), #FFF4F7
    accentSoft: accent['50'], // blue-tinted panels. Was #E7F0F9 (C.accentSoft), #E3ECF5
  },
  text: {
    primary: primary['700'], // headings and key text. Was #2C496A (C.pri)
    secondary: primary['600'], // body copy. Was #3E5C7D (C.body)
    // Was #8892A3 (C.muted), which is only 3.1:1 on white. neutral-600 meets AA (4.5:1).
    muted: neutral['600'],
    placeholder: neutral['400'], // placeholders, disabled text, inactive icons only (3:1). Was #8892A3
    inverse: white, // on background.inverse
    link: accent['600'], // tappable text. accent-300 is too light for text on white
    onBrand: primary['900'], // labels on action.primary. White on brand pink is only 2.7:1
  },
  border: {
    subtle: neutral['50'], // Was #EEF3F8 (C.line)
    default: neutral['100'], // Was #D4E0EC, #DCE6F0
    strong: neutral['300'], // Was #A9B4C2
  },
  action: {
    // Pink CTA. Was #FF6B8B (C.pink). Pressed goes lighter: a darker pink would drop the navy label below 4.5:1.
    primary: { bg: brand['300'], pressed: brand['200'], text: primary['900'] },
    secondary: { bg: primary['700'], pressed: primary['800'], text: white }, // navy button
    accent: { bg: accent['300'], pressed: accent['400'], text: primary['900'] }, // sky-blue chips and toggles
  },
  status: {
    danger: { text: danger['600'], bg: danger['50'], solid: danger['600'] }, // Was #D64545 (C.danger)
    success: { text: success['600'], bg: success['50'], solid: success['500'] }, // Was #3BB273, #2E8A5D
  },
  decorative: {
    heart: brand['300'], // hearts, match rings, icons. Not for text
    accent: accent['300'], // sky-blue icons and highlights. Not for text
    shadow: accent['50'], // shadowColor. Was #E3EDF7 (C.shadow)
  },
} as const;

export type Colors = typeof colors;
