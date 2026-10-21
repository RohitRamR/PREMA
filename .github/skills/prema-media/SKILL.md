# PREMA Media & Image Optimization Guidelines

## Overview
Image upload workflows, Cloudinary integration, EXIF metadata stripping, thumbnail generation, and image moderation standards.

---

## 🖼️ Media Pipeline Standards

1. **Direct Upload via Signed Parameters**: Mobile clients request short-lived upload signatures from Supabase Edge Functions before uploading images directly to Cloudinary.
2. **Automated EXIF Stripping**: Strip all GPS location tags, camera metadata, and timestamp headers from uploaded photos to preserve user privacy.
3. **Image Optimization & Delivery**:
   - Deliver WebP / AVIF formats automatically based on client device support.
   - Use Cloudinary dynamic transformations (`w_800,h_1000,c_fill,g_face,q_auto,f_auto`) for profile cards to minimize bandwidth.
4. **Moderation Integration**: Every uploaded image MUST pass automated moderation scanning before becoming visible in public profile stacks.
