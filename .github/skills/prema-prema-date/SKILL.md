# PREMA Date (Curated Venue & Safe Date Infrastructure) Skill

## Overview
Architecture and safety rules for PREMA Date—the curated public venue date reservation and date verification platform.

---

## ☕ PREMA Date System Architecture

```
Partner Venue Directory (Curated Coffee Shops, Tea Rooms, Art Cafes)
       ↓
Date Invitation Sent & Accepted
       ↓
Venue Reserved (QR Confirmation Code Generated)
       ↓
Date Check-In (QR Code Scan at Partner Venue)
       ↓
Safety Circle Notification (Trusted Contact alerted date started safely)
       ↓
Date Check-Out & Post-Date Private Reflection
```

---

## 🔒 Safety & Privacy Principles

1. **Public Venues Only**: PREMA Date reservations are strictly restricted to vetted, public partner venues. No private residences or unverified locations.
2. **Zero Precise Live Location Sharing**: Never broadcast continuous live GPS coordinates to matches or third parties. Location data is strictly used for city-level radius venue discovery.
3. **Safety Circle Integration**: Users can optionally designate emergency contacts who receive an automated SMS/push notification when a date check-in occurs and when the date checks out safely.
4. **Post-Date Private Reflection**: Prompt both users independently after date completion for private feedback ("Did you feel safe?", "Would you like a second date?"). Feedback is strictly confidential and feeds into outcome calibration.
