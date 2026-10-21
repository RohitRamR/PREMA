# Codemods

One-off Node scripts that rewrote app source files during early UI work
(animations, onboarding figures, icon/logo references). They have **already
been applied** and nothing runs them — they are kept for history only.

Most read paths relative to where they were first run:

- `mobile/*.js` — run from `apps/mobile/` (or `apps/mobile/scripts/` for
  `convert-ui.js`, `fix.js`, `update-logo-references.js`)
- `fix-second-spin.js` — run from the repository root

Don't run them again on current code; they use regex replacements written for
an older version of the files.
