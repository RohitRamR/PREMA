# PREMA Performance Engineering & Scalability Standards

## Overview
Performance targets, rendering optimizations, database indexing, and network latency controls for PREMA.

---

## ⚡ Performance SLAs & Benchmarks

| Metric / SLA | Target Threshold | Optimization Technique |
| :--- | :--- | :--- |
| **Edge Function Latency** | `< 200 ms` (p95) | Cache compatibility scores; optimized SQL queries. |
| **Mobile App Cold Start** | `< 1.5 s` | Hermes engine enabled; lazy route loading in Expo Router. |
| **List Scroll FPS** | `60 FPS` constant | FlashList integration; memoized item renderers. |
| **Image Loading** | `< 300 ms` | Cloudinary WebP/AVIF transformations; responsive dimensions. |
| **Initial User Scale Target** | `1,000 active users` | Connection pooling via Supavisor; indexed Postgres schemas. |

---

## 🛑 Memory & Waterfall Prevention
- Eliminate data fetching waterfalls by batching Supabase queries.
- Avoid passing massive uncompressed JSON payloads over Realtime channels.
