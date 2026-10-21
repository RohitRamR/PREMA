# PREMA Analytics & Product Funnel Metrics Guidelines

## Overview
Defines event tracking schemas, product funnel telemetry, and privacy-compliant analytics standards for PREMA.

---

## 📊 Core Product Funnel Telemetry

Track events across the PREMA conversion funnel:

```
signup_completed
       ↓
profile_completed
       ↓
verification_completed
       ↓
compatibility_generated
       ↓
recommendation_viewed
       ↓
like_sent / note_sent
       ↓
match_created
       ↓
conversation_started
       ↓
date_created
       ↓
date_checked_in
       ↓
post_date_feedback
       ↓
second_date
```

---

## 🔒 Privacy & Data Minimization Rules
- Never attach raw messages, PII, phone numbers, or exact addresses to analytics payload events.
- Anonymize user IDs using salted hashes for analytics storage.
- Focus telemetry on measuring real relationship outcome conversion (First Date -> Second Date) rather than vanity engagement metrics.
