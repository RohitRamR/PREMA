// A real arrow (shaft, head and feathered tail) for "send your arrow".
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function CupidArrow({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* shaft */}
      <Path d="M4 12 H17" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      {/* head */}
      <Path d="M14.5 6.8 L21.5 12 L14.5 17.2 Z" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
      {/* feathers */}
      <Path d="M7 12 L3.6 7.6 M7 12 L3.6 16.4 M10 12 L6.6 7.6 M10 12 L6.6 16.4"
        stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}
