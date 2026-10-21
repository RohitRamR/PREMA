# PREMA Content Moderation & Review Guidelines

## Overview
Standards for automated image/text moderation queues, human moderation workflows, user appeals, and account strike systems.

---

## 📋 Moderation Architecture

1. **Automated Image Pre-Screening**: All user uploaded profile images are scanned via Cloudinary Moderation AI before being published. Images containing explicit content, weapons, or text overlays are flagged.
2. **Text & Note Moderation**: Incoming intentional notes and chat messages are checked for offensive language, phone number spamming prior to match creation, and financial solicitations.
3. **Moderation Queue & Review Portal**: Flagged content routes to a secure Supabase Admin moderation dashboard for human reviewer verdict within 15 minutes.
4. **Appeals & Transparency**: Users receive clear notification if an image or profile bio is rejected, with option to submit an appeal.
