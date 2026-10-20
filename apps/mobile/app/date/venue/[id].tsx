import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import { catalogue, whenLabel, rupees } from '../../../src/features/date/store';
import { ActivityCard, DetailHero, MissingListing, PreviewNotice } from '../../../src/features/date/ui';

export default function VenueDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const v = catalogue.venue(id ?? '');
  if (!v) return <MissingListing />;
  const activities = catalogue.activities.filter((a) => a.venueId === v.id);
  const offers = catalogue.offers.filter((o) => o.venueId === v.id);
  const events = catalogue.events.filter((e) => e.venueId === v.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <DetailHero photo={v.photo} height={280}>
          <Text style={s.kind}>{v.kind}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={s.title}>{v.name}</Text>
            {v.verified ? <Icon name="verified" size={20} color={C.white} /> : null}
          </View>
          <Text style={s.area}>{v.area}, {v.city}</Text>
        </DetailHero>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={s.card}>
            <Row icon="location_on" text={v.address} />
            <Row icon="schedule" text={v.hours} />
            <Row icon="phone" text={v.phone} />
            <Row icon="info" text={v.accessibility} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Tap onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(v.mapsQuery)}`)} style={s.btn}>
                <Icon name="directions" size={17} color={C.pri} />
                <Text style={s.btnText}>Directions</Text>
              </Tap>
              <Tap onPress={() => Linking.openURL(`tel:${v.phone.replace(/\s/g, '')}`)} style={s.btn}>
                <Icon name="phone" size={17} color={C.pri} />
                <Text style={s.btnText}>Call venue</Text>
              </Tap>
            </View>
          </View>

          {offers.map((o) => (
            <Tap key={o.id} onPress={() => router.push(`/date/offer/${o.id}`)} style={s.offer}>
              <Icon name="local_cafe" size={20} color={C.accent} />
              <View style={{ flex: 1 }}>
                <Text style={s.offerTitle}>{o.title}</Text>
                <Text style={s.offerSub}>PREMA Free Coffee · {o.minSpend ? `min. spend ${rupees(o.minSpend)}` : 'no minimum spend'}</Text>
              </View>
              <Icon name="chevron_right" size={22} color={C.muted} />
            </Tap>
          ))}

          {activities.length ? <Text style={s.section}>Experiences here</Text> : null}
          <View style={{ gap: 16 }}>
            {activities.map((a) => <ActivityCard key={a.id} activity={a} />)}
          </View>

          {events.length ? <Text style={s.section}>Upcoming events</Text> : null}
          {events.map((e) => (
            <Tap key={e.id} onPress={() => router.push(`/date/event/${e.id}`)} style={s.offer}>
              <Icon name="event_available" size={20} color={C.accent} />
              <View style={{ flex: 1 }}>
                <Text style={s.offerTitle}>{e.title}</Text>
                <Text style={s.offerSub}>{whenLabel(e.startsAt)}</Text>
              </View>
              <Icon name="chevron_right" size={22} color={C.muted} />
            </Tap>
          ))}
        </View>
        <PreviewNotice />
      </ScrollView>
    </View>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={s.row}>
      <Icon name={icon} size={17} color={C.accent} />
      <Text style={s.rowText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  kind: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: C.white, fontSize: 30, lineHeight: 36, marginTop: 4, flexShrink: 1, ...serif },
  area: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  row: { flexDirection: 'row', gap: 10, paddingVertical: 6, alignItems: 'flex-start' },
  rowText: { color: C.body, fontSize: 14, lineHeight: 20, flex: 1 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: 22, backgroundColor: C.accentSoft },
  btnText: { color: C.pri, fontSize: 14, fontWeight: '600' },
  offer: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 20, padding: 16, marginTop: 12, ...cardShadow },
  offerTitle: { color: C.pri, fontSize: 15.5, fontWeight: '600' },
  offerSub: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  section: { color: C.pri, fontSize: 21, marginTop: 28, marginBottom: 12, marginLeft: 4, ...serif },
});
