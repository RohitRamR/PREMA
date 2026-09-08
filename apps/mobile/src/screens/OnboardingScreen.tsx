import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Dimensions, Image, Pressable, Platform, Animated as RNAnimated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { colors, spacing, typography } from '../theme/theme';
import { Button } from '../components/Button';
import CelestialBackground from '../../components/CelestialBackground';

const { width: SW, height: SH } = Dimensions.get('window');

function PremaLogoMark({ size = 34, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Image 
      source={require('../../assets/images/logo.png')} 
      style={{ width: size * 3.2, height: size, resizeMode: 'contain' }}
    />
  );
}

const GRID_COLUMN_1 = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
];

const GRID_COLUMN_2 = [
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
];

const GRID_COLUMN_3 = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
];

export const OnboardingScreen = () => {
  const [step, setStep] = useState(0);

  // Marquee Column Animations
  const col1Anim = useRef(new RNAnimated.Value(0)).current;
  const col2Anim = useRef(new RNAnimated.Value(0)).current;
  const col3Anim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const startMarquee = (anim: RNAnimated.Value, duration: number) => {
      RNAnimated.loop(
        RNAnimated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startMarquee(col1Anim, 22000);
    startMarquee(col2Anim, 28000);
    startMarquee(col3Anim, 18000);
  }, []);

  const colWidth = Math.floor((SW - 32 - 16) / 3);
  const cardHeight = Math.round(SH * 0.19);
  const cardGap = 10;
  const singleCycleHeight = GRID_COLUMN_1.length * (cardHeight + cardGap);

  const translateY1 = col1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-singleCycleHeight, 0],
  });

  const translateY2 = col2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -singleCycleHeight],
  });

  const translateY3 = col3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-singleCycleHeight, 0],
  });

  const columnsData = [
    { data: GRID_COLUMN_1, anim: translateY1, id: 'col1' },
    { data: GRID_COLUMN_2, anim: translateY2, id: 'col2' },
    { data: GRID_COLUMN_3, anim: translateY3, id: 'col3' },
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={{ width: SW, height: SH, backgroundColor: '#F1F7FD', position: 'relative' }}>
            {/* PREMA Celestial Background */}
            <CelestialBackground />

            {/* Background Photo Collage Grid */}
            <View style={{
              paddingHorizontal: 16,
              paddingTop: Platform.OS === 'ios' ? 48 : 24,
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: SH * 0.94,
              overflow: 'hidden',
              zIndex: 2,
            }}>
              {columnsData.map((colObj, colIdx) => (
                <RNAnimated.View
                  key={colObj.id}
                  style={{
                    width: colWidth,
                    gap: cardGap,
                    marginTop: colIdx === 1 ? -16 : 0,
                    transform: [{ translateY: colObj.anim }],
                  }}
                >
                  {[...colObj.data, ...colObj.data].map((imgUrl, imgIdx) => (
                    <View key={imgIdx} style={{
                      width: colWidth,
                      height: cardHeight,
                      borderRadius: 18,
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1.5,
                      borderColor: 'rgba(255, 255, 255, 0.95)',
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 4,
                    }}>
                      <Image
                        source={{ uri: imgUrl }}
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                      />
                      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'rgba(44, 73, 106, 0.05)' }} />
                    </View>
                  ))}
                </RNAnimated.View>
              ))}
            </View>

            {/* Soft Tint */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(241, 247, 253, 0.2)',
              zIndex: 3,
            }} pointerEvents="none" />

            {/* Center Floating Brand Logo (Pure White with Slight Border Shadow Only) */}
            <View style={{
              position: 'absolute',
              top: '30%',
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }} pointerEvents="none">
              <Image
                source={require('../../assets/images/logo.png')}
                style={{
                  width: 250,
                  height: 90,
                  resizeMode: 'contain',
                  tintColor: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}
              />
            </View>

            {/* Bottom Actions Container with Coral Gradient Overlay */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: SH * 0.46,
              justifyContent: 'flex-end',
              zIndex: 10,
            }}>
              {/* Coral Gradient Overlay fading up over photo grid */}
              <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs>
                  <LinearGradient id="coralBottomGradientOnboarding" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FF6B8B" stopOpacity="0" />
                    <Stop offset="0.25" stopColor="#FF6B8B" stopOpacity="0.75" />
                    <Stop offset="0.65" stopColor="#EE5274" stopOpacity="0.95" />
                    <Stop offset="1" stopColor="#C93B57" stopOpacity="0.99" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#coralBottomGradientOnboarding)" />
              </Svg>

              {/* Content over Coral Gradient */}
              <View style={{
                paddingHorizontal: 24,
                paddingBottom: Platform.OS === 'ios' ? 72 : 56,
                gap: 16,
                zIndex: 11,
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 12, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                  {'By tapping on "Get Started", you agree to our\n'}
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', textDecorationLine: 'underline' }}>
                    Privacy Policy
                  </Text>
                  {' & '}
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', textDecorationLine: 'underline' }}>
                    Terms of Service
                  </Text>
                </Text>

                {/* Main CTA: Prominent White Pill Button */}
                <Pressable
                  onPress={() => setStep(1)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: '#172B3A', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
                    Get Started
                  </Text>
                </Pressable>

                {/* Secondary CTA: Continue as a guest */}
                <Pressable
                  onPress={() => setStep(3)}
                  style={{
                    width: '100%',
                    paddingVertical: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: '700',
                    letterSpacing: 0.2,
                    textAlign: 'center',
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3
                  }}>
                    Continue as a guest
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>What's your name?</Text>
            <TextInput style={styles.input} placeholder="First Name" placeholderTextColor={colors.textMuted} />
            <View style={styles.spacer} />
            <Button title="Continue" onPress={() => setStep(2)} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Building your Compatibility DNA</Text>
            <Text style={styles.subtitle}>We look at astrology, values, and lifestyle to find the right people for you.</Text>
            <View style={styles.spacer} />
            <Button title="Generate DNA" onPress={() => setStep(3)} />
          </View>
        );
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>All Set</Text>
            <Text style={styles.subtitle}>Your curated matches are ready.</Text>
            <View style={styles.spacer} />
            <Button title="View Matches" onPress={() => setStep(0)} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={step === 0 ? { flex: 1 } : styles.container}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  input: {
    height: 56,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  spacer: {
    flex: 1,
  }
});
