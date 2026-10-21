# PREMA Recommendation & Ranking Engine Architecture

## Overview
Defines the multi-pass discovery ranking pipeline for generating curated daily recommendations for PREMA users.

---

## ⚙️ Multi-Pass Ranking Pipeline

```
Raw Candidate Pool
       ↓
Pass 1: Hard Filters (Age, Location Radius, Gender/Orientation, Intent)
       ↓
Pass 2: Block & Safety Exclusion (Exclude blocked users, safety flags, unverified)
       ↓
Pass 3: Multi-Dimensional Compatibility Calculation
       ↓
Pass 4: Explanation Generation ("Why you match" + "Potential friction")
       ↓
Pass 5: Exposure Balancing (Fair candidate impression distribution)
       ↓
Curated Recommendation Stack (Max 5–10 quality candidates per day)
```

---

## ⚖️ Initial Hypothesis Weights (Configurable)

- **Astrology Alignment**: 50–60%
- **Personality Alignment**: 15–20%
- **Relationship Goals Alignment**: 10–15%
- **Lifestyle Alignment**: 5–10%
- **Shared Interests**: 5–10%

> **Important**: Weights MUST remain dynamically configurable in database configuration (`ranking_config` table). Never hard-code weight constants in application logic.

---

## 📈 System Evolution Roadmap
1. **Phase 1 (Current)**: Rule-Based Heuristics & Weighted Compatibility.
2. **Phase 2**: A/B Testing Weight Variations across user cohorts.
3. **Phase 3**: Real-World Outcome Calibration (learning from date feedback).
4. **Phase 4**: Adaptive Learning-to-Rank (LTR) models.
