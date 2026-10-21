// Leaving PREMA: offer a pause first, ask why (optional), then confirm by typing DELETE.
import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, Chip, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { updateProfile, useProfile } from '../src/store/profile';

const REASONS = ['I met someone', 'Taking a break', 'Not enough matches', 'Too expensive', 'Privacy concerns', 'Something else'];

export default function DeleteAccount() {
  return (
    <NunitoScope>
      <DeleteInner />
    </NunitoScope>
  );
}

function DeleteInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, paused } = useProfile();
  const [reason, setReason] = useState<string | null>(null);
  const [confirm, setConfirm] = useState('');
  const ok = confirm.trim().toUpperCase() === 'DELETE';

  const pauseInstead = () => {
    updateProfile({ paused: true });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Account" title="Delete account" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
          {reason === 'I met someone' ? (
            <View style={s.congrats}>
              <Icon name="favorite" size={22} color={C.pink} />
              <Text style={s.congratsText}>That’s wonderful, {name}. We’re so happy for you.</Text>
            </View>
          ) : null}

          {!paused ? (
            <Tap onPress={pauseInstead} style={s.pause} pressedStyle={{ opacity: 0.92 }} accessibilityRole="button">
              <View style={s.pauseIcon}><Icon name="pause_circle" size={24} color={C.white} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.pauseTitle}>Just need a break?</Text>
                <Text style={s.pauseSub}>Pause instead. You’ll be hidden, and your matches and chats stay safe.</Text>
              </View>
              <Icon name="chevron_right" size={22} color={C.pink} />
            </Tap>
          ) : null}

          <Card style={{ marginTop: 16 }}>
            <Text style={s.label}>Why are you leaving? <Text style={s.optional}>Optional</Text></Text>
            <View style={s.wrap}>
              {REASONS.map((r) => <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(reason === r ? null : r)} />)}
            </View>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Text style={s.label}>What gets deleted</Text>
            {['Your profile and photos', 'All your matches and chats', 'Saved dates and invitations', 'Your membership (no further charges)'].map((t) => (
              <View key={t} style={s.item}>
                <Icon name="close" size={16} color={C.danger} />
                <Text style={s.itemText}>{t}</Text>
              </View>
            ))}
            <Text style={s.note}>Upcoming paid dates are cancelled and refunded under each venue’s policy. Everything is erased within 30 days.</Text>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Text style={s.label}>Type DELETE to confirm</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="DELETE"
              placeholderTextColor="#C3CDD9"
              style={[s.input, ok ? { borderColor: C.danger } : null]}
              accessibilityLabel="Type DELETE to confirm"
            />
          </Card>
        </ScrollView>

        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Tap onPress={ok ? () => router.replace('/') : undefined} style={[s.delete, !ok ? { opacity: 0.4 } : null]}
            accessibilityRole="button" accessibilityState={{ disabled: !ok }}>
            <Text style={s.deleteText}>Delete my account</Text>
          </Tap>
          <Tap onPress={() => router.back()} style={{ paddingVertical: 12 }}>
            <Text style={s.keep}>Keep my account</Text>
          </Tap>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  congrats: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.pinkSoft, borderRadius: 18, padding: 14, marginBottom: 14 },
  congratsText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '800' },
  pause: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF4F7', borderWidth: 2, borderColor: '#FBD3DD', ...cardShadow },
  pauseIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  pauseTitle: { color: C.pri, fontSize: 16, fontWeight: '900' },
  pauseSub: { color: C.body, fontSize: 13.5, lineHeight: 19, marginTop: 2 },
  label: { color: C.pri, fontSize: 15.5, fontWeight: '800', marginBottom: 12 },
  optional: { color: C.muted, fontSize: 12.5, fontWeight: '600' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  itemText: { color: C.body, fontSize: 14.5, fontWeight: '600' },
  note: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 10 },
  input: { height: 52, backgroundColor: '#F6F9FC', borderRadius: 14, borderWidth: 1.5, borderColor: '#E3ECF5', paddingHorizontal: 14, fontSize: 18, letterSpacing: 4, color: C.pri, fontFamily: 'Nunito_800ExtraBold' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)', alignItems: 'center' },
  delete: { alignSelf: 'stretch', height: 54, borderRadius: 27, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: C.white, fontSize: 16, fontWeight: '900' },
  keep: { color: C.pri, fontSize: 15, fontWeight: '800' },
});
