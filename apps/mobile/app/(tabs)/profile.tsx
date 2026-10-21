import React, { useState } from 'react';
import { View, Image, Pressable, ScrollView, Switch, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Text, { NunitoScope } from '../../components/PremaText';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Logo from '../../components/Logo';
import CelestialBackground from '../../components/CelestialBackground';
import { useProfile, updateProfile, LIFESTYLE_OPTIONS } from '../../src/store/profile';
import { useMyChart, answeredCount, QUESTION_COUNT } from '../../src/features/compatibility';
import StatusFade from '../../components/StatusFade';

// Live app palette (matches MatchDetail / Discover / onboarding)
const C = {
  bg: '#F1F7FD',
  pri: '#2C496A',
  body: '#3E5C7D',
  muted: '#8892A3',
  accent: '#74B4F2',
  accentSoft: '#E7F0F9',
  pink: '#FF6B8B',
  pinkSoft: '#FFE8EE',
  navy: '#1A2E44',
  navyRaised: '#243B55',
  shadow: '#E3EDF7',
  white: '#FFFFFF',
};


const PREFERENCES: { icon: string; title: string; sub: string; href?: Href }[] = [
  { icon: 'shield', title: 'Safety & Verification', sub: 'Aadhaar & work verified', href: '/DateCheckInSafety' },
  { icon: 'group', title: 'Family Circle', sub: '2 trusted contacts linked', href: '/FamilyMatrimonialCircle' },
  { icon: 'tune', title: 'Discovery & Distance', sub: '', href: '/DiscoveryPreferences' },
  { icon: 'auto_awesome', title: 'Compatibility Quiz', sub: '', href: '/CompatibilityQuiz' },
  { icon: 'notifications_none', title: 'Curated Introductions', sub: 'Daily at 9:00 AM', href: '/DailyReleaseMindfulCadence' },
];

// NativeWind's Pressable interop ignores function-style `style`, so track the
// pressed state ourselves and always pass a plain, flattened style object.
function Tap({
  style, pressedStyle, children, ...rest
}: React.ComponentProps<typeof Pressable> & {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: ViewStyle;
  children?: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => { setPressed(true); rest.onPressIn?.(e); }}
      onPressOut={(e) => { setPressed(false); rest.onPressOut?.(e); }}
      style={StyleSheet.flatten([style, pressed ? pressedStyle : null])}
    >
      {children}
    </Pressable>
  );
}

function ProfileTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useProfile();
  // Your real Kundli summary from the matching engine (birth time in IST).
  const chart = useMyChart();
  const quizDone = answeredCount(me.answers ?? {});
  const paused = me.paused;
  const setPaused = (v: boolean) => updateProfile({ paused: v });
  const lifestyle = me.lifestyle.map((label) => ({
    label, icon: LIFESTYLE_OPTIONS.find((o) => o.label === label)?.icon ?? 'spa',
  }));
  // Depth grows as the profile fills in (photos, about, values, rhythm).
  const depth = Math.min(1, 0.55 + me.photos.length * 0.05 + (me.about ? 0.1 : 0) + me.values.length * 0.03 + Math.min(me.lifestyle.length, 4) * 0.01);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 150 }}
      >
        {/* ── Header ── */}
        <View style={s.headerRow}>
          <View>
            <Logo width={74} height={31} tintColor="#2C496A" style={{ marginBottom: 2 }} />
            <Text style={s.pageTitle}>Profile</Text>
          </View>
          <Tap onPress={() => router.push('/Settings')} style={s.roundBtn} pressedStyle={{ opacity: 0.7 }} accessibilityLabel="Settings">
            <Icon name="settings" size={22} color={C.pri} />
          </Tap>
        </View>

        {/* ── Identity ── */}
        <View style={[s.card, { alignItems: 'center', paddingTop: 28 }]}>
          <View style={s.avatarRing}>
            <Image source={{ uri: me.photos[0] }} style={s.avatar} />
            <Tap onPress={() => router.push('/ProfilePhotos')} style={s.cameraBadge} pressedStyle={{ opacity: 0.8 }} accessibilityLabel="Update photos">
              <Icon name="photo_camera" size={16} color={C.white} />
            </Tap>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <Text style={s.name}>{me.name}, {me.age}</Text>
            <View style={s.verifiedDot}>
              <Icon name="check" size={14} color={C.white} />
            </View>
          </View>
          <View style={s.metaRow}>
            <Icon name="location_on" size={16} color={C.muted} />
            <Text style={s.meta}>{me.location}</Text>
            <Text style={s.metaDot}>•</Text>
            <Text style={s.meta}>{me.occupation}</Text>
          </View>

          <View style={s.intentPill}>
            <Icon name="favorite_border" size={16} color={C.pink} />
            <Text style={s.intentText}>{me.intent}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, alignSelf: 'stretch' }}>
            <Tap onPress={() => router.push('/EditProfile')} style={s.btnPrimary} pressedStyle={{ opacity: 0.85 }}>
              <Icon name="edit" size={18} color={C.white} />
              <Text style={s.btnPrimaryText}>Edit profile</Text>
            </Tap>
            <Tap onPress={() => router.push('/ProfilePhotos')} style={s.btnSoft} pressedStyle={{ opacity: 0.8 }}>
              <Icon name="image" size={18} color={C.pri} />
              <Text style={s.btnSoftText}>Photos</Text>
            </Tap>
          </View>
        </View>

        {/* ── About ── */}
        {me.about ? (
          <View style={s.card}>
            <Text style={s.label}>About me</Text>
            <Text style={s.aboutText}>{me.about}</Text>
          </View>
        ) : null}

        {/* ── Profile depth ── */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={s.label}>Profile depth</Text>
              <Text style={s.cardTitle}>Exceptional resonance</Text>
            </View>
            <Text style={s.bigNumber}>{Math.round(depth * 100)}%</Text>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${depth * 100}%` }]} />
          </View>
          <Text style={s.bodySmall}>
            {depth >= 1 ? 'Your profile is complete — expect your deepest introductions.' : 'Add more photos or a voice prompt to reach 100% and unlock deeper daily introductions.'}
          </Text>
        </View>

        {/* ── Membership ── */}
        <Tap
          onPress={() => router.push('/PremaPlusMembership')}
          style={s.navyCard} pressedStyle={{ opacity: 0.92 }}
        >
          {/* Same pink gradient as the Prema Plus page */}
          <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="plusCard" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FF97AE" />
                <Stop offset="0.55" stopColor="#FF6B8B" />
                <Stop offset="1" stopColor="#E2456B" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#plusCard)" />
          </Svg>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Icon name="auto_awesome" size={14} color={C.white} />
              <Text style={[s.label, { color: 'rgba(255,255,255,0.9)', marginBottom: 0 }]}>Prema Plus</Text>
            </View>
            <Text style={s.navyTitle}>Founding Member</Text>
            <Text style={s.navyBody}>Quarterly plan · renews 14 Jan 2027</Text>
          </View>
          <View style={s.navyChip}>
            <Text style={s.navyChipText}>Manage</Text>
            <Icon name="chevron_right" size={18} color={C.white} />
          </View>
        </Tap>

        {/* ── Core pillars ── */}
        <Text style={s.sectionLabel}>Core relationship pillars</Text>
        <View style={s.card}>
          <Text style={s.label}>Core values</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {me.values.map(v => (
              <View key={v} style={s.chip}>
                <View style={s.chipDot} />
                <Text style={s.chipText}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={s.label}>A boundary I firmly hold</Text>
          <Text style={s.quote}>“{me.boundary}”</Text>

          <Text style={[s.label, { marginTop: 22 }]}>Daily rhythm</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {lifestyle.map(l => (
              <View key={l.label} style={s.rhythmTile}>
                <Icon name={l.icon} size={18} color={C.accent} />
                <Text style={s.rhythmText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Vedic & Harmony DNA ── */}
        <Tap
          onPress={() => router.push('/CompatibilityBreakdown')}
          style={s.harmonyCard} pressedStyle={{ opacity: 0.95 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingRight: 10 }}>
              <Icon name="all_inclusive" size={22} color={C.accent} />
              <Text style={s.harmonyTitle} numberOfLines={1} adjustsFontSizeToFit>Vedic & Harmony DNA</Text>
            </View>
            <View style={s.privatePill}>
              <Icon name="lock" size={12} color={C.pri} />
              <Text style={s.privateText}>Private</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={s.harmonyTile}>
              <Text style={s.label}>Archetype</Text>
              <Text style={s.harmonyValue}>{chart ? `${chart.moonSign} (${chart.moonSignEnglish})` : 'Add birth date'}</Text>
              <Text style={s.bodySmall}>{chart ? `${chart.nakshatra} Nakshatra · Pada ${chart.pada}` : 'In Edit profile'}</Text>
            </View>
            <View style={s.harmonyTile}>
              <Text style={s.label}>Element</Text>
              <Text style={s.harmonyValue}>{chart ? `${chart.element} Moon` : '—'}</Text>
              <Text style={s.bodySmall}>{chart ? (chart.lagna ? `${chart.lagna} rising · Sun in ${chart.sunSign}` : `Sun in ${chart.sunSign}`) : ''}</Text>
            </View>
          </View>

          <View style={s.resonanceRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Compatibility DNA</Text>
              <Text style={s.resonanceNum}>
                {quizDone}
                <Text style={s.resonanceMax}> / {QUESTION_COUNT} answered</Text>
              </Text>
            </View>
            <View style={s.resonanceIcon}>
              <Icon name="insights" size={22} color={C.white} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <Icon name="enhanced_encryption" size={16} color={C.muted} />
            <Text style={[s.bodySmall, { flex: 1, marginTop: 0 }]}>
              Your birth details stay encrypted. Only the harmony summary is shared, and only with mutual connections.
            </Text>
          </View>
        </Tap>

        {/* ── Preferences & safety ── */}
        <Text style={s.sectionLabel}>Preferences & safety</Text>
        <View style={[s.card, { paddingVertical: 6, paddingHorizontal: 0 }]}>
          {PREFERENCES.map((p, i) => (
            <Tap
              key={p.title}
              onPress={p.href ? () => router.push(p.href!) : undefined}
              style={[s.row, i < PREFERENCES.length - 1 ? s.rowDivider : null]}
              pressedStyle={{ backgroundColor: 'rgba(116,180,242,0.06)' }}
            >
              <View style={s.rowIcon}>
                <Icon name={p.icon} size={20} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{p.title}</Text>
                <Text style={s.rowSub}>
                  {p.href === '/DiscoveryPreferences'
                    ? `${me.discovery.cities.join(' & ')} · ${me.discovery.distanceKm} km`
                    : p.href === '/CompatibilityQuiz'
                      ? `${quizDone} of ${QUESTION_COUNT} answered · sharpens every match`
                      : p.sub}
                </Text>
              </View>
              <Icon name="chevron_right" size={22} color={C.muted} />
            </Tap>
          ))}

          <View style={[s.row, s.rowDividerTop]}>
            <View style={[s.rowIcon, { backgroundColor: C.pinkSoft }]}>
              <Icon name="pause" size={20} color={C.pink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Pause matching</Text>
              <Text style={s.rowSub}>{paused ? 'Hidden from new introductions' : 'You’re visible to curated matches'}</Text>
            </View>
            <Switch
              value={paused}
              onValueChange={setPaused}
              trackColor={{ false: '#DCE6F0', true: C.pink }}
              thumbColor={C.white}
              ios_backgroundColor="#DCE6F0"
            />
          </View>
        </View>

        <Text style={s.footer}>PREMA · Cultivated for meaningful living</Text>
      </ScrollView>

      {/* Soft backing behind the status bar so content doesn't collide with the clock */}
      <StatusFade />
    </View>
  );
}

const cardShadow = {
  shadowColor: C.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 2,
};

const s = StyleSheet.create({
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20, paddingHorizontal: 4,
  },
  eyebrow: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  pageTitle: { color: C.pri, fontSize: 34, fontFamily: 'Georgia', fontStyle: 'italic', lineHeight: 42 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', ...cardShadow,
  },

  card: { backgroundColor: C.white, borderRadius: 24, padding: 22, marginBottom: 16, ...cardShadow },

  avatarRing: {
    width: 128, height: 128, borderRadius: 64, padding: 4,
    borderWidth: 2, borderColor: C.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatar: { width: 116, height: 116, borderRadius: 58, backgroundColor: C.accentSoft },
  cameraBadge: {
    position: 'absolute', bottom: 2, right: 2, width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: C.white,
  },
  name: { color: C.pri, fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  verifiedDot: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#3EA9F5',
    alignItems: 'center', justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' },
  meta: { color: C.muted, fontSize: 15, fontWeight: '500' },
  metaDot: { color: C.muted, fontSize: 15, marginHorizontal: 2 },
  intentPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: C.pinkSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  intentText: { color: C.pri, fontSize: 13, fontWeight: '600' },

  btnPrimary: {
    flex: 1.4, height: 50, borderRadius: 25, backgroundColor: C.pink,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  btnPrimaryText: { color: C.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
  btnSoft: {
    flex: 1, height: 50, borderRadius: 25, backgroundColor: C.accentSoft,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnSoftText: { color: C.pri, fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },

  label: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  sectionLabel: {
    color: C.muted, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase',
    marginTop: 12, marginBottom: 12, marginLeft: 4,
  },
  cardTitle: { color: C.pri, fontSize: 20, fontFamily: 'Georgia', fontStyle: 'italic', marginTop: -4 },
  bigNumber: { color: C.accent, fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  track: { height: 8, borderRadius: 4, backgroundColor: C.accentSoft, marginTop: 14, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: C.accent },
  bodySmall: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 12 },

  navyCard: {
    backgroundColor: C.pink, borderRadius: 24, padding: 22, marginBottom: 16, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 6,
  },
  navyTitle: { color: C.white, fontSize: 22, fontFamily: 'Georgia', fontStyle: 'italic', marginBottom: 4 },
  navyBody: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 19 },
  navyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: 'rgba(255,255,255,0.25)', paddingLeft: 14, paddingRight: 8, paddingVertical: 8, borderRadius: 18,
  },
  navyChipText: { color: C.white, fontSize: 13, fontWeight: '700' },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.accentSoft, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  chipText: { color: C.body, fontSize: 14, fontWeight: '600' },
  aboutText: { color: C.body, fontSize: 16, lineHeight: 26 },
  quote: { color: C.pri, fontSize: 19, lineHeight: 28, fontFamily: 'Georgia', fontStyle: 'italic' },
  rhythmTile: {
    width: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F6F9FC', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14,
  },
  rhythmText: { color: C.body, fontSize: 13, fontWeight: '600', flex: 1 },

  harmonyCard: {
    backgroundColor: C.accentSoft, borderRadius: 24, padding: 22, marginBottom: 16, marginTop: 4,
    shadowColor: '#D4E2F0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  harmonyTitle: { flexShrink: 1, color: C.pri, fontSize: 20, fontFamily: 'Georgia', fontStyle: 'italic' },
  privatePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  privateText: { color: C.pri, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  harmonyTile: { flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 16 },
  harmonyValue: { color: C.pri, fontSize: 17, fontWeight: '700', marginTop: -2 },
  resonanceRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10,
    backgroundColor: C.white, borderRadius: 18, padding: 16,
  },
  resonanceNum: { color: C.pri, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  resonanceMax: { color: C.muted, fontSize: 18, fontWeight: '600' },
  resonanceIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#EEF3F8' },
  rowDividerTop: { borderTopWidth: 1, borderTopColor: '#EEF3F8' },
  rowIcon: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.accentSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: C.pri, fontSize: 16, fontWeight: '600' },
  rowSub: { color: C.muted, fontSize: 13, marginTop: 2 },

  footer: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 12, letterSpacing: 0.5 },
});

export default function ProfileTab() {
  return (
    <NunitoScope>
      <ProfileTabScreen />
    </NunitoScope>
  );
}
