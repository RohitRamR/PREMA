# PREMA colour system

One palette and one set of named colour roles for the mobile app. Today the app
hard-codes 134 different hex colours in 507 places (plus about 180 `rgba()`,
short-hex and named colours), with five copies of the same small palette. This
system replaces them.

| Piece | File |
|---|---|
| Palette (shade ramps) | `apps/mobile/src/theme/palette.json`, generated |
| Semantic tokens (what each colour is for) | `apps/mobile/src/theme/tokens.ts` |
| Contrast and palette tests | `apps/mobile/src/theme/__tests__/tokens.test.ts` |
| Generator | `tools/colour/generate_palette.py` |
| Every current colour and what it becomes | [colour-migration-map.md](colour-migration-map.md) |

```ts
import { colors } from '../src/theme';
<View style={{ backgroundColor: colors.background.canvas }}>
  <Text style={{ color: colors.text.primary }}>…</Text>
```

## The palette

Six brand colours from `components/prema-ui.tsx`, each scaled into 11 shades
(Tailwind stops: 50 is lightest, 950 darkest). **Bold** = the original brand
colour, kept exactly.

| Colour | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **primary** | #EAF3FD | #CDD9E7 | #B0BFD1 | #94A6BC | #798EA7 | #5E7692 | #455F7E | **#2C496A** | #1B344F | #0C2036 | #010D1F |
| **accent** | #E8F3FF | #BFDFFF | #9ACAF9 | **#74B4F2** | #5E99D3 | #487FB4 | #336696 | #1E4E79 | #07375E | #00213E | #000E1F |
| **brand** | #FFEDEF | #FEC7CE | #FE9DAD | **#FF6B8B** | #DF5575 | #BF405F | #A02A4A | #831336 | #610525 | #400115 | #220007 |
| **neutral** | #EFF2F7 | #D4D9E1 | #BAC1CC | #A1A9B7 | **#8892A3** | #707989 | #59616F | #434A57 | #2E3540 | #1B202A | #090D15 |
| **danger** | #FFEDEB | #FDCCC8 | #FDA9A2 | #F18A83 | #E46964 | **#D64545** | #B22E31 | #90151D | #6A0610 | #440207 | #220002 |
| **success** | #E0F9E8 | #AEE2C0 | #7ACA99 | **#3BB273** | #25995F | #07814C | #07693D | #02512E | #013B20 | #002512 | #001206 |

How it's built: in OKLCH, so equal steps look equally different. Each brand
colour stays exact at its nearest stop; lightness steps evenly from 96% (50)
to the brand colour and on down to 16% (950); saturation tapers towards both
ends, so the lightest shades stay as soft as the app's current pale blues. To
change a brand colour, edit `SOURCES` in the generator and run:

```bash
python3 tools/colour/generate_palette.py --write
```

The tests then confirm the contrast promises below still hold.

## Semantic tokens

Screens use **roles**, not shades, so the palette can change without touching
screens.

| Token | Shade | Replaces today |
|---|---|---|
| `background.canvas` | primary-50 | `#F1F7FD` (`C.bg`) |
| `background.surface` | white | `#FFFFFF` cards |
| `background.subtle` | neutral-50 | `#EEF3F8` (`C.line`), `#F6F9FC` |
| `background.inverse` | primary-800 | `#1A2E44` (`C.navy`) |
| `background.brandSoft` / `accentSoft` | brand-50 / accent-50 | `#FFE8EE`, `#FFF4F7` / `#E7F0F9`, `#E3ECF5` |
| `text.primary` | primary-700 | `#2C496A` (`C.pri`) |
| `text.secondary` | primary-600 | `#3E5C7D` (`C.body`) |
| `text.muted` | neutral-600 | `#8892A3` (`C.muted`), **darker, see below** |
| `text.placeholder` | neutral-400 | `#8892A3` for placeholders and inactive icons only |
| `text.link` | accent-600 | sky-blue text |
| `text.onBrand` | primary-900 | white labels on pink, **see below** |
| `border.subtle` / `default` / `strong` | neutral-50 / 100 / 300 | `#EEF3F8` / `#D4E0EC`, `#DCE6F0` / `#A9B4C2` |
| `action.primary` | brand-300, pressed brand-200, label primary-900 | pink CTA |
| `action.secondary` | primary-700, pressed primary-800, label white | navy button |
| `action.accent` | accent-300, pressed accent-400, label primary-900 | sky-blue chips |
| `status.danger` / `success` | text 600, background 50, solid 600 / 500 | `#D64545` / `#3BB273`, `#2E8A5D` |
| `decorative.heart` / `accent` / `shadow` | brand-300 / accent-300 / accent-50 | hearts, icons, `C.shadow` |

## Accessibility: changes that need sign-off

