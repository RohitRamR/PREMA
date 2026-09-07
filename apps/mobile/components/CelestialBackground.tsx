import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const C = {
  pri: '#2C496A',
  pink: '#FF6B8B',
  accent: '#74B4F2',
  yellow: '#FFDF00',
  glow: '#FFF8B0'
};

export default function CelestialBackground({ scrollX }: { scrollX?: Animated.Value }) {
  const fallbackScrollX = useRef(new Animated.Value(0)).current;
  const activeScrollX = scrollX || fallbackScrollX;
  const blink1 = useRef(new Animated.Value(0)).current;
  const blink2 = useRef(new Animated.Value(0)).current;
  const blink3 = useRef(new Animated.Value(0)).current;
  const blink4 = useRef(new Animated.Value(0)).current;
  
  const shoot1 = useRef(new Animated.Value(0)).current;
  const shoot2 = useRef(new Animated.Value(0)).current;
  const shoot3 = useRef(new Animated.Value(0)).current;
  const shoot4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // High-shine glitter loop (sharp fades and double pulses)
    const createGlitter = (val: Animated.Value, delay: number, speed: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: speed, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: speed * 0.5, useNativeDriver: true }),
          Animated.timing(val, { toValue: 1, duration: speed * 0.5, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: speed * 1.5, useNativeDriver: true }),
          Animated.delay(speed * 2)
        ])
      ).start();
    };

    createGlitter(blink1, 0, 800);
    createGlitter(blink2, 1200, 1000);
    createGlitter(blink3, 600, 600);
    createGlitter(blink4, 2000, 900);

    // Shooting stars loop
    const createShootingStar = (val: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }) // reset immediately
        ])
      ).start();
    };

    createShootingStar(shoot1, 2500); // Shoots more frequently
    createShootingStar(shoot2, 5500);
  }, []);

  // Opacity & Scale Interpolations for ultimate shine
  const getOp = (val: Animated.Value) => val.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const getScale = (val: Animated.Value) => val.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.4] });

  // Rotating moon tied to user swipe
  const moonRotate = activeScrollX.interpolate({
    inputRange: [0, width * 5],
    outputRange: ['0deg', '360deg']
  });

  // Shoot 1 translation (Top right to bottom left)
  const s1X = shoot1.interpolate({ inputRange: [0, 1], outputRange: [width + 50, -150] });
  const s1Y = shoot1.interpolate({ inputRange: [0, 1], outputRange: [-50, height * 0.5] });
  const s1ScaleX = shoot1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.5, 0] });
  
  // Shoot 2 translation (Top left to bottom right)
  const s2X = shoot2.interpolate({ inputRange: [0, 1], outputRange: [-100, width + 150] });
  const s2Y = shoot2.interpolate({ inputRange: [0, 1], outputRange: [100, height * 0.6] });
  const s2ScaleX = shoot2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 2, 0] });

  const s1Opacity = shoot1.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });
  const s2Opacity = shoot2.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.8, 0.8, 0] });

  // Shoot 3 translation (Bottom left to bottom right)
  const s3X = shoot3.interpolate({ inputRange: [0, 1], outputRange: [-150, width + 50] });
  const s3Y = shoot3.interpolate({ inputRange: [0, 1], outputRange: [height * 0.7, height * 0.9] });
  const s3ScaleX = shoot3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.8, 0] });
  const s3Opacity = shoot3.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.9, 0.9, 0] });

  // Shoot 4 translation (Bottom right to bottom left)
  const s4X = shoot4.interpolate({ inputRange: [0, 1], outputRange: [width + 100, -100] });
  const s4Y = shoot4.interpolate({ inputRange: [0, 1], outputRange: [height * 0.85, height * 0.65] });
  const s4ScaleX = shoot4.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.4, 0] });
  const s4Opacity = shoot4.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.8, 0.8, 0] });

  // Milky Way dense star cluster generator (diagonal band from bottom-left to top-right)
  const milkyWayStars = useRef(
    Array.from({ length: 60 }).map(() => {
      const x = Math.random() * width;
      const lineY = height - (height / width) * x; // Diagonal line
      const spread = (Math.random() - 0.5) * 250; // Scatter width
      return {
        cx: x,
        cy: lineY + spread,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      };
    })
  ).current;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]} pointerEvents="none">
      {/* ── Giant Gradient Orbs (Aurora Effect) ── */}
      <View style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: '#FFFFFF', opacity: 0.6 }} />
      <View style={{ position: 'absolute', top: '20%', right: -150, width: 300, height: 300, borderRadius: 150, backgroundColor: '#74B4F2', opacity: 0.12 }} />
      <View style={{ position: 'absolute', bottom: '10%', left: -150, width: 350, height: 350, borderRadius: 175, backgroundColor: '#FF6B8B', opacity: 0.08 }} />
      <View style={{ position: 'absolute', bottom: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: '#B1E0FE', opacity: 0.2 }} />

      {/* ── Milky Way Galaxy Dust Band ── */}
      <View style={{ position: 'absolute', top: '15%', left: '-50%', width: '200%', height: 160, backgroundColor: '#FFFFFF', opacity: 0.12, transform: [{ rotate: '-35deg' }], borderRadius: 80 }} />
      <View style={{ position: 'absolute', top: '25%', left: '-40%', width: '180%', height: 80, backgroundColor: '#74B4F2', opacity: 0.08, transform: [{ rotate: '-35deg' }], borderRadius: 40 }} />
      
      {/* ── Milky Way Dense Star Cluster ── */}
      <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
        <Svg width="100%" height="100%">
          {milkyWayStars.map((star, i) => (
            <Circle key={`mw-${i}`} cx={star.cx} cy={star.cy} r={star.r} fill="#FFFFFF" opacity={star.opacity} />
          ))}
        </Svg>
      </View>

      {/* ── Top Right Astrolabe ── */}
      <View style={{ position: 'absolute', top: -80, right: -150, width: 450, height: 450, borderRadius: 225, borderWidth: 1, borderColor: 'rgba(44,73,106,0.06)', borderStyle: 'dashed' }} />
      <View style={{ position: 'absolute', top: -20, right: -90, width: 330, height: 330, borderRadius: 165, borderWidth: 1, borderColor: 'rgba(44,73,106,0.04)' }} />
      
      {/* ── Bottom Left Planetary Orbits ── */}
      <View style={{ position: 'absolute', bottom: -100, left: -200, width: 500, height: 500, borderRadius: 250, borderWidth: 1, borderColor: 'rgba(116,180,242,0.15)', transform: [{ scaleY: 0.4 }, { rotate: '-25deg' }] }} />
      <View style={{ position: 'absolute', bottom: -50, left: -150, width: 400, height: 400, borderRadius: 200, borderWidth: 1, borderColor: 'rgba(255,107,139,0.08)', transform: [{ scaleY: 0.5 }, { rotate: '-15deg' }] }} />

      {/* ── Giant Rotating Full Moon ── */}
      <Animated.View style={{ 
        position: 'absolute', bottom: '0%', right: '-15%', 
        transform: [{ rotate: moonRotate }],
        shadowColor: '#B1E0FE', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30, elevation: 10,
        zIndex: 2
      }}>
        <Svg width="280" height="280" viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="48" fill="#FFFFFF" opacity="0.15" />
          <Circle cx="30" cy="40" r="14" fill="#74B4F2" opacity="0.15" />
          <Circle cx="70" cy="35" r="9" fill="#74B4F2" opacity="0.12" />
          <Circle cx="60" cy="70" r="18" fill="#74B4F2" opacity="0.15" />
          <Circle cx="25" cy="70" r="7" fill="#74B4F2" opacity="0.1" />
          <Circle cx="45" cy="20" r="6" fill="#74B4F2" opacity="0.12" />
        </Svg>
      </Animated.View>

      {/* ── Extra Stars Near Moon ── */}
      <Text style={{ position: 'absolute', bottom: '15%', right: '5%', fontSize: 14, opacity: 0.35, color: C.yellow }}>✦</Text>
      <Text style={{ position: 'absolute', bottom: '8%', right: '22%', fontSize: 10, opacity: 0.25, color: '#FFFFFF' }}>✧</Text>
      <Text style={{ position: 'absolute', bottom: '20%', right: '32%', fontSize: 16, opacity: 0.2, color: C.accent }}>✦</Text>

      {/* ── Static Symbols ── */}
      <Text style={{ position: 'absolute', bottom: '25%', right: '15%', fontSize: 20, opacity: 0.15, color: C.pri }}>✦</Text>
      <Text style={{ position: 'absolute', top: '25%', left: '8%', fontSize: 18, opacity: 0.08, color: C.pri }}>♀</Text>
      <Text style={{ position: 'absolute', bottom: '15%', left: '35%', fontSize: 22, opacity: 0.06, color: C.pri }}>☿</Text>
      <Text style={{ position: 'absolute', top: '45%', right: '18%', fontSize: 20, opacity: 0.08, color: C.pri }}>♃</Text>
      <Text style={{ position: 'absolute', bottom: '30%', right: '8%', fontSize: 24, opacity: 0.07, color: C.pri }}>☉</Text>

      {/* ── Animated High-Shine Glitter Stars ── */}
      <Animated.Text style={{ position: 'absolute', top: '15%', left: '18%', fontSize: 26, color: '#FFFFFF', textShadowColor: C.glow, textShadowRadius: 15, opacity: getOp(blink1), transform: [{ scale: getScale(blink1) }] }}>✦</Animated.Text>
      <Animated.Text style={{ position: 'absolute', top: '32%', right: '12%', fontSize: 18, color: '#FFFFFF', textShadowColor: C.yellow, textShadowRadius: 12, opacity: getOp(blink2), transform: [{ scale: getScale(blink2) }] }}>✧</Animated.Text>
      <Animated.Text style={{ position: 'absolute', top: '10%', right: '35%', fontSize: 22, color: '#FFFFFF', textShadowColor: C.glow, textShadowRadius: 15, opacity: getOp(blink3), transform: [{ scale: getScale(blink3) }] }}>✦</Animated.Text>
      <Animated.Text style={{ position: 'absolute', bottom: '45%', right: '25%', fontSize: 16, color: '#FFFFFF', textShadowColor: C.yellow, textShadowRadius: 10, opacity: getOp(blink4), transform: [{ scale: getScale(blink4) }] }}>✨</Animated.Text>
      
      {/* ── Animated Shooting Stars ── */}
      <Animated.View style={{
         position: 'absolute', width: 80, height: 2, backgroundColor: '#FFFFFF',
         borderRadius: 2, opacity: s1Opacity,
         transform: [{ translateX: s1X }, { translateY: s1Y }, { rotate: '-35deg' }, { scaleX: s1ScaleX }],
         shadowColor: C.yellow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 12, elevation: 8
       }} />

       <Animated.View style={{
         position: 'absolute', width: 60, height: 2, backgroundColor: '#FFFFFF',
         borderRadius: 2, opacity: s2Opacity,
         transform: [{ translateX: s2X }, { translateY: s2Y }, { rotate: '25deg' }, { scaleX: s2ScaleX }],
         shadowColor: C.glow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 6
       }} />
           <Animated.View style={{
         position: 'absolute', width: 70, height: 2, backgroundColor: '#FFFFFF',
         borderRadius: 2, opacity: s3Opacity,
         transform: [{ translateX: s3X }, { translateY: s3Y }, { rotate: '20deg' }, { scaleX: s3ScaleX }],
         shadowColor: C.yellow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 8
       }} />

       <Animated.View style={{
         position: 'absolute', width: 50, height: 2, backgroundColor: '#FFFFFF',
         borderRadius: 2, opacity: s4Opacity,
         transform: [{ translateX: s4X }, { translateY: s4Y }, { rotate: '-20deg' }, { scaleX: s4ScaleX }],
         shadowColor: C.glow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 6
       }} />
    </View>
  );
}
