# PREMA Razorpay Payment Integration Architecture

## Overview
Secure, server-authoritative implementation rules for Razorpay payments and subscriptions in India.

---

## 💳 Payment Flow Architecture

```
User (Mobile/Web App)
       ↓ (1. Request Order Creation)
PREMA Supabase Edge Function
       ↓ (2. Call Razorpay API with Secret Key)
Razorpay Servers (Order Created: order_id)
       ↓ (3. Return order_id to Client)
User Completes Checkout (Razorpay SDK)
       ↓ (4. Razorpay Webhook Event)
PREMA Supabase Webhook Endpoint (Verify Signature HMAC-SHA256)
       ↓ (5. Validated Payment Event)
PREMA Entitlement Service (Grant PREMA PLUS Membership)
```

---

## 🔒 Security Rules

1. **Server-Side Order Creation**: Razorpay orders MUST be created on Supabase Edge Functions using the server-only `RAZORPAY_SECRET_KEY`.
2. **Cryptographic Signature Verification**: Validate `razorpay_signature` server-side using HMAC SHA256 (`crypto.subtle`) before granting entitlements.
3. **Idempotent Webhooks**: All webhook handlers MUST verify `x-razorpay-signature` and log processed `payment_id` / `order_id` in database to prevent double-crediting.
4. **Client Never Trusted**: Never accept payment status, tier status, or entitlement flags passed directly from client requests.
5. **No Secrets in Client**: Never include Razorpay API Secret Keys in React Native or Next.js frontend code.
