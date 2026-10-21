import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Text, { NunitoScope } from '../../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { addMatch } from '../../src/store/chats';
import { useSafety } from '../../src/store/safety';
import { useScoreOf, scoreOf } from '../../src/features/compatibility';
import { AuraFrame, AuraRing } from '../../components/Aura';
import { C, Tap, cardShadow, serif } from '../../components/prema-ui';
import StatusFade from '../../components/StatusFade';

type Like = {
  id: string; name: string; age: number; city: string; match: number; photo: string;
  /** What they responded to on your profile, and their note. */
  on: string; note: string;
};

const LIKED_YOU: Like[] = [
  {
    id: 'tara', name: 'Tara', age: 26, city: 'Chennai', match: 85,
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600',
    on: 'Your values', note: 'Family closeness — yes, always.',
  },
];

const YOU_LIKED: (Like & { status: string })[] = [
  {
    id: 'nila', name: 'Nila', age: 26, city: 'Chennai', match: 92, status: 'Viewed your note',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    on: 'Her prompt', note: 'You wrote about monsoon reading corners.',
  },
];

function LikesTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scoreFor = useScoreOf();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<'in' | 'out'>('in');
  const [incomingAll, setIncoming] = useState(LIKED_YOU);
  const { blocked } = useSafety();
  const incoming = incomingAll.filter((l) => !blocked.includes(l.id));
  const cardW = (width - 40 - 14) / 2;

  const pass = (id: string) => setIncoming((l) => l.filter((x) => x.id !== id));
  const connect = (id: string) => {
    const l = incoming.find((x) => x.id === id);
    setIncoming((all) => all.filter((x) => x.id !== id));
    if (!l) return;
    addMatch({ id: l.id, name: l.name, age: l.age, city: l.city, photo: l.photo, match: scoreOf(l.id, l.match) });
    router.push({ pathname: '/ItSAMatch', params: { id: l.id, name: l.name, photo: l.photo } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 150 }}
      >
        <View style={{ paddingHorizontal: 4, marginBottom: 16 }}>
          <Logo width={74} height={31} tintColor="#2C496A" style={{ marginBottom: 2 }} />
          <Text style={s.title}>Likes</Text>
        </View>

        {/* Segmented control */}
        <View style={s.segment}>
          {([['in', `Liked you · ${incoming.length}`], ['out', `You liked · ${YOU_LIKED.length}`]] as const).map(([k, label]) => {
            const on = tab === k;
            return (
              <Tap key={k} onPress={() => setTab(k)} style={[s.segItem, on ? s.segOn : null]}
                accessibilityRole="tab" accessibilityState={{ selected: on }}>
                <Text style={[s.segText, on ? { color: C.pri } : null]}>{label}</Text>
              </Tap>
            );
          })}
        </View>

        {tab === 'in' ? (
          <>
            <Text style={s.lede}>
              Each like arrives with a note on something that resonated. Take your time.
            </Text>

            {incoming.length === 0 ? (
              <Empty
                icon="favorite_border"
                title="You’re all caught up"
                body="New likes will appear here, each with a thoughtful note."
              />
            ) : (
              <View style={s.grid}>
                {incoming.map((l) => (
                  <View key={l.id} style={[s.card, { width: cardW }]}>
                    <Tap onPress={() => router.push({ pathname: '/MatchDetail', params: { id: l.id } })} pressedStyle={{ opacity: 0.92 }}>
                      <View style={{ height: cardW * 1.2 }}>
                        <Image source={{ uri: l.photo }} style={StyleSheet.absoluteFill} />
                        <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
                          <Defs>
                            <LinearGradient id={`g-${l.id}`} x1="0" y1="0" x2="0" y2="1">
                              <Stop offset="0.45" stopColor="#1A2E44" stopOpacity="0" />
                              <Stop offset="1" stopColor="#1A2E44" stopOpacity="0.75" />
                            </LinearGradient>
                          </Defs>
                          <Rect width="100%" height="100%" fill={`url(#g-${l.id})`} />
                        </Svg>
                        <View style={s.nameWrap}>
                          <Text style={s.name}>{l.name}, {l.age}</Text>
                          <Text style={s.city}>{l.city}</Text>
                        </View>
                      </View>
                    </Tap>
                    <View style={{ padding: 12 }}>
                      <Text style={s.on}>Liked {l.on.toLowerCase()}</Text>
                      <Text style={s.note} numberOfLines={2}>“{l.note}”</Text>
                      <View style={s.actions}>
                        <Tap onPress={() => pass(l.id)} style={s.passBtn} accessibilityLabel={`Pass on ${l.name}`}>
                          <Icon name="close" size={18} color={C.muted} />
                        </Tap>
                        <Tap onPress={() => connect(l.id)} style={s.connectBtn} pressedStyle={{ opacity: 0.85 }}
                          accessibilityLabel={`Connect with ${l.name}`}>
                          <Icon name="favorite" size={16} color={C.white} />
                          <Text style={s.connectText}>Connect</Text>
                        </Tap>
                      </View>
                    </View>
                    <AuraFrame score={scoreFor(l.id, l.match)} radius={22} width={4} />
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={s.lede}>People you’ve reached out to. We’ll let you know when they respond.</Text>
            <View style={s.listCard}>
              {YOU_LIKED.map((l, i) => (
                <Tap
                  key={l.id}
                  onPress={() => router.push({ pathname: '/MatchDetail', params: { id: l.id } })}
                  style={[s.row, i < YOU_LIKED.length - 1 ? s.rowDivider : null]}
                  pressedStyle={{ backgroundColor: 'rgba(116,180,242,0.06)' }}
                >
                  <AuraRing score={scoreFor(l.id, l.match)} size={64} stroke={2.5} gap={2.5}>
                    <Image source={{ uri: l.photo }} style={{ width: '100%', height: '100%' }} />
                  </AuraRing>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowName}>{l.name}, {l.age}</Text>
                    <Text style={s.rowNote} numberOfLines={1}>{l.note}</Text>
                    <View style={s.statusPill}>
                      <Icon name={l.status.startsWith('Viewed') ? 'visibility' : 'schedule'} size={12} color={C.accent} />
                      <Text style={s.statusText}>{l.status}</Text>
                    </View>
                  </View>
                  <Icon name="chevron_right" size={22} color={C.muted} />
                </Tap>
              ))}
            </View>
          </>
        )}

        <View style={s.footer}>
          <Icon name="spa" size={15} color={C.muted} />
          <Text style={s.footerText}>No paywalls on who likes you — ever.</Text>
        </View>
      </ScrollView>

      <StatusFade />
    </View>
  );
}

function Empty({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}><Icon name={icon} size={26} color={C.pink} /></View>
      <Text style={s.emptyTitle}>{title}</Text>
      <Text style={s.emptyBody}>{body}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { color: C.pri, fontSize: 34, lineHeight: 42, ...serif },

  segment: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, padding: 4, borderWidth: 1, borderColor: '#E6EDF5' },
  segItem: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.white, ...cardShadow },
  segText: { color: C.muted, fontSize: 14, fontWeight: '600' },
  lede: { color: C.body, fontSize: 14, lineHeight: 21, marginTop: 16, marginBottom: 16, paddingHorizontal: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: { backgroundColor: C.white, borderRadius: 22, overflow: 'hidden', ...cardShadow },
  matchPill: {
    position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  matchText: { color: C.pri, fontSize: 11, fontWeight: '800' },
  nameWrap: { position: 'absolute', left: 12, right: 12, bottom: 10 },
  name: { color: C.white, fontSize: 18, ...serif },
  city: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },
  on: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  note: { color: C.pri, fontSize: 13.5, lineHeight: 19, marginTop: 4, minHeight: 38, ...serif },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  passBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#F2F6FB',
    alignItems: 'center', justifyContent: 'center',
  },
  connectBtn: {
    flex: 1, height: 38, borderRadius: 19, backgroundColor: C.pink,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  connectText: { color: C.white, fontSize: 13, fontWeight: '700' },

  listCard: { backgroundColor: C.white, borderRadius: 24, paddingVertical: 4, ...cardShadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  rowAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.accentSoft },
  rowName: { color: C.pri, fontSize: 17, fontWeight: '700' },
  rowNote: { color: C.muted, fontSize: 13.5, marginTop: 2 },
  statusPill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
    backgroundColor: C.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  statusText: { color: C.body, fontSize: 11, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: C.pri, fontSize: 20, marginTop: 14, ...serif },
  emptyBody: { color: C.muted, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 6 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 22 },
  footerText: { color: C.muted, fontSize: 12 },
});

export default function LikesTab() {
  return (
    <NunitoScope>
      <LikesTabScreen />
    </NunitoScope>
  );
}
