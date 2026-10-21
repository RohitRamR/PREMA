import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import Text from '../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import { C, ScreenHeader, Tap, cardShadow, serif } from '../../components/prema-ui';
import { useConversations } from '../../src/store/chats';
import {
  cancelInvitation, catalogue, counterInvitation, describe, respondToInvitation, simulateTheyAccept,
  useDateState, whenLabel, rupees,
} from '../../src/features/date/store';
import { PreviewNotice, SlotPicker, D } from '../../src/features/date/ui';
import type { Invitation } from '../../src/features/date/types';

const STATUS: Record<Invitation['status'], { label: string; bg: string; fg: string }> = {
  sent: { label: 'Awaiting reply', bg: D.amberSoft, fg: D.amber },
  accepted: { label: 'Accepted', bg: D.greenSoft, fg: D.green },
  declined: { label: 'Declined', bg: D.greySoft, fg: C.muted },
  countered: { label: 'New time suggested', bg: C.accentSoft, fg: '#3B7BBF' },
  cancelled: { label: 'Withdrawn', bg: D.greySoft, fg: C.muted },
};

export default function Invitations() {
  const params = useLocalSearchParams<{ tab?: 'in' | 'sent' }>();
  const router = useRouter();
  const { invitations } = useDateState();
  const matches = useConversations();
  const [tab, setTab] = useState<'in' | 'sent'>(params.tab === 'sent' ? 'sent' : 'in');
  const [countering, setCountering] = useState<string | null>(null);
  const [counterSlot, setCounterSlot] = useState<string | null>(null);

  const list = invitations.filter((i) => (tab === 'in' ? !i.fromMe : i.fromMe));
  const incomingCount = invitations.filter((i) => !i.fromMe && i.status === 'sent').length;

  const accept = (inv: Invitation) => {
    const booking = respondToInvitation(inv.id, 'accept');
    // Paid dates go straight to payment; free ones to the booking.
    if (booking) router.push(booking.status === 'payment_pending' ? `/date/pay/${booking.id}` : `/date/booking/${booking.id}`);
  };
  const decline = (inv: Invitation, name?: string) =>
    Alert.alert('Decline this invitation?', `${name ?? 'They'} will see that you’ve declined. You can still chat.`, [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => respondToInvitation(inv.id, 'decline') },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Shared planner" title="Invitations" />

      <View style={s.segment}>
        {([['in', `For you${incomingCount ? ` · ${incomingCount}` : ''}`], ['sent', 'Sent']] as const).map(([k, label]) => (
          <Tap key={k} onPress={() => setTab(k)} style={[s.segItem, tab === k ? s.segOn : null]} accessibilityRole="tab" accessibilityState={{ selected: tab === k }}>
            <Text style={[s.segText, tab === k ? { color: C.pri } : null]}>{label}</Text>
          </Tap>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 14, gap: 14 }}>
        {list.length === 0 ? (
          <View style={s.empty}>
            <Icon name="mail" size={26} color={C.accent} />
            <Text style={s.emptyTitle}>{tab === 'in' ? 'No invitations yet' : 'You haven’t invited anyone yet'}</Text>
            <Text style={s.emptyBody}>{tab === 'in' ? 'When a match invites you to something, it appears here.' : 'Find something you’d both enjoy.'}</Text>
            {tab === 'sent' ? <Tap onPress={() => router.push('/date/plan')} style={s.emptyBtn}><Text style={s.emptyBtnText}>Plan a date</Text></Tap> : null}
          </View>
        ) : list.map((inv) => {
          const m = matches.find((x) => x.id === inv.matchId);
          const info = describe(inv.subject);
          const slot = info?.slots.find((x) => x.id === inv.slotId);
          const when = slot?.startsAt ?? inv.requestedTime ?? (inv.subject.type === 'event' ? catalogue.event(inv.subject.id)?.startsAt : null);
          const st = inv.status === 'sent' && !inv.fromMe ? { label: 'Needs your reply', bg: C.pinkSoft, fg: '#C24468' } : STATUS[inv.status];
          const open = inv.status === 'sent';
          return (
            <View key={inv.id} style={s.card}>
              <View style={s.cardHead}>
                {m ? <Image source={{ uri: m.photo }} style={s.avatar} /> : null}
                <View style={{ flex: 1 }}>
                  <Text style={s.who}>{inv.fromMe ? `To ${m?.name}` : `${m?.name} invited you`}</Text>
                  {inv.status === 'sent' && !inv.fromMe ? null : (
                    <View style={[s.status, { backgroundColor: st.bg }]}><Text style={[s.statusText, { color: st.fg }]}>{st.label}</Text></View>
                  )}
                </View>
              </View>

              <Tap onPress={() => router.push(`/date/${inv.subject.type}/${inv.subject.id}`)} style={s.subject}>
                {info ? <Image source={{ uri: info.photo }} style={s.subjectImg} /> : null}
                <View style={{ flex: 1 }}>
                  <Text style={s.subjectTitle} numberOfLines={1}>{info?.title}</Text>
                  <Text style={s.subjectMeta} numberOfLines={1}>{info?.venue?.name}</Text>
                  <Text style={s.subjectMeta}>
                    {when ? whenLabel(when) : 'Time to be agreed'}{inv.requestedTime ? ' · preferred, venue to confirm' : ''}
                  </Text>
                  <Text style={s.subjectMeta}>{rupees(info?.priceForTwo ?? null)}{info?.priceForTwo ? ' for two' : ''}</Text>
                </View>
              </Tap>

              {inv.message ? <Text style={s.note}>“{inv.message}”</Text> : null}

              {open && !inv.fromMe ? (
                countering === inv.id && info?.slots.length ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={s.counterTitle}>Suggest another time</Text>
                    <SlotPicker slots={info.slots.filter((x) => x.id !== inv.slotId)} value={counterSlot} onChange={setCounterSlot} />
                    <View style={s.actions}>
                      <Tap onPress={() => { setCountering(null); setCounterSlot(null); }} style={s.btnGhost}><Text style={s.btnGhostText}>Back</Text></Tap>
                      <Tap
                        onPress={counterSlot ? () => { counterInvitation(inv.id, counterSlot, null, 'How about this time instead?'); setCountering(null); setCounterSlot(null); setTab('sent'); } : undefined}
                        style={[s.btnPrimary, !counterSlot ? { opacity: 0.5 } : null]}
                      >
                        <Text style={s.btnPrimaryText}>Send new time</Text>
                      </Tap>
                    </View>
                  </View>
                ) : (
                  <View style={s.actions}>
                    <Tap onPress={() => decline(inv, m?.name)} style={s.btnGhost} accessibilityLabel="Decline"><Icon name="close" size={18} color={C.muted} /></Tap>
                    {info?.slots.length ? (
                      <Tap onPress={() => setCountering(inv.id)} style={s.btnSoft}><Text style={s.btnSoftText}>Other time</Text></Tap>
                    ) : null}
                    <Tap onPress={() => accept(inv)} style={s.btnPrimary} pressedStyle={{ opacity: 0.88 }}>
                      <Icon name="check" size={17} color={C.white} />
                      <Text style={s.btnPrimaryText}>Accept</Text>
                    </Tap>
                  </View>
                )
              ) : null}

              {open && inv.fromMe ? (
                <View style={s.actions}>
                  <Tap onPress={() => cancelInvitation(inv.id)} style={s.btnSoft}><Text style={s.btnSoftText}>Withdraw</Text></Tap>
                  <Tap
                    onPress={() => { const b = simulateTheyAccept(inv.id); if (b) router.push(b.status === 'payment_pending' ? `/date/pay/${b.id}` : `/date/booking/${b.id}`); }}
                    style={s.previewBtn}
                  >
                    <Text style={s.previewText}>Preview: {m?.name} accepts</Text>
                  </Tap>
                </View>
              ) : null}
            </View>
          );
        })}
        <PreviewNotice />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  segment: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, padding: 4, borderWidth: 1, borderColor: '#E6EDF5' },
  segItem: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.white, ...cardShadow },
  segText: { color: C.muted, fontSize: 14, fontWeight: '600' },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 16, ...cardShadow },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.accentSoft },
  who: { color: C.pri, fontSize: 16, fontWeight: '600' },
  status: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  subject: { flexDirection: 'row', gap: 12, marginTop: 14, backgroundColor: '#F6F9FC', borderRadius: 16, padding: 10 },
  subjectImg: { width: 72, height: 72, borderRadius: 14, backgroundColor: C.accentSoft },
  subjectTitle: { color: C.pri, fontSize: 16, ...serif },
  subjectMeta: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  note: { color: C.body, fontSize: 14.5, lineHeight: 21, marginTop: 12, ...serif },
  counterTitle: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  btnGhost: { height: 44, minWidth: 44, paddingHorizontal: 12, borderRadius: 22, backgroundColor: '#F2F6FB', alignItems: 'center', justifyContent: 'center' },
  btnGhostText: { color: C.body, fontSize: 14, fontWeight: '600' },
  btnSoft: { height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  btnSoftText: { color: C.pri, fontSize: 14, fontWeight: '600' },
  btnPrimary: { flex: 1, height: 44, borderRadius: 22, backgroundColor: C.pri, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnPrimaryText: { color: C.white, fontSize: 14.5, fontWeight: '600' },
  previewBtn: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFD4EA', alignItems: 'center', justifyContent: 'center' },
  previewText: { color: C.muted, fontSize: 12.5, fontWeight: '600' },
  empty: { backgroundColor: C.white, borderRadius: 22, padding: 28, alignItems: 'center' },
  emptyTitle: { color: C.pri, fontSize: 19, marginTop: 8, textAlign: 'center', ...serif },
  emptyBody: { color: C.muted, fontSize: 13.5, marginTop: 4, textAlign: 'center' },
  emptyBtn: { marginTop: 14, backgroundColor: C.pri, paddingHorizontal: 18, height: 40, borderRadius: 20, justifyContent: 'center' },
  emptyBtnText: { color: C.white, fontSize: 14, fontWeight: '600' },
});
