// Soft fade behind the status bar so scrolling content melts away instead of
// stopping at a hard-edged band under the clock.
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatusFade({ color = '#F1F7FD', extra = 28 }: { color?: string; extra?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + extra }}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="statusFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={1} />
            <Stop offset="0.55" stopColor={color} stopOpacity={0.85} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#statusFade)" />
      </Svg>
    </View>
  );
}
