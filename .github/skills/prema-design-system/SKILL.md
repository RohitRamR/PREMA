# PREMA Design System Engineering Guidelines

## Overview
This skill governs component architecture, design tokens, spacing scales, and layout utilities for PREMA React Native / Expo and Next.js interfaces.

---

## 🎨 Color Tokens & Usage Rules

```typescript
export const PREMA_THEME = {
  colors: {
    background: '#F8F7F2',     // Primary Canvas Off-White
    skyBlue: '#A9D8F5',        // Primary Brand Accent & Active Fills
    powderBlue: '#DCEFFA',     // Subtle Container & Overlay Fill
    deepNavy: '#172B3A',       // Primary High-Contrast Text & Headers
    mutedBlueGrey: '#6F8492',  // Secondary Subtext & Borders
    white: '#FFFFFF',          // Elevated Card Surface
    error: '#D9534F',          // Subtle Danger / Alert
    success: '#2E7D32',        // Verified / Safe Badge
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 9999,
  },
  typography: {
    headingFont: 'Outfit-Bold',
    editorialFont: 'PlayfairDisplay-Regular',
    bodyFont: 'Inter-Regular',
    bodyMedium: 'Inter-Medium',
  }
} as const;
```

---

## 📐 Layout & Accessibility Controls

1. **Touch Targets**: All interactive elements (buttons, icons, checkboxes) MUST have a minimum tap area of `44x44 dp`.
2. **Contrast Ratio**: Text color `#172B3A` on background `#F8F7F2` achieves a WCAG AAA compliant contrast ratio (> 7:1).
3. **Card Elevation**: Use subtle border strokes (`borderWidth: 1`, `borderColor: '#DCEFFA'`) rather than harsh heavy dropshadows.
4. **Responsive Layouts**: Use Flexbox and percentage-based max widths to ensure smooth display on compact mobile screens as well as tablets.
