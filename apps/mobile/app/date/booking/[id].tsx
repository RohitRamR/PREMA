import React from 'react';
import { View, ScrollView, Image, StyleSheet, Alert, Linking } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import { useConversations } from '../../../src/store/chats';
import {
  cancelBooking, catalogue, describe, previewCompletePayment, previewVenueConfirms, rupees, useDateState, whenLabel, duration,
} from '../../../src/features/date/store';
import { DetailHero, MissingListing, PreviewNotice } from '../../../src/features/date/ui';
import type { Booking } from '../../../src/features/date/types';

function timeline(b: Booking, paid: boolean, request: boolean) {
  const reached = (s: Booking['status'][]) => s.includes(b.status);
  const steps = [
    { label: 'Invitation accepted by both', done: !!b.consent.me && !!b.consent.them },
    ...(request ? [{ label: 'Venue confirms the time', done: !reached(['awaiting_response']) }] : []),
    ...(paid ? [{ label: 'Payment verified', done: reached(['confirmed', 'completed', 'refunded']) }] : []),
    { label: 'Confirmed', done: reached(['confirmed', 'completed']) },
    { label: 'Completed', done: reached(['completed']) },
  ];
  return steps;
}

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings } = useDateState();
  const matches = useConversations();
  const b = bookings.find((x) => x.id === id);
  if (!b) return <MissingListing />;
  const info = describe(b.subject);
  const m = matches.find((x) => x.id === b.matchId);
  const venue = info?.venue;
  const paid = b.totalPaise > 0;
  const request = info?.bookingMode === 'request';
  const policy =
    b.subject.type === 'activity' ? catalogue.activity(b.subject.id)?.cancellation
    : b.subject.type === 'offer' ? catalogue.offer(b.subject.id)?.cancellation
    : catalogue.event(b.subject.id)?.refundPolicy;

  const confirmCancel = () =>
    Alert.alert('Cancel this date?', `${policy ?? ''}\n\n${m?.name ?? 'Your match'} will be notified.`, [
      { text: 'Keep booking', style: 'cancel' },
      { text: 'Cancel date', style: 'destructive', onPress: () => cancelBooking(b.id) },
    ]);

  const report = () =>
    Alert.alert('Report a concern', 'Tell us privately about a safety issue with this date, venue or person. Reports are reviewed by PREMA’s safety team and never shared with the other person.', [
      { text: 'Not now', style: 'cancel' },
      { text: 'Continue', onPress: () => router.push(`/date/review/${b.id}?report=1`) },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <DetailHero photo={info?.photo ?? ''} height={260}>
          <Text style={s.heroTitle}>{info?.title}</Text>
          <Text style={s.heroSub}>{venue?.name} · {venue?.area}</Text>
        </DetailHero>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Summary */}
          <View style={[s.card, { marginTop: 4 }]}>
            <Row icon="event_available" label="When" value={whenLabel(b.startsAt)} />
            {info?.durationMin ? <Row icon="schedule" label="Duration" value={duration(info.durationMin)} /> : null}
            <Row icon="location_on" label="Where" value={venue?.address ?? ''} />
            <View style={s.row}>
              <Icon name="favorite_border" size={18} color="#E0607E" />
              <Text style={s.rowLabel}>With</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                {m ? <Image source={{ uri: m.photo }} style={{ width: 24, height: 24, borderRadius: 12 }} /> : null}
                <Text style={[s.rowValue, { flex: 0 }]}>{m?.name}</Text>
              </View>
            </View>
            <Row icon="payments" label="Total for two" value={rupees(b.totalPaise)} last />
          </View>

          {/* Status actions */}
          {b.status === 'confirmed' && b.pass ? (
            <Tap onPress={() => router.push(`/date/pass/${b.id}`)} style={s.passCard} pressedStyle={{ opacity: 0.92 }}>
              <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="passGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FF8FA8" />
                    <Stop offset="1" stopColor="#FFB38F" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#passGrad)" />
              </Svg>
              <View style={s.passIcon}><Icon name="qr_code_2" size={26} color="#E0607E" /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.passTitle}>Your pass is ready</Text>
                <Text style={s.passSub}>Single-use · show it at the venue</Text>
              </View>
              <Icon name="chevron_right" size={22} color={C.white} />
            </Tap>
          ) : null}

          {b.status === 'payment_pending' ? (
            <View style={s.notice}>
              <Text style={s.noticeTitle}>Payment pending</Text>
              <Text style={s.noticeBody}>You both accepted. The booking confirms once payment of {rupees(b.totalPaise)} is verified by our payment provider.</Text>
              <Tap onPress={() => previewCompletePayment(b.id)} style={s.noticeBtn}>
                <Text style={s.noticeBtnText}>Pay {rupees(b.totalPaise)} (preview)</Text>
              </Tap>
            </View>
          ) : null}

          {b.status === 'awaiting_response' ? (
            <View style={s.notice}>
              <Text style={s.noticeTitle}>Waiting for the venue</Text>
              <Text style={s.noticeBody}>{venue?.name} confirms requested times manually. We’ll notify you both as soon as they reply.</Text>
              <Tap onPress={() => previewVenueConfirms(b.id)} style={[s.noticeBtn, s.noticeBtnGhost]}>
                <Text style={[s.noticeBtnText, { color: C.muted }]}>Preview: venue confirms</Text>
              </Tap>
            </View>
          ) : null}

          {b.status === 'completed' ? (
            <Tap onPress={b.review ? undefined : () => router.push(`/date/review/${b.id}`)} style={s.feedback}>
              <Icon name={b.review ? 'check_circle' : 'edit_note'} size={22} color={C.accent} />
              <View style={{ flex: 1 }}>
                <Text style={s.feedbackTitle}>{b.review ? 'Feedback sent privately' : 'How was it?'}</Text>
                <Text style={s.feedbackSub}>{b.review ? 'Thank you — it helps us keep venues great.' : 'Share private feedback about the venue and activity.'}</Text>
              </View>
              {!b.review ? <Icon name="chevron_right" size={22} color={C.muted} /> : null}
            </Tap>
          ) : null}

          {(b.status === 'cancelled' || b.status === 'refunded') ? (
            <View style={s.notice}>
              <Text style={s.noticeTitle}>{b.status === 'refunded' ? 'Cancelled · refund issued' : 'Cancelled'}</Text>
              <Text style={s.noticeBody}>{b.status === 'refunded' ? 'Refunds take 5–7 working days to reach your original payment method.' : 'Nothing was charged.'}</Text>
            </View>
          ) : null}

          {/* Timeline */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Status</Text>
            {timeline(b, paid, !!request).map((st, i, arr) => (
              <View key={st.label} style={s.tl}>
                <View style={{ alignItems: 'center' }}>
                  <View style={[s.tlDot, st.done ? s.tlDotDone : null]}>{st.done ? <Icon name="check" size={11} color={C.white} /> : null}</View>
                  {i < arr.length - 1 ? <View style={[s.tlLine, st.done ? { backgroundColor: '#FFB3C4' } : null]} /> : null}
                </View>
                <Text style={[s.tlText, st.done ? { color: C.pri, fontWeight: '600' } : null]}>{st.label}</Text>
              </View>
            ))}
          </View>

          {/* Venue actions */}
          {venue && !['cancelled', 'refunded'].includes(b.status) ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Tap onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(venue.mapsQuery)}`)} style={s.soft}>
                <Icon name="directions" size={17} color={C.pri} /><Text style={s.softText}>Directions</Text>
              </Tap>
              <Tap onPress={() => Linking.openURL(`tel:${venue.phone.replace(/\s/g, '')}`)} style={s.soft}>
                <Icon name="phone" size={17} color={C.pri} /><Text style={s.softText}>Call venue</Text>
              </Tap>
            </View>
          ) : null}

          {policy ? (
            <View style={s.card}>
              <Text style={s.cardTitle}>Cancellation policy</Text>
              <Text style={s.policy}>{policy}</Text>
            </View>
          ) : null}

          <View style={s.links}>
            {['confirmed', 'payment_pending', 'awaiting_response'].includes(b.status) ? (
              <Tap onPress={confirmCancel}><Text style={s.cancel}>Cancel date</Text></Tap>
            ) : null}
            <Tap onPress={report}><Text style={s.report}>Report a concern</Text></Tap>
          </View>
        </View>
        <PreviewNotice />
      </ScrollView>
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

function Row({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[s.row, last ? { borderBottomWidth: 0 } : null]}>
      <Icon name={icon} size={18} color="#E0607E" />
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  heroTitle: { color: C.white, fontSize: 28, lineHeight: 34, ...serif },
  heroSub: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  cardTitle: { color: C.pri, fontSize: 18, marginBottom: 6, ...serif },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.line },
  rowLabel: { color: C.muted, fontSize: 13.5, width: 92 },
  rowValue: { color: C.pri, fontSize: 14.5, fontWeight: '600', flex: 1, textAlign: 'right' },
  passCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, padding: 18, marginTop: 16, overflow: 'hidden',
    shadowColor: '#FF8FA8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4,
  },
  passIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  passTitle: { color: C.white, fontSize: 18, ...serif },
  passSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 2 },
  notice: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, borderLeftWidth: 3, borderLeftColor: C.accent, ...cardShadow },
  noticeTitle: { color: C.pri, fontSize: 16, fontWeight: '600' },
  noticeBody: { color: C.body, fontSize: 13.5, lineHeight: 20, marginTop: 4 },
  noticeBtn: { marginTop: 12, height: 44, borderRadius: 22, backgroundColor: C.pri, alignItems: 'center', justifyContent: 'center' },
  noticeBtnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFD4EA' },
  noticeBtnText: { color: C.white, fontSize: 14, fontWeight: '600' },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  feedbackTitle: { color: C.pri, fontSize: 16, fontWeight: '600' },
  feedbackSub: { color: C.muted, fontSize: 13, marginTop: 2 },
  tl: { flexDirection: 'row', gap: 12, minHeight: 34 },
  tlDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#C9D6E3', alignItems: 'center', justifyContent: 'center', backgroundColor: C.white },
  tlDotDone: { backgroundColor: C.pink, borderColor: C.pink },
  tlLine: { width: 2, flex: 1, backgroundColor: '#E3ECF5', marginVertical: 2 },
  tlText: { color: C.muted, fontSize: 14, marginTop: 1 },
  soft: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: 23, backgroundColor: C.white, ...cardShadow },
  softText: { color: C.pri, fontSize: 14, fontWeight: '600' },
  policy: { color: C.body, fontSize: 13.5, lineHeight: 20 },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 22 },
  cancel: { color: '#B4373F', fontSize: 14, fontWeight: '600' },
  report: { color: C.muted, fontSize: 14, fontWeight: '600' },
});
