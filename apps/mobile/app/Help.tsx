// Help centre, community guidelines and privacy, in one calm reading screen.
// ?topic=help | guidelines | privacy picks the starting tab.
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';

type Topic = 'help' | 'guidelines' | 'privacy';

const FAQ = [
  { q: 'How are my daily introductions chosen?', a: 'Every morning at 9:00 AM we pick a few people whose values, intent and rhythm line up with yours. No endless swiping.' },
  { q: 'Why can’t I message someone?', a: 'Chat opens once you’ve both liked each other. Until then, a note travels with your like.' },
  { q: 'How does splitting a date work?', a: 'After you both accept an invite, choose “Split it in two”. Each of you pays half; the date confirms once both halves are in.' },
  { q: 'How do I pause my profile?', a: 'Profile → pause. You stay hidden from new people but keep your chats.' },
  { q: 'I was charged but my date isn’t confirmed', a: 'Payments verify within a few minutes. If it’s been longer, contact us below with your booking.' },
];

const GUIDELINES = [
  { icon: 'favorite', title: 'Be kind, be real', body: 'Use your own recent photos and honest details. Kindness first, always.' },
  { icon: 'handshake', title: 'Consent matters', body: 'Respect a “no” or a slow reply. Never pressure anyone to meet, share or pay.' },
  { icon: 'shield', title: 'Meet safely', body: 'First dates happen at verified venues. Share your plans with someone you trust.' },
  { icon: 'block', title: 'Zero tolerance', body: 'Harassment, hate, scams and anyone under 18 are removed immediately.' },
  { icon: 'report', title: 'Speak up', body: 'Report anything that feels off. Reports are private and reviewed within 24 hours.' },
];

const PRIVACY = [
  { icon: 'lock', title: 'Your data stays yours', body: 'We never sell your data or show ads based on it.' },
  { icon: 'visibility_off', title: 'You control who sees you', body: 'Hide your age, pause your profile or go incognito any time in Settings.' },
  { icon: 'verified_user', title: 'Verification is private', body: 'ID checks confirm you’re real. Your ID is never shown to anyone.' },
  { icon: 'delete', title: 'Leave cleanly', body: 'Deleting your account erases your profile, photos and chats within 30 days.' },
];

export default function Help() {
  return (
    <NunitoScope>
      <HelpInner />
    </NunitoScope>
  );
}

function HelpInner() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topic?: Topic }>();
  const [topic, setTopic] = useState<Topic>(params.topic ?? 'help');
  const [open, setOpen] = useState<number | null>(0);

  const TABS: [Topic, string][] = [['help', 'Help'], ['guidelines', 'Guidelines'], ['privacy', 'Privacy']];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="We’re here for you" title="Help & policies" />

      <View style={s.segment}>
        {TABS.map(([k, label]) => (
          <Tap key={k} onPress={() => setTopic(k)} style={[s.segItem, topic === k ? s.segOn : null]}
            accessibilityRole="tab" accessibilityState={{ selected: topic === k }}>
            <Text style={[s.segText, topic === k ? { color: C.pri } : null]}>{label}</Text>
          </Tap>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        {topic === 'help' ? (
          <>
            <View style={s.card}>
              {FAQ.map((f, i) => {
                const on = open === i;
                return (
                  <Tap key={f.q} onPress={() => setOpen(on ? null : i)} style={[s.faq, i < FAQ.length - 1 ? s.divider : null]}
                    accessibilityState={{ expanded: on }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={s.q}>{f.q}</Text>
                      <Icon name={on ? 'remove' : 'add'} size={20} color={C.pink} />
                    </View>
                    {on ? <Text style={s.a}>{f.a}</Text> : null}
                  </Tap>
                );
              })}
            </View>

            <Text style={s.section}>Still need help?</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Tap onPress={() => Linking.openURL('mailto:care@prema.app')} style={s.contact}>
                <Icon name="mail" size={22} color={C.pink} />
                <Text style={s.contactTitle}>Email us</Text>
                <Text style={s.contactSub}>Reply within a day</Text>
              </Tap>
              <Tap onPress={() => router.push('/Report')} style={s.contact}>
                <Icon name="report" size={22} color={C.pink} />
                <Text style={s.contactTitle}>Report a concern</Text>
                <Text style={s.contactSub}>Private & reviewed</Text>
              </Tap>
            </View>
          </>
        ) : (
          <View style={s.card}>
            {(topic === 'guidelines' ? GUIDELINES : PRIVACY).map((g, i, arr) => (
              <View key={g.title} style={[s.point, i < arr.length - 1 ? s.divider : null]}>
                <View style={s.pointIcon}><Icon name={g.icon} size={20} color={C.pink} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.pointTitle}>{g.title}</Text>
                  <Text style={s.pointBody}>{g.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {topic === 'privacy' ? <Text style={s.legal}>Full privacy policy and terms of service: [LINK TO FULL TERMS]</Text> : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  segment: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, padding: 4, borderWidth: 1, borderColor: '#E6EDF5' },
  segItem: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.white, ...cardShadow },
  segText: { color: C.muted, fontSize: 14, fontWeight: '700' },
  card: { backgroundColor: C.white, borderRadius: 24, paddingHorizontal: 18, ...cardShadow },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  faq: { paddingVertical: 16 },
  q: { flex: 1, color: C.pri, fontSize: 15.5, fontWeight: '800' },
  a: { color: C.body, fontSize: 14.5, lineHeight: 22, marginTop: 8 },
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 24, marginBottom: 10, marginLeft: 4 },
  contact: { flex: 1, padding: 16, borderRadius: 22, backgroundColor: C.white, gap: 4, ...cardShadow },
  contactTitle: { color: C.pri, fontSize: 15, fontWeight: '800', marginTop: 6 },
  contactSub: { color: C.muted, fontSize: 12.5, fontWeight: '600' },
  point: { flexDirection: 'row', gap: 14, paddingVertical: 16, alignItems: 'flex-start' },
  pointIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  pointTitle: { color: C.pri, fontSize: 15.5, fontWeight: '800' },
  pointBody: { color: C.body, fontSize: 14, lineHeight: 21, marginTop: 3 },
  legal: { color: C.muted, fontSize: 12.5, textAlign: 'center', marginTop: 16 },
});
