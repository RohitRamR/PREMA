# PREMA React Native Engineering Standards

## Overview
Standards and best practices for developing high-performance, fluid React Native components for PREMA mobile apps.

---

## ⚡ Performance Rules

1. **Reanimated & Gesture Handler**: Use `react-native-reanimated` (v3+) for all UI animations to keep animation logic strictly off the JS main thread.
2. **List Optimization**: Use `@shopify/flash-list` instead of standard `FlatList` for long candidate decks or chat messages to prevent UI lag.
3. **Hermes Engine**: Ensure Hermes JS engine is enabled in `app.json` for fast TTFF (Time to First Frame) and low RAM footprint.
4. **Memoization**: Wrap expensive profile calculations and compatibility subcomponents in `React.memo` or `useMemo`.
5. **Flexbox Strictness**: Always set explicit `flex: 1` or dimensions on container components to prevent layout calculation jumps.

---

## 🔒 State & Native Bridge

- Use Zustand or Context API for lightweight, modular global state.
- Avoid passing non-serializable objects across component props or navigation routes.
- Strip inline function definitions inside render loops for optimized list items.
