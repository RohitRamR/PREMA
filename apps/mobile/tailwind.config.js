/** @type {import('tailwindcss').Config} */

// PREMA design tokens.
// Token *names* follow the "Warm Editorial Intent" design system (DESIGN.md) that the
// exported screens were built with; the *values* are tuned to the live app palette
// (soft sky canvas, navy #2C496A type, sky-blue #74B4F2 accent, coral #FF6B8B CTA)
// so every screen matches Discover / Match Detail / Profile.
// Sizes are in px on purpose: NativeWind resolves 1rem = 14px, not 16px.

const colors = {
  // Canvas & surfaces
  background: '#F1F7FD',
  surface: '#F1F7FD',
  'surface-bright': '#F7FAFE',
  'surface-dim': '#D4E0EC',
  'surface-variant': '#E3EDF7',
  'surface-container-lowest': '#FFFFFF',
  'surface-container-low': '#F6F9FC',
  'surface-container': '#EDF3F9',
  'surface-container-high': '#E6EEF6',
  'surface-container-highest': '#DDE7F1',
  'surface-tint': '#74B4F2',

  // Type on surfaces
  'on-background': '#2C496A',
  'on-surface': '#2C496A',
  'on-surface-variant': '#62758C',
  outline: '#8892A3',
  'outline-variant': '#D4E0EC',
  'inverse-surface': '#1A2E44',
  'inverse-on-surface': '#F1F7FD',

  // Primary — deep navy
  primary: '#2C496A',
  'on-primary': '#FFFFFF',
  'primary-container': '#1A2E44',
  'on-primary-container': '#A9C3DD',
  'primary-fixed': '#D6E6F6',
  'primary-fixed-dim': '#B4C9DC',
  'on-primary-fixed': '#10233A',
  'on-primary-fixed-variant': '#3E5C7D',
  'inverse-primary': '#B4C9DC',

  // Secondary — sky blue
  secondary: '#4A90D9',
  'on-secondary': '#FFFFFF',
  'secondary-container': '#DCEBFA',
  'on-secondary-container': '#2C5F8F',
  'secondary-fixed': '#D3E7FB',
  'secondary-fixed-dim': '#A9D2F5',
  'on-secondary-fixed': '#0E2A44',
  'on-secondary-fixed-variant': '#2C5F8F',

  // Tertiary — coral (brand CTA)
  tertiary: '#E0486B',
  'on-tertiary': '#FFFFFF',
  'tertiary-container': '#FFE8EE',
  'on-tertiary-container': '#B3264A',
  'tertiary-fixed': '#FFD9E1',
  'tertiary-fixed-dim': '#FFB1C1',
  'on-tertiary-fixed': '#3F0016',
  'on-tertiary-fixed-variant': '#9C1B3F',

  // Feedback
  error: '#BA1A1A',
  'on-error': '#FFFFFF',
  'error-container': '#FFDAD6',
  'on-error-container': '#93000A',

  // Brand shortcuts
  accent: '#74B4F2',
  coral: '#FF6B8B',
  navy: '#1A2E44',
};

const type = (size, lineHeight, weight, tracking) => [
  `${size}px`,
  { lineHeight: `${lineHeight}px`, fontWeight: weight, letterSpacing: `${tracking}px` },
];

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontSize: {
        'headline-display': type(40, 48, '700', -1.2),
        'headline-lg': type(32, 38, '700', -0.64),
        'headline-lg-mobile': type(26, 32, '700', -0.52),
        'headline-md': type(22, 28, '600', -0.33),
        'headline-sm': type(18, 24, '600', -0.18),
        'body-lg': type(16, 24, '400', 0),
        'body-md': type(14, 21, '400', 0.07),
        'body-sm': type(13, 18, '400', 0.13),
        'label-lg': type(15, 20, '600', 0.15),
        'label-md': type(13, 18, '600', 0.26),
        'label-sm': type(11, 14, '700', 0.44),
      },
      spacing: {
        'space-2': '2px',
        'space-4': '4px',
        'space-6': '6px',
        'space-8': '8px',
        'space-12': '12px',
        'space-16': '16px',
        'space-20': '20px',
        'space-24': '24px',
        'space-32': '32px',
        'space-40': '40px',
        'space-48': '48px',
        'gutter-mobile': '16px',
        'margin-mobile': '20px',
        'margin-tablet': '32px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
};
