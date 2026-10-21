# PREMA Automated Testing Discipline & Quality Assurance

## Overview
Mandatory testing standards for unit tests, integration tests, RLS policy verification, compatibility math tests, and payment mocks across PREMA.

---

## 🧪 Testing Pyramid & Coverage Requirements

```
         / \
        / E2E \       Mobile Flow Tests (Detox / Maestro)
       /───────\
      /  Integration \   Supabase Edge Functions & API Contract Tests
     /───────────────\
    /   Unit & Math   \   Astrology, Numerology, Zod Schema & Utility Tests
   /───────────────────\
```

---

## 📋 Mandatory Test Areas

1. **Vedic Astrology & Numerology Math Tests**: Comprehensive unit test suites verifying Ashtakoota Guna Milan points, Nadi Dosha exceptions, and Life Path calculations against reference charts.
2. **Database Row Level Security (RLS) Tests**: Verify that User A cannot read User B's un-matched messages or private verification documents.
3. **Razorpay Payment Mock Tests**: Test order creation, signature verification logic with test keys, and webhook idempotency handling.
4. **Trust & Safety Filter Tests**: Verify that flagged profiles are excluded from candidate stacks across all discovery query variations.
5. **Regression Rule**: Every new feature or bug fix MUST include automated tests before merging to `main`.
