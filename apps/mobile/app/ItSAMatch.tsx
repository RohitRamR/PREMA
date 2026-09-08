import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withSpring, 
  Easing 
} from 'react-native-reanimated';
import { colors, spacing, radii } from '../src/theme/theme';
import Icon from '../components/Icon';
import { CelestialBackground } from '../components/CelestialBackground';

const PREMA_THEME = { colors, spacing, radii };

export default function ItSAMatch() {
  const router = useRouter();

  // Animation values for the floating FLOW
  const floatY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Pop in effect
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Continuous floating animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true // reverse
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: scale.value }
    ],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={StyleSheet.absoluteFill}>
        <CelestialBackground intensity="match" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Dismiss Button */}
        <Pressable 
          style={styles.dismissButton} 
          onPress={() => router.back()}
        >
          <Icon name="close" size={20} color={PREMA_THEME.colors.deepNavy} />
        </Pressable>

        {/* ── Avatar Heartbeat Container ── */}
        <View style={styles.avatarArena}>
          
          <View style={styles.avatarLeft}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }}
              style={styles.avatarImage}
            />
          </View>
          
          {/* Animated floating FLOW replacing the flower */}
          <Animated.View style={[styles.centerFlower, floatingStyle]}>
            <Text style={styles.flowText}>FLOW</Text>
          </Animated.View>

          <View style={styles.avatarRight}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' }}
              style={styles.avatarImage}
            />
          </View>
          
        </View>

        {/* ── Match Details ── */}
        <View style={styles.matchDetails}>
          <Text style={styles.matchSubtitle}>
            PREMA thinks you two have something worth exploring with care and presence.
          </Text>
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionContainer}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.push('/SendIntentionalNote')}
          >
            <Icon name="mark_email_read" size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>Send Intentional Note</Text>
          </Pressable>

          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.push('/CompatibilityBreakdown')}
          >
            <Icon name="insights" size={18} color={PREMA_THEME.colors.skyBlue} />
            <Text style={styles.secondaryButtonText}>Explore Compatibility Breakdown</Text>
          </Pressable>

          <Pressable 
            style={styles.textButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.textButtonLabel}>Keep Discovering</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC', 
  },
  scrollContent: {
    padding: 24,
    minHeight: '100%',
    justifyContent: 'center', 
  },
  dismissButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  avatarArena: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  avatarLeft: {
    marginRight: -10, // Overlap slightly with FLOW
    zIndex: 2,
  },
  avatarRight: {
    marginLeft: -10, // Overlap slightly with FLOW
    zIndex: 2,
  },
  centerFlower: {
    zIndex: 10, // Ensure FLOW floats above the avatars!
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  flowText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FF6B8B', // Pastel Pink
    letterSpacing: -2,
    textShadowColor: 'rgba(255,107,139,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  matchDetails: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  matchSubtitle: {
    fontSize: 16,
    color: PREMA_THEME.colors.mutedBlueGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: PREMA_THEME.colors.deepNavy,
    borderRadius: 999,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: PREMA_THEME.colors.deepNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: PREMA_THEME.colors.cardBg,
    borderRadius: 999,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(44,73,106,0.1)',
  },
  secondaryButtonText: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonLabel: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 15,
    fontWeight: '600',
  },
});
