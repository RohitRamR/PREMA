import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  TextInput,
  StatusBar,
  Animated as RNAnimated,
  KeyboardAvoidingView,
  Platform,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Icon from '../../components/Icon';
import CelestialBackground from '../../components/CelestialBackground';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  bg: '#F1F7FD',
  card: '#FFFFFF',
  pri: '#2C496A',
  accent: '#74B4F2',
  pink: '#FF6B8B',
  muted: '#8892A3',
  light: '#E7F0F9',
  ground: '#D4E2F0',
};

function PremaLogoMark({ size = 34, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Image 
      source={require('../../assets/images/logo.png')} 
      style={{ width: size * 3.2, height: size, resizeMode: 'contain', tintColor: color }}
    />
  );
}

const GRID_COLUMN_1 = [
  require('../../assets/images/adesh-bankar-t0uFIywV6g4-unsplash.jpg'),
  require('../../assets/images/anthony-tran-3Xkms-gMvZg-unsplash.jpg'),
  require('../../assets/images/arrul-lin-sYhUhse5uT8-unsplash.jpg'),
  require('../../assets/images/caleb-ekeroth-wSBQFWF77lI-unsplash.jpg')
];

const GRID_COLUMN_2 = [
  require('../../assets/images/carly-rae-hobbins-zNHOIzjJiyA-unsplash.jpg'),
  require('../../assets/images/d-ng-h-u-CCjgYjUudxE-unsplash.jpg'),
  require('../../assets/images/fortune-vieyra-qC7jvmbEmRQ-unsplash.jpg'),
  require('../../assets/images/pargat-dhillon-SO3Hyvh_J6c-unsplash.jpg')
];

const GRID_COLUMN_3 = [
  require('../../assets/images/pravin-suthar-3ua7SFahVgQ-unsplash.jpg'),
  require('../../assets/images/priscilla-du-preez-xM4wUnvbCKk-unsplash.jpg'),
  require('../../assets/images/raamin-ka-uR51HXLO7G0-unsplash.jpg'),
  require('../../assets/images/sung-wang-g4DgCF90EM4-unsplash.jpg')
];

const INTERESTS = [
  { id: '1', name: 'Coffee', icon: 'local-cafe' },
  { id: '2', name: 'Music', icon: 'music-note' },
  { id: '3', name: 'Travel', icon: 'flight' },
  { id: '4', name: 'Dogs', icon: 'pets' },
  { id: '5', name: 'Art', icon: 'palette' },
  { id: '6', name: 'Hiking', icon: 'landscape' },
  { id: '7', name: 'Reading', icon: 'menu-book' },
  { id: '8', name: 'Cooking', icon: 'restaurant' },
  { id: '9', name: 'Yoga', icon: 'spa' },
  { id: '10', name: 'Movies', icon: 'play-arrow' },
];

