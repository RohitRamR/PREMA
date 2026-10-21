# PREMA Trust & Safety Architecture Guidelines

## Overview
Defines safety protocols, threat mitigation, identity verification, risk scoring, and block/report rules across PREMA.

---

## 🛡️ Critical Safety Precedence Rule

> [!CAUTION]
> **SAFETY OVERRULES COMPATIBILITY**
> If a candidate profile triggers a high trust & safety risk score, is reported for harassment/scams, or fails identity verification, the candidate MUST BE INSTANTLY EXCLUDED from discovery, regardless of their compatibility score.

---

## 🔍 Threat Detection Framework

| Threat Vector | Detection Mechanism | Enforcement Action |
| :--- | :--- | :--- |
| **Fake Profiles / Impersonation** | Mandatory selfie verification against ID photo via face match AI. | Require re-verification or suspend account. |
| **Romance Scams / Financial Asks** | NLP scanner detecting UPI handles, bank transfers, crypto keywords in early chat. | Flag message, alert user, hold account for human review. |
| **Harassment / Threats** | Realtime toxic content classification. | Instant shadow-ban and report escalation. |
| **Underage / Grooming** | Age verification check & pattern monitoring. | Immediate permanent ban & safety report logging. |

---

## 🚫 User Controls
- **Instant Block & Report**: Available on every profile, card, and chat screen.
- **Incognito Mode**: Hide profile from general discovery, visible only to profiles liked by user.
- **Safety Circle**: Nominate trusted contacts to receive PREMA Date check-in alerts.
