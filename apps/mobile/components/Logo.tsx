import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  tintColor?: string;
}

export default function Logo({ width = 140, height = 50, style, tintColor }: LogoProps) {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={[
        {
          width,
          height,
          resizeMode: 'contain',
        },
        tintColor ? { tintColor } : null,
        style,
      ]}
    />
  );
}
