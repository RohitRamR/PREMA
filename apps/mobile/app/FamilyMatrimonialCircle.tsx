// Family circle: trusted family members you choose to involve, and exactly what they can see.
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, PrimaryButton, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';

type Member = { name: string; relation: string };

const SCOPES = [
  { id: 'profiles', title: 'See profiles I shortlist', sub: 'Only people you choose to share' },
  { id: 'compat', title: 'See compatibility reports', sub: 'Values and family alignment, never chats' },
  { id: 'dates', title: 'Know when I have a date', sub: 'Time and venue, for safety' },
] as const;

export default function FamilyCircle() {
  return (
    <NunitoScope>
      <FamilyInner />
    </NunitoScope>
  );
}

function FamilyInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<Member[]>([
    { name: 'Aarav', relation: 'Brother' },
    { name: 'Priya', relation: 'Friend' },
  ]);
  const [scopes, setScopes] = useState<Record<string, boolean>>({ profiles: true, compat: false, dates: true });
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('');

  const add = () => {
    if (!newName.trim()) return;
    setMembers((m) => [...m, { name: newName.trim(), relation: newRel.trim() || 'Family' }]);
    setNewName(''); setNewRel(''); setAdding(false);
  };

  const remove = (m: Member) => Alert.alert(`Remove ${m.name}?`, 'They’ll stop seeing anything you’ve shared.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => setMembers((all) => all.filter((x) => x !== m)) },
  ]);

  const save = () => {
    Alert.alert('Family circle saved', `${members.length} trusted ${members.length === 1 ? 'person' : 'people'} · ${Object.values(scopes).filter(Boolean).length} permissions on.`);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Involve family, your way" title="Family circle" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={s.intro}>
          <Icon name="lock" size={18} color={C.pink} />
          <Text style={s.introText}>Family never sees your chats. You decide everything they can see.</Text>
        </View>

        <Text style={s.section}>Trusted members</Text>
        <Card>
          {members.map((m, i) => (
            <View key={`${m.name}-${i}`} style={[s.member, s.divider]}>
              <View style={s.avatar}><Text style={s.avatarText}>{m.name[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{m.name}</Text>
                <Text style={s.sub}>{m.relation}</Text>
              </View>
              <Tap onPress={() => remove(m)} style={s.removeBtn} accessibilityLabel={`Remove ${m.name}`}>
                <Icon name="close" size={18} color={C.muted} />
              </Tap>
            </View>
          ))}
          {adding ? (
            <View style={{ gap: 10, paddingTop: 12 }}>
              <TextInput value={newName} onChangeText={setNewName} placeholder="Name" placeholderTextColor="#A9B4C2" style={s.input} autoFocus />
              <TextInput value={newRel} onChangeText={setNewRel} placeholder="Relation, e.g. Mother" placeholderTextColor="#A9B4C2" style={s.input} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Tap onPress={() => setAdding(false)} style={[s.smallBtn, { backgroundColor: C.accentSoft }]}><Text style={[s.smallBtnText, { color: C.pri }]}>Cancel</Text></Tap>
                <Tap onPress={add} style={[s.smallBtn, !newName.trim() ? { opacity: 0.5 } : null]}><Text style={s.smallBtnText}>Add</Text></Tap>
              </View>
            </View>
          ) : (
            <Tap onPress={() => setAdding(true)} style={s.addRow}>
              <Icon name="add_circle" size={22} color={C.pink} />
              <Text style={s.link}>Add a trusted family member</Text>
            </Tap>
          )}
        </Card>

        <Text style={s.section}>What they can see</Text>
        <Card>
          {SCOPES.map((sc, i) => (
            <View key={sc.id} style={[s.member, i < SCOPES.length - 1 ? s.divider : null]}>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{sc.title}</Text>
                <Text style={s.sub}>{sc.sub}</Text>
              </View>
              <Switch value={!!scopes[sc.id]} onValueChange={(v) => setScopes((x) => ({ ...x, [sc.id]: v }))}
                trackColor={{ false: '#DCE6F0', true: C.pink }} thumbColor={C.white} ios_backgroundColor="#DCE6F0" />
            </View>
          ))}
        </Card>

        <Tap onPress={() => router.push('/CompatibilityBreakdown')} style={s.report}>
          <Icon name="insights" size={20} color={C.pink} />
          <Text style={s.reportText}>Preview the family compatibility report</Text>
          <Icon name="chevron_right" size={22} color={C.muted} />
        </Tap>
      </ScrollView>
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save family circle" onPress={save} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  intro: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, backgroundColor: C.pinkSoft },
  introText: { flex: 1, color: C.pri, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 20, marginBottom: 10, marginLeft: 4 },
  member: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.white, fontSize: 17, fontWeight: '900' },
  name: { color: C.pri, fontSize: 15.5, fontWeight: '800' },
  sub: { color: C.muted, fontSize: 13, marginTop: 2 },
  removeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F6FB', alignItems: 'center', justifyContent: 'center' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 14 },
  link: { color: C.pink, fontSize: 14.5, fontWeight: '800' },
  input: { height: 48, backgroundColor: '#F6F9FC', borderRadius: 14, borderWidth: 1, borderColor: '#E3ECF5', paddingHorizontal: 14, fontSize: 15, color: C.pri, fontFamily: 'Nunito_600SemiBold' },
  smallBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  smallBtnText: { color: C.white, fontSize: 14.5, fontWeight: '800' },
  report: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, padding: 16, borderRadius: 20, backgroundColor: C.white, ...cardShadow },
  reportText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '800' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)' },
});
