# PREMA Push & Email Notification Guidelines

## Overview
Standards for Firebase Cloud Messaging (FCM), Resend transactional emails, notification rate limits, and quiet hours.

---

## 🔔 Notification Rules

1. **FCM Push Delivery**: Send push notifications for critical, high-intent events (New Match, Intentional Note Received, PREMA Date Reminder, Date Check-In Alert).
2. **Resend Email Delivery**: Send transactional emails for account verification, password resets, payment receipts, and weekly compatibility summaries.
3. **Notification Rate Limiting**: Limit promotional/recommendation push alerts to maximum 1 per day to prevent notification fatigue.
4. **Quiet Hours**: Respect user quiet hours (default: 10:00 PM to 8:00 AM local time) for non-urgent push messages.
