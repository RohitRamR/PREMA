# PREMA Backend API & Edge Function Standards

## Overview
Mandatory rules for designing REST APIs, Supabase Edge Functions, request/response validation, error handling, and server authority.

---

## 🛡️ API Architecture Rules

1. **Server-Side Validation**: All incoming requests MUST be validated server-side using typed Zod schemas. Never trust client validation alone.
2. **Typed Contracts**: Standardized API response format:
   ```typescript
   export type ApiResponse<T> =
     | { success: true; data: T; timestamp: string }
     | { success: false; error: { code: string; message: string; details?: unknown }; timestamp: string };
   ```
3. **Strict Server Authority**:
   - **Payment Status**: Client CANNOT pass payment success flags. Payment status is ONLY updated via server-side Razorpay webhook validation.
   - **Compatibility Scores**: Compatibility scores are calculated strictly on the backend/Edge Functions. Clients never compute or submit scores.
4. **Idempotency**: All mutation endpoints (e.g. creating date bookings, initiating notes, processing Razorpay orders) MUST support an `Idempotency-Key` header.
5. **Structured Logging**: Use JSON logging (`console.log(JSON.stringify({ event, userId, durationMs, status }))`) for observability.
6. **No Secrets in Client Code**: Never embed service-role keys, Razorpay secret keys, or Cloudinary API secrets in client bundles.
