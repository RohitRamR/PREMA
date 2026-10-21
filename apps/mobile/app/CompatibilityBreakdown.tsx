// "Why you match": the compatibility breakdown between you and one person.
// ?id=<person id> picks who; without it, it shows your strongest match (Ananya).
import React from 'react';
import { View, ScrollView, Image, StyleSheet, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { useProfile } from '../src/store/profile';
import { person } from '../src/store/people';
import { useConversations } from '../src/store/chats';

const ANANYA = {
  id: 'ananya', name: 'Ananya', match: 96,
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  interests: ['Filter coffee', 'Architecture', 'Slow living', 'Carnatic music', 'Heritage walks', 'Sketching'],
};

// Sample birth-chart data until real charts are computed server-side.
const ME_CHART = { sign: 'Vrishabha', english: 'Taurus', nakshatra: 'Rohini', element: 'Earth', lifePath: 6 };
const CHARTS: Record<string, { sign: string; english: string; nakshatra: string; element: string; lifePath: number }> = {
  ananya: { sign: 'Kanya', english: 'Virgo', nakshatra: 'Hasta', element: 'Earth', lifePath: 9 },
  riya: { sign: 'Karka', english: 'Cancer', nakshatra: 'Pushya', element: 'Water', lifePath: 2 },
  priya: { sign: 'Makara', english: 'Capricorn', nakshatra: 'Shravana', element: 'Earth', lifePath: 4 },
  neha: { sign: 'Meena', english: 'Pisces', nakshatra: 'Revati', element: 'Water', lifePath: 3 },
  meera: { sign: 'Tula', english: 'Libra', nakshatra: 'Swati', element: 'Air', lifePath: 6 },
  kavya: { sign: 'Meena', english: 'Pisces', nakshatra: 'Uttara Bhadrapada', element: 'Water', lifePath: 7 },
};
// The eight kootas of Ashtakoot milan and their maximum points (total 36).
// Each with a plain-English meaning so anyone can read it.
const KOOTAS: [string, number, string, string][] = [
  ['Varna', 1, 'Work & values', 'How your outlooks on work, duty and growth line up.'],
  ['Vashya', 2, 'Mutual pull', 'How naturally you influence and are drawn to each other.'],
  ['Tara', 3, 'Health & luck', 'Wellbeing and good fortune you bring each other.'],
  ['Yoni', 4, 'Intimacy', 'Physical and emotional closeness.'],
  ['Graha Maitri', 5, 'Friendship', 'Mental compatibility and how well you get along.'],
  ['Gana', 6, 'Temperament', 'Whether your natures are calm, lively or intense together.'],
  ['Bhakoot', 7, 'Love & family', 'Emotional bond, family life and shared prosperity.'],
  ['Nadi', 8, 'Health & children', 'Genetic and health harmony; the most important koota.'],
];

const R = 54, STROKE = 10, CIRC = 2 * Math.PI * R, BOX = 2 * R + STROKE;

export default function CompatibilityBreakdown() {
  return (
    <NunitoScope>
      <BreakdownInner />
    </NunitoScope>
  );
}

function BreakdownInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const me = useProfile();
  const convos = useConversations();
  const convo = convos.find((c) => c.id === id);
  const p = person(id);
  const them = p
    ? { id: p.id, name: p.name, match: p.match, photo: p.photos[0], interests: p.interests }
    : convo
      ? { id: convo.id, name: convo.name, match: convo.match, photo: convo.photo, interests: [] as string[] }
      : ANANYA;
  const canChat = convos.some((c) => c.id === them.id);

  const score = them.match;
  const chart = CHARTS[them.id] ?? CHARTS.ananya;
  // Guna milan points out of 36, scaled from the overall score (sample until charts are live).
  const guna = Math.max(18, Math.min(35, Math.round((score / 100) * 34)));
  // Spread the missing points across kootas (bigger ones first) so the parts always add up to the total.
  const kootas = (() => {
    const got = KOOTAS.map(([, max]) => max);
    let missing = 36 - guna;
    for (let i = KOOTAS.length - 2; missing > 0; i = (i - 1 + KOOTAS.length) % KOOTAS.length) {
      if (got[i] > 0) { got[i] -= 1; missing -= 1; }
    }
    return KOOTAS.map(([k, max, plain, why], i) => ({ k, max, plain, why, got: got[i] }));
  })();
  const elements = ME_CHART.element === chart.element
    ? `Both ${chart.element}: steady and grounding together.`
    : `${ME_CHART.element} and ${chart.element}: ${ME_CHART.element === 'Earth' && chart.element === 'Water' ? 'nurturing, like soil and rain.' : 'complementary energies.'}`;
  const lifePathNote = Math.abs(ME_CHART.lifePath - chart.lifePath) % 3 === 0 ? 'Harmonious numbers' : 'Balancing numbers';
  const parts = [
    { icon: 'favorite', label: 'Core values', value: Math.min(100, score + 2), note: 'You both put emotional honesty and family first.' },
    { icon: 'flag', label: 'Relationship intent', value: Math.min(100, score + 4), note: 'Both looking for something lasting, at a similar pace.' },
    { icon: 'wb_sunny', label: 'Lifestyle rhythm', value: Math.max(60, score - 7), note: 'Early mornings and quiet weekends line up well.' },
    { icon: 'chat', label: 'Communication', value: Math.max(60, score - 4), note: 'Thoughtful, unhurried replies on both sides.' },
    { icon: 'home', label: 'Family outlook', value: Math.max(60, score - 10), note: 'Close to family, with room to build your own.' },
  ];
  const shared = them.interests.filter((t) => me.interests.some((m) => m.toLowerCase() === t.toLowerCase()));
  const different = them.interests.filter((t) => !shared.includes(t)).slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader
        eyebrow="Compatibility"
        title="Why you match"
        right={
          <Tap onPress={() => Share.share({ message: `Prema says ${them.name} and I are ${score}% aligned.` })} style={s.iconBtn} accessibilityLabel="Share">
            <Icon name="share" size={20} color={C.pri} />
          </Tap>
        }
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        {/* Score hero */}
        <View style={s.hero}>
          <View style={s.faces}>
            <Image source={{ uri: me.photos[0] }} style={s.face} />
            <View style={{ width: BOX, height: BOX, marginHorizontal: -14, zIndex: 2 }}>
              <Svg width={BOX} height={BOX}>
                <Defs>
                  <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FF97AE" />
                    <Stop offset="1" stopColor="#E2456B" />
                  </LinearGradient>
                </Defs>
                <Circle cx={BOX / 2} cy={BOX / 2} r={R} fill={C.white} stroke="#FFE0E8" strokeWidth={STROKE} />
                <Circle
                  cx={BOX / 2} cy={BOX / 2} r={R} fill="none" stroke="url(#ring)" strokeWidth={STROKE}
                  strokeLinecap="round" strokeDasharray={`${(CIRC * score) / 100} ${CIRC}`}
                  transform={`rotate(-90 ${BOX / 2} ${BOX / 2})`}
                />
              </Svg>
              <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={s.score}>{score}%</Text>
                <Text style={s.scoreLabel}>aligned</Text>
              </View>
            </View>
            {them.photo ? <Image source={{ uri: them.photo }} style={s.face} /> : null}
          </View>
          <Text style={s.heroTitle}>You and {them.name}</Text>
          <Text style={s.heroSub}>A strong match on what matters most.</Text>
        </View>

        {/* Stars & numbers first */}
        <Text style={s.section}>Stars & numbers</Text>
        <View style={s.astro}>
          <View style={s.signRow}>
            <SignTile who="Your moon sign" sign={ME_CHART.sign} english={ME_CHART.english} nakshatra={ME_CHART.nakshatra} />
            <View style={s.signJoin}><Icon name="favorite" size={16} color={C.white} /></View>
            <SignTile who={`${them.name}’s`} sign={chart.sign} english={chart.english} nakshatra={chart.nakshatra} />
          </View>

          <View style={s.gunaHead}>
            <View style={{ flex: 1 }}>
              <Text style={s.gunaLabel}>Kundli match <Text style={s.gunaSmall}>(guna milan)</Text></Text>
              <Text style={s.gunaNote}>{guna >= 28 ? 'Excellent' : guna >= 18 ? 'Good' : 'Needs care'} · 18 or more out of 36 is a good match</Text>
            </View>
            <Text style={s.gunaScore}>{guna}<Text style={s.gunaOf}>/36</Text></Text>
          </View>
          <View style={s.track}><View style={[s.fill, { width: `${(guna / 36) * 100}%` }]} /></View>
          <Text style={s.explain}>Vedic astrology compares your moon signs across 8 areas of life. Tap any one to learn more.</Text>

          <View style={s.kootaGrid}>
            {kootas.map((x) => {
              const full = x.got === x.max;
              return (
                <Tap key={x.k} onPress={() => Alert.alert(`${x.plain} (${x.k})`, `${x.why}\n\nYou scored ${x.got} of ${x.max}.`)}
                  style={s.koota} accessibilityRole="button" accessibilityLabel={`${x.plain}, ${x.got} of ${x.max}`}>
                  <Text style={s.kootaPlain} numberOfLines={1}>{x.plain}</Text>
                  <Text style={s.kootaName} numberOfLines={1}>{x.k}</Text>
                  <View style={s.kootaBar}><View style={[s.kootaFill, { width: `${(x.got / x.max) * 100}%`, backgroundColor: full ? C.pink : '#FFB3C4' }]} /></View>
                  <Text style={[s.kootaVal, full ? { color: C.pink } : null]}>{x.got}/{x.max}</Text>
                </Tap>
              );
            })}
          </View>

          <View style={s.astroRow}>
            <View style={s.astroIcon}><Icon name="eco" size={17} color={C.pink} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.astroTitle}>Elements · {ME_CHART.element} & {chart.element}</Text>
              <Text style={s.astroBody}>{elements}</Text>
            </View>
          </View>
          <View style={[s.astroRow, { borderBottomWidth: 0 }]}>
            <View style={s.astroIcon}><Text style={s.num}>{ME_CHART.lifePath}·{chart.lifePath}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.astroTitle}>Numerology · {lifePathNote.toLowerCase()}</Text>
              <Text style={s.astroBody}>Your life path numbers ({ME_CHART.lifePath} and {chart.lifePath}, from your birth dates) suggest one brings care, the other brings depth.</Text>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <Text style={s.section}>Everyday compatibility</Text>
        <View style={s.card}>
          {parts.map((x, i) => (
            <View key={x.label} style={[s.part, i < parts.length - 1 ? s.divider : null]}>
              <View style={s.partHead}>
                <View style={s.partIcon}><Icon name={x.icon} size={17} color={C.pink} /></View>
                <Text style={s.partLabel}>{x.label}</Text>
                <Text style={s.partValue}>{x.value}%</Text>
              </View>
              <View style={s.track}><View style={[s.fill, { width: `${x.value}%` }]} /></View>
              <Text style={s.partNote}>{x.note}</Text>
            </View>
          ))}
        </View>

        {/* Shared and different */}
        {shared.length ? (
          <>
            <Text style={s.section}>You both love</Text>
            <View style={s.wrap}>
              {shared.map((t) => <View key={t} style={s.chipOn}><Text style={s.chipOnText}>{t}</Text></View>)}
            </View>
          </>
        ) : null}
        {different.length ? (
          <>
            <Text style={s.section}>Worth asking {them.name} about</Text>
            <View style={s.wrap}>
              {different.map((t) => <View key={t} style={s.chip}><Text style={s.chipText}>{t}</Text></View>)}
            </View>
          </>
        ) : null}


        {canChat ? (
          <Tap onPress={() => router.push({ pathname: '/Chat', params: { id: them.id } })} style={s.cta} pressedStyle={{ opacity: 0.9 }}>
            <Icon name="chat_bubble" size={18} color={C.white} />
            <Text style={s.ctaText}>Message {them.name}</Text>
          </Tap>
        ) : null}
      </ScrollView>
    </View>
  );
}

