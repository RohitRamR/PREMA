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
  ScrollView,
  Keyboard,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

// Dev only: lets you tap Continue through sign-up without phone/OTP or any
// required fields. Set to false before release to restore real validation.
const SKIP_SIGNUP_CHECKS = true;

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

// ─── UNIQUE PREMA COMPATIBILITY RESONANCE ANCHORS ───
const RESONANCE_ANCHORS = [
  // Soul & Emotional Depth
  { id: 'emotional_safety', name: 'Emotional Safety' },
  { id: 'authentic_vulnerability', name: 'Vulnerability' },
  { id: 'shared_silence', name: 'Shared Silence' },
  { id: 'deep_empathy', name: 'Deep Empathy' },
  { id: 'nurturing_energy', name: 'Nurturing Energy' },
  { id: 'inner_peace', name: 'Inner Peace' },
  { id: 'soft_presence', name: 'Soft Presence' },
  { id: 'sacred_trust', name: 'Sacred Trust' },

  // Mind & Intellectual Harmony
  { id: 'mindful_convo', name: 'Mindful Convos' },
  { id: 'intellectual_depth', name: 'Intellectual Depth' },
  { id: 'intellectual_curiosity', name: 'Curiosity & Mind' },
  { id: 'healthy_boundaries', name: 'Healthy Boundaries' },
  { id: 'deep_talks', name: 'Deep Talks' },
  { id: 'shared_wisdom', name: 'Shared Wisdom' },
  { id: 'open_mindset', name: 'Open Mindset' },
  { id: 'late_night_convos', name: 'Late Night Convos' },

  // Spirituality & Vision
  { id: 'spiritual_path', name: 'Spiritual Path' },
  { id: 'harmonious_presence', name: 'Harmonious Presence' },
  { id: 'mutual_growth', name: 'Mutual Growth' },
  { id: 'family_roots', name: 'Family & Roots' },
  { id: 'soul_alignment', name: 'Soul Alignment' },
  { id: 'mindful_living', name: 'Mindful Living' },
  { id: 'stargazing_vibes', name: 'Stargazing Vibes' },
  { id: 'shared_purpose', name: 'Higher Purpose' },

  // Creativity & Adventure
  { id: 'spontaneous_adventure', name: 'Spontaneity' },
  { id: 'road_trips', name: 'Road Trips' },
  { id: 'laughter_wit', name: 'Laughter & Wit' },
  { id: 'live_music', name: 'Live Music' },
  { id: 'creative_expression', name: 'Creative Expression' },
  { id: 'playful_curiosity', name: 'Playful Curiosity' },
  { id: 'artistic_exploration', name: 'Art & Culture' },
  { id: 'nature_escapes', name: 'Nature Escapes' },
];

const ANCHOR_CATEGORIES = [
  {
    title: 'SOUL & EMOTIONAL DEPTH',
    icon: 'favorite-border',
    ids: ['emotional_safety', 'authentic_vulnerability', 'shared_silence', 'deep_empathy', 'nurturing_energy', 'inner_peace', 'soft_presence', 'sacred_trust']
  },
  {
    title: 'MIND & INTELLECTUAL HARMONY',
    icon: 'psychology',
    ids: ['mindful_convo', 'intellectual_depth', 'intellectual_curiosity', 'healthy_boundaries', 'deep_talks', 'shared_wisdom', 'open_mindset', 'late_night_convos']
  },
  {
    title: 'SPIRITUALITY & VISION',
    icon: 'auto-awesome',
    ids: ['spiritual_path', 'harmonious_presence', 'mutual_growth', 'family_roots', 'soul_alignment', 'mindful_living', 'stargazing_vibes', 'shared_purpose']
  },
  {
    title: 'CREATIVITY & ADVENTURE',
    icon: 'explore',
    ids: ['spontaneous_adventure', 'road_trips', 'laughter_wit', 'live_music', 'creative_expression', 'playful_curiosity', 'artistic_exploration', 'nature_escapes']
  }
];

const FLOATING_OFFSETS: { [key: string]: { marginLeft?: number } } = {
  emotional_safety: { marginLeft: 0 },
  shared_silence: { marginLeft: 24 },
  nurturing_energy: { marginLeft: 8 },
  authentic_vulnerability: { marginLeft: 28 },
  deep_empathy: { marginLeft: 4 },
  mindful_convo: { marginLeft: 0 },
  intellectual_depth: { marginLeft: 14 },
  healthy_boundaries: { marginLeft: 0 },
  intellectual_curiosity: { marginLeft: 18 },
  spiritual_path: { marginLeft: 8 },
  harmonious_presence: { marginLeft: 30 },
  mutual_growth: { marginLeft: 4 },
  family_roots: { marginLeft: 22 },
  spontaneous_adventure: { marginLeft: 0 },
  laughter_wit: { marginLeft: 26 },
  creative_expression: { marginLeft: 10 },
  playful_curiosity: { marginLeft: 28 },
  artistic_exploration: { marginLeft: 4 },
};

