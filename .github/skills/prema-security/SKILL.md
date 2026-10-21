# PREMA Application Security & Secret Protection Guidelines

## Overview
Security standards for static code analysis, secret protection, OWASP API Top 10 mitigation, and vulnerability management.

---

## 🔒 Mandatory Security Controls

1. **Secret Protection**:
   - Enable GitHub Secret Scanning & Push Protection.
   - Never commit API secrets, service-role keys, Razorpay secrets, or Cloudinary credentials into Git repository.
   - Use `.env.local` for local secrets and GitHub Action secrets / Supabase secrets for deployment environments.
2. **CodeQL Static Security Scanning**: Run CodeQL workflow on every Pull Request to detect SQL injection, XSS, insecure deserialization, and command injection.
3. **Dependency Supply Chain Security**: Audit all npm packages using `npm audit` and Dependabot alerts before merging new dependencies.
4. **OWASP API Defenses**: Enforce strict rate limiting, CORS restrictions, authorization checks on every endpoint, and input sanitization.