function SignTile({ who, sign, english, nakshatra }: { who: string; sign: string; english: string; nakshatra: string }) {
  return (
    <View style={s.signTile}>
      <Text style={s.signWho}>{who}</Text>
      <Text style={s.signName}>{sign}</Text>
      <Text style={s.signSub}>{english} · {nakshatra}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  astro: { backgroundColor: C.white, borderRadius: 24, padding: 18, ...cardShadow },
  signRow: { flexDirection: 'row', alignItems: 'center' },
  signTile: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFF5F8' },
  signWho: { color: C.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  signName: { color: C.pri, fontSize: 19, fontWeight: '900', marginTop: 4 },
  signSub: { color: C.muted, fontSize: 12.5, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  signJoin: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center', marginHorizontal: -10, zIndex: 2, borderWidth: 3, borderColor: C.white },
  gunaHead: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 18 },
  gunaLabel: { color: C.pri, fontSize: 15.5, fontWeight: '900' },
  gunaSmall: { color: C.muted, fontSize: 13, fontWeight: '700' },
  explain: { color: C.body, fontSize: 13.5, lineHeight: 19, marginTop: 12 },
  kootaPlain: { color: C.pri, fontSize: 13, fontWeight: '900' },
  kootaBar: { alignSelf: 'stretch', height: 5, borderRadius: 3, backgroundColor: '#EEF2F7', overflow: 'hidden', marginTop: 8 },
  kootaFill: { height: '100%', borderRadius: 3 },
  gunaNote: { color: C.muted, fontSize: 12.5, fontWeight: '600', marginTop: 2 },
  gunaScore: { color: C.pink, fontSize: 28, fontWeight: '900' },
  gunaOf: { color: C.muted, fontSize: 15, fontWeight: '800' },
  kootaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  koota: { width: '47%', flexGrow: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#F6F9FC' },
  kootaName: { color: C.muted, fontSize: 11.5, fontWeight: '700', marginTop: 1 },
  kootaVal: { position: 'absolute', right: 12, top: 10, color: C.pri, fontSize: 14, fontWeight: '900' },
  astroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  astroIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  num: { color: C.pink, fontSize: 12.5, fontWeight: '900' },
  astroTitle: { color: C.pri, fontSize: 15, fontWeight: '800' },
  astroBody: { color: C.muted, fontSize: 13.5, marginTop: 2, lineHeight: 19 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...cardShadow },
  hero: { alignItems: 'center', backgroundColor: C.white, borderRadius: 28, paddingVertical: 24, paddingHorizontal: 16, marginTop: 4, ...cardShadow },
  faces: { flexDirection: 'row', alignItems: 'center' },
  face: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: C.white, backgroundColor: C.accentSoft },
  score: { color: C.pri, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  scoreLabel: { color: C.muted, fontSize: 12, fontWeight: '800', marginTop: -2 },
  heroTitle: { color: C.pri, fontSize: 22, fontWeight: '900', marginTop: 16 },
  heroSub: { color: C.muted, fontSize: 14.5, fontWeight: '600', marginTop: 2 },
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 24, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: C.white, borderRadius: 24, paddingHorizontal: 18, ...cardShadow },
  part: { paddingVertical: 15 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  partHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  partIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  partLabel: { flex: 1, color: C.pri, fontSize: 15.5, fontWeight: '800' },
  partValue: { color: C.pri, fontSize: 15, fontWeight: '900' },
  track: { height: 8, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden', marginTop: 10 },
  fill: { height: '100%', borderRadius: 4, backgroundColor: C.pink },
  partNote: { color: C.muted, fontSize: 13.5, lineHeight: 19, marginTop: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipOn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: C.pink },
  chipOnText: { color: C.white, fontSize: 14, fontWeight: '800' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: C.white, borderWidth: 1, borderColor: '#E6EDF5' },
  chipText: { color: C.pri, fontSize: 14, fontWeight: '700' },
  cta: {
    marginTop: 24, height: 56, borderRadius: 28, backgroundColor: C.pink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14,
  },
  ctaText: { color: C.white, fontSize: 16.5, fontWeight: '900' },
});
