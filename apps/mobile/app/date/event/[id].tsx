import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import { catalogue, rupees, timeLabel, toggleWaitlist, useDateState, dayLabel } from '../../../src/features/date/store';
import { DetailHero, InfoList, MissingListing, PreviewNotice, D } from '../../../src/features/date/ui';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { waitlist } = useDateState();
  const e = catalogue.event(id ?? '');
  if (!e) return <MissingListing />;
  const v = catalogue.venue(e.venueId);
  const left = e.capacity - e.seatsTaken;
  const full = left <= 0;
  const onWaitlist = waitlist.includes(e.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <DetailHero photo={e.photo} subject={{ type: 'event', id: e.id }}>
          <Text style={s.heroDate}>{dayLabel(e.startsAt)} · {timeLabel(e.startsAt)} – {timeLabel(e.endsAt)}</Text>
          <Text style={s.heroTitle}>{e.title}</Text>
          <Text style={s.heroHost}>Hosted by {e.host}</Text>
        </DetailHero>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Seats */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={s.price}>{rupees(e.pricePerCouple)}</Text>
                <Text style={s.priceSub}>per couple</Text>
              </View>
              <View style={[s.seatPill, full ? { backgroundColor: D.greySoft } : null]}>
                <Text style={[s.seatText, full ? { color: C.muted } : null]}>{full ? 'Fully booked' : `${left} of ${e.capacity} spots left`}</Text>
              </View>
            </View>
            <View style={s.bar}><View style={[s.barFill, { width: `${Math.min(100, (e.seatsTaken / e.capacity) * 100)}%` }]} /></View>
            <Text style={s.hint}>
              {e.audience === 'couples_only' ? 'Couples only · ' : 'Open to couples and individuals · '}
              seats update from live bookings
            </Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>The evening</Text>
            <InfoList title="Activities" items={e.activities} icon="auto_awesome" />
            <InfoList title="Included" items={e.includes} />
            <InfoList title="Not included" items={e.excludes} icon="close" tone="muted" />
          </View>

          {v ? (
            <Tap onPress={() => router.push(`/date/venue/${v.id}`)} style={s.card}>
              <Text style={s.cardTitle}>Venue</Text>
              <Text style={s.venueName}>{v.name}</Text>
              <Text style={s.venueMeta}>{v.address}</Text>
            </Tap>
          ) : null}

          <View style={s.card}>
            <InfoList title="Accessibility" items={[e.accessibility]} icon="info" tone="muted" />
            <InfoList title="Photography & consent" items={[e.photoPolicy]} icon="photo_camera" tone="muted" />
            <InfoList title="Cancellation & refunds" items={[e.refundPolicy]} icon="event_available" tone="muted" />
            <InfoList title="House rules" items={e.rules} icon="circle" tone="muted" />
          </View>
        </View>
        <PreviewNotice />
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {full ? (
          <Tap onPress={() => toggleWaitlist(e.id)} style={[s.cta, onWaitlist ? s.ctaQuiet : { backgroundColor: C.pri }]} pressedStyle={{ opacity: 0.88 }}>
            <Icon name={onWaitlist ? 'check' : 'hourglass_top'} size={17} color={onWaitlist ? C.pri : C.white} />
            <Text style={[s.ctaText, onWaitlist ? { color: C.pri } : null]}>{onWaitlist ? 'On the waitlist · tap to leave' : 'Join the waitlist'}</Text>
          </Tap>
        ) : (
          <Tap onPress={() => router.push({ pathname: '/date/plan', params: { type: 'event', id: e.id } })} style={s.cta} pressedStyle={{ opacity: 0.88 }}>
            <Icon name="send" size={16} color={C.white} />
            <Text style={s.ctaText}>Invite a match · {rupees(e.pricePerCouple)}</Text>
          </Tap>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  heroDate: { color: 'rgba(255,255,255,0.88)', fontSize: 12.5, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroTitle: { color: C.white, fontSize: 30, lineHeight: 36, marginTop: 4, ...serif },
  heroHost: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 6 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  cardTitle: { color: C.pri, fontSize: 18, ...serif },
  price: { color: C.pri, fontSize: 24, fontWeight: '700' },
  priceSub: { color: C.muted, fontSize: 12.5 },
  seatPill: { backgroundColor: C.accentSoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 11 },
  seatText: { color: C.body, fontSize: 12, fontWeight: '700' },
  bar: { height: 6, borderRadius: 3, backgroundColor: '#EDF2F7', marginTop: 14, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3, backgroundColor: C.accent },
  hint: { color: C.muted, fontSize: 12, marginTop: 10 },
  venueName: { color: C.pri, fontSize: 15.5, fontWeight: '600', marginTop: 8 },
  venueMeta: { color: C.muted, fontSize: 13, marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5' },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.pink, height: 54, borderRadius: 27 },
  ctaQuiet: { backgroundColor: C.white, borderWidth: 1.5, borderColor: '#D6E2EE' },
  ctaText: { color: C.white, fontSize: 15.5, fontWeight: '600' },
});