// ─── SIDE-VIEW STICK FIGURE ───
// Drawn entirely with View elements. Facing right by default.
// Set facingLeft=true to mirror.
function SideStickFigure({
  color = C.pri,
  facingLeft = false,
  isFemale = false,
  legAnim = 0,   
  armAnim = 0,   
  scale = 1,
}: {
  color?: string;
  facingLeft?: boolean;
  isFemale?: boolean;
  legAnim?: number;
  armAnim?: number;
  scale?: number;
}) {
  const s = scale;
  
  // Perfect pictogram proportions
  const headR = 8 * s;
  const gap = 2 * s;
  
  const maleTorsoW = 10 * s;
  const torsoH = 24 * s;
  
  const dressTop = 6 * s;
  const dressFlare = 8 * s; // Bottom width = 6 + 8 + 8 = 22
  
  const limbW = 5.5 * s;
  const armH = 20 * s;
  const legH = 22 * s;
  
  const restingLeg = 10; 
  const restingArm = 15;
  
  const frontLeg = legAnim * 35 + restingLeg;
  const backLeg = -legAnim * 35 - restingLeg;
  const frontArm = -armAnim * 35 + restingArm;
  const backArm = armAnim * 35 - restingArm;

  const centerX = 20 * s;

  return (
    <View style={{
      width: 40 * s,
      height: 64 * s,
      transform: [{ scaleX: facingLeft ? -1 : 1 }],
    }}>
      {/* Female Ponytail (User's Favorite S-Curve, but Thicker and Attached) */}
      {isFemale && (
        <View style={{
          position: 'absolute',
          top: -2 * s,
          left: centerX - headR - 10.5 * s,
          width: 14 * s,
          height: 28 * s,
          zIndex: 3,
        }}>
          <Svg viewBox="-4 -5 32 80" width="100%" height="100%">
            <Path 
              d="M 18 15 C 6 0, -4 15, 1 30 C 6 45, 16 40, 11 55 C 8 65, -2 58, -2 58 C 6 68, 26 60, 24 48 C 22 35, 10 40, 9 30 C 8 20, 14 10, 18 22 Z" 
              fill={color} 
            />
          </Svg>
        </View>
      )}

      {/* Head */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: centerX - headR,
        width: headR * 2,
        height: headR * 2,
        borderRadius: headR,
        backgroundColor: color,
        zIndex: 4,
      }} />

      {/* Torso / Dress */}
      {isFemale ? (
        <View style={{ 
          position: 'absolute', 
          top: headR * 2 + gap, 
          left: centerX - (dressTop + dressFlare * 2) / 2, 
          width: dressTop + dressFlare * 2, 
          alignItems: 'center',
          zIndex: 2 
        }}>
          {/* A-Line Dress Trapezoid */}
          <View style={{
            width: dressTop,
            height: 0,
            borderBottomWidth: torsoH,
            borderBottomColor: color,
            borderLeftWidth: dressFlare,
            borderLeftColor: 'transparent',
            borderRightWidth: dressFlare,
            borderRightColor: 'transparent',
            borderBottomLeftRadius: 2 * s,
            borderBottomRightRadius: 2 * s,
          }} />
        </View>
      ) : (
        <View style={{
          position: 'absolute',
          top: headR * 2 + gap,
          left: centerX - maleTorsoW / 2,
          width: maleTorsoW,
          height: torsoH,
          backgroundColor: color,
          borderRadius: maleTorsoW / 2,
          zIndex: 2,
        }} />
      )}

      {/* Back Arm */}
      <View style={{
        position: 'absolute',
        top: headR * 2 + gap + 1 * s,
        left: centerX - limbW / 2,
        width: limbW,
        height: armH,
        backgroundColor: color,
        borderRadius: limbW / 2,
        transform: [{ rotate: `${backArm}deg` }],
        transformOrigin: 'top center',
        zIndex: 1,
      }} />

      {/* Back Leg */}
      <View style={{
        position: 'absolute',
        top: headR * 2 + gap + torsoH - 2 * s,
        left: centerX - limbW / 2,
        width: limbW,
        height: legH,
        backgroundColor: color,
        borderRadius: limbW / 2,
        transform: [{ rotate: `${backLeg}deg` }],
        transformOrigin: 'top center',
        zIndex: 1,
      }} />

      {/* Front Leg */}
      <View style={{
        position: 'absolute',
        top: headR * 2 + gap + torsoH - 2 * s,
        left: centerX - limbW / 2,
        width: limbW,
        height: legH,
        backgroundColor: color,
        borderRadius: limbW / 2,
        transform: [{ rotate: `${frontLeg}deg` }],
        transformOrigin: 'top center',
        zIndex: 3,
      }} />

      {/* Front Arm */}
      <View style={{
        position: 'absolute',
        top: headR * 2 + gap + 1 * s,
        left: centerX - limbW / 2,
        width: limbW,
        height: armH,
        backgroundColor: color,
        borderRadius: limbW / 2,
        transform: [{ rotate: `${frontArm}deg` }],
        transformOrigin: 'top center',
        zIndex: 5,
      }} />
    </View>
  );
}

