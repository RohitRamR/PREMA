# Colour migration map

Every 6-digit hex colour hard-coded in `apps/mobile` (app, components, src) on `main` at
commit `1ee44eb`, with the palette shade or token it should become. Generated with the same
OKLCH maths as `tools/colour/generate_palette.py`.

**ΔE** is the OKLab distance to the suggested shade: under 0.005 looks identical, under 0.03 is
a barely visible nudge, and 0.03 or more is a visible change that needs a look before swapping.

Totals: 134 colours, 507 uses.

| Uses | Current | Suggested | Shade | ΔE | Group | Example file |
|---:|---|---|---|---:|---|---|
| 90 | `#FFFFFF` | colors.background.surface / text.inverse | `white` #FFFFFF | 0.000 | exact | `app/(onboarding)/index.tsx` +15 |
| 25 | `#FF6B8B` | colors.action.primary.bg / decorative.heart | `brand-300` #FF6B8B | 0.000 | exact | `app/(onboarding)/index.tsx` +9 |
| 22 | `#A9B4C2` | colors.border.strong | `neutral-300` #A1A9B7 | 0.033 | review | `app/(onboarding)/waitlist.tsx` +8 |
| 19 | `#E3ECF5` | colors.background.accentSoft / decorative.shadow | `accent-50` #E8F3FF | 0.021 | close | `app/(onboarding)/waitlist.tsx` +13 |
| 18 | `#74B4F2` | colors.action.accent.bg / decorative.accent | `accent-300` #74B4F2 | 0.000 | exact | `app/(onboarding)/index.tsx` +6 |
| 16 | `#2C496A` | colors.text.primary / action.secondary.bg | `primary-700` #2C496A | 0.000 | exact | `app/(onboarding)/index.tsx` +10 |
| 14 | `#F6F9FC` | colors.background.surface / text.inverse | `white` #FFFFFF | 0.020 | close | `app/(onboarding)/waitlist.tsx` +12 |
| 12 | `#DCE6F0` | colors.border.default | `neutral-100` #D4D9E1 | 0.037 | review | `app/(tabs)/profile.tsx` +5 |
| 11 | `#E6EDF5` | colors.background.canvas | `primary-50` #EAF3FD | 0.018 | close | `app/(tabs)/likes.tsx` +10 |
| 11 | `#1A2E44` | colors.background.inverse | `primary-800` #1B344F | 0.025 | close | `app/(tabs)/likes.tsx` +6 |
| 9 | `#FFF4F7` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.018 | close | `app/(onboarding)/index.tsx` +5 |
| 9 | `#F1F7FD` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.013 | close | `app/(onboarding)/index.tsx` +5 |
| 8 | `#FBD3DD` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.028 | close | `app/(tabs)/meet.tsx` +5 |
| 8 | `#E2456B` | ramps.brand['400'] | `brand-400` #DF5575 | 0.026 | close | `app/(onboarding)/index.tsx` +5 |
| 6 | `#F2F6FB` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.011 | close | `app/(tabs)/likes.tsx` +5 |
| 6 | `#E0607E` | ramps.brand['400'] | `brand-400` #DF5575 | 0.021 | close | `app/(tabs)/meet.tsx` +2 |
| 6 | `#8892A3` | colors.text.placeholder | `neutral-400` #8892A3 | 0.000 | exact | `app/(onboarding)/index.tsx` +4 |
| 6 | `#3BB273` | ramps.success['300'] | `success-300` #3BB273 | 0.000 | exact | `app/(onboarding)/index.tsx` +3 |
| 5 | `#FF97AE` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.015 | close | `app/(onboarding)/index.tsx` +4 |
| 5 | `#FF8FA8` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.031 | review | `app/(tabs)/meet.tsx` +3 |
| 5 | `#E7F0F9` | colors.background.canvas | `primary-50` #EAF3FD | 0.009 | close | `app/(onboarding)/index.tsx` +4 |
| 5 | `#C9D5E3` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.012 | close | `app/(onboarding)/index.tsx` +4 |
| 5 | `#C9406A` | ramps.brand['500'] | `brand-500` #BF405F | 0.025 | close | `app/EditProfile.tsx` +2 |
| 5 | `#C24468` | ramps.brand['500'] | `brand-500` #BF405F | 0.015 | close | `app/(tabs)/meet.tsx` +1 |
| 5 | `#3E5C7D` | colors.text.secondary | `primary-600` #455F7E | 0.013 | close | `app/(tabs)/index.tsx` +2 |
| 5 | `#2E8A5D` | colors.status.success.solid | `success-500` #07814C | 0.039 | review | `app/AccountDetails.tsx` +3 |
| 4 | `#EEF2F7` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.001 | exact | `app/CompatibilityBreakdown.tsx` +2 |
| 4 | `#E3EDF7` | colors.background.accentSoft / decorative.shadow | `accent-50` #E8F3FF | 0.018 | close | `app/(tabs)/index.tsx` +2 |
| 4 | `#B4373F` | colors.status.danger.text | `danger-600` #B22E31 | 0.019 | close | `app/date/booking/[id].tsx` +2 |
| 4 | `#172B3A` | ramps.neutral['900'] | `neutral-900` #1B202A | 0.042 | review | `app/(onboarding)/index.tsx` +2 |
| 3 | `#FFF1F4` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.010 | close | `app/CompatibilityBreakdown.tsx` +1 |
| 3 | `#FFE8EE` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.012 | close | `app/(tabs)/meet.tsx` +2 |
| 3 | `#FFB3C4` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.045 | review | `app/(tabs)/meet.tsx` +2 |
| 3 | `#FFB38F` | keep: decorative art colour (see Phase 4) | `danger-200` #FDA9A2 | 0.041 | warm art | `app/(tabs)/meet.tsx` +2 |
| 3 | `#FF6685` | colors.action.primary.bg / decorative.heart | `brand-300` #FF6B8B | 0.010 | close | `app/(tabs)/_layout.tsx` +1 |
| 3 | `#F5B9C6` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.038 | review | `app/Chat.tsx` +2 |
| 3 | `#F3D5DD` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.031 | review | `app/(tabs)/chats.tsx` +2 |
| 3 | `#EEF3F8` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.003 | exact | `app/(tabs)/profile.tsx` +1 |
| 3 | `#EEF2F6` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.002 | exact | `app/(tabs)/meet.tsx` +2 |
| 3 | `#BFD4EA` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.024 | close | `app/ProfilePhotos.tsx` +2 |
| 3 | `#A0AAB8` | colors.border.strong | `neutral-300` #A1A9B7 | 0.003 | exact | `app/(tabs)/_layout.tsx` |
| 3 | `#6B7F99` | ramps.neutral['500'] | `neutral-500` #707989 | 0.025 | close | `app/(onboarding)/index.tsx` +1 |
| 3 | `#3EA9F5` | colors.action.accent.bg / decorative.accent | `accent-300` #74B4F2 | 0.057 | review | `app/(tabs)/index.tsx` +2 |
| 3 | `#3E8FDB` | colors.action.accent.pressed | `accent-400` #5E99D3 | 0.045 | review | `app/MatchDetail.tsx` +1 |
| 3 | `#3B7BBF` | ramps.accent['500'] | `accent-500` #487FB4 | 0.026 | close | `app/date/bookings.tsx` +2 |
| 2 | `#FFF7F9` | colors.background.surface / text.inverse | `white` #FFFFFF | 0.019 | close | `app/Chat.tsx` +1 |
| 2 | `#FFF6F8` | colors.background.surface / text.inverse | `white` #FFFFFF | 0.022 | close | `app/(tabs)/meet.tsx` +1 |
| 2 | `#FFE0E8` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.031 | review | `app/CompatibilityBreakdown.tsx` +1 |
| 2 | `#FFC2CF` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.013 | close | `app/(onboarding)/index.tsx` +1 |
| 2 | `#FBF1DC` | colors.status.danger.bg | `danger-50` #FFEDEB | 0.026 | close | `app/Notifications.tsx` +1 |
| 2 | `#FBE4E6` | colors.status.danger.bg | `danger-50` #FFEDEB | 0.023 | close | `app/Report.tsx` +1 |
| 2 | `#F4F8FC` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.017 | close | `app/MatchDetail.tsx` |
| 2 | `#EEF4FB` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.006 | close | `app/CompatibilityQuiz.tsx` +1 |
| 2 | `#EAF2FB` | colors.background.canvas | `primary-50` #EAF3FD | 0.003 | exact | `app/(onboarding)/index.tsx` +1 |
| 2 | `#E8F7EF` | colors.status.success.bg | `success-50` #E0F9E8 | 0.016 | close | `app/PremaPlusMembership.tsx` +1 |
| 2 | `#D4E2F0` | colors.border.default | `neutral-100` #D4D9E1 | 0.026 | close | `app/(onboarding)/index.tsx` +1 |
| 2 | `#C9D6E4` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.010 | close | `app/CompatibilityQuiz.tsx` +1 |
| 2 | `#C9D6E3` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.010 | close | `app/date/booking/[id].tsx` +1 |
| 2 | `#C3CFDC` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.031 | review | `app/(onboarding)/waitlist.tsx` +1 |
| 2 | `#B5657A` | ramps.brand['500'] | `brand-500` #BF405F | 0.074 | review | `app/(tabs)/meet.tsx` +1 |
| 2 | `#B1E0FE` | ramps.accent['100'] | `accent-100` #BFDFFF | 0.017 | close | `components/CelestialBackground.tsx` |
| 2 | `#9EC9F5` | ramps.accent['200'] | `accent-200` #9ACAF9 | 0.007 | close | `app/MatchDetail.tsx` |
| 2 | `#5E7290` | ramps.primary['500'] | `primary-500` #5E7692 | 0.011 | close | `app/MatchDetail.tsx` |
| 2 | `#4CC38A` | ramps.success['200'] | `success-200` #7ACA99 | 0.050 | review | `app/(tabs)/chats.tsx` +1 |
| 2 | `#4A6585` | colors.text.secondary | `primary-600` #455F7E | 0.021 | close | `app/(onboarding)/index.tsx` +1 |
| 2 | `#2B4A6A` | colors.text.primary / action.secondary.bg | `primary-700` #2C496A | 0.003 | exact | `app/(tabs)/index.tsx` |
| 1 | `#FFF8B0` | keep: decorative art colour (see Phase 4) | `success-50` #E0F9E8 | 0.076 | warm art | `components/CelestialBackground.tsx` |
| 1 | `#FFF5F8` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.020 | close | `app/CompatibilityBreakdown.tsx` |
| 1 | `#FFF4D6` | keep: decorative art colour (see Phase 4) | `danger-50` #FFEDEB | 0.038 | warm art | `components/Aura.tsx` |
| 1 | `#FFEBB8` | keep: decorative art colour (see Phase 4) | `danger-50` #FFEDEB | 0.065 | warm art | `components/Aura.tsx` |
| 1 | `#FFE6EC` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.017 | close | `app/MatchDetail.tsx` |
| 1 | `#FFE6AA` | keep: decorative art colour (see Phase 4) | `danger-50` #FFEDEB | 0.079 | warm art | `components/Aura.tsx` |
| 1 | `#FFDF00` | keep: decorative art colour (see Phase 4) | `success-100` #AEE2C0 | 0.164 | warm art | `components/CelestialBackground.tsx` |
| 1 | `#FFD77A` | keep: decorative art colour (see Phase 4) | `danger-100` #FDCCC8 | 0.108 | warm art | `components/Aura.tsx` |
| 1 | `#FFD3DD` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.029 | close | `app/ItSAMatch.tsx` |
| 1 | `#FFD0DB` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.024 | close | `app/CompatibilityBreakdown.tsx` |
| 1 | `#FFC2A3` | keep: decorative art colour (see Phase 4) | `danger-100` #FDCCC8 | 0.046 | warm art | `app/(tabs)/meet.tsx` |
| 1 | `#FFB8C6` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.035 | review | `app/(onboarding)/index.tsx` |
| 1 | `#FFB3C6` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.047 | review | `app/MatchDetail.tsx` |
| 1 | `#FFB199` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.027 | close | `components/Aura.tsx` |
| 1 | `#FFA3B5` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.015 | close | `components/Aura.tsx` |
| 1 | `#FFA0B4` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.010 | close | `app/(onboarding)/index.tsx` |
| 1 | `#FF9F6B` | keep: decorative art colour (see Phase 4) | `danger-200` #FDA9A2 | 0.063 | warm art | `components/Aura.tsx` |
| 1 | `#FF8FAB` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.032 | review | `app/MatchDetail.tsx` |
| 1 | `#FF5C80` | colors.action.primary.bg / decorative.heart | `brand-300` #FF6B8B | 0.027 | close | `app/MatchDetail.tsx` |
| 1 | `#FCD58A` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.089 | review | `components/Aura.tsx` |
| 1 | `#FBEFF0` | colors.background.brandSoft | `brand-50` #FFEDEF | 0.007 | close | `app/date/review/[id].tsx` |
| 1 | `#FBCB72` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.104 | review | `components/Aura.tsx` |
| 1 | `#F8F7F2` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.021 | close | `app/_layout.tsx` |
| 1 | `#F8D58A` | ramps.danger['100'] | `danger-100` #FDCCC8 | 0.090 | review | `app/(tabs)/meet.tsx` |
| 1 | `#F5B94A` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.118 | review | `components/Aura.tsx` |
| 1 | `#F5AE55` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.096 | review | `components/Aura.tsx` |
| 1 | `#F3C9CE` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.017 | close | `app/date/review/[id].tsx` |
| 1 | `#F2B954` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.111 | review | `components/Aura.tsx` |
| 1 | `#F2A3B5` | colors.action.primary.pressed | `brand-200` #FE9DAD | 0.023 | close | `app/EditProfile.tsx` |
| 1 | `#F09A4C` | ramps.danger['300'] | `danger-300` #F18A83 | 0.084 | review | `components/Aura.tsx` |
| 1 | `#EEF3F9` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.003 | exact | `app/EditProfile.tsx` |
| 1 | `#EE5274` | ramps.brand['400'] | `brand-400` #DF5575 | 0.028 | close | `app/(onboarding)/index.tsx` |
| 1 | `#EDF2F7` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.003 | exact | `app/date/event/[id].tsx` |
| 1 | `#EBA83E` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.115 | review | `components/Aura.tsx` |
| 1 | `#E8EEF5` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.014 | close | `app/(onboarding)/waitlist.tsx` |
| 1 | `#E8EEF4` | colors.background.subtle / border.subtle | `neutral-50` #EFF2F7 | 0.014 | close | `app/(onboarding)/index.tsx` |
| 1 | `#E8B04B` | ramps.danger['200'] | `danger-200` #FDA9A2 | 0.114 | review | `app/date/review/[id].tsx` |
| 1 | `#E3B6E8` | ramps.brand['100'] | `brand-100` #FEC7CE | 0.078 | review | `components/Aura.tsx` |
| 1 | `#E07B85` | ramps.danger['400'] | `danger-400` #E46964 | 0.048 | review | `app/date/review/[id].tsx` |
| 1 | `#E07A92` | colors.action.primary.bg / decorative.heart | `brand-300` #FF6B8B | 0.057 | review | `app/date/pass/[id].tsx` |
| 1 | `#E0415C` | ramps.danger['500'] | `danger-500` #D64545 | 0.036 | review | `app/(onboarding)/index.tsx` |
| 1 | `#DCE6F1` | colors.border.default | `neutral-100` #D4D9E1 | 0.037 | review | `app/(onboarding)/index.tsx` |
| 1 | `#D6E6F6` | colors.border.default | `neutral-100` #D4D9E1 | 0.038 | review | `app/Chat.tsx` |
| 1 | `#D6E2EE` | colors.border.default | `neutral-100` #D4D9E1 | 0.025 | close | `app/date/event/[id].tsx` |
| 1 | `#D64545` | ramps.danger['500'] | `danger-500` #D64545 | 0.000 | exact | `components/prema-ui.tsx` |
| 1 | `#D5DEE9` | colors.border.default | `neutral-100` #D4D9E1 | 0.015 | close | `app/Chat.tsx` |
| 1 | `#CFE6FA` | ramps.accent['100'] | `accent-100` #BFDFFF | 0.030 | review | `components/Aura.tsx` |
| 1 | `#CDBEF5` | ramps.accent['200'] | `accent-200` #9ACAF9 | 0.068 | review | `app/(tabs)/meet.tsx` |
| 1 | `#C9B8F5` | ramps.accent['200'] | `accent-200` #9ACAF9 | 0.070 | review | `components/Aura.tsx` |
| 1 | `#C98A12` | ramps.danger['400'] | `danger-400` #E46964 | 0.128 | review | `app/Notifications.tsx` |
| 1 | `#C93B57` | ramps.brand['500'] | `brand-500` #BF405F | 0.021 | close | `app/(onboarding)/index.tsx` |
| 1 | `#C3CDD9` | ramps.neutral['200'] | `neutral-200` #BAC1CC | 0.036 | review | `app/DeleteAccount.tsx` |
| 1 | `#B8D8F0` | ramps.accent['100'] | `accent-100` #BFDFFF | 0.026 | close | `app/(onboarding)/index.tsx` |
| 1 | `#A9D8F5` | ramps.accent['100'] | `accent-100` #BFDFFF | 0.035 | review | `components/Aura.tsx` |
| 1 | `#A9D2F5` | ramps.accent['200'] | `accent-200` #9ACAF9 | 0.031 | review | `app/(tabs)/meet.tsx` |
| 1 | `#A8DDBA` | ramps.success['100'] | `success-100` #AEE2C0 | 0.016 | close | `app/(tabs)/meet.tsx` |
| 1 | `#A58FEA` | colors.action.accent.pressed | `accent-400` #5E99D3 | 0.101 | review | `components/Aura.tsx` |
| 1 | `#A3AEBD` | colors.border.strong | `neutral-300` #A1A9B7 | 0.015 | close | `app/Notifications.tsx` |
| 1 | `#9FD8DF` | ramps.primary['100'] | `primary-100` #CDD9E7 | 0.058 | review | `app/(tabs)/meet.tsx` |
| 1 | `#9B2C33` | ramps.brand['600'] | `brand-600` #A02A4A | 0.035 | review | `app/Report.tsx` |
| 1 | `#9A6A12` | ramps.neutral['500'] | `neutral-500` #707989 | 0.140 | review | `src/features/date/ui.tsx` |
| 1 | `#8C2D34` | ramps.danger['700'] | `danger-700` #90151D | 0.035 | review | `app/date/review/[id].tsx` |
| 1 | `#8A9AB0` | colors.text.placeholder | `neutral-400` #8892A3 | 0.025 | close | `app/(onboarding)/index.tsx` |
| 1 | `#7D8DA3` | ramps.primary['400'] | `primary-400` #798EA7 | 0.007 | close | `app/MatchDetail.tsx` |
| 1 | `#6F8492` | ramps.neutral['500'] | `neutral-500` #707989 | 0.031 | review | `app/_layout.tsx` |
| 1 | `#3FB37B` | ramps.success['300'] | `success-300` #3BB273 | 0.011 | close | `app/PremaPlusMembership.tsx` |
| 1 | `#243B55` | colors.background.inverse | `primary-800` #1B344F | 0.027 | close | `app/(tabs)/profile.tsx` |
| 1 | `#000000` | ramps.neutral['950'] | `neutral-950` #090D15 | 0.160 | review | `app/(tabs)/_layout.tsx` |