// ─── SIDE-VIEW STICK FIGURE ───
const SideStickFigure = React.memo(function SideStickFigure({
  color = C.pri,
  facingLeft = false,
  isFemale = false,
  walkCycle,
  scale = 1,
}: {
  color?: string;
  facingLeft?: boolean;
  isFemale?: boolean;
  walkCycle?: any;
  scale?: number;
}) {
  const s = scale;
  
  const headR = 8 * s;
  const neckH = (isFemale ? 2.5 : 1) * s; // Female: visible gap between head and dress
  
  const maleTorsoW = 10 * s;
  const torsoH = 22 * s;
  
  const dressBottomW = 15 * s; // A-line hem width
  
  const limbW = (isFemale ? 4 : 5) * s;
  const armH = 18 * s;
  const legH = 20 * s;

  // Use a stable ref to avoid creating new Animated.Value on every render
  const dummyWalk = useRef(new RNAnimated.Value(0)).current;
  const animValue = walkCycle || dummyWalk;

  const frontLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['10deg', '40deg', '10deg', '-20deg', '10deg']
  });
  const backLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-10deg', '-40deg', '-10deg', '20deg', '-10deg']
  });
  const frontArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['15deg', '-20deg', '15deg', '45deg', '15deg']
  });
  const backArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-15deg', '20deg', '-15deg', '-45deg', '-15deg']
  });

  const containerW = 44 * s;
  const centerX = containerW / 2;
  const bodyTop = headR * 2 + neckH;

  return (
    <View style={{
      width: containerW,
      height: bodyTop + torsoH - 2 * s + legH,
      transform: [{ scaleX: facingLeft ? -1 : 1 }],
    }}>
      {/* Back Arm (female arms are hidden by the dress) */}
      {!isFemale && <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backArmAngle }], zIndex: 1,
      }} />}

      {/* Back Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backLegAngle }], zIndex: 1,
      }} />

      {/* Torso/Body */}
      {isFemale ? (
        // A-line dress with rounded shoulders (viewBox units = s)
        <Svg
          width={dressBottomW}
          height={torsoH}
          viewBox="0 0 15 22"
          style={{ position: 'absolute', top: bodyTop, left: centerX - dressBottomW / 2, zIndex: 2 }}
          pointerEvents="none"
        >
          <Path
            d="M 7.5 0 C 9.4 0 10.6 1.2 11.1 2.9 C 12 6 13.6 11 14.4 13.2 C 14.8 15 15 18 15 21.2 Q 15 22 14.2 22 L 0.8 22 Q 0 22 0 21.2 C 0 18 0.2 15 0.6 13.2 C 1.4 11 3 6 3.9 2.9 C 4.4 1.2 5.6 0 7.5 0 Z"
            fill={color}
          />
        </Svg>
      ) : (
        <View style={{
          position: 'absolute', top: bodyTop, left: centerX - maleTorsoW / 2,
          width: maleTorsoW, height: torsoH, backgroundColor: color,
          borderRadius: maleTorsoW / 2, zIndex: 2,
        }} />
      )}

      {/* Head */}
      <View style={{
        position: 'absolute', top: 0, left: centerX - headR,
        width: headR * 2, height: headR * 2, borderRadius: headR,
        backgroundColor: color, zIndex: 3,
      }}>
        {isFemale && (
          <>
            {/* Ponytail — tapered S-curve off the BACK of the head (figure faces +x
                before mirroring, so the back is the left side). viewBox is in
                head-local units: head circle is centred at (8,8), r=8. */}
            <Svg
              width={20 * s}
              height={28 * s}
              viewBox="-12 -4 20 28"
              style={{ position: 'absolute', left: -12 * s, top: -4 * s }}
              pointerEvents="none"
            >
              <Path
                d="M 0.8 4.4
                   C -1.2 2.4, -3.4 1.9, -4.8 2.2
                   C -6.8 2.6, -8.1 4.4, -8 6
                   C -7.9 7.6, -7 9.2, -6.6 10.6
                   C -6 12.4, -4.6 13.2, -3.8 14.4
                   C -3.2 15.6, -3 17.2, -3.4 18.4
                   C -3.8 19.6, -5.4 20, -8 20.4
                   C -6.4 21.4, -3.4 21.6, -1.6 21
                   C -0.2 20.4, 0.7 19.6, 0.8 18.6
                   C 1.1 17.4, 1.4 15.8, 0.9 15
                   C 0.4 14, 0.1 13.4, -0.4 12.9
                   C -1.4 12.2, -2.6 11.8, -3.2 11.2
                   C -4 10.4, -4.3 9, -4.2 8
                   C -4.1 7, -3.9 6.2, -3.6 5.8
                   L -1.4 5.8
                   C -0.6 5.8, 0.2 5.6, 0.8 5.4 Z"
                fill={color}
              />
            </Svg>
          </>
        )}
      </View>

      {/* Front Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontLegAngle }], zIndex: 3,
      }} />

      {/* Front Arm */}
      {!isFemale && <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontArmAngle }], zIndex: 4,
      }} />}
    </View>
  );
});

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
  }, [delay, anim]);

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

