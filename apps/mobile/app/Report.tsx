// Report and/or block someone. Private: the other person is never told who reported them.
import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, PrimaryButton, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { person } from '../src/store/people';
import { useConversations } from '../src/store/chats';
import { REPORT_REASONS, reportPerson, type ReportReason } from '../src/store/safety';

export default function Report() {
  return (
    <NunitoScope>
      <ReportInner />
    </NunitoScope>
  );
}

function ReportInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id = '' } = useLocalSearchParams<{ id?: string }>();
  const convo = useConversations().find((c) => c.id === id);
  const p = person(id);
  const name = convo?.name ?? p?.name ?? 'this person';
  const photo = convo?.photo ?? p?.photos[0];

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [block, setBlock] = useState(true);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!reason) return;
    reportPerson(id, reason, note.trim(), block);
    setSent(true);
  };

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <CelestialBackground />
        <View style={[s.done, { paddingTop: insets.top + 80 }]}>
          <View style={s.doneIcon}><Icon name="verified_user" size={40} color={C.white} /></View>
          <Text style={s.doneTitle}>Thank you for telling us</Text>
          <Text style={s.doneBody}>
            Our safety team reviews every report within 24 hours. {name} won’t know it was you.
            {block ? ` You won’t see ${name} again.` : ''}
          </Text>
        </View>
        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton label="Done" onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Private & confidential" title="Report" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <View style={s.who}>
            {photo ? <Image source={{ uri: photo }} style={s.avatar} /> : null}
            <Text style={s.whoText}>What happened with {name}?</Text>
          </View>

          <View style={{ gap: 10 }}>
            {REPORT_REASONS.map((r) => {
              const on = reason === r.id;
              return (
                <Tap key={r.id} onPress={() => setReason(r.id)} style={[s.reason, on ? s.reasonOn : null]}
                  accessibilityRole="radio" accessibilityState={{ checked: on }}>
                  <View style={[s.reasonIcon, on ? { backgroundColor: C.pink } : null]}>
                    <Icon name={r.icon} size={19} color={on ? C.white : C.pri} />
                  </View>
                  <Text style={s.reasonText}>{r.label}</Text>
                  <View style={[s.radio, on ? s.radioOn : null]}>{on ? <View style={s.radioDot} /> : null}</View>
                </Tap>
              );
            })}
          </View>

          {reason ? (
            <Card style={{ marginTop: 16 }}>
              <Text style={s.label}>Anything else we should know?</Text>
              <TextInput
                value={note}
                onChangeText={(t) => setNote(t.slice(0, 400))}
                placeholder="Optional. Dates, messages, anything that helps."
                placeholderTextColor="#A9B4C2"
                multiline
                style={s.input}
              />
            </Card>
          ) : null}

          <View style={s.blockRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.blockTitle}>Also block {name}</Text>
              <Text style={s.blockSub}>You won’t see each other again, and your chat is removed.</Text>
            </View>
            <Switch value={block} onValueChange={setBlock} trackColor={{ false: '#DCE6F0', true: C.pink }} thumbColor={C.white} ios_backgroundColor="#DCE6F0" />
          </View>

          <View style={s.urgent}>
            <Icon name="emergency" size={20} color={C.danger} />
            <Text style={s.urgentText}>In danger right now? Call 112 first. Then tell us.</Text>
          </View>
        </ScrollView>

        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton label="Send report" onPress={submit} disabled={!reason} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  who: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, marginTop: 2 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.accentSoft },
  whoText: { flex: 1, color: C.pri, fontSize: 18, fontWeight: '800' },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: C.white, borderWidth: 2, borderColor: 'transparent', ...cardShadow },
  reasonOn: { borderColor: C.pink, backgroundColor: '#FFF4F7' },
  reasonIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  reasonText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '700' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C9D5E3', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: C.pink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.pink },
  label: { color: C.pri, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  input: { backgroundColor: '#F6F9FC', borderRadius: 16, borderWidth: 1, borderColor: '#E3ECF5', padding: 14, minHeight: 100, fontSize: 15, color: C.pri, textAlignVertical: 'top', fontFamily: 'Nunito_600SemiBold' },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 16, borderRadius: 20, backgroundColor: C.white, ...cardShadow },
  blockTitle: { color: C.pri, fontSize: 15.5, fontWeight: '800' },
  blockSub: { color: C.muted, fontSize: 13, marginTop: 2, lineHeight: 18 },
  urgent: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, padding: 14, borderRadius: 18, backgroundColor: '#FBE4E6' },
  urgentText: { flex: 1, color: '#9B2C33', fontSize: 14, fontWeight: '700' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)' },
  done: { alignItems: 'center', paddingHorizontal: 32 },
  doneIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { color: C.pri, fontSize: 26, fontWeight: '900', marginTop: 20, textAlign: 'center' },
  doneBody: { color: C.body, fontSize: 15.5, lineHeight: 23, marginTop: 8, textAlign: 'center' },
});
