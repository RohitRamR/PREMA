// Aura — PREMA shows match strength with colour only, never a number or name.
// Lowest → highest: sky blue, lilac, rose, gold.
// The compatibility score drives the colour; screen readers still get a level.
import React, { useState } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle, Rect } from 'react-native-svg';
import Text from './PremaText';

export type AuraTier = {
  level: 1 | 2 | 3 | 4; // 4 = highest
  a11y: string; // spoken description only
  colors: [string, string, string];
};

// Ordered lowest → highest.
export const AURA_TIERS: AuraTier[] = [
  { level: 1, a11y: 'Gentle alignment', colors: ['#74B4F2', '#A9D8F5', '#CFE6FA'] },
  { level: 2, a11y: 'Good alignment', colors: ['#A58FEA', '#C9B8F5', '#E3B6E8'] },
  { level: 3, a11y: 'Strong alignment', colors: ['#FF6B8B', '#FFA3B5', '#FFB199'] },
  { level: 4, a11y: 'Highest alignment', colors: ['#F5B94A', '#FFD77A', '#FF9F6B'] },
];

/** Map a 0–100 compatibility score to an aura tier. */
export function auraFor(score: number): AuraTier {
  if (score >= 94) return AURA_TIERS[3];
  if (score >= 90) return AURA_TIERS[2];
  if (score >= 86) return AURA_TIERS[1];
  return AURA_TIERS[0];
}

let uid = 0;
const useGradId = (p: string) => React.useMemo(() => `${p}-${uid++}`, []);

// ── Gold shimmer ────────────────────────────────────────────────────────────
// Only the highest (gold) aura animates: its gradient slowly sweeps around so
// a bright highlight travels along the ring/border. One shared ticker drives
// every gold element on screen, and it only runs while something subscribes.
const SWEEP_MS = 8000; // one slow, calm lap
let sweepAngle = 0;
let sweepFrame: number | null = null;
const sweepListeners = new Set<() => void>();

function subscribeSweep(l: () => void) {
  sweepListeners.add(l);
  if (sweepFrame === null) {
    // Resume from the current angle so re-subscribing never jumps.
    const start = Date.now() - (sweepAngle / (2 * Math.PI)) * SWEEP_MS;
    const tick = () => {
      sweepAngle = (((Date.now() - start) % SWEEP_MS) / SWEEP_MS) * 2 * Math.PI;
      sweepListeners.forEach((fn) => fn());
      sweepFrame = requestAnimationFrame(tick); // display-synced, ~60fps
    };
    sweepFrame = requestAnimationFrame(tick);
  }
  return () => {
    sweepListeners.delete(l);
    if (sweepListeners.size === 0 && sweepFrame !== null) { cancelAnimationFrame(sweepFrame); sweepFrame = null; }
  };
}
const noopSubscribe = () => () => {};
const getSweep = () => sweepAngle;
const getStill = () => Math.PI / 4; // static diagonal for non-gold tiers

function useGradientAngle(animated: boolean) {
  return React.useSyncExternalStore(animated ? subscribeSweep : noopSubscribe, animated ? getSweep : getStill, getStill);
}

// Gold gets a bright champagne highlight between its warm tones.
// Many close stops = a soft, feathered highlight instead of a hard band.
const GOLD_SHIMMER = ['#EBA83E', '#F2B954', '#FCD58A', '#FFEBB8', '#FFF4D6', '#FFE6AA', '#FBCB72', '#F5AE55', '#F09A4C'];

function Grad({ id, tier }: { id: string; tier: AuraTier }) {
  const gold = tier.level === 4;
  const a = useGradientAngle(gold);
  const dx = Math.cos(a) / 2, dy = Math.sin(a) / 2;
  const stops = gold ? GOLD_SHIMMER : tier.colors;
  return (
    <Defs>
      <LinearGradient id={id} x1={0.5 - dx} y1={0.5 - dy} x2={0.5 + dx} y2={0.5 + dy}>
        {stops.map((c, i) => <Stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
      </LinearGradient>
    </Defs>
  );
}

/** A gradient ring in the aura's colours, wrapped around its children (an avatar). */
export function AuraRing({ score, size, stroke = 3, gap = 3, children, style }: {
  score: number; size: number; stroke?: number; gap?: number; children: React.ReactNode; style?: ViewStyle;
}) {
  const tier = auraFor(score);
  const id = useGradId('ring');
  const r = (size - stroke) / 2;
  return (
    <View
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
      accessible
      accessibilityLabel={tier.a11y}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Grad id={id} tier={tier} />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={`url(#${id})`} strokeWidth={stroke} fill="none" />
      </Svg>
      <View style={{ width: size - (stroke + gap) * 2, height: size - (stroke + gap) * 2, borderRadius: size, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

/** Gradient border in the aura's colours, laid over a rounded card. */
export function AuraFrame({ score, radius, width = 4 }: { score: number; radius: number; width?: number }) {
  const tier = auraFor(score);
  const id = useGradId('frame');
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      accessible
      accessibilityLabel={tier.a11y}
    >
      {size ? (
        <Svg width={size.w} height={size.h}>
          <Grad id={id} tier={tier} />
          <Rect
            x={width / 2} y={width / 2}
            width={size.w - width} height={size.h - width}
            rx={Math.max(0, radius - width / 2)}
            fill="none" stroke={`url(#${id})`} strokeWidth={width}
          />
        </Svg>
      ) : null}
    </View>
  );
}

/** Colour-only capsule for places without a ring (e.g. on a photo). */
export function AuraChip({ score, width = 30, height = 12, style }: { score: number; width?: number; height?: number; style?: ViewStyle }) {
  const tier = auraFor(score);
  const id = useGradId('chip');
  return (
    <View style={[s.chipWrap, style]} accessible accessibilityLabel={tier.a11y}>
      <Svg width={width} height={height}>
        <Grad id={id} tier={tier} />
        <Rect x={0} y={0} width={width} height={height} rx={height / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/** Small key: lower → higher, the four colours in order. */
export function AuraLegend({ style }: { style?: ViewStyle }) {
  return (
    <View style={[s.legend, style]} accessible accessibilityLabel="Ring colour shows alignment, from blue for lower to gold for highest">
      <Text style={s.legendText}>Lower</Text>
      {AURA_TIERS.map((t) => <LegendDot key={t.level} tier={t} />)}
      <Text style={s.legendText}>Higher</Text>
    </View>
  );
}

function LegendDot({ tier }: { tier: AuraTier }) {
  const id = useGradId('dot');
  return (
    <Svg width={12} height={12}>
      <Grad id={id} tier={tier} />
      <Circle cx={6} cy={6} r={6} fill={`url(#${id})`} />
    </Svg>
  );
}

const s = StyleSheet.create({
  chipWrap: { padding: 3, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.92)', alignSelf: 'flex-start' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendText: { color: '#8892A3', fontSize: 11.5, fontWeight: '700' },
});