// ─── SINGLE FLOATING HEART ───
function FloatingHeart({ delay, x }: { delay: number; x: number }) {
  const anim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <RNAnimated.Text style={{
      position: 'absolute',
      left: x,
      bottom: 0,
      fontSize: 20,
      color: C.pink,
      opacity: anim.interpolate({
        inputRange: [0, 0.3, 0.8, 1],
        outputRange: [0, 1, 1, 0],
      }),
      transform: [{
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      }, {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.2, 0.8],
        }),
      }],
    }}>
      {'\u2665'}
    </RNAnimated.Text>
  );
}

// ─── MAIN ───
export default function AnimatedSignUp() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const [step, setStep] = useState(0);

  // Form
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [element, setElement] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

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

    startMarquee(col1Anim, 16000);
    startMarquee(col2Anim, 20000);
    startMarquee(col3Anim, 14000);
  }, []);

  // Figure animation values
  const leftX = useRef(new RNAnimated.Value(20)).current;
  const rightX = useRef(new RNAnimated.Value(SW - 60)).current;
  const walkCycle = useRef(new RNAnimated.Value(0)).current;
  const [legVal, setLegVal] = useState(0);
  const [armVal, setArmVal] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [showFinale, setShowFinale] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const flowerOpacity = useRef(new RNAnimated.Value(0)).current;
  const messageOpacity = useRef(new RNAnimated.Value(0)).current;

  // Walk cycle listener
  const walkListenerId = useRef<string | null>(null);

  const startWalkCycle = useCallback(() => {
    setIsWalking(true);
    walkCycle.setValue(0);

    // Remove old listener
    if (walkListenerId.current) {
      walkCycle.removeListener(walkListenerId.current);
    }

    walkListenerId.current = walkCycle.addListener(({ value }) => {
      const v = Math.sin(value * Math.PI * 2);
      setLegVal(v);
      setArmVal(v);
    });

    const anim = RNAnimated.loop(
      RNAnimated.timing(walkCycle, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    anim.start();
    return anim;
  }, [walkCycle]);

  const stopWalkCycle = useCallback(() => {
    walkCycle.stopAnimation();
    if (walkListenerId.current) {
      walkCycle.removeListener(walkListenerId.current);
      walkListenerId.current = null;
    }
    setLegVal(0);
    setArmVal(0);
    setIsWalking(false);
  }, [walkCycle]);

  const goToStep = useCallback((nextStep: number) => {
    if (nextStep >= 4) {
      playFinale();
      return;
    }

    flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
    setStep(nextStep);

    // Walk the left figure forward
    const leftTarget = 20 + (nextStep / 3) * (SW / 2 - 80);
    const rightTarget = (SW - 60) - (nextStep / 3) * (SW / 2 - 80);
    const cycle = startWalkCycle();

    RNAnimated.parallel([
      RNAnimated.timing(leftX, {
        toValue: leftTarget,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
      RNAnimated.timing(rightX, {
        toValue: rightTarget,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      stopWalkCycle();
    });
  }, [leftX, startWalkCycle, stopWalkCycle]);

  const playFinale = useCallback(() => {
    setShowFinale(true);
    const cycle = startWalkCycle();
    const meetX = SW / 2 - 20;

    // Both figures walk toward center simultaneously
    RNAnimated.parallel([
      RNAnimated.timing(leftX, {
        toValue: meetX - 25,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
      RNAnimated.timing(rightX, {
        toValue: meetX + 25,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      stopWalkCycle();

      // Show flower
      setTimeout(() => {
        setShowFlower(true);
        RNAnimated.timing(flowerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();

        // Show hearts
        setTimeout(() => {
          setShowHearts(true);

          // Show message
          setTimeout(() => {
            setShowMessage(true);
            RNAnimated.timing(messageOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start();

            // Navigate to home
            setTimeout(() => {
              router.replace('/(tabs)');
            }, 2200);
          }, 600);
        }, 500);
      }, 400);
    });
  }, [leftX, rightX, startWalkCycle, stopWalkCycle, flowerOpacity, messageOpacity, router]);

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  // ── SLIDES ──

  const renderWelcome = () => {
    const colWidth = Math.floor((SW - 32 - 16) / 3);
    const cardHeight = 160;
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

    return (
      <View style={{ width: SW, height: SH, backgroundColor: C.bg, position: 'relative' }}>
        {/* PREMA Celestial Background */}
        <CelestialBackground />

        {/* Animated Marquee Photo Grid */}
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
              {[...colObj.data, ...colObj.data, ...colObj.data].map((imgUrl, imgIdx) => (
                <View key={imgIdx} style={{
                  width: colWidth,
                  height: cardHeight,
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.95)',
                  shadowColor: C.pri,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 4,
                }}>
                  <Image
                    source={imgUrl}
                    style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 16 }}
                  />
                  
                </View>
              ))}
            </RNAnimated.View>
          ))}
        </View>
        {/* Centered Logo Only */}
        <View style={{
          position: 'absolute',
          top: '25%',
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 10,
        }} pointerEvents="none">
          <View style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 6,
            elevation: 8,
            
          }}>
            <PremaLogoMark size={90} color="#FFFFFF" />
          </View>
        </View>


        {/* Soft Radial Tint for background legibility */}
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
              <LinearGradient id="coralBottomGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FF6B8B" stopOpacity="0" />
                <Stop offset="0.25" stopColor="#FF6B8B" stopOpacity="0.75" />
                <Stop offset="0.65" stopColor="#EE5274" stopOpacity="0.95" />
                <Stop offset="1" stopColor="#C93B57" stopOpacity="0.99" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#coralBottomGradient)" />
          </Svg>

          {/* Bottom Actions & Terms Disclaimer */}
          <View style={{
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === 'ios' ? 72 : 56,
            gap: 16,
            zIndex: 11,
          }}>
            {/* Terms & Privacy Disclaimer */}
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
              onPress={() => goToStep(1)}
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
          </View>
        </View>
      </View>
    );
  };

  const renderBasics = () => (
    <View style={{ width: SW, paddingHorizontal: 32, paddingTop: 40 }}>
      {/* Celestial Art: Astrolabe Rings */}
      <View style={{ position: 'absolute', top: -80, right: -120, width: 300, height: 300, borderRadius: 150, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', borderStyle: 'dashed' }} />
      <View style={{ position: 'absolute', top: -30, right: -70, width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(44,73,106,0.1)' }} />
      <Text style={{ position: 'absolute', top: 180, right: 40, fontSize: 20, opacity: 0.3, color: C.pri }}>☾</Text>
      <Text style={{ position: 'absolute', top: 120, left: 20, fontSize: 12, opacity: 0.3, color: C.pri }}>✦</Text>

      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 16, lineHeight: 38 }}>
        {'The stars want\nto know you.'}
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'YOUR GIVEN NAME'}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, paddingVertical: 14 }}>
          <TextInput 
            value={name} onChangeText={setName}
            placeholder="e.g. Eleanor" 
            placeholderTextColor="rgba(44,73,106,0.4)" 
            style={{ fontSize: 16, color: C.pri, fontWeight: '600', letterSpacing: 0.5 }} 
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'ARRIVAL DATE'}</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, paddingVertical: 14 }}>
            <TextInput value={dob} onChangeText={setDob} placeholder="DD/MM/YY" placeholderTextColor="rgba(44,73,106,0.4)" keyboardType="numeric" style={{ fontSize: 14, color: C.pri, fontWeight: '600', letterSpacing: 1 }} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'EXACT TIME'}</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, paddingVertical: 14 }}>
            <TextInput value={birthTime} onChangeText={setBirthTime} placeholder="11:11 AM" placeholderTextColor="rgba(44,73,106,0.4)" style={{ fontSize: 14, color: C.pri, fontWeight: '600', letterSpacing: 1 }} />
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'YOUR ENERGY'}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { id: 'Woman', label: 'Divine\nFeminine', icon: '☾' },
            { id: 'Man', label: 'Divine\nMasculine', icon: '☼' },
            { id: 'Other', label: 'Ethereal\nSpirit', icon: '✧' }
          ].map(g => {
            const sel = gender === g.id;
            return (
              <Pressable key={g.id} onPress={() => setGender(g.id)} style={{ 
                flex: 1, paddingVertical: 12, borderRadius: 16, 
                backgroundColor: sel ? C.pri : 'rgba(255,255,255,0.5)', 
                borderWidth: 1, borderColor: sel ? C.pri : 'rgba(44,73,106,0.15)', 
                alignItems: 'center', shadowColor: sel ? C.pri : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
              }}>
                <Text style={{ fontSize: 20, marginBottom: 6, color: sel ? C.pink : C.pri }}>{g.icon}</Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: sel ? '#FFF' : C.pri, letterSpacing: 0.5, textAlign: 'center' }}>{g.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable onPress={() => goToStep(2)} style={{ backgroundColor: (name && dob && gender) ? C.pink : 'rgba(44,73,106,0.1)', paddingVertical: 16, borderRadius: 40, alignItems: 'center', shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: (name && dob && gender) ? 0.3 : 0, shadowRadius: 16 }}>
        <Text style={{ color: (name && dob && gender) ? '#FFF' : 'rgba(44,73,106,0.4)', fontSize: 14, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>{'Align & Continue'}</Text>
      </Pressable>
    </View>
  );

  const renderAbout = () => (
    <View style={{ width: SW, paddingHorizontal: 32, paddingTop: 40 }}>
      {/* Celestial Art: Constellation Orbs */}
      <View style={{ position: 'absolute', top: 120, right: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF', opacity: 0.4 }} />
      <View style={{ position: 'absolute', top: 280, left: -40, width: 100, height: 100, borderRadius: 50, backgroundColor: C.pink, opacity: 0.08 }} />
      <Text style={{ position: 'absolute', top: 60, right: 30, fontSize: 24, opacity: 0.2, color: C.pri }}>☼</Text>
      <Text style={{ position: 'absolute', top: 320, right: 20, fontSize: 14, opacity: 0.4, color: C.pri }}>✧</Text>

      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 16, lineHeight: 38 }}>
        {'What governs\nyour spirit?'}
      </Text>

      <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'DOMINANT ELEMENT'}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        {[
          { id: 'Fire', icon: '🔥' },
          { id: 'Earth', icon: '🌿' },
          { id: 'Air', icon: '💨' },
          { id: 'Water', icon: '💧' }
        ].map(e => {
          const sel = element === e.id;
          return (
            <Pressable key={e.id} onPress={() => setElement(e.id)} style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: sel ? C.pri : 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: sel ? C.pri : 'rgba(44,73,106,0.15)', alignItems: 'center', justifyContent: 'center', shadowColor: sel ? C.pri : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
              <Text style={{ fontSize: 24 }}>{e.icon}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'SOUL VIBRATIONS'}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {INTERESTS.map(item => {
          const sel = interests.includes(item.id);
          return (
            <Pressable key={item.id} onPress={() => toggleInterest(item.id)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: sel ? C.pink : 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: sel ? C.pink : 'rgba(44,73,106,0.15)', shadowColor: sel ? C.pink : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#FFF' : C.pri, letterSpacing: 0.5 }}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 8 }}>{'AURA SIGNATURE'}</Text>
      <View style={{ marginBottom: 16 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TextInput value={bio} onChangeText={setBio} placeholder="A few words about your cosmic journey..." placeholderTextColor="rgba(44,73,106,0.4)" multiline numberOfLines={2} style={{ fontSize: 15, color: C.pri, fontWeight: '500', minHeight: 48, textAlignVertical: 'top', lineHeight: 20 }} />
        </View>
      </View>

      <Pressable onPress={() => goToStep(3)} style={{ backgroundColor: interests.length > 0 ? C.pink : 'rgba(44,73,106,0.1)', paddingVertical: 16, borderRadius: 40, alignItems: 'center', shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: interests.length > 0 ? 0.3 : 0, shadowRadius: 16 }}>
        <Text style={{ color: interests.length > 0 ? '#FFF' : 'rgba(44,73,106,0.4)', fontSize: 14, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>{'Align & Continue'}</Text>
      </Pressable>
    </View>
  );

  const renderVerify = () => (
    <View style={{ width: SW, paddingHorizontal: 32, paddingTop: 40 }}>
      {/* Celestial Art: Planetary Orbit */}
      <View style={{ position: 'absolute', top: 100, left: -150, width: 400, height: 400, borderRadius: 200, borderWidth: 1, borderColor: 'rgba(44,73,106,0.1)', transform: [{ scaleY: 0.4 }, { rotate: '-20deg' }] }} />
      <View style={{ position: 'absolute', top: 140, left: -130, width: 360, height: 360, borderRadius: 180, borderWidth: 1, borderColor: 'rgba(255,107,139,0.1)', transform: [{ scaleY: 0.4 }, { rotate: '-20deg' }], borderStyle: 'dashed' }} />
      <Text style={{ position: 'absolute', top: 150, left: 60, fontSize: 20, opacity: 0.3, color: C.pri }}>✦</Text>
      <Text style={{ position: 'absolute', top: 220, right: 40, fontSize: 18, opacity: 0.5, color: C.pri }}>✨</Text>

      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 8, lineHeight: 38 }}>
        {'Unlock your\ndestiny.'}
      </Text>
      <Text style={{ fontSize: 14, color: 'rgba(44,73,106,0.6)', marginBottom: 24, lineHeight: 22 }}>
        {'Verify your earthly frequency\nbefore the stars align.'}
      </Text>

      {/* Floating Card for Phone */}
      <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: C.pri, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, marginBottom: 24 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: C.pri, letterSpacing: 2, marginBottom: 12 }}>{'YOUR FREQUENCY'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(44,73,106,0.05)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginRight: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.pri }}>{'+91'}</Text>
          </View>
          <TextInput 
            value={phone} onChangeText={setPhone} 
            placeholder="98765 43210" placeholderTextColor="rgba(44,73,106,0.3)" 
            keyboardType="phone-pad" 
            style={{ flex: 1, fontSize: 18, fontWeight: '600', color: C.pri, letterSpacing: 1 }} 
          />
        </View>
      </View>

      {/* Sleek Individual OTP Boxes */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: C.pri, letterSpacing: 2, marginBottom: 12, textAlign: 'center' }}>{'THE 6-DIGIT ALIGNMENT CODE'}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative' }}>
          {[0,1,2,3,4,5].map(i => {
            const char = otp[i] || '';
            const isActive = otp.length === i;
            return (
              <View key={i} pointerEvents="none" style={{ 
                width: 40, height: 50, borderRadius: 12, 
                backgroundColor: char ? C.pri : '#FFF',
                borderWidth: 2, borderColor: isActive ? C.pink : (char ? C.pri : 'rgba(44,73,106,0.1)'),
                alignItems: 'center', justifyContent: 'center',
                shadowColor: isActive ? C.pink : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
              }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: char ? '#FFF' : C.pri }}>{char}</Text>
              </View>
            );
          })}
          {/* Invisible input overlaying the boxes to capture typing */}
          <TextInput 
            value={otp} onChangeText={setOtp} 
            maxLength={6} keyboardType="number-pad"
            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0 }} 
          />
        </View>
      </View>

      <Pressable onPress={() => goToStep(4)} style={{ backgroundColor: otp.length === 6 ? C.pink : 'rgba(44,73,106,0.1)', paddingVertical: 16, borderRadius: 40, alignItems: 'center', shadowColor: C.pink, shadowOffset: { width: 0, height: 10 }, shadowOpacity: otp.length === 6 ? 0.3 : 0, shadowRadius: 20 }}>
        <Text style={{ color: otp.length === 6 ? '#FFF' : 'rgba(44,73,106,0.4)', fontSize: 14, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>{'Manifest Connection'}</Text>
      </Pressable>
    </View>
  );

  const slides = [renderWelcome, renderBasics, renderAbout, renderVerify];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={step === 0 ? [] : ['top']}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Celestial Node Map Progress - Only show for onboarding form steps */}
        {step > 0 && (
          <View style={{ paddingHorizontal: 32, paddingTop: 24, paddingBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              
              {/* Background Track */}
              <View style={{ position: 'absolute', top: 8, left: 10, right: 10, height: 1.5, backgroundColor: 'rgba(44,73,106,0.15)', zIndex: 1 }} />
              
              {/* Animated Fill Track */}
              <RNAnimated.View style={{ 
                position: 'absolute', top: 8, left: 10, height: 1.5, backgroundColor: C.pri, zIndex: 1,
                width: scrollX.interpolate({ inputRange: [0, SW * 3], outputRange: ['0%', '100%'], extrapolate: 'clamp' })
              }} />

              {/* Nodes */}
              {['WELCOME', 'COSMIC', 'SPIRIT', 'ORBIT'].map((label, i) => {
                
                const starOpacity = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, i * SW, (i + 0.6) * SW],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp'
                });
                
                const starScale = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, i * SW, (i + 0.6) * SW],
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: 'clamp'
                });

                // Future dot is visible before we reach this step
                const futureDotOpacity = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, (i - 0.2) * SW],
                  outputRange: [1, 0],
                  extrapolate: 'clamp'
                });

                // Past dot is visible after we pass this step
                const pastDotOpacity = scrollX.interpolate({
                  inputRange: [(i + 0.2) * SW, (i + 0.6) * SW],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                });

                return (
                  <View key={label} style={{ alignItems: 'center', zIndex: 2, width: 60 }}>
                    <View style={{ height: 18, justifyContent: 'center', alignItems: 'center' }}>
                      
                      {/* Future Dot (Hollow) */}
                      <RNAnimated.View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF', borderWidth: 1.5, borderColor: 'rgba(44,73,106,0.3)', opacity: futureDotOpacity }} />
                      
                      {/* Past Dot (Solid Navy) */}
                      <RNAnimated.View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: C.pri, opacity: pastDotOpacity }} />
                      
                      {/* Active Star (Glowing Pink) */}
                      <RNAnimated.View style={{ position: 'absolute', opacity: starOpacity, transform: [{ scale: starScale }] }}>
                        <Text style={{ fontSize: 22, color: C.pink, textShadowColor: C.pink, textShadowRadius: 8, marginTop: -3 }}>{'✦'}</Text>
                      </RNAnimated.View>

                    </View>

                    {/* Labels Container */}
                    <View style={{ position: 'absolute', top: 26, width: 80, alignItems: 'center' }}>
                      {/* Future Label */}
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 9, fontWeight: '700', color: 'rgba(44,73,106,0.5)', letterSpacing: 1.5, textAlign: 'center', opacity: futureDotOpacity }}>
                        {label}
                      </RNAnimated.Text>
                      {/* Past Label */}
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 9, fontWeight: '700', color: C.pri, letterSpacing: 1.5, textAlign: 'center', opacity: pastDotOpacity }}>
                        {label}
                      </RNAnimated.Text>
                      {/* Active Label (Pink) */}
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 9, fontWeight: '700', color: C.pink, letterSpacing: 1.5, textAlign: 'center', opacity: starOpacity }}>
                        {label}
                      </RNAnimated.Text>
                    </View>
                  </View>
                );
              })}
              
            </View>
          </View>
        )}

        {/* Slides */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={slides}
            keyExtractor={(_, i) => String(i)}
            horizontal pagingEnabled scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={RNAnimated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item: fn }) => <View style={{ width: SW }}>{fn()}</View>}
          />
        </View>

        {/* ── GROUND + FIGURES (Shown during form steps) ── */}
        {step > 0 && (
          <View style={{ height: 120, position: 'relative' }}>
            {/* Ground line */}
            <View style={{ position: 'absolute', bottom: 22, left: 16, right: 16, height: 2, backgroundColor: C.ground, borderRadius: 1 }} />

            {/* Dotted path */}
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={`d${i}`} style={{
                position: 'absolute',
                bottom: 18,
                left: 16 + i * ((SW - 32) / 20),
                width: 4, height: 4, borderRadius: 2,
                backgroundColor: i % 3 === 0 ? C.pink : C.accent,
                opacity: 0.25,
              }} />
            ))}

            {/* Small flowers along path */}
            {[0.15, 0.35, 0.55, 0.75].map((pct, i) => (
              <Text key={`f${i}`} style={{
                position: 'absolute',
                bottom: 26,
                left: SW * pct,
                fontSize: 10,
                opacity: 0.4,
              }}>{'\u273F'}</Text>
            ))}

            {/* Step dots */}
            {[0, 1, 2, 3].map(i => (
              <View key={`s${i}`} style={{
                position: 'absolute',
                bottom: 18,
                left: 20 + (i / 3) * (SW * 0.35) + 8,
                width: 10, height: 10, borderRadius: 5,
                backgroundColor: step >= i ? C.accent : C.ground,
                borderWidth: 2, borderColor: C.bg,
              }} />
            ))}

            {/* LEFT FIGURE (user — facing right, walks rightward) */}
            <RNAnimated.View style={{
              position: 'absolute',
              bottom: 24,
              left: leftX,
            }}>
              <SideStickFigure
                color={C.pri}
                facingLeft={false}
                legAnim={legVal}
                armAnim={armVal}
              />
            </RNAnimated.View>

            {/* RIGHT FIGURE (match — facing left, stays on right, walks leftward in finale) */}
            <RNAnimated.View style={{
              position: 'absolute',
              bottom: 24,
              left: rightX,
            }}>
              <SideStickFigure
                color={C.pink}
                isFemale={true}
                facingLeft={true}
                legAnim={legVal}
                armAnim={armVal}
              />
            </RNAnimated.View>

            {/* Flower between them during finale */}
            {showFlower && (
              <RNAnimated.View style={{
                position: 'absolute',
                bottom: 50,
                left: SW / 2 - 12,
                opacity: flowerOpacity,
              }}>
                <Text style={{ fontSize: 24 }}>{'\uD83C\uDF38'}</Text>
              </RNAnimated.View>
            )}

            {/* Floating hearts */}
            {showHearts && (
              <View style={{ position: 'absolute', bottom: 75, left: SW / 2 - 30, width: 60, height: 80 }}>
                <FloatingHeart delay={0} x={0} />
                <FloatingHeart delay={200} x={20} />
                <FloatingHeart delay={400} x={40} />
                <FloatingHeart delay={300} x={10} />
                <FloatingHeart delay={500} x={30} />
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Finale overlay */}
      {showFinale && (
        <RNAnimated.View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(241,247,253,0.92)',
          justifyContent: 'center', alignItems: 'center',
          opacity: messageOpacity,
        }}>
          <Text style={{ fontFamily: 'Georgia', fontSize: 38, color: C.pri, fontStyle: 'italic', textAlign: 'center', lineHeight: 50 }}>
            {'The stars\nhave aligned'}
          </Text>
          <Text style={{ fontSize: 44, marginTop: 20 }}>{'\uD83C\uDF38'}</Text>
          <Text style={{ fontSize: 14, color: C.muted, marginTop: 16 }}>{'Taking you home...'}</Text>
        </RNAnimated.View>
      )}
    </SafeAreaView>
  );
}
