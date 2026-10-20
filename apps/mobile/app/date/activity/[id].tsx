import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Linking, Image } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import { catalogue, duration, rupees } from '../../../src/features/date/store';
import {
  AvailabilityBadge, DetailHero, InfoList, MissingListing, PreviewNotice, SlotPicker,
} from '../../../src/features/date/ui';

export default function ActivityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const a = catalogue.activity(id ?? '');
  const [slotId, setSlotId] = useState<string | null>(null);

  if (!a) return <MissingListing />;
  const v = catalogue.venue(a.venueId);
  const category = catalogue.categories.find((c) => c.id === a.category);

  const invite = () => router.push({
    pathname: '/date/plan',
    params: { type: 'activity', id: a.id, ...(slotId ? { slot: slotId } : {}) },
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <DetailHero photo={a.photos[0]} subject={{ type: 'activity', id: a.id }}>
          <Text style={s.heroEyebrow}>{category?.label}</Text>
          <Text style={s.heroTitle}>{a.title}</Text>
          <Text style={s.heroVenue}>{v?.name} · {v?.area}, {v?.city}</Text>
        </DetailHero>

        {a.photos.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 14 }}>
            {a.photos.map((p) => <Image key={p} source={{ uri: p }} style={s.thumb} />)}
          </ScrollView>
        ) : null}

        <View style={{ paddingHorizontal: 20 }}>
          {/* Facts */}
          <View style={s.facts}>
            <Fact icon="payments" label="For two" value={rupees(a.priceForTwo)} />
            <View style={s.factDivider} />
            <Fact icon="schedule" label="Duration" value={duration(a.durationMin)} />
            <View style={s.factDivider} />
            <Fact icon="spa" label="Level" value={a.beginnerFriendly ? 'Beginner' : 'Some experience'} />
          </View>

          <Text style={s.body}>{a.description}</Text>

          {/* Availability */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={s.cardTitle}>Availability</Text>
              <AvailabilityBadge activity={a} />
            </View>
            {a.bookingMode === 'instant' ? (
              <>
                <SlotPicker slots={a.slots} value={slotId} onChange={setSlotId} />
                <Text style={s.hint}>Times come directly from the venue’s live calendar.</Text>
              </>
            ) : (
              <Text style={s.hintStrong}>
                This venue confirms times manually. You and your match pick a preferred time; the venue replies before anything is booked.
              </Text>
            )}
          </View>

          {/* Details */}
          <View style={s.card}>
            <InfoList title="What’s included" items={a.includes} />
            <InfoList title="Not included" items={a.excludes} icon="close" tone="muted" />
            <InfoList title="Materials supplied" items={a.materials} icon="circle" tone="muted" />
            <InfoList title="Accessibility" items={[a.accessibility]} icon="info" tone="muted" />
          </View>

          {/* Venue */}
          {v ? (
            <View style={s.card}>
              <Text style={s.cardTitle}>The venue</Text>
              <Tap onPress={() => router.push(`/date/venue/${v.id}`)} style={s.venueRow}>
                <Image source={{ uri: v.photo }} style={s.venueThumb} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.venueName}>{v.name}</Text>
                    {v.verified ? <Icon name="verified" size={15} color={C.accent} /> : null}
                  </View>
                  <Text style={s.venueMeta}>{v.address}</Text>
                  <Text style={s.venueMeta}>{v.hours}</Text>
                </View>
              </Tap>
              <Tap
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(v.mapsQuery)}`)}
                style={s.directions}
              >
                <Icon name="directions" size={17} color={C.pri} />
                <Text style={s.directionsText}>Get directions</Text>
              </Tap>
            </View>
          ) : null}

          {/* Policy + reviews */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Cancellation policy</Text>
            <Text style={s.policy}>{a.cancellation}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Reviews</Text>
            <Text style={s.policy}>No reviews yet. Reviews appear only after verified, completed bookings.</Text>
          </View>
        </View>
        <PreviewNotice />
      </ScrollView>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.footPrice}>{rupees(a.priceForTwo)}</Text>
          <Text style={s.footSub}>{a.priceForTwo ? 'total for two' : 'venue will quote'}</Text>
        </View>
        <Tap onPress={invite} style={s.cta} pressedStyle={{ opacity: 0.88 }}>
          <Icon name="send" size={16} color={C.white} />
          <Text style={s.ctaText}>{a.bookingMode === 'instant' ? 'Invite & book' : 'Invite & request'}</Text>
        </Tap>
      </View>
    </View>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Icon name={icon} size={18} color={C.accent} />
      <Text style={s.factValue}>{value}</Text>
      <Text style={s.factLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  heroEyebrow: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  heroTitle: { color: C.white, fontSize: 30, lineHeight: 36, marginTop: 4, ...serif },
  heroVenue: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 6 },
  thumb: { width: 96, height: 72, borderRadius: 14, backgroundColor: C.accentSoft },

  facts: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 22, paddingVertical: 16, marginTop: 16, ...cardShadow },
  factDivider: { width: 1, backgroundColor: C.line },
  factValue: { color: C.pri, fontSize: 15, fontWeight: '700', marginTop: 6 },
  factLabel: { color: C.muted, fontSize: 11.5, marginTop: 2 },

  body: { color: C.body, fontSize: 15, lineHeight: 23, marginTop: 18, paddingHorizontal: 4 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  cardTitle: { color: C.pri, fontSize: 18, ...serif },
  hint: { color: C.muted, fontSize: 12, marginTop: 10 },
  hintStrong: { color: C.body, fontSize: 13.5, lineHeight: 20 },

  venueRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  venueThumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: C.accentSoft },
  venueName: { color: C.pri, fontSize: 15.5, fontWeight: '600' },
  venueMeta: { color: C.muted, fontSize: 12.5, marginTop: 2, lineHeight: 17 },
  directions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, height: 44, borderRadius: 22, backgroundColor: C.accentSoft },
  directionsText: { color: C.pri, fontSize: 14, fontWeight: '600' },
  policy: { color: C.body, fontSize: 13.5, lineHeight: 20, marginTop: 8 },

  footer: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5' },
  footPrice: { color: C.pri, fontSize: 20, fontWeight: '700' },
  footSub: { color: C.muted, fontSize: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.pink, height: 52, paddingHorizontal: 22, borderRadius: 26 },
  ctaText: { color: C.white, fontSize: 15, fontWeight: '600' },
});
