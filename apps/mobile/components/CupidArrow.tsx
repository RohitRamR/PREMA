// A little Cupid's arrow for "send your arrow": heart-shaped tip,
// rounded shaft and soft leaf-like feathers.
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CupidArrow({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* shaft */}
      <Path d="M4.5 12 H15" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      {/* heart tip, pointing right */}
      <Path
        d="M22.4 12 C19.6 7.6 17.6 6.2 15.8 6.2 C14.2 6.2 13.2 7.4 13.2 8.9 C13.2 10 13.8 11 14.6 12 C13.8 13 13.2 14 13.2 15.1 C13.2 16.6 14.2 17.8 15.8 17.8 C17.6 17.8 19.6 16.4 22.4 12 Z"
        fill={color}
      />
      {/* soft feathers */}
      <Path d="M7.6 12 C6.3 9.2 4.6 7.9 2.6 8 C3.2 10 4.9 11.5 7.6 12 Z" fill={color} opacity={0.9} />
      <Path d="M7.6 12 C6.3 14.8 4.6 16.1 2.6 16 C3.2 14 4.9 12.5 7.6 12 Z" fill={color} opacity={0.9} />
      <Path d="M10.4 12 C9.4 10 8.2 9.1 6.8 9.1 C7.2 10.6 8.4 11.6 10.4 12 Z" fill={color} opacity={0.75} />
      <Path d="M10.4 12 C9.4 14 8.2 14.9 6.8 14.9 C7.2 13.4 8.4 12.4 10.4 12 Z" fill={color} opacity={0.75} />
    </Svg>
  );
}
