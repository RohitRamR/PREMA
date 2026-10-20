import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Text, { NunitoScope } from '../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import {
  C, Card, Label, Chip, ScreenHeader, PrimaryButton, ToggleRow, Tap, serif,
} from '../components/prema-ui';
import { useProfile, updateProfile, INTENT_OPTIONS } from '../src/store/profile';

const DISTANCES = [10, 25, 50, 100];
const CITIES = ['Bengaluru', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi NCR', 'Kochi'];
const AGE_FLOOR = 21;
const AGE_CEIL = 60;

// Renders in Nunito like the rest of the profile area.
export default function DiscoveryPreferences() {
  return (
    <NunitoScope>
      <DiscoveryPreferencesInner />
    </NunitoScope>
  );
}

function DiscoveryPreferencesInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { discovery } = useProfile();

  const [distanceKm, setDistance] = useState(discovery.distanceKm);
  const [ageMin, setAgeMin] = useState(discovery.ageMin);
  const [ageMax, setAgeMax] = useState(discovery.ageMax);
  const [cities, setCities] = useState(discovery.cities);
  const [intents, setIntents] = useState(discovery.intents);
  const [verifiedOnly, setVerifiedOnly] = useState(discovery.verifiedOnly);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const save = () => {
    updateProfile({ discovery: { distanceKm, ageMin, ageMax, cities, intents, verifiedOnly } });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Who you meet" title="Discovery & distance" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card>
          <Label>Distance</Label>
          <Text style={s.bigValue}>Within {distanceKm} km</Text>
          <View style={s.segment}>
            {DISTANCES.map((d) => {
              const on = d === distanceKm;
              return (
                <Tap key={d} onPress={() => setDistance(d)} style={[s.segItem, on ? s.segOn : null]}
                  accessibilityRole="button" accessibilityState={{ selected: on }}>
                  <Text style={[s.segText, on ? { color: C.white } : null]}>{d} km</Text>
                </Tap>
              );
            })}
          </View>
        </Card>

        <Card>
          <Label>Age range</Label>
          <Text style={s.bigValue}>{ageMin} – {ageMax}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Stepper label="From" value={ageMin}
              onDec={() => setAgeMin((v) => Math.max(AGE_FLOOR, v - 1))}
              onInc={() => setAgeMin((v) => Math.min(ageMax, v + 1))} />
            <Stepper label="To" value={ageMax}
              onDec={() => setAgeMax((v) => Math.max(ageMin, v - 1))}
              onInc={() => setAgeMax((v) => Math.min(AGE_CEIL, v + 1))} />
          </View>
        </Card>

        <Card>
          <Label>Cities</Label>
          <View style={s.wrap}>
            {CITIES.map((c) => (
              <Chip key={c} label={c} selected={cities.includes(c)} onPress={() => toggle(cities, setCities, c)} />
            ))}
          </View>
        </Card>

        <Card>
          <Label>Their intention</Label>
          <View style={s.wrap}>
            {INTENT_OPTIONS.map((o) => (
              <Chip key={o} label={o} selected={intents.includes(o)} onPress={() => toggle(intents, setIntents, o)} />
            ))}
          </View>
        </Card>

        <Card style={{ paddingVertical: 4, paddingHorizontal: 0 }}>
          <ToggleRow icon="verified_user" title="Verified profiles only" sub="Aadhaar or work-verified members"
            value={verifiedOnly} onValueChange={setVerifiedOnly} last />
        </Card>

        <Text style={s.note}>
          Wider preferences mean more thoughtful introductions — we’ll still never show more than your daily cadence.
        </Text>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save preferences" icon="check" onPress={save} disabled={cities.length === 0 || intents.length === 0} />
      </View>
    </View>
  );
}

function Stepper({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <View style={s.stepper}>
      <Text style={s.stepLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tap onPress={onDec} style={s.stepBtn} accessibilityLabel={`Decrease ${label}`}>
          <Icon name="remove" size={18} color={C.pri} />
        </Tap>
        <Text style={s.stepValue}>{value}</Text>
        <Tap onPress={onInc} style={s.stepBtn} accessibilityLabel={`Increase ${label}`}>
          <Icon name="add" size={18} color={C.pri} />
        </Tap>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bigValue: { color: C.pri, fontSize: 24, marginTop: -2, marginBottom: 14, ...serif },
  segment: { flexDirection: 'row', backgroundColor: '#F2F6FB', borderRadius: 22, padding: 4 },
  segItem: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.pri },
  segText: { color: C.body, fontSize: 14, fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stepper: { flex: 1, backgroundColor: '#F6F9FC', borderRadius: 18, padding: 14 },
  stepLabel: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  stepBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E3ECF5',
  },
  stepValue: { color: C.pri, fontSize: 22, fontWeight: '700' },
  note: { color: C.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', paddingHorizontal: 12 },
  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(241,247,253,0.96)', borderTopWidth: 1, borderTopColor: '#E3ECF5',
  },
});
