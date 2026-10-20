import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setStatusBarStyle } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { C, Tap, cardShadow, serif } from '../components/prema-ui';

const HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDd0ZmfZQCdWgNzbOCmxgFC1SiPdZLUfy4sGNgoefXf_JhcRDRuMLFEDsU1U-7KIJ2eFhzhf4ROSgXXzMhDWew6n8ujrL5NyqyiJKqm0XjjQ2YOvTVtmoeiM-uRaqb9IYBWeag9dB_cojfDsqazEizr3FuJkplZCvyBRz02HZci9AksURX0J4wMD_aSkOt-idQB0Dc4gCJDLWDY_c_FN1AH0MnPGYi-vDkrAVLy0CMHAJ05w26zOg8y';

// The member's active subscription (mock until billing is connected).
const CURRENT = {
  tier: 'Founding Member',
  level: 'Tier I',
  plan: 'quarterly' as const,
  renews: '14 Jan 2027',
  since: 'Sep 2026',
};

const BENEFITS = [
  { icon: 'filter_vintage', title: 'Up to 5 curated matches daily', body: 'Hand-picked introductions with zero endless swiping.' },
  { icon: 'psychology', title: 'Full compatibility deep-dives', body: 'All 48 psycho-social and cultural DNA dimensions, before you say hello.' },
  { icon: 'history', title: 'Revisit past introductions', body: 'Quietly reconsider anyone from the last 14 days — no FOMO.' },
  { icon: 'local_cafe', title: 'Sanctuary date perks', body: 'Complimentary coffee or dessert at Amethyst, The English Tearoom & Blue Tokai.' },
  { icon: 'tune', title: 'Advanced intentional filters', body: 'Filter by cultural rhythms, lifestyle cadence and non-negotiables.' },
];