Checked with WCAG 2.1 (normal text needs 4.5:1; icons and large UI need 3:1).
The tokens already use the passing option. These are visible changes, so
approve them before Phase 5 rolls them out.

| Today | Contrast | Token instead | Contrast |
|---|---:|---|---:|
| Muted text `#8892A3` on white | 3.14 ✗ | `text.muted` = neutral-600 `#59616F` | 6.24 ✓ |
| Muted text `#8892A3` on `#F1F7FD` | 2.91 ✗ | same, on `background.canvas` | 5.57 ✓ |
| **White** label on pink `#FF6B8B` | 2.72 ✗ | **navy** label (primary-900) on the same pink | 6.06 ✓ |
| White on sky blue `#74B4F2` | 2.20 ✗ | navy label (primary-900) on accent-300 | 7.49 ✓ |
| White on green `#3BB273` | 2.69 ✗ | white on success-500 `#07814C` | 4.94 ✓ |
| White on red `#D64545` | 4.38 ✗ | white on danger-600 `#B22E31` | 6.31 ✓ |

**Pink buttons: decided (22 Oct 2026). Navy labels on the existing pink.**
PREMA keeps its signature pink `#FF6B8B`; button labels change from white to
navy (`text.onBrand`, primary-900, 6.06:1). The rejected alternative was white
labels on a darker pink (brand-500 `#BF405F`, 5.10:1). Pressed pink goes
*lighter* (brand-200), because a darker pressed pink would drop the navy label
to 4.46:1. The other rows above still need sign-off before Phase 5.

## Open question: the light-surfaces gap

Found in Phase 3. The app layers pale blue surfaces 1–8% lightness apart
(page `#F1F7FD`, panels `#F6F9FC`, `#EDF3F9`, `#E6EEF6`, `#E3EDF7`, `#DDE7F1`,
selected cards `#DCEBFA`), but the palette jumps from 50 (~96%) to 100 (~89%).
Mapping those surfaces to the nearest shade makes panels vanish into the card
or page behind them. Checked on Send Note: the grounding panel and the
selected prompt card both disappeared, so Phase 3 kept the surface names at
their original values.

Decide before Phase 4 touches surfaces. The likely fix is finer light stops
(for example 25 and 75, or a dedicated surface scale) in the generator, chosen
so each layer keeps its contrast with the layer behind it.

## Migration plan

Each phase is its own PR, reviewed with before/after screenshots. CI runs the
contrast tests on every PR.

| Phase | What | Screens change? | Size |
|---|---|---|---|
| **0** | Palette, tokens, tests, generator, docs | No | Done |
| **1** | Point the shared `C` in `components/prema-ui.tsx` at the palette, keeping the key names. 33 screens follow automatically. `C.muted` and `C.danger` keep their exact current shades (neutral-400, danger-500) until Phase 5. | Barely: every `C` value moves by ΔE 0.025 or less | Done |
| **2** | Replace the four copied palettes (`MatchDetail`, `(tabs)/profile`, onboarding, `CelestialBackground`) with `C` or tokens. Wait for in-progress work on `MatchDetail` and `profile` to merge first. | Slightly: `MatchDetail`'s drifted greys (`#4A6585`, `#7D8DA3`) line up with the rest of the app | 4 files |
| **3** | Generate the Tailwind colours in `tailwind.config.js` from `palette.json`: all six ramps become classes (`bg-brand-300`…), the used text and accent names point at palette shades, and 32 unused mockup names are removed. **The surface names kept their original values** (see the light-surfaces gap below). After the unreachable Send Note screen was removed (#21), the 15 names only it used were dropped; `surface-variant` and `coral` remain, as Discover shadow colours | Only the `secondary` blue on Send Note: `#4A90D9` → accent-500 `#487FB4`, slightly deeper, and contrast on white goes from 3.34 to 4.23 | Done |
| **4** | Swap the 507 hard-coded hex values, screen by screen, using the [map](colour-migration-map.md): **exact** (181 uses) first, then **close** (212), then **review** (103) by hand. The 9 **warm art** colours (gold and peach glows in `Aura` and `CelestialBackground`) stay as named constants in those components; they're illustration, not UI. Then the ~180 `rgba()` and short-hex values. | Exact: no. Close: barely. Review: yes, check each | ~40 files |
| **5** | Accessibility changes above: labels on pink (**approved**: navy), plus muted text and labels on blue, green and red (need sign-off) | **Yes** | After 4 |
| **6** | Guardrail: a CI check that fails on new hex colours outside `src/theme/` and the two art components | No | Small |

**Order matters:** Phase 1 gives the most consistency for the least risk. Phase 4
is mechanical once 1–3 are in. Phase 5 is a design decision, kept separate so it
can be approved on its own.
