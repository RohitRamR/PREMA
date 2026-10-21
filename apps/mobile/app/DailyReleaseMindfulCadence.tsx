// Curated introductions: how many matches arrive, when, and a quiet-hours curfew. Pause lives here too.
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, Chip, PrimaryButton, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { updateProfile, useProfile } from '../src/store/profile';
import { goBack } from '../components/nav';

const RHYTHMS = [
  { id: 'slow', title: 'The Slow Horizon', sub: '2 deeply aligned matches a day', icon: 'spa' },
  { id: 'steady', title: 'The Steady Rhythm', sub: '3 curated matches a day at 9:00 AM', icon: 'wb_sunny' },
  { id: 'weekend', title: 'Weekend Sabbatical', sub: 'Matches only Friday to Sunday', icon: 'weekend' },
] as const;
const TIMES = ['7:00 AM', '9:00 AM', '12:00 PM', '6:00 PM'];
const CURFEWS = ['Off', '9:00 PM', '10:00 PM', '11:00 PM'];

export default function MindfulCadence() {
  return (
    <NunitoScope>
      <CadenceInner />
    </NunitoScope>
  );
}

function CadenceInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useProfile();
  const [rhythm, setRhythm] = useState<(typeof RHYTHMS)[number]['id']>('steady');
  const [time, setTime] = useState('9:00 AM');
  const [curfew, setCurfew] = useState('10:00 PM');

  const save = () => {
    updateProfile((p) => ({ settings: { ...p.settings, pushIntros: true } }));
    Alert.alert('Rhythm saved', `${RHYTHMS.find((r) => r.id === rhythm)!.sub}${rhythm === 'weekend' ? '' : `, arriving at ${time}`}.`);
    goBack(router);
  };

  const pauseFor = (days: number) => {
    updateProfile({ paused: true });
    Alert.alert('Paused', `You’re hidden for ${days} days. Your matches and chats stay safe.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Mindful cadence" title="Curated introductions" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <Text style={s.section}>Your rhythm</Text>
        <View style={{ gap: 10 }}>
          {RHYTHMS.map((r) => {
            const on = rhythm === r.id;
            return (
              <Tap key={r.id} onPress={() => setRhythm(r.id)} style={[s.option, on ? s.optionOn : null]}
                accessibilityRole="radio" accessibilityState={{ checked: on }}>
                <View style={[s.optIcon, on ? { backgroundColor: C.pink } : null]}><Icon name={r.icon} size={21} color={on ? C.white : C.pri} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.optTitle}>{r.title}</Text>
                  <Text style={s.optSub}>{r.sub}</Text>
                </View>
                <View style={[s.radio, on ? s.radioOn : null]}>{on ? <View style={s.radioDot} /> : null}</View>
              </Tap>
            );
          })}
        </View>

        {rhythm !== 'weekend' ? (
          <Card style={{ marginTop: 16 }}>
            <Text style={s.label}>Arrives at</Text>
            <View style={s.wrap}>{TIMES.map((t) => <Chip key={t} label={t} selected={time === t} onPress={() => setTime(t)} />)}</View>
          </Card>
        ) : null}

        <Card style={{ marginTop: 16 }}>
          <Text style={s.label}>Quiet hours</Text>
          <Text style={s.sub}>No notifications after this time.</Text>
          <View style={s.wrap}>{CURFEWS.map((t) => <Chip key={t} label={t} selected={curfew === t} onPress={() => setCurfew(t)} />)}</View>
        </Card>

        <Text style={s.section}>Need a pause?</Text>
        {me.paused ? (
          <View style={s.paused}>
            <Icon name="pause_circle" size={22} color={C.pink} />
            <Text style={s.pausedText}>Your profile is paused.</Text>
            <Tap onPress={() => updateProfile({ paused: false })} style={s.undo}><Text style={s.undoText}>Resume</Text></Tap>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tap onPress={() => pauseFor(7)} style={s.pauseBtn}><Icon name="pause" size={18} color={C.pri} /><Text style={s.pauseText}>Pause 7 days</Text></Tap>
            <Tap onPress={() => Alert.alert('Pause for how long?', undefined, [
              { text: '3 days', onPress: () => pauseFor(3) },
              { text: '14 days', onPress: () => pauseFor(14) },
              { text: '30 days', onPress: () => pauseFor(30) },
              { text: 'Cancel', style: 'cancel' },
            ])} style={s.pauseBtn}><Icon name="event" size={18} color={C.pri} /><Text style={s.pauseText}>Custom pause</Text></Tap>
          </View>
        )}
      </ScrollView>
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save rhythm" onPress={save} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 18, marginBottom: 10, marginLeft: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: C.white, borderWidth: 2, borderColor: 'transparent', ...cardShadow },
  optionOn: { borderColor: C.pink, backgroundColor: '#FFF4F7' },
  optIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  optTitle: { color: C.pri, fontSize: 16, fontWeight: '800' },
  optSub: { color: C.muted, fontSize: 13, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C9D5E3', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: C.pink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.pink },
  label: { color: C.pri, fontSize: 15.5, fontWeight: '800', marginBottom: 10 },
  sub: { color: C.muted, fontSize: 13, marginTop: -6, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pauseBtn: { flex: 1, height: 52, borderRadius: 26, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, ...cardShadow },
  pauseText: { color: C.pri, fontSize: 14.5, fontWeight: '800' },
  paused: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, backgroundColor: C.pinkSoft },
  pausedText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '800' },
  undo: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: C.white },
  undoText: { color: C.pink, fontSize: 13.5, fontWeight: '900' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)' },
});
