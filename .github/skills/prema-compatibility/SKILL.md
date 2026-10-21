# PREMA Compatibility Engine Architecture Guidelines

## Overview
Defines the multi-dimensional compatibility calculation engine for PREMA. This engine integrates Vedic Astrology, Numerology, Personality, Core Values, Communication Style, Lifestyle Alignment, and Relationship Intent.

---

## 🔬 Multi-Dimensional Compatibility Framework

```
                    PREMA COMPATIBILITY SCORE (1-100%)
                                   │
  ┌──────────────────┬─────────────┼──────────────┬────────────────┐
  │                  │             │              │                │
Vedic Astrology   Numerology   Personality     Core Values      Lifestyle & Goals
 (50–60% Weight)  (Harmonics)  (15–20% Weight) (10–15% Weight)  (5–10% Weight)
```

---

## 📐 Mandatory Calculation Rules

1. **Documented Methodology**: Every score calculation MUST have a documented mathematical formula and version number (e.g. `v1.2.0`). No arbitrary or random scoring.
2. **Server-Side Execution**: All compatibility calculations are executed inside Supabase Edge Functions. Scores are cached with version tags in `compatibility_scores` table.
3. **Dual Output**: The compatibility engine MUST output both:
   - **Overall Alignment Percentage**: Scaled score between 1% and 100%.
   - **Explainable Insights**: Breakdown of "Why You Match" and "Potential Friction".
4. **No Magic Formulas**: Do NOT invent astrology or numerology rules on the fly. Follow exact Vedic Ashtakoota and Pythagorean/Chaldean numerology rules documented in `prema-astrology` and `prema-numerology`.
