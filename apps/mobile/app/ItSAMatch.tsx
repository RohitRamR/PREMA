// "It's a match" — shown right after two people like each other.
// Pink PREMA moment: overlapping photos with a beating heart, the match score,
// and one clear next step (send a note), with planning a date as the alternative.
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Tap } from '../components/prema-ui';
import { goBack } from '../components/nav';
import { useProfile } from '../src/store/profile';
import { person } from '../src/store/people';
import { addMatch, hasConversation } from '../src/store/chats';

export default function ItSAMatch() {
  return (
    <NunitoScope>
      <MatchInner />
    </NunitoScope>
  );
}

function MatchInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id, name, photo } = useLocalSearchParams<{ id?: string; name?: string; photo?: string }>();
  const me = useProfile();
  const them = person(id);
  const theirName = name ?? them?.name ?? 'your match';
  const theirPhoto = photo ?? them?.photos[0];
  const score = them?.match;

  // Entrance: photos slide together, heart pops, then a slow heartbeat.
  const enter = useRef(new Animated.Value(0)).current;
  const beat = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }).start();
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(beat, { toValue: 1.12, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(beat, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(500),
    ]));
    loop.start();
    return () => loop.stop();
  }, [enter, beat]);

  const size = Math.min(150, width * 0.36);
  const leftX = enter.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] });
  const rightX = enter.interpolate({ inputRange: [0, 1], outputRange: [60, 0] });
  const fade = enter.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  // Make sure the conversation exists (opened directly, it may not yet), then open it.
  const openChat = () => {
    if (!id) return router.replace('/chats');
    if (them) addMatch({ id, name: them.name, age: them.age, city: them.city, photo: them.photos[0], match: them.match });
    else if (name && photo) addMatch({ id, name, age: 0, city: '', photo, match: 90 });
    if (hasConversation(id)) router.replace({ pathname: '/Chat', params: { id } });
    else router.replace('/chats');
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Pink wash at the top fading into the app background */}
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="matchBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF97AE" />
            <Stop offset="0.45" stopColor="#FFD3DD" />
            <Stop offset="0.75" stopColor={C.bg} />
          </LinearGradient>
          <RadialGradient id="matchGlow" cx="0.5" cy="0.38" r="0.45">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#matchBg)" />
        <Rect width="100%" height="100%" fill="url(#matchGlow)" />
      </Svg>

      <View style={[s.top, { paddingTop: insets.top + 8 }]}>
        <View style={{ width: 42 }} />
        <Logo width={92} height={36} tintColor="#FFFFFF" />
        <Tap onPress={() => goBack(router)} style={s.close} accessibilityLabel="Close">
          <Icon name="close" size={20} color={C.white} />
        </Tap>
      </View>

      <View style={s.center}>
        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <Text style={s.kicker}>It’s a match</Text>
          <Text style={s.title}>You and {theirName}</Text>
        </Animated.View>

        {/* Overlapping photos with the heart between */}
        <View style={[s.pair, { height: size + 20 }]}>
          <Animated.View style={[s.photoWrap, { width: size, height: size, borderRadius: size / 2, transform: [{ translateX: leftX }, { rotate: '-6deg' }] }]}>
            <Image source={{ uri: me.photos[0] }} style={{ width: '100%', height: '100%', borderRadius: size / 2 }} />
          </Animated.View>
          <Animated.View style={[s.photoWrap, { width: size, height: size, borderRadius: size / 2, marginLeft: -size * 0.22, transform: [{ translateX: rightX }, { rotate: '6deg' }] }]}>
            {theirPhoto ? <Image source={{ uri: theirPhoto }} style={{ width: '100%', height: '100%', borderRadius: size / 2 }} /> : null}
          </Animated.View>
          <Animated.View style={[s.heart, { transform: [{ scale: Animated.multiply(enter, beat) }] }]}>
            <Icon name="favorite" size={30} color={C.white} />
          </Animated.View>
        </View>

        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          {score ? (
            <Tap onPress={() => router.push({ pathname: '/CompatibilityBreakdown', params: id ? { id } : {} })} style={s.scorePill} pressedStyle={{ opacity: 0.85 }}
              accessibilityRole="button" accessibilityLabel={`${score}% aligned. See why you match`}>
              <View style={s.scoreBadge}><Text style={s.scoreNum}>{score}%</Text></View>
              <Text style={s.scoreText}>aligned</Text>
              <View style={s.scoreDivider} />
              <Text style={s.scoreLink}>See why</Text>
              <Icon name="chevron_right" size={18} color={C.pink} />
            </Tap>
          ) : null}
          <Text style={s.body}>You both said yes. Start with something real.</Text>
        </Animated.View>
      </View>

      <Animated.View style={[s.actions, { opacity: fade, paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <Tap onPress={openChat} style={s.primary} pressedStyle={{ opacity: 0.9 }} accessibilityRole="button">
          <Icon name="chat_bubble" size={19} color={C.white} />
          <Text style={s.primaryText}>Send {theirName} a note</Text>
        </Tap>
        <Tap onPress={() => router.replace({ pathname: '/date/plan', params: id ? { match: id } : {} })} style={s.secondary} accessibilityRole="button">
          <Icon name="local_activity" size={18} color={C.pri} />
          <Text style={s.secondaryText}>Plan a date instead</Text>
        </Tap>
        <Tap onPress={() => router.replace('/(tabs)')} style={{ paddingVertical: 10, alignSelf: 'center' }}>
          <Text style={s.later}>Keep discovering</Text>
        </Tap>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  close: {
    width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  kicker: { color: '#C9406A', fontSize: 15, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: C.pri, fontSize: 32, fontWeight: '900', letterSpacing: -0.6, marginTop: 6, textAlign: 'center' },
  pair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
  photoWrap: {
    borderWidth: 5, borderColor: C.white, backgroundColor: C.accentSoft,
    shadowColor: '#E2456B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8,
  },
  heart: {
    position: 'absolute', bottom: -6, width: 62, height: 62, borderRadius: 31,
    backgroundColor: C.pink, borderWidth: 4, borderColor: C.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 10,
  },
  scorePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 6, paddingRight: 10, paddingVertical: 6, borderRadius: 24,
    backgroundColor: C.white, shadowColor: C.pri, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, backgroundColor: C.pink },
  scoreNum: { color: C.white, fontSize: 15, fontWeight: '900' },
  scoreText: { color: C.pri, fontSize: 15, fontWeight: '800' },
  scoreDivider: { width: 1, height: 18, backgroundColor: '#E6EDF5' },
  scoreLink: { color: C.pink, fontSize: 14.5, fontWeight: '900' },
  body: { color: C.body, fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 14, lineHeight: 23 },
  actions: { paddingHorizontal: 20, gap: 10 },
  primary: {
    height: 58, borderRadius: 29, backgroundColor: C.pink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 6,
  },
  primaryText: { color: C.white, fontSize: 17, fontWeight: '900' },
  secondary: {
    height: 52, borderRadius: 26, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    shadowColor: C.pri, shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  secondaryText: { color: C.pri, fontSize: 15, fontWeight: '800' },
  later: { color: C.muted, fontSize: 15, fontWeight: '800' },
});
