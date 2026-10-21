// Heart formed by two hands shaking: PREMA's "Meet" mark.
// The hand outlines are cut out of the heart in `cut` (the colour behind it).
import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

const HEART = 'M50 30 C44 23 33 21 26 26 C19 31 18 42 22 50 C26 58 40 68 50 77 C60 68 74 58 78 50 C82 42 81 31 74 26 C67 21 56 23 50 30 Z';

export default function HandshakeHeart({ size = 36, color = '#FFFFFF', cut = '#FF6685' }: { size?: number; color?: string; cut?: string }) {
  return (
    <Svg width={size} height={size} viewBox="18 18 64 64">
      <Defs>
        <ClipPath id="hsHeart"><Path d={HEART} /></ClipPath>
      </Defs>
      <Path d={HEART} fill={color} />
      <G clipPath="url(#hsHeart)" stroke={cut} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d="M48.5 27 L63.5 41.5 Q66.5 45 62 45.8 L56 45.8 Q54 45.8 52.5 44.3 L46.2 37.6 Q44 35.4 41.8 37.6 L20 59" />
        <Path d="M44.5 49.5 L28 66" />
        <Path d="M50.5 55.5 L36 70" />
        <Path d="M56.5 61.5 L44 74" />
      </G>
    </Svg>
  );
}
