// Shared building blocks for PREMA screens built with plain RN styles.
// Palette + patterns match Discover / Match Detail / Profile.
import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Switch, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import Text from './PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';

export const C = {
  bg: '#F1F7FD',
  pri: '#2C496A',
  body: '#3E5C7D',
  muted: '#8892A3',
  accent: '#74B4F2',
  accentSoft: '#E7F0F9',
  pink: '#FF6B8B',
  pinkSoft: '#FFE8EE',
  navy: '#1A2E44',
  shadow: '#E3EDF7',
  line: '#EEF3F8',
  white: '#FFFFFF',
  danger: '#D64545',
};

export const cardShadow: ViewStyle = {
  shadowColor: C.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 2,
};

export const serif: TextStyle = { fontFamily: 'Georgia', fontStyle: 'italic' };

/**
 * Pressable with pressed feedback. NativeWind's Pressable interop ignores
 * function-style `style`, so we track the pressed state ourselves and always
 * pass a plain, flattened style object.
 */
export function Tap({
  style, pressedStyle = { opacity: 0.75 }, children, ...rest
}: React.ComponentProps<typeof Pressable> & {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: ViewStyle;
  children?: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => { setPressed(true); rest.onPressIn?.(e); }}
      onPressOut={(e) => { setPressed(false); rest.onPressOut?.(e); }}
      style={StyleSheet.flatten([style, pressed ? pressedStyle : null])}
    >
      {children}
    </Pressable>
  );
}

/** Floating round back button + italic serif title, sitting on the canvas. */
export function ScreenHeader({
  title, eyebrow, right,
}: { title: string; eyebrow?: string; right?: React.ReactNode }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[ui.header, { paddingTop: insets.top + 6 }]}>
      <Tap onPress={() => router.back()} style={ui.roundBtn} accessibilityLabel="Go back">
        <Icon name="arrow_back" size={22} color={C.pri} />
      </Tap>
      <View style={{ flex: 1, marginLeft: 14 }}>
        {eyebrow ? <Text style={ui.eyebrow}>{eyebrow}</Text> : null}
        <Text style={ui.title} numberOfLines={1}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[ui.card, style]}>{children}</View>;
}

export function Label({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[ui.label, style]}>{children}</Text>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={ui.sectionLabel}>{children}</Text>;
}

/** Tappable/toggleable chip in the soft-sky style. */
export function Chip({
  label, selected, onPress, icon,
}: { label: string; selected?: boolean; onPress?: () => void; icon?: string }) {
  return (
    <Tap
      onPress={onPress}
      style={[ui.chip, selected ? ui.chipOn : null]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
    >
      {icon ? <Icon name={icon} size={16} color={selected ? C.white : C.accent} /> : null}
      <Text style={[ui.chipText, selected ? { color: C.white } : null]}>{label}</Text>
    </Tap>
  );
}

/** List row: round icon, title/subtitle, and a chevron or custom accessory. */
export function Row({
  icon, title, sub, onPress, right, last, tint = 'sky',
}: {
  icon: string; title: string; sub?: string; onPress?: () => void;
  right?: React.ReactNode; last?: boolean; tint?: 'sky' | 'pink';
}) {
  const body = (
    <>
      <View style={[ui.rowIcon, tint === 'pink' ? { backgroundColor: C.pinkSoft } : null]}>
        <Icon name={icon} size={20} color={tint === 'pink' ? C.pink : C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ui.rowTitle}>{title}</Text>
        {sub ? <Text style={ui.rowSub}>{sub}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron_right" size={22} color={C.muted} /> : null)}
    </>
  );
  const style = [ui.row, !last ? ui.rowDivider : null];
  return onPress
    ? <Tap onPress={onPress} style={style} pressedStyle={{ backgroundColor: 'rgba(116,180,242,0.06)' }}>{body}</Tap>
    : <View style={style}>{body}</View>;
}

export function ToggleRow({
  icon, title, sub, value, onValueChange, last,
}: {
  icon: string; title: string; sub?: string; value: boolean;
  onValueChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <Row
      icon={icon} title={title} sub={sub} last={last}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#DCE6F0', true: C.accent }}
          thumbColor={C.white}
          ios_backgroundColor="#DCE6F0"
        />
      }
    />
  );
}

export function PrimaryButton({
  label, onPress, icon, disabled,
}: { label: string; onPress?: () => void; icon?: string; disabled?: boolean }) {
  return (
    <Tap
      onPress={disabled ? undefined : onPress}
      style={[ui.primaryBtn, disabled ? { backgroundColor: '#C3CFDC', shadowOpacity: 0 } : null]}
      pressedStyle={{ opacity: 0.85 }}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      {icon ? <Icon name={icon} size={18} color={C.white} /> : null}
      <Text style={ui.primaryBtnText}>{label}</Text>
    </Tap>
  );
}

export const ui = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center', ...cardShadow,
  },
  eyebrow: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { color: C.pri, fontSize: 28, lineHeight: 34, ...serif },

  card: { backgroundColor: C.white, borderRadius: 24, padding: 20, marginBottom: 16, ...cardShadow },
  label: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  sectionLabel: {
    color: C.muted, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase',
    marginTop: 8, marginBottom: 12, marginLeft: 4,
  },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.accentSoft, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  chipOn: { backgroundColor: C.pri },
  chipText: { color: C.body, fontSize: 14, fontWeight: '600' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  rowIcon: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.accentSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: C.pri, fontSize: 16, fontWeight: '600' },
  rowSub: { color: C.muted, fontSize: 13, marginTop: 2 },

  primaryBtn: {
    height: 54, borderRadius: 27, backgroundColor: C.pink,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  primaryBtnText: { color: C.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
});
