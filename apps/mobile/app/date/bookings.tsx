// All your dates in one place: upcoming (including ones waiting on payment or the venue)
// and past ones, with a nudge to leave feedback.
import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import Text from '../../components/PremaText';
import { C, ScreenHeader, Tap, cardShadow } from '../../components/prema-ui';
import { useConversations } from '../../src/store/chats';
import { STATUS_COPY, describe, isUpcoming, rupees, useDateState, whenLabel } from '../../src/features/date/store';
import { D } from '../../src/features/date/ui';
import type { Booking } from '../../src/features/date/types';

const TONE: Record<string, { bg: string; fg: string }> = {
  sky: { bg: C.accentSoft, fg: '#3B7BBF' },
  green: { bg: D.greenSoft, fg: D.green },
  amber: { bg: D.amberSoft, fg: D.amber },
  grey: { bg: D.greySoft, fg: C.muted },
  red: { bg: D.redSoft, fg: D.red },
};

export default function MyDates() {
  const router = useRouter();
  const { bookings } = useDateState();
  const matches = useConversations();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = bookings.filter(isUpcoming).sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  const past = bookings.filter((b) => !isUpcoming(b)).sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));
  const list = tab === 'upcoming' ? upcoming : past;

  const open = (b: Booking) => router.push(b.status === 'payment_pending' ? `/date/pay/${b.id}` : `/date/booking/${b.id}`);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="PREMA Date" title="My dates" />

      <View style={s.segment}>
        {([['upcoming', `Upcoming${upcoming.length ? ` · ${upcoming.length}` : ''}`], ['past', 'Past']] as const).map(([k, label]) => (
          <Tap key={k} onPress={() => setTab(k)} style={[s.segItem, tab === k ? s.segOn : null]}
            accessibilityRole="tab" accessibilityState={{ selected: tab === k }}>
            <Text style={[s.segText, tab === k ? { color: C.pri } : null]}>{label}</Text>
          </Tap>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 48, gap: 14 }} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <View style={s.empty}>
            <Icon name={tab === 'upcoming' ? 'event_available' : 'history'} size={34} color={C.pink} />
            <Text style={s.emptyTitle}>{tab === 'upcoming' ? 'No dates planned yet' : 'No past dates'}</Text>
            <Text style={s.emptyBody}>{tab === 'upcoming' ? 'Find something you’d both enjoy and send an invite.' : 'Dates you’ve been on will show up here.'}</Text>
            {tab === 'upcoming' ? (
              <Tap onPress={() => router.push('/date/plan')} style={s.emptyBtn}><Text style={s.emptyBtnText}>Plan a date</Text></Tap>
            ) : null}
          </View>
        ) : list.map((b) => {
          const info = describe(b.subject);
          const m = matches.find((x) => x.id === b.matchId);
          const st = STATUS_COPY[b.status];
          const tone = TONE[st.tone];
          const action =
            b.status === 'payment_pending' ? (b.payment?.mePaid ? 'Waiting for their half' : 'Pay to confirm')
            : b.status === 'confirmed' && b.pass ? 'View pass'
            : b.status === 'completed' && !b.review ? 'Leave feedback'
            : null;
          return (
            <Tap key={b.id} onPress={() => open(b)} style={s.card} pressedStyle={{ opacity: 0.94 }}>
              <Image source={{ uri: info?.photo }} style={s.photo} />
              <View style={{ flex: 1 }}>
                <View style={[s.pill, { backgroundColor: tone.bg }]}><Text style={[s.pillText, { color: tone.fg }]}>{st.label}</Text></View>
                <Text style={s.title} numberOfLines={1}>{info?.title}</Text>
                <Text style={s.meta} numberOfLines={1}>{whenLabel(b.startsAt)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  {m ? <Image source={{ uri: m.photo }} style={s.mini} /> : null}
                  <Text style={s.meta}>With {m?.name ?? 'your match'} · {rupees(b.totalPaise)}</Text>
                </View>
                {action ? <Text style={s.action}>{action} →</Text> : null}
              </View>
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  segment: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, padding: 4, borderWidth: 1, borderColor: '#E6EDF5' },
  segItem: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.white, ...cardShadow },
  segText: { color: C.muted, fontSize: 14, fontWeight: '700' },
  card: { flexDirection: 'row', gap: 14, padding: 12, borderRadius: 24, backgroundColor: C.white, ...cardShadow },
  photo: { width: 96, height: 124, borderRadius: 18, backgroundColor: C.accentSoft },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  pillText: { fontSize: 11.5, fontWeight: '800' },
  title: { color: C.pri, fontSize: 16.5, fontWeight: '900', marginTop: 6 },
  meta: { color: C.muted, fontSize: 13, fontWeight: '600', marginTop: 2 },
  mini: { width: 20, height: 20, borderRadius: 10 },
  action: { color: C.pink, fontSize: 13.5, fontWeight: '800', marginTop: 8 },
  empty: { alignItems: 'center', backgroundColor: C.white, borderRadius: 24, padding: 30 },
  emptyTitle: { color: C.pri, fontSize: 19, fontWeight: '900', marginTop: 10 },
  emptyBody: { color: C.muted, fontSize: 14, marginTop: 4, textAlign: 'center' },
  emptyBtn: { marginTop: 14, backgroundColor: C.pink, paddingHorizontal: 20, height: 44, borderRadius: 22, justifyContent: 'center' },
  emptyBtnText: { color: C.white, fontSize: 15, fontWeight: '800' },
});
