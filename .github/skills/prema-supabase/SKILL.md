# PREMA Supabase Architecture & Integration Guidelines

## Overview
Governs Supabase Database, Auth, Realtime, Storage, Edge Functions, and RLS policies for PREMA.

---

## ⚡ Supabase Edge Functions & Client Rules

1. **Server-Side Operations**: Perform compatibility calculations, payment verification, and candidate ranking inside Supabase Edge Functions (TypeScript on Deno runtime).
2. **Client Initialization**: Initialize the Supabase client using `@supabase/supabase-js` with Expo `SecureStore` adapter for persistent sessions on mobile.
3. **Database RLS Policies**: Every table in the Supabase PostgreSQL database MUST have Row Level Security (RLS) enabled.
4. **Realtime Channels**: Use Supabase Realtime channels for instant messaging and match notifications. Always filter channels by user ID or conversation ID to prevent data leaks.
5. **Storage Buckets**: Maintain public storage buckets for optimized user thumbnails and restricted private storage buckets for verification documents (ID verification, selfies).
