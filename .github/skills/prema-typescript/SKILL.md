# PREMA TypeScript Quality & Type Safety Guidelines

## Overview
Defines type-checking standards, schema validation, domain entity typing, and interface discipline for PREMA codebases.

---

## 🔒 Type Safety Rules

1. **Strict TypeScript Configuration**:
   - `strict: true`
   - `noImplicitAny: true`
   - `strictNullChecks: true`
   - `noUnusedLocals: true`
2. **Zero `any` Types**: Explicitly type all variables, function arguments, and API returns. Use `unknown` with runtime type narrowing when handling external data.
3. **Zod Runtime Schema Validation**: Validate all incoming Edge Function payloads, client API parameters, and database responses using Zod schemas.
4. **Discriminated Unions**: Model domain states (such as payment status, verification status, or match state) using discriminated union types:

```typescript
export type MatchState =
  | { status: 'RECOMMENDED'; score: number; calculatedAt: string }
  | { status: 'NOTE_SENT'; noteText: string; sentAt: string }
  | { status: 'MUTUAL_MATCH'; matchedAt: string; conversationId: string }
  | { status: 'DATE_SCHEDULED'; dateId: string; venueId: string }
  | { status: 'PASSED'; passedAt: string };
```
