import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Text, { NunitoScope } from '../components/PremaText';
import { useRouter } from 'expo-router';
import CelestialBackground from '../components/CelestialBackground';
import {
  C, Card, SectionLabel, Row, ToggleRow, ScreenHeader, Tap,
} from '../components/prema-ui';
import { useProfile, updateProfile, type Profile } from '../src/store/profile';

// Renders in Nunito like the rest of the profile area.
export default function Settings() {
  return (
    <NunitoScope>
      <SettingsInner />
    </NunitoScope>
  );
}

function SettingsInner() {
  const router = useRouter();
  const me = useProfile();
  const { settings } = me;
  const set = (k: keyof Profile['settings']) => (v: boolean) =>
    updateProfile((p) => ({ settings: { ...p.settings, [k]: v } }));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Your sanctuary" title="Settings" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <SectionLabel>Account</SectionLabel>
        <Card style={s.list}>
          <Row icon="phone" title="Phone number" sub={`+91 ${me.phone.slice(0, 2)}•••• ••${me.phone.slice(-3)}`} onPress={() => router.push({ pathname: '/AccountDetails', params: { focus: 'phone' } })} />
          <Row icon="message" title="Email" sub={me.email || 'Add a recovery email'} onPress={() => router.push({ pathname: '/AccountDetails', params: { focus: 'email' } })} />
          <Row icon="workspace_premium" title="Membership" sub="Founding Member · Tier I" onPress={() => router.push('/PremaPlusMembership')} last />
        </Card>

        <SectionLabel>Notifications</SectionLabel>
        <Card style={s.list}>
          <ToggleRow icon="auto_awesome" title="Daily introductions" sub="Your curated matches at 9:00 AM" value={settings.pushIntros} onValueChange={set('pushIntros')} />
          <ToggleRow icon="chat_bubble" title="New messages" sub="Only from mutual connections" value={settings.pushMessages} onValueChange={set('pushMessages')} />
          <ToggleRow icon="event_available" title="Date reminders" sub="Check-ins before and after dates" value={settings.dateReminders} onValueChange={set('dateReminders')} last />
        </Card>

        <SectionLabel>Privacy</SectionLabel>
        <Card style={s.list}>
          <ToggleRow icon="visibility" title="Show my age" value={settings.showAge} onValueChange={set('showAge')} />
          <ToggleRow icon="done_all" title="Read receipts" sub="Let matches see when you’ve read a note" value={settings.readReceipts} onValueChange={set('readReceipts')} />
          <ToggleRow icon="visibility_off" title="Incognito mode" sub="Only people you like can see you" value={settings.incognito} onValueChange={set('incognito')} />
          <Row icon="shield" title="Safety & verification" sub="Aadhaar & work verified" onPress={() => router.push('/DateCheckInSafety')} last />
        </Card>

        <SectionLabel>Support</SectionLabel>
        <Card style={s.list}>
          <Row icon="auto_awesome" title="How Prema matches" sub="Cosmo & Heart ratings explained" onPress={() => router.push('/HowPremaMatches')} />
          <Row icon="help" title="Help centre" onPress={() => router.push({ pathname: '/Help', params: { topic: 'help' } })} />
          <Row icon="info" title="Community guidelines" onPress={() => router.push({ pathname: '/Help', params: { topic: 'guidelines' } })} />
          <Row icon="lock" title="Privacy policy & terms" onPress={() => router.push({ pathname: '/Help', params: { topic: 'privacy' } })} last />
        </Card>

        <Tap
          style={s.logout}
          onPress={() => Alert.alert('Log out of PREMA?', 'Your matches and conversations will be here when you return.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: () => router.replace('/') },
          ])}
        >
          <Text style={s.logoutText}>Log out</Text>
        </Tap>

        <Tap
          style={s.delete}
          onPress={() => router.push('/DeleteAccount')}
        >
          <Text style={s.deleteText}>Delete account</Text>
        </Tap>

        <Text style={s.version}>PREMA · v2.4.1</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  list: { paddingVertical: 4, paddingHorizontal: 0 },
  logout: {
    marginTop: 8, height: 52, borderRadius: 26, backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E3ECF5',
  },
  logoutText: { color: C.pri, fontSize: 15, fontWeight: '700' },
  delete: { marginTop: 10, height: 44, alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: C.danger, fontSize: 14, fontWeight: '600' },
  version: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
