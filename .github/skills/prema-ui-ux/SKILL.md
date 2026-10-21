# PREMA UI/UX Design System & Visual Language Guidelines

## Overview
PREMA is an India-first, compatibility-first dating application. This skill defines the mandatory visual design principles, color palette, UI hierarchy, and aesthetic standards across all PREMA mobile and web interfaces.

---

## 🎨 Official Color Palette

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Background** | `#F8F7F2` | Warm off-white canvas for screens and pages. Primary background. |
| **Primary Sky Blue** | `#A9D8F5` | Primary brand accent, active tabs, subtle highlights, primary CTA fills. |
| **Powder Blue** | `#DCEFFA` | Soft container backgrounds, badge fills, subtle card overlays. |
| **Deep Navy** | `#172B3A` | Primary text color, high-contrast headings, dark mode structural surfaces. |
| **Muted Blue Grey** | `#6F8492` | Secondary text, subheadings, border strokes, inactive icon states. |
| **White** | `#FFFFFF` | Card containers, modal sheets, elevated surface elements. |

---

## 🌟 Visual Direction & Brand Identity

PREMA's visual aesthetic is defined by:
- **Premium & Editorial**: Clean, spacious typography layout with room for photography and storytelling.
- **Warm & Calm**: Soft off-white canvas (`#F8F7F2`) combined with gentle sky and powder blues (`#A9D8F5`, `#DCEFFA`).
- **Modern & Trustworthy**: High-contrast deep navy typography (`#172B3A`) for clarity and confidence.
- **Romantic but Minimal**: Intentional micro-interactions and soft warmth without cheesy clichés.
- **Photography-Led & Compatibility-Led**: User photography and compatibility insights drive the visual focus.

---

## 🚫 Strict Visual Prohibitions

Do **NOT** implement:
- ❌ **Tinder-Style Swipe Deck Clones**: No generic swipe cards or endless addictive swipe loops.
- ❌ **Horoscope / Mystical App Aesthetics**: No dark mystical starscapes, glowing purple orbs, or cheap astrology graphics.
- ❌ **Matrimonial Site Layouts**: No dense tabular bio data, transactional columns, or bureaucratic forms.
- ❌ **Neon & Heavy Pink Colors**: No harsh neon accents, bright magenta, or overwhelming pink fills.
- ❌ **Excessive Hearts & Cliché Romance Icons**: Avoid childish heart patterns, floating balloons, or cheesy dating tropes.
- ❌ **Generic AI Gradients**: Avoid standard rainbow or neon blur gradients.
- ❌ **Heavy Glassmorphism**: Avoid blurry frosted glass overlays that degrade contrast and accessibility.

---

## 📐 Mandatory PREMA UI Hierarchy

Every match card and profile interface MUST follow this exact top-to-bottom layout hierarchy:

1. **Profile Header & Editorial Photo**: High-quality user image with authentic presentation.
2. **Compatibility DNA Score**: Prominently displayed overall alignment score (e.g., "88% Compatible") with breakdown badges (Astrology, Personality, Values).
3. **Why You Match**: Highlight 2–3 key resonance factors (e.g., "Both value family autonomy & high-growth careers", "Sun/Moon Graha Maitri alignment").
4. **Potential Friction**: Transparently state 1 potential area of growth or friction (e.g., "Different communication pace during work hours").
5. **Intentional Action CTA**: Clear, mindful action buttons ("Send Intentional Note", "Invite to PREMA Date", "Save for Later").

---

## 📱 Component Design Rules
- **Buttons**: Rounded pill buttons (`border-radius: 9999px`) with minimum touch height of `48dp`. Primary button uses Deep Navy (`#172B3A`) text on Sky Blue (`#A9D8F5`) fill or Sky Blue text on Deep Navy fill.
- **Cards**: White (`#FFFFFF`) surface cards with subtle border (`1px solid #DCEFFA`) and minimal shadow elevation (`shadowColor: '#172B3A'`, `shadowOpacity: 0.04`, `shadowRadius: 12`).
- **Typography**: Primary font family: **Inter** or **Outfit** for clean legibility; Serif accents (**Playfair Display** or **Cinzel**) for editorial section headers.