const PLANS = [
  {
    id: 'quarterly', name: 'Quarterly', tagline: 'The recommended rhythm for meaningful conversations',
    price: '₹1,499', note: 'Billed ₹4,499 every 3 months', badge: 'Most intentional', save: 'Save 25%',
  },
  {
    id: 'monthly', name: 'Monthly', tagline: 'Explore at your own comfortable pace',
    price: '₹1,999', note: 'Billed monthly · cancel anytime', badge: null, save: null,
  },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

export default function PremaPlusMembership() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<PlanId>(CURRENT.plan);
  const selected = PLANS.find((p) => p.id === plan)!;
  const isCurrent = plan === CURRENT.plan;

  // Light status bar over the photo hero, restored to dark when leaving.
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
      `${selected.price}/month — ${selected.note}. The change starts on ${CURRENT.renews}, when your current period ends.`,
      [{ text: 'Not now', style: 'cancel' }, { text: 'Switch plan' }],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* ── Hero ── */}
        <ImageBackground source={{ uri: HERO }} resizeMode="cover" style={[s.hero, { paddingTop: insets.top + 8 }]}>
          <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1A2E44" stopOpacity="0.28" />
                <Stop offset="0.5" stopColor="#1A2E44" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#1A2E44" stopOpacity="0.72" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#veil)" />
          </Svg>

          <View style={s.heroTop}>
            <Tap onPress={() => router.back()} style={s.glassBtn} accessibilityLabel="Go back">
              <Icon name="arrow_back" size={22} color={C.white} />
            </Tap>
            <View style={s.glassPill}>
              <Icon name="auto_awesome" size={12} color={C.white} />
              <Text style={s.glassPillText}>PREMA Plus</Text>
            </View>
          </View>

          <View>
            <Text style={s.heroTitle}>Go deeper with PREMA.</Text>
            <Text style={s.heroBody}>
              Thoughtful tools for an intentional search — no artificial urgency, no paywalled compatibility.
            </Text>
          </View>
        </ImageBackground>

        <View style={{ paddingHorizontal: 20, marginTop: -26 }}>
          {/* ── Current plan ── */}
          <View style={s.currentCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={s.label}>Your current plan</Text>
              <View style={s.activePill}>
                <View style={s.activeDot} />
                <Text style={s.activeText}>Active</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 2 }}>
              <View style={s.tierIcon}>
                <Icon name="workspace_premium" size={24} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.currentTitle}>{CURRENT.tier}</Text>
                <Text style={s.currentSub}>
                  {CURRENT.level} · {PLANS.find((p) => p.id === CURRENT.plan)!.name} · member since {CURRENT.since}
                </Text>
              </View>
            </View>
            <View style={s.renewRow}>
              <Icon name="event_available" size={16} color={C.muted} />
              <Text style={s.renewText}>Renews on {CURRENT.renews}</Text>
            </View>
          </View>

          {/* ── Plans ── */}
          <Text style={s.sectionLabel}>Choose your cadence</Text>
          <View style={{ gap: 14 }}>
            {PLANS.map((p) => {
              const on = p.id === plan;
              const current: boolean = (p.id as string) === CURRENT.plan;
              return (
                <Tap
                  key={p.id}
                  onPress={() => setPlan(p.id)}
                  style={[s.plan, on ? s.planOn : null]}
                  pressedStyle={{ opacity: 0.92 }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                >
                  {current ? (
                    <View style={[s.ribbon, s.ribbonCurrent]}>
                      <Icon name="check" size={11} color={C.pri} />
                      <Text style={[s.ribbonText, { color: C.pri }]}>Current plan</Text>
                    </View>
                  ) : p.badge ? (
                    <View style={s.ribbon}>
                      <Text style={s.ribbonText}>{p.badge}</Text>
                    </View>
                  ) : null}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    <View style={[s.radio, on ? s.radioOn : null]}>
                      {on ? <View style={s.radioDot} /> : null}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={s.planName}>{p.name}</Text>
                        {p.save ? (
                          <View style={s.save}><Text style={s.saveText}>{p.save}</Text></View>
                        ) : null}
                      </View>
                      <Text style={s.planTagline}>{p.tagline}</Text>
                      <View style={s.planPriceRow}>
                        <Text style={s.price}>
                          {p.price}<Text style={s.unit}> / month</Text>
                        </Text>
                        <Text style={s.planNote}>{p.note}</Text>
                      </View>
                    </View>
                  </View>
                </Tap>
              );
            })}
          </View>

          {/* ── Benefits ── */}
          <Text style={s.sectionLabel}>Included in your membership</Text>
          <View style={s.card}>
            {BENEFITS.map((b, i) => (
              <View key={b.title} style={[s.benefit, i < BENEFITS.length - 1 ? s.benefitDivider : null]}>
                <View style={s.benefitIcon}>
                  <Icon name={b.icon} size={19} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.benefitTitle}>{b.title}</Text>
                  <Text style={s.benefitBody}>{b.body}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Ethics ── */}
          <View style={s.ethics}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="balance" size={18} color={C.accent} />
              <Text style={s.ethicsTitle}>The PREMA ethics guarantee</Text>
            </View>
            <Text style={s.ethicsBody}>
              We never sell compatibility rankings, promote profiles for money, or manufacture urgency. Membership gives you better tools — never algorithmic privilege.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {[['do_not_disturb_on', 'Zero pay-to-rank'], ['visibility_off', 'Zero hidden trackers'], ['lock', 'Private by design']].map(([icon, t]) => (
                <View key={t} style={s.ethicsChip}>
                  <Icon name={icon} size={13} color={C.body} />
                  <Text style={s.ethicsChipText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Tap
          onPress={onCta}
          style={[s.cta, isCurrent ? s.ctaQuiet : null]}
          pressedStyle={{ opacity: 0.88 }}
          accessibilityRole="button"
        >
          <Text style={[s.ctaText, isCurrent ? { color: C.pri } : null]}>
            {isCurrent ? 'Manage membership' : `Switch to ${selected.name.toLowerCase()} · ${selected.price}/mo`}
          </Text>
        </Tap>
        <View style={s.trust}>
          <Icon name="lock" size={12} color={C.muted} />
          <Text style={s.trustText}>Secure checkout · Razorpay & Apple Pay · Cancel in one tap</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { minHeight: 340, paddingHorizontal: 20, paddingBottom: 48, justifyContent: 'space-between' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glassBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  glassPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  glassPillText: { color: C.white, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { color: C.white, fontSize: 32, lineHeight: 38, ...serif },
  heroBody: { color: 'rgba(255,255,255,0.85)', fontSize: 14.5, lineHeight: 21, marginTop: 8, maxWidth: 320 },

  label: { color: C.muted, fontSize: 11.5, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  sectionLabel: { color: C.pri, fontSize: 20, marginTop: 28, marginBottom: 14, marginLeft: 4, ...serif },

  currentCard: {
    backgroundColor: C.white, borderRadius: 24, padding: 18,
    shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 22, elevation: 6,
  },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12,
    backgroundColor: '#E8F7EF', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3FB37B' },
  activeText: { color: '#2E8A5D', fontSize: 11, fontWeight: '700' },
  tierIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  currentTitle: { color: C.pri, fontSize: 21, ...serif },
  currentSub: { color: C.muted, fontSize: 13, marginTop: 2 },
  renewRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: C.line,
  },
  renewText: { color: C.body, fontSize: 13, fontWeight: '500' },

  plan: { borderRadius: 22, padding: 18, backgroundColor: C.white, borderWidth: 1, borderColor: '#E6EDF5', ...cardShadow },
  planOn: {
    borderColor: C.pri, borderWidth: 1.5, backgroundColor: '#FBFDFF',
    shadowColor: C.pri, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 4,
  },
  ribbon: {
    position: 'absolute', top: -10, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.pinkSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 11,
    borderWidth: 1, borderColor: '#FBD3DD',
  },
  ribbonCurrent: { backgroundColor: C.accentSoft, borderColor: '#D3E4F5' },
  ribbonText: { color: '#D9577A', fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#C3D0DE',
    alignItems: 'center', justifyContent: 'center', marginTop: 3,
  },
  radioOn: { borderColor: C.pri },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.pri },
  planName: { color: C.pri, fontSize: 20, ...serif },
  save: { backgroundColor: '#EAF3FC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9 },
  saveText: { color: '#3B7BBF', fontSize: 11, fontWeight: '700' },
  planTagline: { color: C.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  planPriceRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line },
  price: { color: C.pri, fontSize: 23, fontWeight: '700', letterSpacing: -0.4 },
  unit: { color: C.muted, fontSize: 13, fontWeight: '500' },
  planNote: { color: C.muted, fontSize: 12, marginTop: 2 },

  card: { backgroundColor: C.white, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 4, ...cardShadow },
  benefit: { flexDirection: 'row', gap: 14, paddingVertical: 15, alignItems: 'flex-start' },
  benefitDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  benefitIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { color: C.pri, fontSize: 15, fontWeight: '600' },
  benefitBody: { color: C.muted, fontSize: 13.5, lineHeight: 19, marginTop: 3 },

  ethics: { marginTop: 16, backgroundColor: 'rgba(231,240,249,0.7)', borderRadius: 24, padding: 18 },
  ethicsTitle: { color: C.pri, fontSize: 17, ...serif },
  ethicsBody: { color: C.body, fontSize: 13.5, lineHeight: 20 },
  ethicsChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14,
  },
  ethicsChipText: { color: C.body, fontSize: 12, fontWeight: '600' },

  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5',
  },
  cta: {
    height: 54, borderRadius: 27, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 3,
  },
  ctaQuiet: { backgroundColor: C.white, borderWidth: 1.5, borderColor: '#D6E2EE', shadowOpacity: 0 },
  ctaText: { color: C.white, fontSize: 16, fontWeight: '600', letterSpacing: 0.2 },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 },
  trustText: { color: C.muted, fontSize: 11.5 },
});
