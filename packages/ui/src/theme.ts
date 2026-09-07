/**
 * PREMA Design System Tokens
 * Defines the core visual language according to brand guidelines.
 */

export const colors = {
  // Primary Background
  warmOffWhite: '#F8F7F2',
  
  // Primary Brand Accent
  softSkyBlue: '#A9D8F5',
  
  // Secondary Accent
  powderBlue: '#DCEFFA',
  
  // Primary Text
  deepNavy: '#172B3A',
  
  // Secondary Text
  mutedBlueGrey: '#6F8492',
  
  // Cards & Surfaces
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 9999,
};

export const typography = {
  fontFamily: 'Inter, sans-serif', // Assuming Inter as a modern sans-serif placeholder
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  }
};

export const theme = {
  colors,
  spacing,
  radii,
  typography,
};
