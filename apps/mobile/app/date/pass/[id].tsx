import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import Text from '../../../components/PremaText';
import CelestialBackground from '../../../components/CelestialBackground';
import Icon from '../../../components/Icon';
import { C, ScreenHeader, cardShadow } from '../../../components/prema-ui';
import { useConversations } from '../../../src/store/chats';
import { useProfile } from '../../../src/store/profile';
import { describe, timeLabel, useDateState } from '../../../src/features/date/store';
import { MissingListing } from '../../../src/features/date/ui';

const PAGE_BG = C.bg;

function Heart({ size = 12, color = C.pink }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 21 C5 16 2 12.5 2 8.6 C2 5.5 4.4 3 7.4 3 C9.2 3 10.9 3.9 12 5.4 C13.1 3.9 14.8 3 16.6 3 C19.6 3 22 5.5 22 8.6 C22 12.5 19 16 12 21 Z" fill={color} />
    </Svg>
  );
}

export default function PassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useDateState();
  const matches = useConversations();
  const me = useProfile();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  const b = bookings.find((x) => x.id === id);
  if (!b || !b.pass) return <MissingListing />;
  const info = describe(b.subject);
  const m = matches.find((x) => x.id === b.matchId);
  const to = +new Date(b.pass.expiresAt);
  const blocked = b.pass.redeemedAt ? 'Already redeemed' : now > to ? 'This pass has expired' : null;
  const dateText = new Date(b.pass.validFrom).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <CelestialBackground />
      <ScreenHeader title="Your pass" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={s.ticket}>
          {/* Top: gradient with the date details */}
          <View style={s.top}>
            <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="ticketTop" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#FF8FA8" />
                  <Stop offset="1" stopColor="#FFB38F" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#ticketTop)" />
            </Svg>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              {info?.photo ? <Image source={{ uri: info.photo }} style={s.photo} /> : null}
              <View style={{ flex: 1 }}>
                <Text style={s.title} numberOfLines={2}>{info?.title}</Text>
                <Text style={s.venue} numberOfLines={1}>{info?.venue?.name}</Text>
              </View>
            </View>
            <View style={s.pair}>
              <Image source={{ uri: me.photos[0] }} style={s.face} />
              {m ? <Image source={{ uri: m.photo }} style={[s.face, { marginLeft: -10 }]} /> : null}
              <View style={s.pairHeart}><Heart size={11} /></View>
              <Text style={s.pairText}>You & {m?.name}</Text>
            </View>
          </View>

          {/* Tear line */}
          <View style={s.tear}>
            <View style={[s.notch, { left: -12 }]} />
            <View style={s.dashes}>
              {Array.from({ length: 16 }).map((_, i) => <View key={i} style={s.dash} />)}
            </View>
            <View style={[s.notch, { right: -12 }]} />
          </View>

          {/* Bottom: QR */}
          <View style={s.bottom}>
            {blocked ? (
              <View style={s.blocked}><Text style={s.blockedText}>{blocked}</Text></View>
            ) : null}
            <View style={[s.qrWrap, blocked ? { opacity: 0.25 } : null]}>
              <QRCode value={b.pass.token} size={196} color="#2C496A" backgroundColor="#FFFFFF" />
            </View>
            <Text style={s.token}>{b.pass.token}</Text>

            <View style={s.chips}>
              <View style={s.chip}>
                <Icon name="calendar_today" size={15} color="#E0607E" />
                <Text style={s.chipText}>{dateText}</Text>
              </View>
              <View style={s.chip}>
                <Icon name="schedule" size={15} color="#E0607E" />
                <Text style={s.chipText}>{timeLabel(b.pass.validFrom)} – {timeLabel(b.pass.expiresAt)}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={s.hint}>Show this at the counter — staff will scan it.</Text>
        <View style={s.rules}>
          {[
            ['lock', 'Single use'],
            ['schedule', '±30 min window'],
            ['visibility_off', 'Profile stays private'],
          ].map(([icon, t]) => (
            <View key={t} style={s.rule}>
              <Icon name={icon} size={14} color={C.muted} />
              <Text style={s.ruleText}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  ticket: {
    borderRadius: 28, backgroundColor: C.white, marginTop: 4,
    shadowColor: '#E07A92', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 8,
  },
  top: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', padding: 20, paddingBottom: 18 },
  photo: { width: 64, height: 64, borderRadius: 18, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.85)' },
  title: { color: C.white, fontSize: 20, fontWeight: '800', lineHeight: 25 },
  venue: { color: 'rgba(255,255,255,0.92)', fontSize: 13.5, marginTop: 3 },
  pair: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20, paddingVertical: 4, paddingLeft: 4, paddingRight: 12,
  },
  face: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: C.white },
  pairHeart: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center',
    marginLeft: -6, marginTop: 12,
  },
  pairText: { color: C.white, fontSize: 13, fontWeight: '800', marginLeft: 6 },

  tear: { height: 24, justifyContent: 'center' },
  notch: { position: 'absolute', top: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: PAGE_BG },
  dashes: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 22 },
  dash: { width: 7, height: 2, borderRadius: 1, backgroundColor: '#F3D5DD' },

  bottom: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 22 },
  blocked: { backgroundColor: '#EEF2F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  blockedText: { color: C.muted, fontSize: 12.5, fontWeight: '700' },
  qrWrap: { padding: 12, borderRadius: 22, backgroundColor: C.white, borderWidth: 1.5, borderColor: '#FBD3DD' },
  token: { color: '#B5657A', fontSize: 12.5, letterSpacing: 2, marginTop: 12, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.pinkSoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  chipText: { color: C.pri, fontSize: 13.5, fontWeight: '700' },

  hint: { color: C.body, fontSize: 13.5, textAlign: 'center', marginTop: 20 },
  rules: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
  rule: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, ...cardShadow,
  },
  ruleText: { color: C.muted, fontSize: 12, fontWeight: '700' },
});