// ─── SUSPENDED ZERO-GRAVITY FLOATING CAPSULE ───
function FloatingCapsule({
  item,
  isSel,
  onPress,
  index = 0,
  marginLeft = 0,
}: {
  item: { id: string; name: string };
  isSel: boolean;
  onPress: () => void;
  index?: number;
  marginLeft?: number;
}) {
  const animY = useRef(new RNAnimated.Value(0)).current;
  const animX = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (isSel) {
      animY.stopAnimation();
      animX.stopAnimation();
      RNAnimated.parallel([
        RNAnimated.spring(animY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 12,
        }),
        RNAnimated.spring(animX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 12,
        }),
      ]).start();
      return;
    }

    // Unique phase/timing calculation based on index for natural desynchronized zero-gravity float
    const duration = 2200 + (index % 5) * 260;
    const delay = (index % 7) * 120;
    const floatDist = 1.6 + (index % 3) * 0.5;

    const floatLoopY = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(animY, {
          toValue: -floatDist,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        RNAnimated.timing(animY, {
          toValue: floatDist,
          duration: duration * 1.15,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        RNAnimated.timing(animY, {
          toValue: 0,
          duration: duration * 0.85,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const floatLoopX = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(animX, {
          toValue: floatDist * 0.3,
          duration: duration * 1.25,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(animX, {
          toValue: -floatDist * 0.3,
          duration: duration * 1.1,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(animX, {
          toValue: 0,
          duration: duration * 0.9,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const t = setTimeout(() => {
      floatLoopY.start();
      floatLoopX.start();
    }, delay);

    return () => {
      clearTimeout(t);
      floatLoopY.stop();
      floatLoopX.stop();
    };
  }, [isSel, index, animY, animX]);

  return (
    <RNAnimated.View
      style={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '46%',
        maxWidth: '48%',
        marginVertical: 4,
        transform: [{ translateY: animY }, { translateX: animX }],
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 24,
          borderWidth: 1.5,
          borderColor: isSel ? C.pri : 'rgba(44,73,106,0.18)',
          backgroundColor: isSel ? C.pri : '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: isSel ? C.pri : 'rgba(44,73,106,0.10)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isSel ? 0.35 : 0.10,
          shadowRadius: 8,
          elevation: isSel ? 4 : 2,
        }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={{ fontSize: 13, fontWeight: isSel ? '700' : '600', color: isSel ? '#FFFFFF' : C.pri, textAlign: 'center' }}
        >
          {item.name}
        </Text>
      </Pressable>
    </RNAnimated.View>
  );
}

// ─── MAIN ONBOARDING COMPONENT ───
// ─── Ticket shape: rounded card with real half-circle notches at the tear line ───
const TICKET_TEAR = 76;
function ticketPath(w: number, h: number, r = 24, ny = TICKET_TEAR, nr = 12) {
  return `M${r},0 H${w - r} A${r},${r} 0 0 1 ${w},${r} V${ny - nr} A${nr},${nr} 0 0 0 ${w},${ny + nr} ` +
    `V${h - r} A${r},${r} 0 0 1 ${w - r},${h} H${r} A${r},${r} 0 0 1 0,${h - r} V${ny + nr} ` +
    `A${nr},${nr} 0 0 0 0,${ny - nr} V${r} A${r},${r} 0 0 1 ${r},0 Z`;
}

function Ticket({ variant, selected, children }: { variant: 'pink' | 'light'; selected: boolean; children: React.ReactNode }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const pink = variant === 'pink';
  const gid = `ticket-${variant}`;
  return (
    <View
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      style={{
        // No background, so the iOS shadow follows the ticket shape (notches included).
        shadowColor: pink ? '#E2456B' : selected ? '#FF6B8B' : '#2C496A',
        shadowOffset: { width: 0, height: selected ? 12 : 8 },
        shadowOpacity: pink ? (selected ? 0.42 : 0.26) : selected ? 0.25 : 0.08,
        shadowRadius: selected ? 16 : 12,
      }}
    >
      {size.w > 0 ? (
        <Svg width={size.w} height={size.h} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={pink ? (selected ? '#FFA0B4' : '#FF97AE') : selected ? '#FFF4F7' : '#FFFFFF'} />
              <Stop offset="0.55" stopColor={pink ? '#FF6B8B' : selected ? '#FFF4F7' : '#FFFFFF'} />
              <Stop offset="1" stopColor={pink ? '#E2456B' : selected ? '#FFF4F7' : '#FFFFFF'} />
            </LinearGradient>
          </Defs>
          <Path
            d={ticketPath(size.w, size.h)}
            fill={`url(#${gid})`}
            stroke={!pink && selected ? '#FF6B8B' : 'none'}
            strokeWidth={2}
          />
        </Svg>
      ) : null}
      {children}
    </View>
  );
}

export default function AnimatedSignUp() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const transitioningRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [slideH, setSlideH] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); timersRef.current.forEach(clearTimeout); };
  }, []);

  const later = (fn: () => void, ms: number) => { timersRef.current.push(setTimeout(fn, ms)); };

  // Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [gender, setGender] = useState('');

  // Step 2: Invite-only access. An invite code unlocks the app; everyone else joins the waiting list.
  const [access, setAccess] = useState<'invite' | 'waitlist' | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const accessRef = useRef<'invite' | 'waitlist' | null>(null);
  useEffect(() => { accessRef.current = access; }, [access]);
  const cleanInvite = inviteCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const inviteReady = cleanInvite.length >= 6 && cleanInvite.length <= 12;

  // Step 3: Target Dating Preferences
  const [targetGenders, setTargetGenders] = useState<string[]>([]);

  // Step 4: Intent
  const [intent, setIntent] = useState('');

  // Step 5: Unique PREMA Compatibility Resonance Anchors
  const [anchorSearch, setAnchorSearch] = useState('');
  const [selectedAnchors, setSelectedAnchors] = useState<string[]>([]);

  // Step 6: Bio & Photos
  const [photos, setPhotos] = useState<any[]>([]);
  const [bio, setBio] = useState('');

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
  }, [col1Anim, col2Anim, col3Anim]);

  // Figure animation values
  const leftX = useRef(new RNAnimated.Value(20)).current;
  const rightX = useRef(new RNAnimated.Value(SW - 60)).current;
  const walkCycle = useRef(new RNAnimated.Value(0)).current;
    const isWalkingRef = useRef(false);
  const [showFinale, setShowFinale] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const showMessageRef = useRef(false);
  const flowerOpacity = useRef(new RNAnimated.Value(0)).current;
  const flowerScale = useRef(new RNAnimated.Value(1)).current;
  const flowerY = useRef(new RNAnimated.Value(0)).current;
  const flowerRotation = useRef(new RNAnimated.Value(0)).current;
  const messageOpacity = useRef(new RNAnimated.Value(0)).current;

  
  const walkLoopRef = useRef<RNAnimated.CompositeAnimation | null>(null);

  const startWalkCycle = useCallback(() => {
    walkLoopRef.current?.stop();
    isWalkingRef.current = true;
    walkCycle.setValue(0);
    const anim = RNAnimated.loop(
      RNAnimated.timing(walkCycle, {
        toValue: 1,
        duration: 500, easing: Easing.linear, useNativeDriver: true,
      }),
    );
    walkLoopRef.current = anim;
    anim.start();
    return anim;
  }, [walkCycle]);

  const stopWalkCycle = useCallback(() => {
    walkLoopRef.current?.stop();
    walkLoopRef.current = null;
    // Settle limbs back to a neutral standing pose instead of freezing mid-stride.
    RNAnimated.timing(walkCycle, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    isWalkingRef.current = false;
  }, [walkCycle]);

  const playFinale = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    Keyboard.dismiss();
    setShowFinale(true);
    startWalkCycle();
    const meetX = SW / 2 - 20;

    RNAnimated.parallel([
      RNAnimated.timing(leftX, {
        toValue: meetX - 25,
        duration: 2000,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
      RNAnimated.timing(rightX, {
        toValue: meetX + 25,
        duration: 2000,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
    ]).start(() => {
      stopWalkCycle();

      later(() => {
        setShowFlower(true);
        RNAnimated.timing(flowerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();

        later(() => {
          setShowHearts(true);

          later(() => {
            showMessageRef.current = true;
            // Rotate exactly once
            
            
            
            // 1. Float, grow, AND rotate simultaneously!
            RNAnimated.parallel([
              RNAnimated.timing(flowerY, {
                // Float from the ground up to just below the centred "have aligned" title, on any screen size.
                toValue: -(SH / 2 - 45 - 90),
                duration: 3000, // Slow, majestic float
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(flowerScale, {
                toValue: 2.2,
                duration: 3000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(flowerRotation, {
                toValue: 1, // First full rotation while floating
                duration: 3000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(messageOpacity, {
                toValue: 1, // Fade text in 
                duration: 1000, 
                useNativeDriver: true,
              })
            ]).start(() => {
              // 2. Once the flower reaches the destination, SPIN AGAIN!
              RNAnimated.timing(flowerRotation, {
                toValue: 2, // Second full rotation (360deg to 720deg)
                duration: 1000, // Quick celebratory spin!
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }).start(() => {
                // 3. After the second spin finishes, route to home!
                later(() => {
                  if (accessRef.current === 'waitlist') {
                    router.replace({ pathname: '/(onboarding)/waitlist', params: { phone } });
                  } else {
                    router.replace('/(tabs)');
                  }
                }, 300); // Tiny pause before transitioning
              });
            });



          }, 600);
        }, 500);
      }, 400);
    });
  }, [leftX, rightX, startWalkCycle, stopWalkCycle, flowerOpacity, messageOpacity, router, phone]);

  const goToStep = useCallback((nextStep: number) => {
    if (transitioningRef.current || nextStep < 0) return;
    Keyboard.dismiss();
    if (nextStep >= 8) {
      playFinale();
      return;
    }
    transitioningRef.current = true;
    later(() => { transitioningRef.current = false; }, 450); // ignore double taps during the slide

    leftX.stopAnimation();
    rightX.stopAnimation();
    flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
    stepRef.current = nextStep;
    setStep(nextStep);

    const progressRatio = nextStep / 7;
    const leftTarget = 20 + progressRatio * (SW / 2 - 80);
    const rightTarget = (SW - 60) - progressRatio * (SW / 2 - 80);
    startWalkCycle();

    RNAnimated.parallel([
      RNAnimated.timing(leftX, {
        toValue: leftTarget,
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      RNAnimated.timing(rightX, {
        toValue: rightTarget,
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) stopWalkCycle();
    });
  }, [leftX, rightX, startWalkCycle, stopWalkCycle, playFinale]);

  // Target Gender & Anchor Handlers
  const toggleTargetGender = (g: string) => {
    setTargetGenders(prev =>
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const toggleAnchor = (id: string) => {
    setSelectedAnchors(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleTogglePhoto = (idx: number) => {
    setPhotos(prev => {
      if (prev[idx]) {
        return prev.filter((_, i) => i !== idx);
      } else {
        const samplePhotos = [
          GRID_COLUMN_1[0],
          GRID_COLUMN_2[0],
          GRID_COLUMN_3[0],
          GRID_COLUMN_1[1],
          GRID_COLUMN_2[1],
          GRID_COLUMN_3[1],
        ];
        const nextImg = samplePhotos[idx % samplePhotos.length];
        const nextList = [...prev];
        nextList[idx] = nextImg;
        return nextList.filter(Boolean);
      }
    });
  };

  // ─── STEP 0: WELCOME SCREEN ───
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
        <CelestialBackground />

        {/* Marquee Photo Grid */}
        <View style={{
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'ios' ? 48 : 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: SH,
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

        {/* Brand Logo */}
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

        {/* Coral Gradient Overlay & Bottom Action */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SH * 0.46,
          justifyContent: 'flex-end',
          zIndex: 10,
        }}>
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

  const phoneReady = phone.length === 10;
  const otpRef = useRef<TextInput>(null);

  // Birth date mask: digits only → DD/MM/YYYY
  const onDobChange = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    setDob([d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/'));
  };
  const dobReady = /^\d{2}\/\d{2}\/\d{4}$/.test(dob);

  // ─── STEP 1: PHONE & OTP VERIFICATION ───
  const renderVerify = () => (
    <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 16 }}>
      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 8, lineHeight: 38 }}>
        {'Unlock your\ndestiny.'}
      </Text>
      <Text style={{ fontSize: 14, color: 'rgba(44,73,106,0.65)', marginBottom: 24, lineHeight: 22 }}>
        {'Verify your phone frequency before\nthe stars align your connection.'}
      </Text>

      <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(44,73,106,0.12)', shadowColor: C.pri, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12, marginBottom: 20 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 10 }}>{'YOUR PHONE NUMBER'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(44,73,106,0.05)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginRight: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.pri }}>{'+91'}</Text>
          </View>
          <TextInput 
            value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))} maxLength={10}
            placeholder="98765 43210" placeholderTextColor="rgba(44,73,106,0.35)" 
            keyboardType="phone-pad" 
            style={{ flex: 1, fontSize: 18, fontWeight: '600', color: C.pri, letterSpacing: 1 }} 
          />
        </View>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 12, textAlign: 'center' }}>{'THE 6-DIGIT ALIGNMENT CODE'}</Text>
        <Pressable
          onPress={() => otpRef.current?.focus()}
          accessibilityLabel="6-digit code"
          style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative' }}
        >
          {[0,1,2,3,4,5].map(i => {
            const char = otp[i] || '';
            const isActive = otp.length === i;
            return (
              <View key={i} pointerEvents="none" style={{ 
                width: 44, height: 54, borderRadius: 14, 
                backgroundColor: char ? C.pri : '#FFF',
                borderWidth: 2, borderColor: isActive ? C.pink : (char ? C.pri : 'rgba(44,73,106,0.12)'),
                alignItems: 'center', justifyContent: 'center',
                shadowColor: isActive ? C.pink : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
              }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: char ? '#FFF' : C.pri }}>{char}</Text>
              </View>
            );
          })}
          {/* iOS ignores taps on views with opacity 0, so hide the input's text instead. */}
          <TextInput
            ref={otpRef}
            value={otp} onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
            maxLength={6} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp"
            caretHidden selectionColor="transparent"
            style={{ position: 'absolute', width: '100%', height: '100%', color: 'transparent', backgroundColor: 'transparent', fontSize: 1 }}
          />
        </Pressable>
      </View>

    </View>
  );

  // ─── LAST STEP: INVITE CODE OR WAITING LIST ───
  const renderAccess = () => {
    const inviteOn = access === 'invite';
    const waitOn = access === 'waitlist';
    const radio = (on: boolean, light: boolean) => (
      <View style={{
        width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2,
        borderColor: light ? (on ? '#FFF' : 'rgba(255,255,255,0.6)') : (on ? C.pink : '#C9D5E3'),
      }}>
        {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: light ? '#FFF' : C.pink }} /> : null}
      </View>
    );
    const stubLabel = { fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 1.8 } as const;

    return (
      <View style={{ width: SW, flex: 1, paddingHorizontal: 20, paddingTop: 18 }}>
        {/* Their own first photo, ringed in pink with a "done" tick */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 88, height: 88 }}>
            <Svg width={88} height={88} style={{ position: 'absolute' }}>
              <Defs>
                <LinearGradient id="accessRing" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#FFC2CF" />
                  <Stop offset="0.5" stopColor="#FF6B8B" />
                  <Stop offset="1" stopColor="#E2456B" />
                </LinearGradient>
              </Defs>
              <Circle cx={44} cy={44} r={42.5} stroke="url(#accessRing)" strokeWidth={3} fill="none" />
            </Svg>
            {photos[0] ? (
              <Image source={photos[0]} style={{ position: 'absolute', left: 7, top: 7, width: 74, height: 74, borderRadius: 37 }} />
            ) : (
              <View style={{ position: 'absolute', left: 7, top: 7, width: 74, height: 74, borderRadius: 37, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="person" size={34} color={C.pri} />
              </View>
            )}
            <View style={{ position: 'absolute', right: -2, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: C.pink, borderWidth: 3, borderColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={14} color="#FFF" />
            </View>
          </View>
          <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 30, color: C.pri, marginTop: 16, letterSpacing: -0.5 }}>
            {name.trim() ? `Almost there, ${name.trim().split(' ')[0]}` : 'Almost there'}
          </Text>
          <Text style={{ fontFamily: 'Nunito_600SemiBold', fontSize: 15.5, color: '#6B7F99', marginTop: 4 }}>
            Prema is invite-only for now.
          </Text>
        </View>

        <View style={{ marginTop: 26, gap: 14 }}>
          {/* Invite ticket: pink, with a stub that holds the code */}
          <Ticket variant="pink" selected={inviteOn}>
            <Pressable onPress={() => setAccess('invite')} accessibilityRole="radio" accessibilityState={{ checked: inviteOn }}
              style={{ height: TICKET_TEAR, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="confirmation_number" size={22} color="#FFF" />
              </View>
              <Text style={{ flex: 1, fontFamily: 'Nunito_900Black', fontSize: 17, color: '#FFF' }}>I have an invite</Text>
              {radio(inviteOn, true)}
            </Pressable>
            <View style={{ marginHorizontal: 22, borderTopWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.45)' }} />
            <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18 }}>
              <Text style={[stubLabel, { color: 'rgba(255,255,255,0.85)' }]}>ADMIT ONE · PREMA</Text>
              {inviteOn ? (
                <View style={{ marginTop: 10, height: 52, borderRadius: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
                  backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: inviteReady ? '#FFF' : 'rgba(255,255,255,0.35)' }}>
                  <TextInput
                    value={inviteCode}
                    onChangeText={(t) => setInviteCode(t.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 14))}
                    placeholder="PREMA-XXXX"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    autoFocus
                    returnKeyType="done"
                    accessibilityLabel="Invite code"
                    style={{ flex: 1, fontFamily: 'Nunito_900Black', fontSize: 19, letterSpacing: 3, color: '#FFF' }}
                  />
                  {inviteReady ? (
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#3BB273', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={14} color="#FFF" />
                    </View>
                  ) : null}
                </View>
              ) : (
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#FFF', marginTop: 4 }}>Start meeting people today</Text>
              )}
            </View>
          </Ticket>

          {/* Waiting-list ticket: white, turns blush when chosen */}
          <Ticket variant="light" selected={waitOn}>
            <Pressable onPress={() => setAccess('waitlist')} accessibilityRole="radio" accessibilityState={{ checked: waitOn }}
              style={{ height: TICKET_TEAR, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: waitOn ? C.pink : '#EAF2FB', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="hourglass_empty" size={22} color={waitOn ? '#FFF' : C.pri} />
              </View>
              <Text style={{ flex: 1, fontFamily: 'Nunito_900Black', fontSize: 17, color: C.pri }}>Join the waiting list</Text>
              {radio(waitOn, false)}
            </Pressable>
            <View style={{ marginHorizontal: 22, borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#DCE6F1' }} />
            <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18 }}>
              <Text style={[stubLabel, { color: '#8A9AB0' }]}>STANDBY · PREMA</Text>
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#4A6585', marginTop: 4 }}>We’ll text you when it’s your turn</Text>
            </View>
          </Ticket>
        </View>
      </View>
    );
  };

  // ─── STEP 3: COSMIC BIRTH DATA ───
  const renderBasics = () => (
    <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 12 }}>
      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 14, lineHeight: 38 }}>
        {'The stars want\nto know you.'}
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'YOUR GIVEN NAME'}</Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, height: 50, justifyContent: 'center' }}>
          <TextInput 
            value={name} onChangeText={setName}
            placeholder="e.g. Eleanor" 
            placeholderTextColor="rgba(44,73,106,0.35)" 
            style={{ fontSize: 16, color: C.pri, fontWeight: '600', letterSpacing: 0.5 }} 
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'ARRIVAL DATE'}</Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, height: 50, justifyContent: 'center' }}>
            <TextInput value={dob} onChangeText={onDobChange} maxLength={10} placeholder="DD/MM/YYYY" placeholderTextColor="rgba(44,73,106,0.35)" keyboardType="number-pad" style={{ fontSize: 14, color: C.pri, fontWeight: '600', letterSpacing: 1 }} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'EXACT TIME'}</Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, height: 50, justifyContent: 'center' }}>
            <TextInput value={birthTime} onChangeText={setBirthTime} placeholder="11:11 AM" placeholderTextColor="rgba(44,73,106,0.35)" style={{ fontSize: 14, color: C.pri, fontWeight: '600', letterSpacing: 1 }} />
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'BIRTH CITY / PLACE'}</Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, height: 50, justifyContent: 'center' }}>
          <TextInput 
            value={birthCity} onChangeText={setBirthCity}
            placeholder="e.g. Mumbai, India" 
            placeholderTextColor="rgba(44,73,106,0.35)" 
            style={{ fontSize: 15, color: C.pri, fontWeight: '600' }} 
          />
        </View>
      </View>

      <View style={{ marginBottom: 18 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'YOUR GENDER IDENTITY'}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { id: 'Woman', label: 'Woman', icon: 'bedtime' },
            { id: 'Man', label: 'Man', icon: 'wb_sunny' },
            { id: 'Nonbinary', label: 'Nonbinary', icon: 'auto_awesome' }
          ].map(g => {
            const sel = gender === g.id;
            return (
              <Pressable key={g.id} onPress={() => setGender(g.id)} style={{ 
                flex: 1, height: 84, justifyContent: 'center', borderRadius: 20, 
                backgroundColor: sel ? C.pri : '#FFFFFF', 
                borderWidth: 1.5, borderColor: sel ? C.pri : 'rgba(44,73,106,0.15)', 
                alignItems: 'center', shadowColor: sel ? C.pri : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8
              }}>
                <View style={{ height: 24, justifyContent: 'center', marginBottom: 6 }}>
                  <Icon name={g.icon} size={22} color={sel ? C.pink : C.pri} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: sel ? '#FFF' : C.pri, letterSpacing: 0.5, textAlign: 'center' }}>{g.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

    </View>
  );

  // ─── STEP 3: WHO WOULD YOU LIKE TO MEET? (CLEAN, NO TOGGLE CARD) ───
  const renderWhoToMeet = () => {
    return (
      <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 16 }}>
        <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 8, lineHeight: 38 }}>
          {'Who would you\nlike to meet?'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(44,73,106,0.65)', lineHeight: 20, marginBottom: 28 }}>
          You can choose more than one answer and change it any time.
        </Text>

        {/* Clean Option Cards: Men, Women, Nonbinary people */}
        {['Men', 'Women', 'Nonbinary people'].map(g => {
          const isSelected = targetGenders.includes(g);
          return (
            <Pressable
              key={g}
              onPress={() => toggleTargetGender(g)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 60,
                paddingHorizontal: 20,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: isSelected ? C.pri : 'rgba(44,73,106,0.15)',
                backgroundColor: isSelected ? C.pri : '#FFFFFF',
                marginBottom: 14,
                shadowColor: isSelected ? C.pri : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: isSelected ? '#FFFFFF' : C.pri }}>
                {g}
              </Text>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: isSelected ? 0 : 2,
                borderColor: C.pri,
                backgroundColor: isSelected ? C.pink : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isSelected && (
                  <Icon name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </Pressable>
          );
        })}

        {/* Privacy Note */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginVertical: 20,
        }}>
          <Icon name="visibility" size={18} color="rgba(44,73,106,0.6)" />
          <Text style={{ fontSize: 12, color: 'rgba(44,73,106,0.65)', lineHeight: 18, flex: 1 }}>
            You'll only be shown to people looking to date your gender.
          </Text>
        </View>

        {/* Full-Width Action Button */}
      </View>
    );
  };

  // ─── STEP 4: RELATIONSHIP INTENT (NO EMOJIS, ELEGANT TEXT) ───
  const renderIntent = () => {
    const intents = [
      { id: 'Life Partner', title: 'Life Partner', desc: 'Looking for the one to build a lifelong journey with' },
      { id: 'Long-term Relationship', title: 'Long-term Relationship', desc: 'Seeking genuine, committed love & partnership' },
      { id: 'Deep Connection', title: 'Deep Connection', desc: 'Mindful dates leading to soulful connection' },
      { id: 'Marriage & Family', title: 'Marriage & Family', desc: 'Ready for matrimony and starting a family circle' },
      { id: 'Mindful Cadence', title: 'Mindful Cadence', desc: 'Taking time to let true alignment unfold naturally' },
    ];

    return (
      <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 14 }}>
        <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 6, lineHeight: 38 }}>
          {'What are you\nlooking for?'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(44,73,106,0.65)', lineHeight: 20, marginBottom: 18 }}>
          Set your intentions early to connect with souls on the same frequency.
        </Text>

        <View style={{ gap: 10, marginBottom: 18 }}>
          {intents.map(item => {
            const isSel = intent === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setIntent(item.id)}
                style={{
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: isSel ? C.pri : '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: isSel ? C.pri : 'rgba(44,73,106,0.15)',
                  shadowColor: isSel ? C.pri : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: isSel ? '#FFFFFF' : C.pri, marginBottom: 3 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 13, color: isSel ? 'rgba(255,255,255,0.8)' : 'rgba(44,73,106,0.65)' }}>
                  {item.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>

      </View>
    );
  };

  // ─── STEP 5: UNIQUE PREMA COMPATIBILITY RESONANCE ANCHORS ───
  const renderResonanceAnchors = () => {
    const isSearching = anchorSearch.trim().length > 0;
    const filtered = RESONANCE_ANCHORS.filter(item =>
      item.name.toLowerCase().includes(anchorSearch.trim().toLowerCase())
    );

    return (
      <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 12, position: 'relative' }}>
        {/* Background Celestial Astrolabe & Orbit Lines Accent */}
        <View style={{ position: 'absolute', top: -40, right: -60, width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: 'rgba(44,73,106,0.08)', borderStyle: 'dashed' }} pointerEvents="none" />
        <View style={{ position: 'absolute', top: 180, left: -50, width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(44,73,106,0.06)' }} pointerEvents="none" />
        <View style={{ position: 'absolute', top: 340, right: -80, width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: 'rgba(44,73,106,0.05)', borderStyle: 'dashed' }} pointerEvents="none" />

        {/* Top Header */}
        <Text style={{ fontFamily: 'Georgia', fontSize: 30, color: C.pri, fontStyle: 'italic', lineHeight: 36, marginBottom: 6 }}>
          {"What resonates\nwith your soul?"}
        </Text>

        <Text style={{ fontSize: 13, color: 'rgba(44,73,106,0.7)', lineHeight: 19, marginBottom: 14 }}>
          Choose up to 5 core connection anchors that define how you love, communicate, and bond.
        </Text>

        {/* Refined Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          borderWidth: 1.5,
          borderColor: 'rgba(44,73,106,0.14)',
          paddingHorizontal: 16,
          height: 48,
          marginBottom: 16,
          shadowColor: C.pri,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 2,
        }}>
          <Icon name="search" size={20} color="rgba(44,73,106,0.5)" />
          <TextInput
            value={anchorSearch}
            onChangeText={setAnchorSearch}
            placeholder="Search connection anchors..."
            placeholderTextColor="rgba(44,73,106,0.4)"
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: C.pri, fontWeight: '500' }}
          />
          {anchorSearch.length > 0 && (
            <Pressable onPress={() => setAnchorSearch('')} style={{ padding: 4 }}>
              <Icon name="close" size={18} color="rgba(44,73,106,0.5)" />
            </Pressable>
          )}
        </View>

        {/* Zero-Gravity Suspended Floating Capsule Cloud (Broad & Animated Floating Motion) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 60,
            gap: 12,
          }}
        >
          {isSearching ? (
            <View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 12 }}>
                {`SEARCH RESULTS (${filtered.length})`}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 }}>
                {filtered.map((item, idx) => {
                  const isSel = selectedAnchors.includes(item.id);
                  return (
                    <FloatingCapsule
                      key={item.id}
                      item={item}
                      isSel={isSel}
                      onPress={() => toggleAnchor(item.id)}
                      index={idx}
                      marginLeft={0}
                    />
                  );
                })}
              </View>
            </View>
          ) : (
            ANCHOR_CATEGORIES.map((cat, catIdx) => {
              const categoryItems = RESONANCE_ANCHORS.filter(item => cat.ids.includes(item.id));
              return (
                <View key={cat.title} style={{ marginBottom: 16 }}>
                  {/* Category Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon name={cat.icon} size={16} color={C.pri} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.2 }}>
                      {cat.title}
                    </Text>
                  </View>

                  {/* Paragraph-Style Flowing Zero-Gravity Floating Capsule Cloud */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 }}>
                    {categoryItems.map((item, itemIdx) => {
                      const isSel = selectedAnchors.includes(item.id);
                      const globalIdx = catIdx * 5 + itemIdx;
                      return (
                        <FloatingCapsule
                          key={item.id}
                          item={item}
                          isSel={isSel}
                          onPress={() => toggleAnchor(item.id)}
                          index={globalIdx}
                          marginLeft={0}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

      </View>
    );
  };

  // ─── STEP 6: PHOTOS & BIO SIGNATURE ───
  const renderPhotosAndBio = () => (
    <View style={{ width: SW, flex: 1, paddingHorizontal: 28, paddingTop: 14 }}>
      <Text style={{ fontFamily: 'Georgia', fontSize: 32, color: C.pri, fontStyle: 'italic', marginBottom: 6, lineHeight: 36 }}>
        {'Show your\ntrue aura.'}
      </Text>
      <Text style={{ fontSize: 13, color: 'rgba(44,73,106,0.65)', marginBottom: 16 }}>
        {'Upload your best moments and write a short bio signature.'}
      </Text>

      {/* Photo Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {[0, 1, 2, 3, 4, 5].map(idx => {
          const hasPhoto = Boolean(photos[idx]);
          return (
            <Pressable
              key={idx}
              onPress={() => handleTogglePhoto(idx)}
              style={{
                width: (SW - 56 - 20) / 3,
                height: 100,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: hasPhoto ? C.pink : 'rgba(44,73,106,0.2)',
                borderStyle: hasPhoto ? 'solid' : 'dashed',
                backgroundColor: hasPhoto ? 'rgba(255,107,139,0.05)' : '#FFF',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {hasPhoto ? (
                <Image source={photos[idx]} style={{ width: '100%', height: '100%', borderRadius: 14 }} />
              ) : (
                <Icon name="add" size={24} color={C.pri} />
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontSize: 11, fontWeight: '700', color: C.pri, letterSpacing: 1.5, marginBottom: 6 }}>{'AURA SIGNATURE / BIO'}</Text>
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 }}>
        <TextInput 
          value={bio} onChangeText={setBio} 
          placeholder="A few words about your cosmic journey and intentions..." 
          placeholderTextColor="rgba(44,73,106,0.35)" 
          multiline numberOfLines={2} 
          style={{ fontSize: 14, color: C.pri, fontWeight: '500', minHeight: 44, textAlignVertical: 'top' }} 
        />
      </View>

    </View>
  );

  // One Continue button for every step, pinned above the walking figures so it is never clipped.
  // Real per-step requirements (used when SKIP_SIGNUP_CHECKS is false).
  const baseCta = (() => {
    switch (step) {
      case 1: return { label: 'Verify & Continue', ok: phoneReady && otp.length === 6, next: 2 };
      case 2: return { label: 'Continue', ok: !!(name.trim() && dobReady && gender), next: 3 };
      case 3: return { label: 'Continue', ok: targetGenders.length > 0, next: 4 };
      case 4: return { label: 'Continue', ok: !!intent, next: 5 };
      case 5: return { label: selectedAnchors.length ? `Continue · ${selectedAnchors.length}/5` : 'Continue', ok: selectedAnchors.length > 0, next: 6 };
      case 6: return { label: 'Continue', ok: photos.length > 0, next: 7 };
      case 7: return access === 'waitlist'
        ? { label: 'Save my spot', ok: true, next: 8 }
        : { label: 'Unlock Prema', ok: access === 'invite' && inviteReady, next: 8 };
      default: return null;
    }
  })();

  const cta = (() => {
    const c = baseCta;
    // Dev: no credentials or required fields — every Continue is tappable.
    return c && SKIP_SIGNUP_CHECKS
      ? { ...c, ok: true, label: step === 7 && !access ? 'Continue' : c.label }
      : c;
  })();

  const slides = [renderWelcome, renderVerify, renderBasics, renderWhoToMeet, renderIntent, renderResonanceAnchors, renderPhotosAndBio, renderAccess];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={step === 0 ? [] : ['top']}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Step Progress Node Map Header */}
        {step > 0 && (
          <RNAnimated.View style={{ paddingLeft: 12, paddingRight: 16, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 4, opacity: messageOpacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
            <Pressable
              onPress={() => goToStep(step - 1)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: -2 }}
            >
              <Icon name="chevron_left" size={26} color={C.pri} />
            </Pressable>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Track spans exactly from the first node's centre to the last (nodes are 36 wide). */}
              <View style={{ position: 'absolute', top: 8, left: 18, right: 18, height: 1.5, backgroundColor: 'rgba(44,73,106,0.15)', zIndex: 1 }} />
              <RNAnimated.View style={{
                position: 'absolute', top: 8, left: 18, right: 18, height: 1.5, backgroundColor: C.pri, zIndex: 1,
                transformOrigin: 'left',
                transform: [{ scaleX: scrollX.interpolate({ inputRange: [0, SW * 7], outputRange: [0.0001, 1], extrapolate: 'clamp' }) }],
              }} />

              {['WELCOME', 'AUTH', 'COSMIC', 'MATCH', 'INTENT', 'ANCHORS', 'PROFILE', 'ACCESS'].map((label, i) => {
                const starOpacity = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, i * SW, (i + 0.6) * SW],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp'
                });
                
                const starScale = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, i * SW, (i + 0.6) * SW],
                  outputRange: [0.7, 1.2, 0.7],
                  extrapolate: 'clamp'
                });

                const futureDotOpacity = scrollX.interpolate({
                  inputRange: [(i - 0.6) * SW, (i - 0.2) * SW],
                  outputRange: [1, 0],
                  extrapolate: 'clamp'
                });

                const pastDotOpacity = scrollX.interpolate({
                  inputRange: [(i + 0.2) * SW, (i + 0.6) * SW],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                });

                return (
                  <View key={label} style={{ alignItems: 'center', zIndex: 2, width: 36 }}>
                    {/* Wire hanging from the line */}
                    <View style={{ width: 1, height: 6, backgroundColor: 'rgba(44,73,106,0.2)', marginTop: 8 }} />
                    
                    {/* Bulb container */}
                    <View style={{ width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                      {/* Future: dim bulb */}
                      <RNAnimated.View style={{ 
                        position: 'absolute', width: 10, height: 10, borderRadius: 5, 
                        backgroundColor: '#E8EEF4', borderWidth: 1, borderColor: 'rgba(44,73,106,0.15)',
                        opacity: futureDotOpacity 
                      }} />
                      {/* Past: lit navy bulb with glow */}
                      <RNAnimated.View style={{ 
                        position: 'absolute', width: 10, height: 10, borderRadius: 5, 
                        backgroundColor: C.pri, opacity: pastDotOpacity,
                        shadowColor: C.accent, shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6, shadowRadius: 4, elevation: 3,
                      }} />
                      {/* Current: glowing pink star bulb */}
                      <RNAnimated.View style={{ 
                        position: 'absolute', opacity: starOpacity, 
                        transform: [{ scale: starScale }],
                      }}>
                        <View style={{ 
                          width: 14, height: 14, borderRadius: 7, 
                          backgroundColor: C.pink,
                          justifyContent: 'center', alignItems: 'center',
                          shadowColor: C.pink, shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 1, shadowRadius: 8, elevation: 5,
                        }}>
                          <Text style={{ fontSize: 9, color: '#FFF', marginTop: -1 }}>{'✦'}</Text>
                        </View>
                      </RNAnimated.View>
                    </View>

                    {/* Label below */}
                    <View style={{ marginTop: 4, width: 46, alignItems: 'center' }}>
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 7, fontWeight: '700', color: 'rgba(44,73,106,0.4)', letterSpacing: 0.3, textAlign: 'center', opacity: futureDotOpacity }}>
                        {label}
                      </RNAnimated.Text>
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 7, fontWeight: '700', color: C.pri, letterSpacing: 0.3, textAlign: 'center', opacity: pastDotOpacity }}>
                        {label}
                      </RNAnimated.Text>
                      <RNAnimated.Text style={{ position: 'absolute', fontSize: 7, fontWeight: '700', color: C.pink, letterSpacing: 0.3, textAlign: 'center', opacity: starOpacity }}>
                        {label}
                      </RNAnimated.Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </RNAnimated.View>
        )}

        {/* Slides Container */}
        <View style={{ flex: 1 }} onLayout={(e) => setSlideH(e.nativeEvent.layout.height)}>
          <RNAnimated.FlatList
            ref={flatListRef}
            data={slides}
            keyExtractor={(_, i) => String(i)}
            horizontal pagingEnabled scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={RNAnimated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
            keyboardShouldPersistTaps="always"
            renderItem={({ item: fn, index }) => (
              <View style={{ width: SW, height: slideH || undefined }}>
                {/* Welcome is full-bleed and Anchors scrolls itself; other steps scroll so the button is never clipped. */}
                {index === 0 || index === 5 ? fn() : (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                  >
                    {fn()}
                  </ScrollView>
                )}
              </View>
            )}
          />
        </View>

        {cta ? (
          <View style={{ paddingHorizontal: 28, paddingTop: 10, paddingBottom: keyboardOpen ? 10 : 2 }}>
            <Pressable
              onPress={() => { if (cta.ok) goToStep(cta.next); }}
              accessibilityRole="button"
              accessibilityState={{ disabled: !cta.ok }}
              style={{
                backgroundColor: cta.ok ? C.pink : 'rgba(44,73,106,0.35)',
                opacity: cta.ok ? 1 : 0.7,
                height: 54,
                borderRadius: 27,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: cta.ok ? C.pink : 'transparent',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: cta.ok ? 6 : 0,
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {cta.label}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Ground + Stick Figure Animations */}
        {step > 0 && !keyboardOpen && (
          <View style={{ height: 100, position: 'relative' }}>
            <View style={{ position: 'absolute', bottom: 35, left: 16, right: 16, height: 2, backgroundColor: C.ground, borderRadius: 1 }} />

                        {Array.from({ length: 20 }).map((_, i) => {
              const dotX = 16 + i * ((SW - 32) / 20);
              const isLeftSide = i < 10;

              if (isLeftSide) {
                const manOpacity = leftX.interpolate({
                  inputRange: [dotX - 25, dotX, dotX + 25],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                // Simplified vibration: fewer interpolation points for smoother perf
                const manInp = [0, dotX];
                const manOut = [0, 0];
                for (let j = 1; j <= 8; j++) {
                  manInp.push(dotX + j * 20);
                  manOut.push(j % 2 === 0 ? -1.5 : 1.5);
                }
                const manVibrate = leftX.interpolate({
                  inputRange: manInp,
                  outputRange: manOut,
                  extrapolate: 'clamp',
                });

                return (
                  <View key={`d${i}`} style={{ position: 'absolute', bottom: 15, left: dotX - 4, alignItems: 'center' }}>
                    <View style={{ width: 1, height: 6, backgroundColor: 'rgba(44,73,106,0.15)' }} />
                    <RNAnimated.View style={{ transform: [{ translateY: manVibrate }] }}>
                      <Text style={{ fontSize: 10, color: '#B8D8F0', marginTop: -2 }}>{'✦'}</Text>
                      <RNAnimated.Text style={{
                        position: 'absolute', top: 0, left: 0,
                        fontSize: 10, color: C.pri,
                        opacity: manOpacity,
                        textShadowColor: C.accent, textShadowRadius: 4, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              } else {
                const womanOpacity = rightX.interpolate({
                  inputRange: [dotX - 25, dotX, dotX + 25],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                const womInp = [dotX];
                const womOut = [0];
                for (let j = 1; j <= 8; j++) {
                  womInp.unshift(dotX - j * 20);
                  womOut.unshift(j % 2 === 0 ? -1.5 : 1.5);
                }
                womInp.push(9999);
                womOut.push(0);
                
                const womanVibrate = rightX.interpolate({
                  inputRange: womInp,
                  outputRange: womOut,
                  extrapolate: 'clamp',
                });

                return (
                  <View key={`d${i}`} style={{ position: 'absolute', bottom: 15, left: dotX - 4, alignItems: 'center' }}>
                    <View style={{ width: 1, height: 6, backgroundColor: 'rgba(44,73,106,0.15)' }} />
                    <RNAnimated.View style={{ transform: [{ translateY: womanVibrate }] }}>
                      <Text style={{ fontSize: 10, color: '#FFB8C6', marginTop: -2 }}>{'✦'}</Text>
                      <RNAnimated.Text style={{
                        position: 'absolute', top: 0, left: 0,
                        fontSize: 10, color: '#E0415C',
                        opacity: womanOpacity,
                        textShadowColor: C.pink, textShadowRadius: 4, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              }
            })}




            {/* Left Figure */}
            <RNAnimated.View style={{
              position: 'absolute',
              bottom: 37, left: 0, transform: [{ translateX: leftX }],
            }}>
              <SideStickFigure color={C.pri} facingLeft={false} walkCycle={walkCycle} scale={0.9} />
            </RNAnimated.View>

            {/* Right Figure */}
            <RNAnimated.View style={{
              position: 'absolute',
              bottom: 37, left: 0, transform: [{ translateX: rightX }],
            }}>
              <SideStickFigure color={C.pink} isFemale={true} facingLeft={true} walkCycle={walkCycle} scale={0.9} />
            </RNAnimated.View>

            

            {showHearts && (
              <View style={{ position: 'absolute', bottom: 70, left: SW / 2 - 30, width: 60, height: 80 }}>
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

      {/* Finale Overlay */}
      {showFinale && (
        <RNAnimated.View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(241,247,253,0.97)',
          justifyContent: 'center', alignItems: 'center',
          opacity: messageOpacity,
          zIndex: 50, elevation: 50, // above the progress header's raised nodes
        }}>
          <Text style={{ fontFamily: 'Georgia', fontSize: 38, color: C.pri, fontStyle: 'italic', textAlign: 'center', lineHeight: 50 }}>
            {'The stars\nhave aligned'}
          </Text>
          
          
        </RNAnimated.View>
      )}
    
      {/* Floating Flower that transcends the overlay */}
      {showFlower && (
        <RNAnimated.View style={{
          position: 'absolute',
          bottom: 45, // Exact position matching the original
          left: SW / 2 - 12,
          opacity: flowerOpacity,
          transform: [
            { translateY: flowerY },
            { scale: flowerScale },
            { rotate: flowerRotation.interpolate({ inputRange: [0, 1, 2], outputRange: ['0deg', '360deg', '720deg'] }) }
          ],
          zIndex: 100, // Very important: sits ON TOP of the Finale Overlay!
        }}>
          <Text style={{ fontSize: 24 }}>{'\uD83C\uDF38'}</Text>
        </RNAnimated.View>
      )}
    </SafeAreaView>
  );
}
