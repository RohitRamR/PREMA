import React, { useMemo, useState } from 'react';
import { View, ScrollView, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '../../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import { C, Chip, ScreenHeader, Tap, cardShadow, serif } from '../../components/prema-ui';
import { useConversations } from '../../src/store/chats';
import { catalogue, describe, proposeDate, rupees, whenLabel, duration } from '../../src/features/date/store';
import { SlotPicker } from '../../src/features/date/ui';
import type { Subject, SubjectType } from '../../src/features/date/types';

const NOTE_IDEAS = [
  'This looked like us — fancy it?',
  'I’d love to try this with you.',
  'Low-key and fun. Interested?',
];

const DAYPARTS = [
  { id: 'morning', label: 'Morning', h: 10 },
  { id: 'afternoon', label: 'Afternoon', h: 15 },
  { id: 'evening', label: 'Evening', h: 18 },
] as const;

export default function PlanDate() {
  const params = useLocalSearchParams<{ type?: SubjectType; id?: string; slot?: string; match?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const matches = useConversations();

  const [matchId, setMatchId] = useState<string | null>(params.match ?? null);
  const [subject, setSubject] = useState<Subject | null>(params.type && params.id ? { type: params.type, id: params.id } : null);
  const [slotId, setSlotId] = useState<string | null>(params.slot ?? null);
  const [dayOffset, setDayOffset] = useState<number | null>(null);
  const [daypart, setDaypart] = useState<(typeof DAYPARTS)[number]['id'] | null>(null);
  const [note, setNote] = useState('');

  const info = subject ? describe(subject) : null;
  const match = matches.find((m) => m.id === matchId);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => i + 1), []);

  const requestedTime = (() => {
    if (info?.bookingMode !== 'request' || dayOffset === null || !daypart) return null;
    const d = new Date(); d.setDate(d.getDate() + dayOffset);
    d.setHours(DAYPARTS.find((p) => p.id === daypart)!.h, 0, 0, 0);
    return d.toISOString();
  })();

  const whenReady = !info ? false
    : info.bookingMode === 'ticket' ? true
    : info.bookingMode === 'request' ? !!requestedTime
    : !!slotId;

  const canSend = !!match && !!subject && whenReady;

  const send = () => {
    if (!canSend || !subject || !matchId) return;
    proposeDate({ matchId, subject, slotId: info?.bookingMode === 'request' || info?.bookingMode === 'ticket' ? null : slotId, requestedTime, message: note.trim() });
    router.replace('/date/invitations?tab=sent');
  };

  const quickPicks: Subject[] = [
    ...catalogue.offers.map((o) => ({ type: 'offer' as const, id: o.id })),
    ...catalogue.activities.filter((a) => a.popular).map((a) => ({ type: 'activity' as const, id: a.id })),
  ];

  const event = subject?.type === 'event' ? catalogue.event(subject.id) : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Shared planner" title="Plan a date" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {/* 1 · Who */}
          <Step n={1} title="Who are you inviting?" done={!!match}>
            <Text style={s.helper}>Only mutual matches can be invited.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingTop: 12 }}>
              {matches.map((m) => {
                const on = m.id === matchId;
                return (
                  <Tap key={m.id} onPress={() => setMatchId(m.id)} style={{ alignItems: 'center', width: 70 }} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                    <View style={[s.ring, on ? s.ringOn : null]}>
                      <Image source={{ uri: m.photo }} style={s.avatar} />
                    </View>
                    <Text style={[s.matchName, on ? { color: C.pri, fontWeight: '700' } : null]}>{m.name}</Text>
                  </Tap>
                );
              })}
            </ScrollView>
          </Step>

          {/* 2 · What */}
          <Step n={2} title="What would you like to do?" done={!!subject}>
            {info && subject ? (
              <View style={s.pick}>
                <Image source={{ uri: info.photo }} style={s.pickImg} />
                <View style={{ flex: 1 }}>
                  <Text style={s.pickTitle} numberOfLines={1}>{info.title}</Text>
                  <Text style={s.pickMeta} numberOfLines={1}>{info.venue?.name} · {info.venue?.area}</Text>
                  <Text style={s.pickMeta}>
                    {rupees(info.priceForTwo)}{info.priceForTwo ? (subject.type === 'event' ? ' per couple' : ' for two') : ''}
                    {info.durationMin ? ` · ${duration(info.durationMin)}` : ''}
                  </Text>
                </View>
                <Tap onPress={() => { setSubject(null); setSlotId(null); }} style={s.change}><Text style={s.changeText}>Change</Text></Tap>
              </View>
            ) : (
              <>
                <View style={{ gap: 10, marginTop: 4 }}>
                  {quickPicks.map((q) => {
                    const qi = describe(q)!;
                    return (
                      <Tap key={`${q.type}:${q.id}`} onPress={() => { setSubject(q); setSlotId(null); }} style={s.quick}>
                        <Image source={{ uri: qi.photo }} style={s.quickImg} />
                        <View style={{ flex: 1 }}>
                          <Text style={s.quickTitle} numberOfLines={1}>{qi.title}</Text>
                          <Text style={s.pickMeta} numberOfLines={1}>{qi.venue?.name} · {rupees(qi.priceForTwo)}</Text>
                        </View>
                        <Icon name="add_circle" size={22} color={C.accent} />
                      </Tap>
                    );
                  })}
                </View>
                <Tap onPress={() => router.push('/date/explore')} style={{ marginTop: 12 }}>
                  <Text style={s.link}>Browse all experiences</Text>
                </Tap>
              </>
            )}
          </Step>

          {/* 3 · When */}
          {info ? (
            <Step n={3} title="When?" done={whenReady}>
              {info.bookingMode === 'ticket' && event ? (
                <Text style={s.fixed}>Scheduled event · {whenLabel(event.startsAt)}</Text>
              ) : info.bookingMode === 'request' ? (
                <>
                  <Text style={s.helper}>Suggest a preferred time — the venue confirms before anything is booked.</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 12 }}>
                    {days.map((d) => {
                      const date = new Date(); date.setDate(date.getDate() + d);
                      return (
                        <Chip key={d} selected={dayOffset === d} onPress={() => setDayOffset(d)}
                          label={date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })} />
                      );
                    })}
                  </ScrollView>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    {DAYPARTS.map((p) => <Chip key={p.id} label={p.label} selected={daypart === p.id} onPress={() => setDaypart(p.id)} />)}
                  </View>
                </>
              ) : info.slots.length ? (
                <SlotPicker slots={info.slots} value={slotId} onChange={setSlotId} />
              ) : (
                <Text style={s.helper}>No open times right now — check back soon.</Text>
              )}
            </Step>
          ) : null}

          {/* 4 · Note */}
          <Step n={4} title="Add a note" done={note.trim().length > 0} optional>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={match ? `Say something to ${match.name}…` : 'Say something…'}
              placeholderTextColor="#A9B4C2"
              multiline
              style={s.input}
              maxLength={240}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {NOTE_IDEAS.map((n) => <Chip key={n} label={n} onPress={() => setNote(n)} />)}
            </View>
          </Step>

          <View style={s.consent}>
            <Icon name="handshake" size={18} color={C.accent} />
            <Text style={s.consentText}>
              Nothing is booked until {match ? match.name : 'your match'} accepts. Either of you can decline, suggest another time, or cancel within the venue’s policy.
            </Text>
          </View>
        </ScrollView>

        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.footPrice}>{info ? rupees(info.priceForTwo) : '—'}</Text>
            <Text style={s.footSub}>{info?.priceForTwo ? 'total for two · paid after both accept' : info?.bookingMode === 'free' ? 'café-funded offer' : 'choose an experience'}</Text>
          </View>
          <Tap onPress={canSend ? send : undefined} style={[s.cta, !canSend ? s.ctaOff : null]} pressedStyle={{ opacity: 0.88 }}
            accessibilityState={{ disabled: !canSend }}>
            <Icon name="send" size={16} color={C.white} />
            <Text style={s.ctaText}>Send invitation</Text>
          </Tap>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Step({ n, title, done, optional, children }: { n: number; title: string; done?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <View style={s.step}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <View style={[s.stepNum, done ? s.stepNumDone : null]}>
          {done ? <Icon name="check" size={14} color={C.white} /> : <Text style={s.stepNumText}>{n}</Text>}
        </View>
        <Text style={s.stepTitle}>{title}</Text>
        {optional ? <Text style={s.optional}>Optional</Text> : null}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  step: { backgroundColor: C.white, borderRadius: 22, padding: 18, marginTop: 14, ...cardShadow },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  stepNumDone: { backgroundColor: C.accent },
  stepNumText: { color: C.pri, fontSize: 13, fontWeight: '700' },
  stepTitle: { color: C.pri, fontSize: 18, flex: 1, ...serif },
  optional: { color: C.muted, fontSize: 12 },
  helper: { color: C.muted, fontSize: 13, lineHeight: 18 },
  ring: { width: 62, height: 62, borderRadius: 31, padding: 3, borderWidth: 2, borderColor: 'transparent' },
  ringOn: { borderColor: C.pri },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.accentSoft },
  matchName: { color: C.muted, fontSize: 12.5, marginTop: 4 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F6F9FC', borderRadius: 16, padding: 10 },
  pickImg: { width: 60, height: 60, borderRadius: 14, backgroundColor: C.accentSoft },
  pickTitle: { color: C.pri, fontSize: 15.5, fontWeight: '600' },
  pickMeta: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  change: { paddingHorizontal: 10, paddingVertical: 6 },
  changeText: { color: C.accent, fontSize: 13, fontWeight: '700' },
  quick: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 8, borderWidth: 1, borderColor: C.line },
  quickImg: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.accentSoft },
  quickTitle: { color: C.pri, fontSize: 14.5, fontWeight: '600' },
  link: { color: C.accent, fontSize: 13.5, fontWeight: '700' },
  fixed: { color: C.body, fontSize: 14.5, fontWeight: '600' },
  input: { backgroundColor: '#F6F9FC', borderRadius: 16, borderWidth: 1, borderColor: '#E3ECF5', padding: 14, minHeight: 84, fontSize: 15, color: C.pri, textAlignVertical: 'top', fontFamily: 'Nunito_600SemiBold' },
  consent: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 16, paddingHorizontal: 6 },
  consentText: { color: C.muted, fontSize: 12.5, lineHeight: 18, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.97)', borderTopWidth: 1, borderTopColor: '#E6EDF5' },
  footPrice: { color: C.pri, fontSize: 19, fontWeight: '700' },
  footSub: { color: C.muted, fontSize: 11.5 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.pink, height: 52, paddingHorizontal: 20, borderRadius: 26 },
  ctaOff: { backgroundColor: '#F5B9C6' },
  ctaText: { color: C.white, fontSize: 15, fontWeight: '600' },
});
