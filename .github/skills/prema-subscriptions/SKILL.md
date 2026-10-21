# PREMA PLUS Subscription Architecture & Entitlements

## Overview
Defines subscription membership tiers, entitlement isolation, billing cycles, and feature gates for PREMA.

---

## 🌟 Membership Tiers

| Feature | Free Tier | PREMA PLUS |
| :--- | :--- | :--- |
| **Daily Discovery Stack** | 5 Curated Matches / Day | 15 Curated Matches / Day |
| **Compatibility Insights** | Core Breakdown (Astrology + Personality) | Deep Granular Report & Friction Details |
| **Intentional Notes** | 1 / Week | 5 / Week |
| **PREMA Date Concierge** | Standard Venue Access | Partner Venue Discounts & Priority Booking |
| **Incognito Mode** | Not Included | Included |

---

## 🔒 Entitlement Isolation Principle

- Subscription status is stored in `user_subscriptions` table (`status: ACTIVE | PAST_DUE | CANCELLED | EXPIRED`).
- Application features query an `EntitlementService.hasFeature(userId, featureKey)` backend helper.
- Decouple billing provider (Razorpay) from entitlement storage so alternative payment gateways can be swapped without modifying feature check logic.
