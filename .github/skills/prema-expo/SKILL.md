# PREMA Expo Architecture & Deployment Guidelines

## Overview
Defines Expo SDK standards, file-based routing (`expo-router`), EAS workflows, and native module management for PREMA.

---

## 🚀 Expo Router Architecture

```
app/
├── (auth)/
│   ├── login.tsx
│   └── verify-otp.tsx
├── (main)/
│   ├── _layout.tsx
│   ├── discovery.tsx
│   ├── matches.tsx
│   ├── dates.tsx
│   └── profile.tsx
├── match/[id].tsx
├── date/[id].tsx
└── _layout.tsx
```

---

## 🛠️ EAS & SDK Best Practices

1. **Expo SDK Version**: Build on modern SDK (SDK 51+), keeping dependencies aligned via `npx expo install`.
2. **File-Based Routing**: Use Typed Routes in Expo Router (`expo-router/babel` enabled, `experiments.typedRoutes: true` in `app.json`).
3. **Secure Credentials**: Store tokens and sensitive user session identifiers using `expo-secure-store`. Never use plain `AsyncStorage` for auth tokens.
4. **EAS Build & Update**: Configure `eas.json` for development, preview, and production channels. Use `eas update` for critical over-the-air patches.
