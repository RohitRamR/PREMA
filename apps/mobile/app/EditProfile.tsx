import React, { useRef, useState } from 'react';
import { View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import Text, { NunitoScope } from '../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import {
  C, Card, Label, Chip, ScreenHeader, PrimaryButton, Tap,
} from '../components/prema-ui';
import Icon from '../components/Icon';
import {
  useProfile, updateProfile, INTENT_OPTIONS, VALUE_OPTIONS, LIFESTYLE_OPTIONS,
  VITAL_FIELDS, PROMPT_OPTIONS, VOICE_OPTIONS, INTEREST_SUGGESTIONS, INTEREST_MAX, BIRTH_PLACES,
  type Vitals,
} from '../src/store/profile';
import { goBack } from '../components/nav';

const MAX_VALUES = 3;

/** A real calendar date in YYYY-MM-DD, not in the future, age 18–100. */
function validBirthDate(v: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return false;
  const age = ageFrom(v);
  return age >= 18 && age <= 100;
}

/** 24-hour HH:mm. */
const validBirthTime = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v.trim());

/** Age today in India (IST), from a YYYY-MM-DD birth date. */
function ageFrom(date: string): number {
  const now = new Date(Date.now() + 330 * 60000); // IST
  const [y, m, d] = date.split('-').map(Number);
  let age = now.getUTCFullYear() - y;
  if (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d)) age -= 1;
  return age;
}
const ABOUT_MAX = 280;

// Renders in Nunito like the rest of the profile area.
export default function EditProfile() {
  return (
    <NunitoScope>
      <EditProfileInner />
    </NunitoScope>
  );
}

function EditProfileInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const p = useProfile();

  const [name, setName] = useState(p.name);
  const [location, setLocation] = useState(p.location);
  const [occupation, setOccupation] = useState(p.occupation);
  const [about, setAbout] = useState(p.about);
  const [intent, setIntent] = useState(p.intent);
  const [values, setValues] = useState(p.values);
  const [boundary, setBoundary] = useState(p.boundary);
  const [lifestyle, setLifestyle] = useState(p.lifestyle);
  const [vitals, setVitals] = useState<Vitals>(p.vitals);
  const [birthDate, setBirthDate] = useState(p.birth.date);
  const [birthTime, setBirthTime] = useState(p.birth.time);
  const [birthPlace, setBirthPlace] = useState(p.birth.place);
  const birthDateOk = validBirthDate(birthDate);
  const birthTimeOk = birthTime.trim() === '' || validBirthTime(birthTime);
  const [prompt, setPrompt] = useState(p.prompt);
  const [interests, setInterests] = useState(p.interests);
  const [newInterest, setNewInterest] = useState('');
  const [photoCaption, setPhotoCaption] = useState(p.photoCaption);
  const [voice, setVoice] = useState(p.voice);
  const [recording, setRecording] = useState(false);
  // "Write your own" lets people ask any question, not just the suggestions.
  const [customPrompt, setCustomPrompt] = useState(!PROMPT_OPTIONS.includes(p.prompt.question));
  const [customVoice, setCustomVoice] = useState(!VOICE_OPTIONS.includes(p.voice.question));
  const recordStart = useRef(0);

  const setVital = (k: keyof Vitals) => (t: string) => setVitals((v) => ({ ...v, [k]: t }));

  const addInterest = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    setInterests((cur) => {
      if (cur.some((x) => x.toLowerCase() === t.toLowerCase())) return cur;
      if (cur.length >= INTEREST_MAX) {
        Alert.alert('That’s plenty', `Keep it to ${INTEREST_MAX} — remove one to add another.`);
        return cur;
      }
      return [...cur, t];
    });
    setNewInterest('');
  };
  const removeInterest = (t: string) => setInterests((cur) => cur.filter((x) => x !== t));

  // Front-end stand-in for recording: tracks only how long you held "record".
  const toggleRecord = () => {
    if (!recording) {
      recordStart.current = Date.now();
      setRecording(true);
    } else {
      const seconds = Math.max(1, Math.min(30, Math.round((Date.now() - recordStart.current) / 1000)));
      setRecording(false);
      setVoice((v) => ({ ...v, recorded: true, seconds }));
    }
  };

  const toggleValue = (v: string) => {
    setValues((cur) => {
      if (cur.includes(v)) return cur.filter((x) => x !== v);
      if (cur.length >= MAX_VALUES) {
        Alert.alert('Three is the limit', `Pick your ${MAX_VALUES} most essential values. Remove one to add another.`);
        return cur;
      }
      return [...cur, v];
    });
  };
  const toggleLifestyle = (l: string) =>
    setLifestyle((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]));

  const canSave = name.trim().length > 0 && values.length > 0 && birthDateOk && birthTimeOk;

  const save = () => {
    const place = BIRTH_PLACES.find((b) => b.name === birthPlace);
    updateProfile({
      birth: { date: birthDate.trim(), time: birthTime.trim(), place: birthPlace, lat: place?.lat, lon: place?.lon },
      age: ageFrom(birthDate.trim()),
      name: name.trim(), location: location.trim(), occupation: occupation.trim(),
      about: about.trim(), intent, values, boundary: boundary.trim(), lifestyle,
      vitals: Object.fromEntries(Object.entries(vitals).map(([k, v]) => [k, v.trim()])) as Vitals,
      prompt: { question: prompt.question.trim() || PROMPT_OPTIONS[0], answer: prompt.answer.trim() },
      interests, photoCaption: photoCaption.trim(),
      voice: { ...voice, question: voice.question.trim() || VOICE_OPTIONS[0] },
    });
    goBack(router);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Your profile" title="Edit profile" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <Tap
            onPress={() => router.push({ pathname: '/MatchDetail', params: { me: '1' } })}
            style={s.preview}
            pressedStyle={{ opacity: 0.8 }}
            accessibilityRole="button"
          >
            <Icon name="visibility" size={18} color={C.accent} />
            <Text style={s.previewText}>See how others see your profile</Text>
            <Icon name="chevron_right" size={20} color={C.muted} />
          </Tap>

          <Card>
            <Field label="Given name" value={name} onChangeText={setName} placeholder="e.g. Vikram" />
            <Field label="Where you live" value={location} onChangeText={setLocation} placeholder="e.g. Bengaluru" icon />
            <Field label="What you do" value={occupation} onChangeText={setOccupation} placeholder="e.g. Architect" last />
          </Card>

          <Card>
            <Label>Birth details</Label>
            <Text style={s.sub}>Used privately for your Kundli, numerology and horoscope match. Never shown on your profile.</Text>
            <View style={s.grid}>
              <View style={s.gridItem}>
                <Text style={[s.miniLabel, { marginBottom: 6 }]}>Date of birth</Text>
                <TextInput
                  value={birthDate}
                  onChangeText={(t) => setBirthDate(t.replace(/[^\d-]/g, '').slice(0, 10))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#A9B4C2"
                  keyboardType="numbers-and-punctuation"
                  style={[s.input, s.inputSmall, !birthDateOk ? s.inputError : null]}
                  accessibilityLabel="Date of birth, year month day"
                />
              </View>
              <View style={s.gridItem}>
                <Text style={[s.miniLabel, { marginBottom: 6 }]}>Birth time (IST)</Text>
                <TextInput
                  value={birthTime}
                  onChangeText={(t) => setBirthTime(t.replace(/[^\d:]/g, '').slice(0, 5))}
                  placeholder="HH:MM, 24-hour"
                  placeholderTextColor="#A9B4C2"
                  keyboardType="numbers-and-punctuation"
                  style={[s.input, s.inputSmall, !birthTimeOk ? s.inputError : null]}
                  accessibilityLabel="Birth time in Indian Standard Time, 24 hour"
                />
              </View>
            </View>
            {!birthDateOk ? <Text style={s.error}>Enter a real date as YYYY-MM-DD (you must be 18 or older).</Text> : null}
            {!birthTimeOk ? <Text style={s.error}>Enter the time as HH:MM in 24-hour Indian time, e.g. 06:30 or 18:45.</Text> : null}
            <View style={[s.wrap, { marginTop: 12 }]}>
              <Chip label="I don’t know my birth time" selected={birthTime.trim() === ''} onPress={() => setBirthTime('')} />
            </View>
            <Text style={[s.miniLabel, { marginTop: 16, marginBottom: 8 }]}>Born in</Text>
            <View style={s.wrap}>
              {BIRTH_PLACES.map((b) => (
                <Chip key={b.name} label={b.name} selected={birthPlace === b.name} onPress={() => setBirthPlace(b.name)} />
              ))}
            </View>
          </Card>

          <Card>
            <Label>About me</Label>
            <TextInput
              value={about}
              onChangeText={(t) => setAbout(t.slice(0, ABOUT_MAX))}
              placeholder="A few honest lines about how you spend your days…"
              placeholderTextColor="#A9B4C2"
              multiline
              style={[s.input, s.multiline]}
            />
            <Text style={s.counter}>{about.length}/{ABOUT_MAX}</Text>
          </Card>

          <Card>
            <Label>What you’re looking for</Label>
            <View style={s.wrap}>
              {INTENT_OPTIONS.map((o) => (
                <Chip key={o} label={o} selected={intent === o} onPress={() => setIntent(o)} />
              ))}
            </View>
          </Card>

          <Card>
            <Label>Basics</Label>
            <Text style={s.sub}>Shown as a tidy grid on your profile. Leave any blank to hide it.</Text>
            <View style={s.grid}>
              {VITAL_FIELDS.map((f) => (
                <View key={f.key} style={s.gridItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                    <Icon name={f.icon} size={14} color={C.accent} />
                    <Text style={s.miniLabel}>{f.label}</Text>
                  </View>
                  <TextInput
                    value={vitals[f.key]}
                    onChangeText={setVital(f.key)}
                    placeholder={f.placeholder}
                    placeholderTextColor="#A9B4C2"
                    style={[s.input, s.inputSmall]}
                    returnKeyType="done"
                  />
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <Label>Your prompt</Label>
            <View style={s.wrap}>
              {PROMPT_OPTIONS.map((q) => (
                <Chip key={q} label={q} selected={!customPrompt && prompt.question === q}
                  onPress={() => { setCustomPrompt(false); setPrompt((cur) => ({ ...cur, question: q })); }} />
              ))}
              <Chip label="Write your own" icon="edit" selected={customPrompt}
                onPress={() => { setCustomPrompt(true); setPrompt((cur) => ({ ...cur, question: '' })); }} />
            </View>
            {customPrompt ? (
              <TextInput
                value={prompt.question}
                onChangeText={(t) => setPrompt((cur) => ({ ...cur, question: t.slice(0, 60) }))}
                placeholder="Your question, e.g. The song I’d play on a long drive…"
                placeholderTextColor="#A9B4C2"
                style={[s.input, { marginTop: 12 }]}
                returnKeyType="done"
                autoFocus
              />
            ) : null}
            <TextInput
              value={prompt.answer}
              onChangeText={(t) => setPrompt((cur) => ({ ...cur, answer: t.slice(0, 160) }))}
              placeholder="Your answer…"
              placeholderTextColor="#A9B4C2"
              multiline
              style={[s.input, s.multiline, { marginTop: 12 }]}
            />
            <Text style={s.counter}>{prompt.answer.length}/160</Text>
          </Card>

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Label>Into</Label>
              <Text style={s.hint}>{interests.length}/{INTEREST_MAX}</Text>
            </View>
            <View style={s.wrap}>
              {interests.map((t) => (
                <Tap key={t} onPress={() => removeInterest(t)} style={s.interestOn} accessibilityLabel={`Remove ${t}`}>
                  <Text style={s.interestOnText}>{t}</Text>
                  <Icon name="close" size={14} color="#FFFFFF" />
                </Tap>
              ))}
            </View>
            <View style={s.addRow}>
              <TextInput
                value={newInterest}
                onChangeText={setNewInterest}
                onSubmitEditing={() => addInterest(newInterest)}
                placeholder="Add an interest"
                placeholderTextColor="#A9B4C2"
                style={[s.input, { flex: 1 }]}
                returnKeyType="done"
              />
              <Tap onPress={() => addInterest(newInterest)} style={s.addBtn} accessibilityLabel="Add interest">
                <Icon name="add" size={22} color="#FFFFFF" />
              </Tap>
            </View>
            <View style={[s.wrap, { marginTop: 10 }]}>
              {INTEREST_SUGGESTIONS.filter((t) => !interests.includes(t)).slice(0, 6).map((t) => (
                <Chip key={t} label={`+ ${t}`} onPress={() => addInterest(t)} />
              ))}
            </View>
          </Card>

          <Card>
            <Label>In your own voice</Label>
            <View style={s.wrap}>
              {VOICE_OPTIONS.map((q) => (
                <Chip key={q} label={q} selected={!customVoice && voice.question === q}
                  onPress={() => { setCustomVoice(false); setVoice((v) => ({ ...v, question: q })); }} />
              ))}
              <Chip label="Write your own" icon="edit" selected={customVoice}
                onPress={() => { setCustomVoice(true); setVoice((v) => ({ ...v, question: '' })); }} />
            </View>
            {customVoice ? (
              <TextInput
                value={voice.question}
                onChangeText={(t) => setVoice((v) => ({ ...v, question: t.slice(0, 60) }))}
                placeholder="Your question, e.g. What home smells like to me…"
                placeholderTextColor="#A9B4C2"
                style={[s.input, { marginTop: 12 }]}
                returnKeyType="done"
                autoFocus
              />
            ) : null}
            <View style={s.voiceRow}>
              <Tap onPress={toggleRecord} style={[s.recBtn, recording ? { backgroundColor: '#E2456B' } : null]}
                accessibilityLabel={recording ? 'Stop recording' : 'Record your answer'}>
                <Icon name={recording ? 'stop' : 'mic'} size={24} color="#FFFFFF" />
              </Tap>
              <View style={{ flex: 1 }}>
                <Text style={s.voiceTitle}>
                  {recording ? 'Recording… tap to stop' : voice.recorded ? `Recorded · 0:${String(voice.seconds).padStart(2, '0')}` : 'Tap to record up to 30 seconds'}
                </Text>
                {voice.recorded && !recording ? (
                  <Tap onPress={() => setVoice((v) => ({ ...v, recorded: false, seconds: 0 }))}>
                    <Text style={s.remove}>Remove recording</Text>
                  </Tap>
                ) : null}
              </View>
            </View>
          </Card>

          <Card>
            <Label>Your second photo</Label>
            <View style={s.photoRow}>
              {p.photos[1] ? (
                <Image source={{ uri: p.photos[1] }} style={s.photoThumb} />
              ) : (
                <View style={[s.photoThumb, s.photoEmpty]}><Icon name="add_a_photo" size={22} color={C.muted} /></View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={s.photoTitle}>{p.photos[1] ? 'Shown halfway down your profile' : 'Add a second photo'}</Text>
                <Tap onPress={() => router.push('/ProfilePhotos')} style={s.photoBtn} pressedStyle={{ opacity: 0.8 }} accessibilityRole="button">
                  <Icon name="photo_library" size={16} color={C.pri} />
                  <Text style={s.photoBtnText}>{p.photos[1] ? 'Change photo' : 'Choose photo'}</Text>
                </Tap>
              </View>
            </View>
            <Text style={[s.miniLabel, { marginTop: 14, marginBottom: 6 }]}>Caption</Text>
            <TextInput
              value={photoCaption}
              onChangeText={(t) => setPhotoCaption(t.slice(0, 40))}
              placeholder="e.g. Auroville, last winter"
              placeholderTextColor="#A9B4C2"
              style={s.input}
              returnKeyType="done"
            />
          </Card>

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Label>Core values</Label>
              <Text style={s.hint}>{values.length}/{MAX_VALUES}</Text>
            </View>
            <View style={s.wrap}>
              {VALUE_OPTIONS.map((v) => (
                <Chip key={v} label={v} selected={values.includes(v)} onPress={() => toggleValue(v)} />
              ))}
            </View>
          </Card>

          <Card>
            <Label>A boundary I firmly hold</Label>
            <TextInput
              value={boundary}
              onChangeText={setBoundary}
              placeholder="Something you won’t compromise on…"
              placeholderTextColor="#A9B4C2"
              multiline
              style={[s.input, s.multiline, s.quoteInput]}
            />
          </Card>

          <Card>
            <Label>Daily rhythm</Label>
            <View style={s.wrap}>
              {LIFESTYLE_OPTIONS.map((l) => (
                <Chip key={l.label} label={l.label} icon={l.icon}
                  selected={lifestyle.includes(l.label)} onPress={() => toggleLifestyle(l.label)} />
              ))}
            </View>
          </Card>
        </ScrollView>

        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton label="Save changes" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label, value, onChangeText, placeholder, last,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; last?: boolean; icon?: boolean;
}) {
  return (
    <View style={{ marginBottom: last ? 0 : 18 }}>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A9B4C2"
        style={s.input}
        returnKeyType="done"
      />
    </View>
  );
}

const s = StyleSheet.create({
  input: {
    backgroundColor: '#F6F9FC', borderRadius: 16, borderWidth: 1, borderColor: '#E3ECF5',
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: C.pri, fontFamily: 'Nunito_600SemiBold',
  },
  multiline: { minHeight: 110, textAlignVertical: 'top', lineHeight: 23, paddingTop: 14 },
  quoteInput: { fontFamily: 'Nunito_700Bold', fontSize: 17, lineHeight: 25 },
  counter: { alignSelf: 'flex-end', color: C.muted, fontSize: 12, marginTop: 6 },
  hint: { color: C.accent, fontSize: 12, fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sub: { color: C.muted, fontSize: 13, lineHeight: 18, marginTop: -4, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  gridItem: { width: '48.5%' },
  miniLabel: { color: C.muted, fontSize: 12, fontWeight: '700' },
  inputSmall: { paddingVertical: 11, fontSize: 15 },
  inputError: { borderColor: '#F2A3B5', backgroundColor: '#FFF6F8' },
  error: { color: '#C9406A', fontSize: 12.5, fontWeight: '700', marginTop: 8 },
  interestOn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18, backgroundColor: '#FF6B8B',
  },
  interestOnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  addBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.pri, alignItems: 'center', justifyContent: 'center' },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  recBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B8B', alignItems: 'center', justifyContent: 'center' },
  voiceTitle: { color: C.pri, fontSize: 15, fontWeight: '700' },
  remove: { color: '#C9406A', fontSize: 13, fontWeight: '700', marginTop: 4 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  photoThumb: { width: 76, height: 96, borderRadius: 16, backgroundColor: '#EEF3F9' },
  photoEmpty: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C9D6E4' },
  photoTitle: { color: C.pri, fontSize: 14.5, fontWeight: '700' },
  photoBtn: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: '#EEF4FB',
  },
  photoBtnText: { color: C.pri, fontSize: 14, fontWeight: '700' },
  preview: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14,
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E3ECF5',
  },
  previewText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '700' },
  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(241,247,253,0.96)', borderTopWidth: 1, borderTopColor: '#E3ECF5',
  },
});
