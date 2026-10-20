import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Switch, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '../../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../../../components/CelestialBackground';
import Icon from '../../../components/Icon';
import { C, ScreenHeader, Tap, PrimaryButton, cardShadow, serif } from '../../../components/prema-ui';
import { describe, submitReview, useDateState } from '../../../src/features/date/store';
import { MissingListing } from '../../../src/features/date/ui';
import type { Review } from '../../../src/features/date/types';

const DIMENSIONS: { key: keyof Omit<Review, 'note' | 'safetyConcern'>; label: string }[] = [
  { key: 'venue', label: 'Venue' },
  { key: 'activity', label: 'Activity' },
  { key: 'host', label: 'Host & staff' },
  { key: 'accuracy', label: 'Matched the listing' },
  { key: 'overall', label: 'Overall' },
];

const REPORT_REASONS = ['Made me feel unsafe', 'Inappropriate behaviour', 'Pressure or harassment', 'Venue safety issue', 'Something else'];

export default function ReviewScreen() {
  const { id, report } = useLocalSearchParams<{ id: string; report?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings } = useDateState();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');
  const [safety, setSafety] = useState(report === '1');
  const [reason, setReason] = useState<string | null>(null);

  const b = bookings.find((x) => x.id === id);
  if (!b) return <MissingListing />;
  const info = describe(b.subject);
  const complete = DIMENSIONS.every((d) => ratings[d.key]) || (safety && !!reason);

  const submit = () => {
    submitReview(b.id, {
      venue: ratings.venue ?? 0, activity: ratings.activity ?? 0, host: ratings.host ?? 0,
      accuracy: ratings.accuracy ?? 0, overall: ratings.overall ?? 0,
      note: [reason ? `[Report: ${reason}]` : '', note.trim()].filter(Boolean).join(' '), safetyConcern: safety,
    });
    Alert.alert(
      safety ? 'Report received' : 'Thank you',
      safety ? 'Our safety team will review this privately and may contact you. The other person is not told who reported.' : 'Your feedback is private and helps keep PREMA Date venues great.',
      [{ text: 'Done', onPress: () => router.back() }],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Private feedback" title="How was it?" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Text style={s.lede}>
            {info?.title} at {info?.venue?.name}. Only PREMA sees this — never the venue publicly or your match.
          </Text>

          <View style={s.card}>
            {DIMENSIONS.map((d) => (
              <View key={d.key} style={s.ratingRow}>
                <Text style={s.ratingLabel}>{d.label}</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Tap key={n} onPress={() => setRatings((r) => ({ ...r, [d.key]: n }))} accessibilityLabel={`${d.label} ${n} of 5`} style={{ padding: 2 }}>
                      <Icon name={(ratings[d.key] ?? 0) >= n ? 'star' : 'star_border'} size={26} color={(ratings[d.key] ?? 0) >= n ? '#E8B04B' : '#C9D6E3'} />
                    </Tap>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>Anything else?</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="What made it special, or what could be better…" placeholderTextColor="#A9B4C2" multiline style={s.input} maxLength={500} />
          </View>

          <View style={[s.card, safety ? { borderWidth: 1, borderColor: '#F3C9CE' } : null]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="shield" size={20} color={safety ? '#B4373F' : C.muted} />
              <View style={{ flex: 1 }}>
                <Text style={s.safetyTitle}>Report a safety concern</Text>
                <Text style={s.safetySub}>Kept separate from ratings and handled by our safety team.</Text>
              </View>
              <Switch value={safety} onValueChange={setSafety} trackColor={{ false: '#DCE6F0', true: '#E07B85' }} thumbColor={C.white} ios_backgroundColor="#DCE6F0" />
            </View>
            {safety ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {REPORT_REASONS.map((r) => (
                  <Tap key={r} onPress={() => setReason(r)} style={[s.reason, reason === r ? s.reasonOn : null]}>
                    <Text style={[s.reasonText, reason === r ? { color: C.white } : null]}>{r}</Text>
                  </Tap>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <PrimaryButton label={safety ? 'Send report' : 'Send feedback'} onPress={submit} disabled={!complete} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  lede: { color: C.body, fontSize: 14, lineHeight: 21, paddingHorizontal: 4 },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 16, ...cardShadow },
  cardTitle: { color: C.pri, fontSize: 18, marginBottom: 10, ...serif },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  ratingLabel: { color: C.pri, fontSize: 15, fontWeight: '500' },
  input: { backgroundColor: '#F6F9FC', borderRadius: 16, borderWidth: 1, borderColor: '#E3ECF5', padding: 14, minHeight: 96, fontSize: 15, color: C.pri, textAlignVertical: 'top', fontFamily: 'Nunito_600SemiBold' },
  safetyTitle: { color: C.pri, fontSize: 15.5, fontWeight: '600' },
  safetySub: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  reason: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FBEFF0' },
  reasonOn: { backgroundColor: '#B4373F' },
  reasonText: { color: '#8C2D34', fontSize: 13, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5' },
});
