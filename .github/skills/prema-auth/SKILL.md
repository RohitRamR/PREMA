# PREMA Authentication & Session Security Guidelines

## Overview
Standards for phone OTP, Apple ID, Google Sign-In, token storage, and session lifecycle management using Supabase Auth.

---

## 🔐 Auth Implementation Rules

1. **Authentication Flow**:
   - Primary login via Phone Number OTP (SMS via Supabase Auth + Indian SMS gateway).
   - OAuth support for Apple Sign-In and Google Sign-In on mobile and web.
2. **Session Storage**:
   - Store refresh tokens using `Expo SecureStore` (Keychain on iOS, Keystore on Android).
   - Automatically refresh access tokens prior to expiration.
3. **Identity Verification Gate**:
   - Require new users to complete initial profile verification (selfie check) before unlocking match discovery.
4. **JWT Security**:
   - Map `auth.uid()` to PostgreSQL RLS policies. Never allow users to impersonate other user IDs in API queries.
