#!/usr/bin/env python3
"""Generate the PREMA colour palette (OKLCH, Tailwind stops) from the brand colours.

For each source colour: keep its OKLCH hue, lock the exact source hex at the stop
nearest its own lightness, step lightness evenly from 96% (stop 50) down to the
source and from the source down to 16% (stop 950), taper chroma towards both ends,
and reduce chroma further if a shade falls outside sRGB.

Usage (from the repo root):
  python3 tools/colour/generate_palette.py --write   -> rewrites apps/mobile/src/theme/palette.json
  python3 tools/colour/generate_palette.py --table   -> prints a readable table
No dependencies. Change SOURCES (or the constants below) and re-run --write.
"""
import json
import math
import sys

SOURCES = [  # role, hex, where it comes from in the app
    ("primary", "#2C496A", "navy text and buttons (prema-ui C.pri)"),
    ("accent", "#74B4F2", "sky blue highlights (C.accent)"),
    ("brand", "#FF6B8B", "pink CTAs and hearts (C.pink)"),
    ("neutral", "#8892A3", "muted grey (C.muted)"),
    ("danger", "#D64545", "errors, destructive actions (C.danger)"),
    ("success", "#3BB273", "confirmations"),
]
STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
L_MAX, L_MIN = 96.0, 16.0  # Tailwind preset: lightest and darkest stop (OKLCH L, %)


# ── sRGB <-> OKLab (Björn Ottosson's reference matrices) ─────────────────────
def _to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02X}" for c in rgb)


def rgb_to_oklab(rgb):
    r, g, b = (_to_linear(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


def oklab_to_linear_rgb(L, a, b):
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def oklch_to_hex(L, C, h):
    """L in 0..1. Reduces chroma until the colour fits in sRGB."""
    for _ in range(60):
        a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
        lin = oklab_to_linear_rgb(L, a, b)
        if all(-1e-4 <= c <= 1 + 1e-4 for c in lin):
            return rgb_to_hex(tuple(_to_srgb(max(0, min(1, c))) for c in lin))
        C *= 0.95
    return rgb_to_hex(tuple(_to_srgb(max(0, min(1, c))) for c in oklab_to_linear_rgb(L, 0, 0)))


def hex_to_oklch(hx):
    L, a, b = rgb_to_oklab(hex_to_rgb(hx))
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def luminance(hx):
    return sum(w * _to_linear(c) for w, c in zip((0.2126, 0.7152, 0.0722), hex_to_rgb(hx)))


def contrast(h1, h2):
    a, b = sorted((luminance(h1), luminance(h2)), reverse=True)
    return (a + 0.05) / (b + 0.05)


# Chroma kept at the lightest / darkest stop, as a fraction of the source chroma.
# Tapering keeps tints soft (like the app's #F1F7FD backgrounds) and shades deep.
CHROMA_AT_LIGHTEST, CHROMA_AT_DARKEST = 0.25, 0.65


def build():
    """Per colour: the source sits exactly on its nearest stop; lightness steps evenly
    from 96% down to the source, and from the source down to 16%. Chroma tapers
    linearly from the source towards each end."""
    even = {s: L_MAX - i * (L_MAX - L_MIN) / (len(STOPS) - 1) for i, s in enumerate(STOPS)}
    palette = {}
    for role, hx, _ in SOURCES:
        L, C, h = hex_to_oklch(hx)
        Ls = L * 100
        src = min(STOPS, key=lambda s: abs(even[s] - Ls))
        i_src = STOPS.index(src)
        shades = {}
        for i, s in enumerate(STOPS):
            if s == src:
                shades[str(s)] = hx.upper()
                continue
            if i < i_src:   # lighter than the source
                t = (i_src - i) / i_src
                Li = Ls + t * (L_MAX - Ls)
                Ci = C * (1 - t * (1 - CHROMA_AT_LIGHTEST))
            else:           # darker than the source
                t = (i - i_src) / (len(STOPS) - 1 - i_src)
                Li = Ls - t * (Ls - L_MIN)
                Ci = C * (1 - t * (1 - CHROMA_AT_DARKEST))
            shades[str(s)] = oklch_to_hex(Li / 100, Ci, h)
        shades["_source"] = str(src)
        palette[role] = shades
    return palette


if __name__ == "__main__":
    import os
    p = build()
    if "--table" in sys.argv:
        for role, shades in p.items():
            src = shades["_source"]
            print(f"{role:8} " + " ".join(f"{s}:{shades[str(s)]}{'*' if str(s) == src else ''}" for s in STOPS))
    elif "--write" in sys.argv:
        out = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "mobile", "src", "theme", "palette.json")
        data = {role: {k: v for k, v in shades.items() if k != "_source"} for role, shades in p.items()}
        data["_meta"] = {
            "generatedBy": "tools/colour/generate_palette.py",
            "scale": "OKLCH lightness 96% (50) to 16% (950), Tailwind stops",
            "sources": {role: {"hex": hx, "stop": p[role]["_source"], "usedFor": why} for role, hx, why in SOURCES},
        }
        with open(os.path.normpath(out), "w") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print("wrote", os.path.normpath(out))
    else:
        print(json.dumps(p, indent=2))
