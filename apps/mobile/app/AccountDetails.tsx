// Phone number and recovery email. Changing the phone needs a 6-digit code (front-end preview).
import React, { useRef, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, Card, PrimaryButton, ScreenHeader, Tap } from '../components/prema-ui';
import { updateProfile, useProfile } from '../src/store/profile';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AccountDetails() {
  return (
    <NunitoScope>
      <AccountInner />
    </NunitoScope>
  );
}

function AccountInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { focus } = useLocalSearchParams<{ focus?: 'phone' | 'email' }>();
  const me = useProfile();

  const [phone, setPhone] = useState(me.phone);
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState(me.email);
  const codeRef = useRef<TextInput>(null);

  const phoneChanged = phone !== me.phone;
  const phoneOk = /^\d{10}$/.test(phone);
  const emailOk = email.trim() === '' || EMAIL_RE.test(email.trim());
  const canSave = emailOk && (!phoneChanged || (phoneOk && codeSent && code.length === 6));

  const sendCode = () => {
    if (!phoneOk) return;
    setCodeSent(true);
    setCode('');
    requestAnimationFrame(() => codeRef.current?.focus());
  };

  const save = () => {
    updateProfile({ phone, email: email.trim() });
    Alert.alert('Saved', 'Your account details are up to date.');
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Account" title="Phone & email" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Card>
            <Text style={s.label}>Phone number</Text>
            <View style={s.phoneRow}>
              <View style={s.cc}><Text style={s.ccText}>+91</Text></View>
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t.replace(/\D/g, '').slice(0, 10)); setCodeSent(false); setCode(''); }}
                keyboardType="phone-pad"
                autoFocus={focus === 'phone'}
                placeholder="98765 43210"
                placeholderTextColor="#A9B4C2"
                style={[s.input, { flex: 1 }]}
                accessibilityLabel="Phone number"
              />
            </View>
            {phoneChanged ? (
              codeSent ? (
                <View style={{ marginTop: 12 }}>
                  <Text style={s.hint}>Enter the 6-digit code we sent to +91 {phone}</Text>
                  <TextInput
                    ref={codeRef}
                    value={code}
                    onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    placeholder="••••••"
                    placeholderTextColor="#A9B4C2"
                    style={[s.input, s.code]}
                    accessibilityLabel="Verification code"
                  />
                  <Tap onPress={sendCode}><Text style={s.link}>Resend code</Text></Tap>
                </View>
              ) : (
                <Tap onPress={sendCode} style={[s.verify, !phoneOk ? { opacity: 0.5 } : null]} accessibilityRole="button">
                  <Icon name="sms" size={18} color={C.white} />
                  <Text style={s.verifyText}>Send verification code</Text>
                </Tap>
              )
            ) : (
              <View style={s.verified}><Icon name="verified" size={16} color="#2E8A5D" /><Text style={s.verifiedText}>Verified</Text></View>
            )}
          </Card>

          <Card style={{ marginTop: 14 }}>
            <Text style={s.label}>Recovery email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={focus === 'email'}
              placeholder="you@example.com"
              placeholderTextColor="#A9B4C2"
              style={[s.input, !emailOk ? { borderColor: C.danger } : null]}
              accessibilityLabel="Recovery email"
            />
            <Text style={[s.hint, !emailOk ? { color: C.danger } : null]}>
              {emailOk ? 'Used only to recover your account. Never shown to anyone.' : 'That doesn’t look like an email address.'}
            </Text>
          </Card>
        </ScrollView>
        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton label="Save" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  label: { color: C.pri, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cc: { height: 50, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.accentSoft, justifyContent: 'center' },
  ccText: { color: C.pri, fontSize: 16, fontWeight: '800' },
  input: { height: 50, backgroundColor: '#F6F9FC', borderRadius: 14, borderWidth: 1, borderColor: '#E3ECF5', paddingHorizontal: 14, fontSize: 16, color: C.pri, fontFamily: 'Nunito_700Bold' },
  code: { marginTop: 8, letterSpacing: 8, fontSize: 20, textAlign: 'center' },
  hint: { color: C.muted, fontSize: 13, marginTop: 8 },
  link: { color: C.pink, fontSize: 13.5, fontWeight: '800', marginTop: 10 },
  verify: { marginTop: 12, height: 46, borderRadius: 23, backgroundColor: C.pri, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  verifyText: { color: C.white, fontSize: 14.5, fontWeight: '800' },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  verifiedText: { color: '#2E8A5D', fontSize: 13, fontWeight: '800' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)' },
});
