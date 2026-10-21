# PREMA Code Review & Quality Gate Discipline

## Overview
Establishes the code review lifecycle, subagent-driven development review loops, and specification compliance gates for PREMA.

---

## 🔁 Mandatory Code Review Lifecycle

```
Feature Implementation Completed
               ↓
Self-Verification & Automated Test Suite Execution
               ↓
Request Code Review (Subagent / Senior Engineering Reviewer)
               ↓
Inspect Spec Compliance, Security, Performance & Design Standards
               ↓
Issues Identified? ─── YES ───► Fix Issues ───► Re-Submit for Review
       │
       NO
       ▼
Approved & Merged to Production
```

---

## 📋 Code Review Gate Criteria

1. **Spec Compliance**: Does the code strictly adhere to PREMA's product guidelines and UI hierarchy?
2. **Visual Fidelity**: Does UI code match `#F8F7F2` canvas, `#A9D8F5` sky blue, `#172B3A` deep navy, and editorial principles?
3. **Security & Privacy**: Are RLS policies defined? Are secrets completely absent from client bundles?
4. **Test Coverage**: Do new features have corresponding automated unit/integration tests?
5. **No Shortcuts**: Never skip code reviews for "small" changes.
