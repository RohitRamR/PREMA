// Safety & check-in: verification status, trusted contacts, and tools for during a date.
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { describe, isUpcoming, useDateState, whenLabel } from '../src/features/date/store';

const CONTACTS = ['Aarav (brother)', 'Priya (friend)'];

export default function SafetyCheckIn() {
  return (
    <NunitoScope>
      <SafetyInner />
    </NunitoScope>
  );
}

function SafetyInner() {
  const router = useRouter();
  const { bookings } = useDateState();
  const next = bookings.filter((b) => isUpcoming(b) && b.status === 'confirmed')
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0];
  const [safeMode, setSafeMode] = useState(false);
  const [lastPing, setLastPing] = useState<number | null>(null);

  const ping = () => {
    setLastPing(Date.now());
    Alert.alert('“All is well” sent', `${CONTACTS.join(' and ')} know you’re okay.`);
  };

  const exitCall = () => Alert.alert('Discreet exit call', 'Your phone will ring in 2 minutes with a polite reason to leave.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Schedule call' },
  ]);

  const wrapUp = () => Alert.alert('Check out of your date?', 'We’ll let your trusted contacts know you’ve left safely.', [
    { text: 'Not yet', style: 'cancel' },
    { text: 'Check out', onPress: () => { setSafeMode(false); Alert.alert('Checked out', 'Glad you’re safe. How did it go?'); } },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Your sanctuary" title="Safety & check-in" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={s.verifyRow}>
            <View style={s.verifyIcon}><Icon name="verified_user" size={24} color={C.white} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>You’re verified</Text>
              <Text style={s.sub}>Aadhaar and work email confirmed. Your ID is never shown.</Text>
            </View>
          </View>
        </Card>

        <View style={[s.safeCard, safeMode ? s.safeCardOn : null]}>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, safeMode ? { color: C.white } : null]}>Safe date mode</Text>
            <Text style={[s.sub, safeMode ? { color: 'rgba(255,255,255,0.9)' } : null]}>
              {safeMode ? `Sharing your date details with ${CONTACTS.length} trusted contacts.` : 'Share where and when you’re meeting with people you trust.'}
            </Text>
          </View>
          <Switch value={safeMode} onValueChange={setSafeMode} trackColor={{ false: '#DCE6F0', true: '#FFFFFF66' }} thumbColor={C.white} ios_backgroundColor="#DCE6F0" />
        </View>

        <Text style={s.section}>During your date</Text>
        <View style={{ gap: 10 }}>
          <Action icon="favorite" title="“All is well” ping" sub={lastPing ? 'Sent just now' : `Updates ${CONTACTS.join(' & ')}`} onPress={ping} />
          <Action icon="call" title="Discreet exit call" sub="An automated, polite reason to leave" onPress={exitCall} />
          {next ? (
            <Action icon="qr_code_2" title="Show your pass" sub={`${describe(next.subject)?.title} · ${whenLabel(next.startsAt)}`} onPress={() => router.push(`/date/pass/${next.id}`)} />
          ) : null}
          <Action icon="logout" title="Wrap up & check out" sub="Tell your contacts you’ve left safely" onPress={wrapUp} />
        </View>

        <Text style={s.section}>Trusted contacts</Text>
        <Card>
          {CONTACTS.map((c, i) => (
            <View key={c} style={[s.contact, i < CONTACTS.length - 1 ? s.divider : null]}>
              <View style={s.contactIcon}><Icon name="person" size={18} color={C.pink} /></View>
              <Text style={s.contactName}>{c}</Text>
            </View>
          ))}
          <Tap onPress={() => router.push('/FamilyMatrimonialCircle')} style={{ paddingTop: 12 }}>
            <Text style={s.link}>Manage trusted contacts →</Text>
          </Tap>
        </Card>

        <Tap onPress={() => Linking.openURL('tel:112')} style={s.sos} accessibilityRole="button">
          <Icon name="emergency" size={20} color={C.white} />
          <Text style={s.sosText}>Emergency · Call 112</Text>
        </Tap>
      </ScrollView>
    </View>
  );
}

function Action({ icon, title, sub, onPress }: { icon: string; title: string; sub: string; onPress: () => void }) {
  return (
    <Tap onPress={onPress} style={s.action} pressedStyle={{ opacity: 0.92 }}>
      <View style={s.actionIcon}><Icon name={icon} size={20} color={C.pink} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.actionTitle}>{title}</Text>
        <Text style={s.sub} numberOfLines={1}>{sub}</Text>
      </View>
      <Icon name="chevron_right" size={22} color={C.muted} />
    </Tap>
  );
}

const s = StyleSheet.create({
  verifyRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  verifyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3BB273', alignItems: 'center', justifyContent: 'center' },
  title: { color: C.pri, fontSize: 16.5, fontWeight: '900' },
  sub: { color: C.muted, fontSize: 13.5, marginTop: 2, lineHeight: 19 },
  safeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: C.white, ...cardShadow },
  safeCardOn: { backgroundColor: C.pink },
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 10, marginLeft: 4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: C.white, ...cardShadow },
  actionIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: C.pri, fontSize: 15.5, fontWeight: '800' },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  contactIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  contactName: { color: C.pri, fontSize: 15, fontWeight: '700' },
  link: { color: C.pink, fontSize: 14, fontWeight: '800' },
  sos: { marginTop: 22, height: 54, borderRadius: 27, backgroundColor: C.danger, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sosText: { color: C.white, fontSize: 16, fontWeight: '900' },
});
