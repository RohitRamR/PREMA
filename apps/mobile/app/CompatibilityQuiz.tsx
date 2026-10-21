// Compatibility quiz ("Compatibility DNA"): one-tap answers that feed the
// matching engine's goals, values, lifestyle and personality layers.
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text, { NunitoScope } from '../components/PremaText';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { C, Card, Chip, ScreenHeader, PrimaryButton, Tap } from '../components/prema-ui';
import { goBack } from '../components/nav';
import { useProfile, updateProfile } from '../src/store/profile';
import {
  QUESTIONS, QUIZ_SECTIONS, QUESTION_COUNT, answeredCount, sectionTotal,
  type QuizAnswers, type ScaleQuestion, type ChoiceQuestion,
} from '../src/features/compatibility/quiz';

export default function CompatibilityQuiz() {
  return (
    <NunitoScope>
      <QuizInner />
    </NunitoScope>
  );
}

function QuizInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useProfile();
  const [answers, setAnswers] = useState<QuizAnswers>(me.answers ?? {});
  const done = answeredCount(answers);

  const set = (id: string, v: number | string) =>
    setAnswers((a) => (a[id] === v ? Object.fromEntries(Object.entries(a).filter(([k]) => k !== id)) : { ...a, [id]: v }));

  const save = () => {
    updateProfile({ answers });
    goBack(router);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Compatibility DNA" title="Your answers" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.intro}>
          <Text style={s.introText}>
            One tap each. Your answers sharpen every match score and are never shown on your profile.
          </Text>
          <View style={s.track}><View style={[s.fill, { width: `${(done / QUESTION_COUNT) * 100}%` }]} /></View>
          <Text style={s.progress}>{done} of {QUESTION_COUNT} answered</Text>
        </View>

        {QUIZ_SECTIONS.map((sec) => {
          const qs = QUESTIONS.filter((q) => q.section === sec.id);
          const n = answeredCount(answers, sec.id);
          const counts = n * 2 >= sectionTotal(sec.id);
          return (
            <Card key={sec.id}>
              <View style={s.secHead}>
                <View style={s.secIcon}><Icon name={sec.icon} size={18} color={C.pink} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.secTitle}>{sec.title}</Text>
                  <Text style={s.secSub}>{sec.blurb}</Text>
                </View>
                <View style={[s.badge, counts ? s.badgeOn : null]}>
                  <Text style={[s.badgeText, counts ? { color: C.white } : null]}>{n}/{qs.length}</Text>
                </View>
              </View>
              {qs.map((q, i) => (
                <View key={q.id} style={[s.q, i < qs.length - 1 ? s.qDivider : null]}>
                  <Text style={s.prompt}>{q.prompt}</Text>
                  {q.kind === 'scale'
                    ? <Scale q={q} value={answers[q.id]} onPick={(v) => set(q.id, v)} />
                    : <Choice q={q} value={answers[q.id]} onPick={(v) => set(q.id, v)} />}
                </View>
              ))}
            </Card>
          );
        })}

        <Text style={s.note}>A section starts counting once half of it is answered. Tap an answer again to clear it.</Text>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label={`Save answers · ${done}/${QUESTION_COUNT}`} icon="check" onPress={save} />
      </View>
    </View>
  );
}

function Scale({ q, value, onPick }: { q: ScaleQuestion; value: unknown; onPick: (v: number) => void }) {
  return (
    <View>
      <View style={s.dots}>
        {[0, 1, 2, 3, 4].map((v) => {
          const on = value === v;
          return (
            <Tap key={v} onPress={() => onPick(v)} style={s.dotHit}
              accessibilityRole="radio" accessibilityState={{ selected: on }}
              accessibilityLabel={`${q.prompt}: ${v + 1} of 5, from ${q.left} to ${q.right}`}>
              <View style={[s.dot, { width: 20 + Math.abs(v - 2) * 6, height: 20 + Math.abs(v - 2) * 6 }, on ? s.dotOn : null]} />
            </Tap>
          );
        })}
      </View>
      <View style={s.ends}>
        <Text style={s.end}>{q.left}</Text>
        <Text style={[s.end, { textAlign: 'right' }]}>{q.right}</Text>
      </View>
    </View>
  );
}

function Choice({ q, value, onPick }: { q: ChoiceQuestion; value: unknown; onPick: (v: string) => void }) {
  return (
    <View style={s.wrap}>
      {q.options.map((o) => (
        <Chip key={o.value} label={o.label} selected={value === o.value} onPress={() => onPick(o.value)} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  intro: { backgroundColor: C.white, borderRadius: 22, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E3ECF5' },
  introText: { color: C.body, fontSize: 14, lineHeight: 20 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden', marginTop: 12 },
  fill: { height: '100%', borderRadius: 4, backgroundColor: C.pink },
  progress: { color: C.muted, fontSize: 12.5, fontWeight: '700', marginTop: 6 },
  secHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  secIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  secTitle: { color: C.pri, fontSize: 16, fontWeight: '900' },
  secSub: { color: C.muted, fontSize: 12.5, lineHeight: 17, marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#EEF4FB' },
  badgeOn: { backgroundColor: C.pink },
  badgeText: { color: C.pri, fontSize: 12, fontWeight: '800' },
  q: { paddingVertical: 14 },
  qDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  prompt: { color: C.pri, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  dotHit: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  dot: { borderRadius: 20, borderWidth: 2, borderColor: '#C9D6E4', backgroundColor: C.white },
  dotOn: { backgroundColor: C.pink, borderColor: C.pink },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, gap: 12 },
  end: { flex: 1, color: C.muted, fontSize: 12, fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { color: C.muted, fontSize: 12.5, lineHeight: 18, textAlign: 'center', paddingHorizontal: 12, marginTop: 4 },
  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(241,247,253,0.96)', borderTopWidth: 1, borderTopColor: '#E3ECF5',
  },
});
