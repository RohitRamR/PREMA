# PREMA CI/CD, Infrastructure & Deployment Workflows

## Overview
Defines GitHub Actions pipelines, Cloudflare Pages/Workers deployment, Supabase database migration workflows, and release management for PREMA.

---

## 🔄 GitHub Actions Pipeline Workflow

```
Issue Created
     ↓
Feature Branch (`feature/prema-xxx`)
     ↓
Implementation & Local Tests
     ↓
Pull Request Created
     ↓
Automated Checks (TypeScript, ESLint, Vitest, CodeQL, Dependency Review)
     ↓
Task-Scoped Code Review Gate
     ↓
Merge to `main`
     ↓
Automated Deployment (Cloudflare Pages for Web, EAS Build for Expo Mobile)
```

---

## 🔒 Branch Protection Rules
- Require Pull Request reviews before merging to `main`.
- Require status checks to pass before merging (`ci/build`, `ci/test`, `codeql`).
- Disable direct pushes to `main`.
