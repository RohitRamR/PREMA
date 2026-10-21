import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import Text, { NunitoScope } from '../../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { C, Tap, cardShadow } from '../../components/prema-ui';
import { useConversations } from '../../src/store/chats';
import { useProfile } from '../../src/store/profile';
import {
  catalogue, describe, isUpcoming, rupees, useDateState, timeLabel, duration,
} from '../../src/features/date/store';
import StatusFade from '../../components/StatusFade';

// Soft pastel rings around each category photo.
const RINGS = ['#FFB3C4', '#A9D2F5', '#F8D58A', '#A8DDBA', '#CDBEF5', '#FFC2A3', '#9FD8DF'];
const SHORT: Record<string, string> = {
  pottery: 'Pottery', painting: 'Painting', candle: 'Candles', cooking: 'Cooking',
  board_games: 'Games', diy_crafts: 'Crafts', coffee: 'Coffee',
};

const month = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
const day = (iso: string) => new Date(iso).getDate();
const weekday = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { weekday: 'long' });

function HeartSeal({ size = 18, color = C.pink }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 21 C5 16 2 12.5 2 8.6 C2 5.5 4.4 3 7.4 3 C9.2 3 10.9 3.9 12 5.4 C13.1 3.9 14.8 3 16.6 3 C19.6 3 22 5.5 22 8.6 C22 12.5 19 16 12 21 Z" fill={color} />
    </Svg>
  );
}

function MeetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { bookings, invitations, saved } = useDateState();
  const matches = useConversations();
  const profile = useProfile();
  const matchOf = (id: string) => matches.find((m) => m.id === id);

  const next = bookings.filter(isUpcoming).sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0];
  const invite = invitations.find((i) => !i.fromMe && i.status === 'sent');

  // ── Date idea deck ──
  const ideas = catalogue.activities;
  const [ideaIdx, setIdeaIdx] = useState(0);
  const flip = useRef(new Animated.Value(0)).current;
  const idea = ideas[ideaIdx % ideas.length];
  const ideaVenue = catalogue.venue(idea.venueId);
  const shuffle = () => {
    Animated.timing(flip, { toValue: 1, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => {
      setIdeaIdx((i) => i + 1);
      flip.setValue(-1);
      Animated.spring(flip, { toValue: 0, useNativeDriver: true, friction: 7, tension: 70 }).start();
    });
  };
  const cardW = width - 56;
  const evW = Math.min(250, width * 0.62);
  const deckStyle = {
    opacity: flip.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
    transform: [
      { translateX: flip.interpolate({ inputRange: [-1, 0, 1], outputRange: [40, 0, -cardW * 0.6] }) },
      { rotate: flip.interpolate({ inputRange: [-1, 0, 1], outputRange: ['4deg', '-1deg', '-12deg'] }) },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 150 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Logo width={74} height={31} tintColor="#2C496A" style={{ marginBottom: 2 }} />
            <Text style={s.title}>Meet</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tap onPress={() => router.push('/date/explore')} style={s.iconBtn} accessibilityLabel="Search experiences">
              <Icon name="search" size={21} color={C.pri} />
            </Tap>
            <Tap onPress={() => router.push('/date/saved')} style={s.iconBtn} accessibilityLabel={`Saved, ${saved.length}`}>
              <Icon name="bookmark_border" size={21} color={C.pri} />
            </Tap>
          </View>
        </View>

        {/* ── Date idea deck ── */}
        <View style={{ paddingHorizontal: 28, marginTop: 4 }}>
          <View style={{ marginTop: 10, marginBottom: 22 }}>
            {/* The next two ideas, fanned out behind like real cards so their photos peek out */}
            {[2, 1].map((k) => {
              const next = ideas[(ideaIdx + k) % ideas.length];
              const tilt = k === 1 ? 5 : -6;
              return (
                <View
                  key={k}
                  style={[s.deckBack, { transform: [{ translateX: k === 1 ? 12 : -12 }, { translateY: k === 1 ? 4 : 10 }, { rotate: `${tilt}deg` }] }]}
                >
                  <Image source={{ uri: next.photos[0] }} style={[s.postcardImg, { opacity: k === 1 ? 0.95 : 0.8 }]} />
                </View>
              );
            })}
            <Animated.View style={[s.postcard, deckStyle]}>
              <Tap onPress={() => router.push(`/date/activity/${idea.id}`)} pressedStyle={{ opacity: 0.95 }}>
                <Image source={{ uri: idea.photos[0] }} style={s.postcardImg} />
                <View style={s.stamp}>
                  <HeartSeal size={14} />
                  <Text style={s.stampText}>for you two</Text>
                </View>
                <Text style={s.ideaTitle} numberOfLines={1}>{idea.title}</Text>
                <Text style={s.ideaMeta} numberOfLines={1}>
                  {ideaVenue?.area} · {duration(idea.durationMin)} · {rupees(idea.priceForTwo)}
                </Text>
              </Tap>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <Tap onPress={shuffle} style={s.shuffle} accessibilityLabel="Show another idea">
                  <Icon name="refresh" size={18} color={C.pri} />
                  <Text style={s.shuffleText}>Shuffle</Text>
                </Tap>
                <Tap
                  onPress={() => router.push({ pathname: '/date/plan', params: { type: 'activity', id: idea.id } })}
                  style={s.planBtn}
                  pressedStyle={{ opacity: 0.88 }}
                >
                  <Text style={s.planText}>Plan this</Text>
                  <Icon name="arrow_forward" size={17} color={C.white} />
                </Tap>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* ── Envelope invitation ── */}
        {invite ? (() => {
          const m = matchOf(invite.matchId);
          const info = describe(invite.subject);
          return (
            <Tap onPress={() => router.push('/date/invitations')} style={s.envelope} pressedStyle={{ opacity: 0.93 }}>
              <View style={s.envFlap} />
              <View style={s.envSeal}><HeartSeal size={16} /></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {m ? <Image source={{ uri: m.photo }} style={s.envAvatar} /> : null}
                <View style={{ flex: 1 }}>
                  <Text style={s.envTitle}>{m?.name} sent you a date</Text>
                  <Text style={s.envSub} numberOfLines={1}>{info?.title}</Text>
                </View>
                <View style={s.openPill}><Text style={s.openText}>Open</Text></View>
              </View>
            </Tap>
          );
        })() : null}

        {/* ── Ticket for the next date ── */}
        {next ? (() => {
          const info = describe(next.subject);
          const m = matchOf(next.matchId);
          const days = Math.round((new Date(next.startsAt).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
          const countdown = days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
          return (
            <Tap onPress={() => router.push(`/date/booking/${next.id}`)} style={s.ticket} pressedStyle={{ opacity: 0.95 }}>
              <View style={s.stub}>
                <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
                  <Defs>
                    <LinearGradient id="stubGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#FF8FA8" />
                      <Stop offset="1" stopColor="#FFB38F" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#stubGrad)" />
                </Svg>
                <Text style={s.stubMonth}>{month(next.startsAt)}</Text>
                <Text style={s.stubDay}>{day(next.startsAt)}</Text>
                <HeartSeal size={13} color="#FFFFFF" />
              </View>
              <View style={s.perf}>
                <View style={[s.notch, { top: -10 }]} />
                {Array.from({ length: 6 }).map((_, i) => <View key={i} style={s.perfDash} />)}
                <View style={[s.notch, { bottom: -10 }]} />
              </View>
              <View style={{ flex: 1, paddingVertical: 14, paddingRight: 14 }}>
                <Text style={s.ticketLabel}>{countdown} · {timeLabel(next.startsAt)}</Text>
                <Text style={s.ticketTitle} numberOfLines={1}>{info?.title}</Text>
                <Text style={s.ticketSub} numberOfLines={1}>{info?.venue?.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <Image source={{ uri: profile.photos[0] }} style={s.pairA} />
                  {m ? <Image source={{ uri: m.photo }} style={s.pairB} /> : null}
                  <View style={s.pairHeart}><HeartSeal size={10} /></View>
                  <Text style={s.ticketWith}>You & {m?.name}</Text>
                  {next.pass ? (
                    <View style={s.passPill}>
                      <Icon name="qr_code_2" size={14} color="#C24468" />
                      <Text style={s.passText}>Pass</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Tap>
          );
        })() : null}

        {/* ── Category bubbles ── */}
        <Text style={[s.section, s.sectionPad]}>What sounds fun?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          {catalogue.categories.map((c, i) => (
            <Tap key={c.id} onPress={() => router.push({ pathname: '/date/explore', params: { category: c.id } })} style={{ alignItems: 'center', width: 70 }}>
              <View style={[s.bubbleRing, { borderColor: RINGS[i % RINGS.length] }]}>
                <Image source={{ uri: c.photo }} style={s.bubbleImg} />
              </View>
              <Text style={s.bubbleText} numberOfLines={1}>{SHORT[c.id] ?? c.label}</Text>
            </Tap>
          ))}
        </ScrollView>

        {/* ── Polaroids: coffee on us ── */}
        <Text style={[s.section, s.sectionPad]}>Coffee is on us ☕</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10, gap: 16 }}>
          {catalogue.offers.map((o, i) => {
            const v = catalogue.venue(o.venueId);
            return (
              <Tap
                key={o.id}
                onPress={() => router.push(`/date/offer/${o.id}`)}
                style={[s.polaroid, { transform: [{ rotate: i % 2 ? '2.5deg' : '-2.5deg' }] }]}
                pressedStyle={{ opacity: 0.93 }}
              >
                <Image source={{ uri: o.photo }} style={s.polaroidImg} />
                <Text style={s.polaroidTitle} numberOfLines={1}>{v?.name}</Text>
                <Text style={s.polaroidSub} numberOfLines={1}>{o.title}</Text>
              </Tap>
            );
          })}
        </ScrollView>

        {/* ── Couple evenings ── */}
        <View style={[s.sectionRow, s.sectionPad]}>
          <Text style={s.section}>Couple evenings</Text>
          <Tap onPress={() => router.push('/date/explore')}><Text style={s.seeAll}>Explore all</Text></Tap>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 6, gap: 14 }}>
          {[...catalogue.events].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)).map((e) => {
            const left = e.capacity - e.seatsTaken;
            return (
              <Tap key={e.id} onPress={() => router.push(`/date/event/${e.id}`)} style={[s.evCard, { width: evW }]} pressedStyle={{ opacity: 0.94 }}>
                <View>
                  <Image source={{ uri: e.photo }} style={s.evImg} />
                </View>
                <View style={{ padding: 14, gap: 3 }}>
                  <Text style={s.evTitle} numberOfLines={1}>{e.title.replace('PREMA ', '')}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar_today" size={13} color={C.pink} />
                    <Text style={s.evWhen} numberOfLines={1}>
                      {new Date(e.startsAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {timeLabel(e.startsAt)}
                    </Text>
                  </View>
                  <Text style={s.evSub} numberOfLines={1}>{catalogue.venue(e.venueId)?.area}</Text>
                  <View style={s.evFoot}>
                    <Text style={s.evPrice}>{rupees(e.pricePerCouple)}<Text style={s.evUnit}> / couple</Text></Text>
                    <View style={[s.evSeats, left <= 0 ? { backgroundColor: '#EEF2F6' } : null]}>
                      <Text style={[s.evSeatsText, left <= 0 ? { color: C.muted } : null]}>{left <= 0 ? 'Waitlist' : `${left} spots`}</Text>
                    </View>
                  </View>
                </View>
              </Tap>
            );
          })}
        </ScrollView>

        <Text style={s.footer}>Meet in public places and arrange your own travel.</Text>
      </ScrollView>

      <StatusFade />
    </View>
  );
}

export default function PremaDateHome() {
  return (
    <NunitoScope>
      <MeetScreen />
    </NunitoScope>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 18 },
  title: { color: C.pri, fontSize: 34, lineHeight: 42, fontFamily: 'Georgia' },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', ...cardShadow },

  kicker: { color: C.pink, fontSize: 13, fontWeight: '800', letterSpacing: 0.4 },

  deckBack: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 26, padding: 12,
    backgroundColor: C.white,
    shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 3,
  },
  postcard: {
    backgroundColor: C.white, borderRadius: 26, padding: 12, paddingBottom: 14,
    shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  postcardImg: { width: '100%', height: 190, borderRadius: 18, backgroundColor: C.accentSoft },
  stamp: {
    position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#FBD3DD', borderStyle: 'dashed',
  },
  stampText: { color: '#C24468', fontSize: 11.5, fontWeight: '800' },
  ideaTitle: { color: C.pri, fontSize: 21, fontFamily: 'Georgia', marginTop: 12, paddingHorizontal: 4 },
  ideaMeta: { color: C.muted, fontSize: 13.5, marginTop: 2, paddingHorizontal: 4 },
  shuffle: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 46, paddingHorizontal: 18, borderRadius: 23, backgroundColor: C.accentSoft },
  shuffleText: { color: C.pri, fontSize: 14.5, fontWeight: '700' },
  planBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: 23, backgroundColor: C.pink },
  planText: { color: C.white, fontSize: 15, fontWeight: '700' },

  envelope: {
    marginHorizontal: 20, marginTop: 22, backgroundColor: '#FFF6F8', borderRadius: 22, padding: 14, paddingTop: 40,
    borderWidth: 1, borderColor: '#FBD3DD', overflow: 'hidden',
  },
  envFlap: {
    position: 'absolute', top: -60, alignSelf: 'center', width: 120, height: 120,
    backgroundColor: '#FFE8EE', transform: [{ rotate: '45deg' }], borderRadius: 14,
  },
  envSeal: {
    position: 'absolute', top: 6, alignSelf: 'center', width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FBD3DD',
  },
  envAvatar: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: C.white },
  envTitle: { color: C.pri, fontSize: 15.5, fontWeight: '800' },
  envSub: { color: '#B5657A', fontSize: 13, marginTop: 1 },
  openPill: { backgroundColor: C.pink, paddingHorizontal: 16, height: 34, borderRadius: 17, justifyContent: 'center' },
  openText: { color: C.white, fontSize: 13.5, fontWeight: '800' },

  ticket: { marginHorizontal: 20, marginTop: 12, flexDirection: 'row', backgroundColor: C.white, borderRadius: 22, ...cardShadow },
  stub: {
    width: 76, alignItems: 'center', justifyContent: 'center', gap: 2, overflow: 'hidden',
    borderTopLeftRadius: 22, borderBottomLeftRadius: 22,
  },
  stubMonth: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  stubDay: { color: C.white, fontSize: 30, fontWeight: '900', lineHeight: 34 },
  perf: { width: 16, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 14 },
  perfDash: { width: 2, height: 6, borderRadius: 1, backgroundColor: '#F3D5DD' },
  notch: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: C.bg },
  ticketLabel: { color: '#E0607E', fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  ticketTitle: { color: C.pri, fontSize: 16.5, fontWeight: '800', marginTop: 3 },
  ticketSub: { color: C.muted, fontSize: 13, marginTop: 1 },
  pairA: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: C.white },
  pairB: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: C.white, marginLeft: -8 },
  pairHeart: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center',
    marginLeft: -6, marginTop: 12, ...cardShadow,
  },
  ticketWith: { color: C.body, fontSize: 13, fontWeight: '700', marginLeft: 6 },
  passPill: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.pinkSoft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 11,
  },
  passText: { color: '#C24468', fontSize: 12, fontWeight: '800' },

  section: { color: C.pri, fontSize: 19, fontFamily: 'Georgia' },
  sectionPad: { paddingHorizontal: 24, marginTop: 28, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  seeAll: { color: C.accent, fontSize: 13.5, fontWeight: '700' },

  bubbleRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 2.5, padding: 3, backgroundColor: C.white },
  bubbleImg: { width: '100%', height: '100%', borderRadius: 32, backgroundColor: C.accentSoft },
  bubbleText: { color: C.pri, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 7 },

  polaroid: {
    width: 158, backgroundColor: C.white, padding: 8, paddingBottom: 12, borderRadius: 6,
    shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
  },
  polaroidImg: { width: '100%', height: 142, borderRadius: 3, backgroundColor: C.accentSoft },
  polaroidTitle: { color: C.pri, fontSize: 14, fontWeight: '800', marginTop: 8, textAlign: 'center' },
  polaroidSub: { color: C.muted, fontSize: 11.5, textAlign: 'center', marginTop: 1 },

  evCard: { backgroundColor: C.white, borderRadius: 22, overflow: 'hidden', ...cardShadow },
  evImg: { width: '100%', height: 140, backgroundColor: C.accentSoft },
  evWhen: { color: C.pri, fontSize: 13, fontWeight: '700', flexShrink: 1 },
  evTitle: { color: C.pri, fontSize: 16, fontWeight: '800' },
  evSub: { color: C.muted, fontSize: 12.5 },
  evFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  evPrice: { color: C.pri, fontSize: 14, fontWeight: '800' },
  evUnit: { color: C.muted, fontSize: 11.5, fontWeight: '600' },
  evSeats: { backgroundColor: C.pinkSoft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  evSeatsText: { color: '#C24468', fontSize: 11, fontWeight: '800' },

  footer: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 26, paddingHorizontal: 32 },
});
