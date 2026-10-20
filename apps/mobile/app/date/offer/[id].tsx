import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import { catalogue, rupees, dayLabel } from '../../../src/features/date/store';
import { DetailHero, InfoList, MissingListing, PreviewNotice, SlotPicker } from '../../../src/features/date/ui';

const STEPS = [
  ['send', 'Propose', 'Pick a time and invite your match.'],
  ['handshake', 'Both accept', 'Nothing is booked until you both say yes.'],
  ['qr_code_2', 'Get your pass', 'A single-use QR pass appears for your time window.'],
  ['local_cafe', 'Show at the café', 'Staff scan it — enjoy your coffee.'],
] as const;

export default function OfferDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const o = catalogue.offer(id ?? '');
  const [slotId, setSlotId] = useState<string | null>(null);
  if (!o) return <MissingListing />;
  const v = catalogue.venue(o.venueId);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <DetailHero photo={o.photo} subject={{ type: 'offer', id: o.id }} height={300}>
          <View style={s.tag}>
            <Icon name="local_cafe" size={12} color={C.pri} />
            <Text style={s.tagText}>PREMA Free Coffee</Text>
          </View>
          <Text style={s.heroTitle}>{o.title}</Text>
          <Text style={s.heroVenue}>{v?.name} · {v?.area}, {v?.city}</Text>
        </DetailHero>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Exact conditions */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Exactly what’s included</Text>
            <Text style={s.cond}>{o.conditions}</Text>
            <InfoList title="Eligible items" items={o.eligibleItems} />
            <View style={s.grid}>
              <Cell label="Minimum spend" value={o.minSpend ? rupees(o.minSpend) : 'None'} />
              <Cell label="Limit" value={`${o.perCoupleLimit} per couple`} />
              <Cell label="Valid from" value={new Date(o.startsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
              <Cell label="Expires" value={new Date(o.expiresOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
            </View>
          </View>

          {/* How it works */}
          <View style={s.card}>
            <Text style={s.cardTitle}>How it works</Text>
            {STEPS.map(([icon, t, b], i) => (
              <View key={t} style={s.step}>
                <View style={s.stepIcon}><Icon name={icon} size={18} color={C.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.stepTitle}>{i + 1}. {t}</Text>
                  <Text style={s.stepBody}>{b}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Times */}
          <View style={s.card}>
            <Text style={[s.cardTitle, { marginBottom: 12 }]}>Choose a time</Text>
            <SlotPicker slots={o.slots} value={slotId} onChange={setSlotId} />
            <Text style={s.hint}>{o.bookingRequirement}</Text>
          </View>

          {/* Policies */}
          <View style={s.card}>
            <InfoList title="Cancellation" items={[o.cancellation]} icon="event_available" tone="muted" />
            <InfoList title="No-shows" items={[o.noShow]} icon="info" tone="muted" />
            <InfoList title="Terms" items={o.terms} icon="circle" tone="muted" />
          </View>
        </View>
        <PreviewNotice />
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.footPrice}>Free</Text>
          <Text style={s.footSub}>{slotId ? `${dayLabel(o.slots.find((x) => x.id === slotId)!.startsAt)} selected` : 'Pick a time or choose later'}</Text>
        </View>
        <Tap
          onPress={() => router.push({ pathname: '/date/plan', params: { type: 'offer', id: o.id, ...(slotId ? { slot: slotId } : {}) } })}
          style={s.cta}
          pressedStyle={{ opacity: 0.88 }}
        >
          <Icon name="send" size={16} color={C.white} />
          <Text style={s.ctaText}>Propose a coffee date</Text>
        </Tap>
      </View>
    </View>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.cell}>
      <Text style={s.cellLabel}>{label}</Text>
      <Text style={s.cellValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  tag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 11, marginBottom: 10 },
  tagText: { color: C.pri, fontSize: 11.5, fontWeight: '700' },
  heroTitle: { color: C.white, fontSize: 30, lineHeight: 36, ...serif },
  heroVenue: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 6 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  cardTitle: { color: C.pri, fontSize: 18, ...serif },
  cond: { color: C.body, fontSize: 14.5, lineHeight: 21, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  cell: { width: '47%', flexGrow: 1, backgroundColor: '#F6F9FC', borderRadius: 14, padding: 12 },
  cellLabel: { color: C.muted, fontSize: 11.5, fontWeight: '600' },
  cellValue: { color: C.pri, fontSize: 15, fontWeight: '700', marginTop: 3 },
  step: { flexDirection: 'row', gap: 12, marginTop: 14, alignItems: 'flex-start' },
  stepIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { color: C.pri, fontSize: 15, fontWeight: '600' },
  stepBody: { color: C.muted, fontSize: 13, marginTop: 2 },
  hint: { color: C.muted, fontSize: 12.5, marginTop: 12, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5' },
  footPrice: { color: C.pri, fontSize: 20, fontWeight: '700' },
  footSub: { color: C.muted, fontSize: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.pink, height: 52, paddingHorizontal: 20, borderRadius: 26 },
  ctaText: { color: C.white, fontSize: 15, fontWeight: '600' },
});
