import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setStatusBarStyle } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Tap, cardShadow } from '../components/prema-ui';

// The member's active subscription (mock until billing is connected).
const CURRENT = {
  tier: 'Founding Member',
  plan: 'quarterly' as const,
  renews: '14 Jan 2027',
};

const BENEFITS = [
  { icon: 'favorite', title: '5 curated matches a day' },
  { icon: 'psychology', title: 'Full compatibility deep-dives' },
  { icon: 'history', title: 'Revisit the last 14 days' },
  { icon: 'local_cafe', title: 'Perks at sanctuary cafés' },
  { icon: 'tune', title: 'Advanced filters' },
];

const PLANS = [
  { id: 'quarterly', name: 'Quarterly', price: '₹1,499', note: '₹4,499 every 3 months', save: 'Save 25%' },
  { id: 'monthly', name: 'Monthly', price: '₹1,999', note: 'Cancel anytime', save: null },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

export default function PremaPlusMembership() {
  return (
    <NunitoScope>
      <MembershipInner />
    </NunitoScope>
  );
}

function MembershipInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<PlanId>(CURRENT.plan);
  const selected = PLANS.find((p) => p.id === plan)!;
  const isCurrent = plan === CURRENT.plan;

  // Light status bar over the pink hero, restored to dark when leaving.
  useFocusEffect(useCallback(() => {
    setStatusBarStyle('light');
    return () => setStatusBarStyle('dark');
  }, []));

  const onCta = () => {
    if (isCurrent) {
      Alert.alert('Manage membership', `You’re on ${CURRENT.tier} · ${selected.name}. Renews ${CURRENT.renews}.`, [
        { text: 'Done', style: 'cancel' },
        { text: 'Cancel renewal', style: 'destructive' },
      ]);
      return;
    }
    Alert.alert(
      `Switch to ${selected.name}?`,
      `${selected.price}/month. Starts on ${CURRENT.renews}, when your current period ends.`,
      [{ text: 'Not now', style: 'cancel' }, { text: 'Switch plan' }],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}>
        {/* ── Pink hero with the Prema wordmark ── */}
        <View style={[s.hero, { paddingTop: insets.top + 8 }]}>
          <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="plusHero" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FF97AE" />
                <Stop offset="0.55" stopColor="#FF6B8B" />
                <Stop offset="1" stopColor="#E2456B" />
              </LinearGradient>
              <RadialGradient id="plusGlow" cx="0.2" cy="0.15" r="0.6">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#plusHero)" />
            <Rect width="100%" height="100%" fill="url(#plusGlow)" />
          </Svg>

          <View style={s.heroTop}>
            <Tap onPress={() => router.back()} style={s.glassBtn} accessibilityLabel="Go back">
              <Icon name="arrow_back" size={22} color={C.white} />
            </Tap>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Logo width={170} height={70} tintColor="#FFFFFF" />
            <View style={s.plusPill}>
              <Icon name="auto_awesome" size={13} color={C.pink} />
              <Text style={s.plusPillText}>Plus</Text>
            </View>
            <Text style={s.heroBody}>Better tools for an intentional search.</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -30 }}>
          {/* ── Current plan ── */}
          <View style={s.currentCard}>
            <View style={s.tierIcon}>
              <Icon name="workspace_premium" size={24} color={C.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.currentTitle}>{CURRENT.tier}</Text>
              <Text style={s.currentSub}>Renews {CURRENT.renews}</Text>
            </View>
          </View>

          {/* ── Plans ── */}
          <Text style={s.sectionTitle}>Choose your plan</Text>
          <View style={{ gap: 12 }}>
            {PLANS.map((p) => {
              const on = p.id === plan;
              const current = (p.id as string) === CURRENT.plan;
              return (
                <Tap
                  key={p.id}
                  onPress={() => setPlan(p.id)}
                  style={[s.plan, on ? s.planOn : null]}
                  pressedStyle={{ opacity: 0.92 }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                >
                  <View style={[s.radio, on ? s.radioOn : null]}>
                    {on ? <View style={s.radioDot} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={s.planName}>{p.name}</Text>
                      {p.save ? <View style={s.save}><Text style={s.saveText}>{p.save}</Text></View> : null}
                    </View>
                    <Text style={s.planNote}>{current ? 'Your current plan' : p.note}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.price}>{p.price}</Text>
                    <Text style={s.unit}>/ month</Text>
                  </View>
                </Tap>
              );
            })}
          </View>

          {/* ── Benefits ── */}
          <Text style={s.sectionTitle}>What you get</Text>
          <View style={s.card}>
            {BENEFITS.map((b, i) => (
              <View key={b.title} style={[s.benefit, i < BENEFITS.length - 1 ? s.benefitDivider : null]}>
                <View style={s.benefitIcon}>
                  <Icon name={b.icon} size={18} color={C.pink} />
                </View>
                <Text style={s.benefitTitle}>{b.title}</Text>
              </View>
            ))}
          </View>

          {/* ── Ethics ── */}
          <View style={s.ethics}>
            <Icon name="verified_user" size={20} color={C.pink} />
            <Text style={s.ethicsBody}>No pay-to-rank. No hidden trackers. Ever.</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Floating CTA: no solid bar, content fades out underneath ── */}
      <View pointerEvents="box-none" style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="footFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={C.bg} stopOpacity="0" />
              <Stop offset="0.45" stopColor={C.bg} stopOpacity="0.9" />
              <Stop offset="1" stopColor={C.bg} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#footFade)" />
        </Svg>
        <Tap
          onPress={onCta}
          style={[s.cta, isCurrent ? s.ctaQuiet : null]}
          pressedStyle={{ opacity: 0.88 }}
          accessibilityRole="button"
        >
          <Text style={[s.ctaText, isCurrent ? { color: C.pri } : null]}>
            {isCurrent ? 'Manage membership' : `Switch to ${selected.name.toLowerCase()}`}
          </Text>
        </Tap>
        <View style={s.trust}>
          <Icon name="lock" size={12} color={C.muted} />
          <Text style={s.trustText}>Secure checkout · Cancel anytime</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { minHeight: 300, paddingHorizontal: 20, paddingBottom: 54, justifyContent: 'space-between', overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  glassBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  plusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4,
    backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14,
  },
  plusPillText: { color: C.pink, fontSize: 13, fontWeight: '900', letterSpacing: 0.4 },
  heroBody: { color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: '600', marginTop: 12, textAlign: 'center' },

  sectionTitle: { color: C.pri, fontSize: 19, fontWeight: '900', marginTop: 28, marginBottom: 12, marginLeft: 4 },

  currentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.white, borderRadius: 24, padding: 16,
    shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 22, elevation: 6,
  },
  tierIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  currentTitle: { color: C.pri, fontSize: 18, fontWeight: '900' },
  currentSub: { color: C.muted, fontSize: 13.5, fontWeight: '600', marginTop: 1 },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F7EF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3FB37B' },
  activeText: { color: '#2E8A5D', fontSize: 12, fontWeight: '800' },

  plan: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 22, padding: 18, backgroundColor: C.white, borderWidth: 2, borderColor: 'transparent', ...cardShadow,
  },
  planOn: {
    borderColor: C.pink, backgroundColor: '#FFF4F7',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 4,
  },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C9D5E3',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn: { borderColor: C.pink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.pink },
  planName: { color: C.pri, fontSize: 17, fontWeight: '900' },
  save: { backgroundColor: C.pink, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9 },
  saveText: { color: C.white, fontSize: 11, fontWeight: '800' },
  planNote: { color: C.muted, fontSize: 13, fontWeight: '600', marginTop: 2 },
  price: { color: C.pri, fontSize: 21, fontWeight: '900', letterSpacing: -0.3 },
  unit: { color: C.muted, fontSize: 12, fontWeight: '600' },

  card: { backgroundColor: C.white, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 4, ...cardShadow },
  benefit: { flexDirection: 'row', gap: 14, paddingVertical: 13, alignItems: 'center' },
  benefitDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  benefitIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { color: C.pri, fontSize: 15, fontWeight: '700', flex: 1 },

  ethics: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14,
    backgroundColor: C.pinkSoft, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14,
  },
  ethicsBody: { color: C.pri, fontSize: 14, fontWeight: '700', flex: 1 },

  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 40 },
  cta: {
    height: 56, borderRadius: 28, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 3,
  },
  ctaQuiet: { backgroundColor: C.white, borderWidth: 2, borderColor: '#FBD3DD', shadowColor: '#2C496A', shadowOpacity: 0.1 },
  ctaText: { color: C.white, fontSize: 16.5, fontWeight: '900' },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 },
  trustText: { color: C.muted, fontSize: 12, fontWeight: '600' },
});
