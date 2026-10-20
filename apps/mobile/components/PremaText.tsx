// Drop-in replacement for React Native's <Text> that renders in Nunito when
// inside a <NunitoScope>. Outside the scope it behaves exactly like <Text>,
// so shared components can use it without changing unrelated screens.
//
// Scope today: Profile, Likes, Meet (and the PREMA Date screens under app/date).
//
// Custom fonts on iOS ignore `fontWeight`, so we pick the Nunito family that
// matches the requested weight — one step heavier than before so body copy
// doesn't read thin. The old italic Georgia headings become Nunito ExtraBold.
import React, { createContext, useContext } from 'react';
import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';

const NunitoContext = createContext(false);

export function NunitoScope({ children }: { children: React.ReactNode }) {
  return <NunitoContext.Provider value>{children}</NunitoContext.Provider>;
}

export const useNunito = () => useContext(NunitoContext);

const BY_WEIGHT: Record<string, string> = {
  '100': 'Nunito_500Medium',
  '200': 'Nunito_500Medium',
  '300': 'Nunito_500Medium',
  '400': 'Nunito_600SemiBold',
  normal: 'Nunito_600SemiBold',
  '500': 'Nunito_600SemiBold',
  '600': 'Nunito_700Bold',
  '700': 'Nunito_800ExtraBold',
  bold: 'Nunito_800ExtraBold',
  '800': 'Nunito_800ExtraBold',
  '900': 'Nunito_900Black',
};

export function nunito(style: TextStyle | undefined): TextStyle {
  const flat = style ?? {};
  const isDisplay = flat.fontFamily === 'Georgia';
  const family = isDisplay
    ? 'Nunito_800ExtraBold'
    : BY_WEIGHT[String(flat.fontWeight ?? '400')] ?? 'Nunito_600SemiBold';
  return {
    fontFamily: family,
    fontWeight: undefined,
    fontStyle: 'normal',
    // Display headings were tuned for an italic serif; tighten them a touch.
    ...(isDisplay ? { letterSpacing: -0.4 } : null),
  };
}

export default function Text({ style, ...rest }: TextProps) {
  const on = useNunito();
  if (!on) return <RNText {...rest} style={style} />;
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  return <RNText {...rest} style={[style, nunito(flat)]} />;
}
