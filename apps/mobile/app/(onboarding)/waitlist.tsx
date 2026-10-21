// Where people land after signing up without an invite code: their profile is
// saved and they wait for a spot. An invite code entered here unlocks the app.
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Animated, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import Text, { NunitoScope } from '../../components/PremaText';
import { C, Tap, cardShadow } from '../../components/prema-ui';

// Front-end only: a stable sample place in line derived from the phone number.
const placeInLine = (phone: string) => {
  const digits = phone.replace(/\D/g, '') || '0';
  const n = 800 + (parseInt(digits.slice(-4), 10) % 1200);
  return n.toLocaleString('en-IN');
};

export default function Waitlist() {
  return (
    <NunitoScope>
      <WaitlistInner />
    </NunitoScope>
  );
}

function WaitlistInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone = '' } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState('');
  const clean = code.replace(/[^A-Z0-9]/gi, '');
  const codeReady = clean.length >= 6 && clean.length <= 12;

  // A slow, calm pulse around the hourglass.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 2600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });

  const shownPhone = phone ? `+91\u00A0${phone.slice(0, 5)}\u00A0${phone.slice(5)}` : 'your phone';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: Math.max(insets.bottom, 20) + 20, paddingHorizontal: 22 }}
        >
          <View style={{ alignItems: 'center' }}>
            <Logo width={120} height={46} />
          </View>

          <View style={s.hero}>
            <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={[s.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
              <View style={s.badge}>
                <Icon name="hourglass_empty" size={44} color="#FFFFFF" />
              </View>
            </View>
            <Text style={s.title}>You’re on the list</Text>
            <Text style={s.body}>
              Your profile is saved and ready. We’ll text {shownPhone} the moment your spot opens.
            </Text>
          </View>

          <View style={[s.card, { alignItems: 'center' }]}>
            <Text style={s.eyebrow}>Your place in line</Text>
            <Text style={s.place}>#{placeInLine(String(phone))}</Text>
            <View style={s.divider} />
            <View style={s.row}>
              <Icon name="check_circle" size={20} color="#3BB273" />
              <Text style={s.rowText}>Profile complete, so you can match on day one</Text>
            </View>
            <View style={s.row}>
              <Icon name="sms" size={20} color={C.accent} />
              <Text style={s.rowText}>A text from us when you’re in</Text>
            </View>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>Got an invite code?</Text>
            <Text style={s.cardSub}>Enter it to skip the line and start now.</Text>
            <View style={s.codeRow}>
              <TextInput
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 14))}
                placeholder="PREMA-XXXX"
                placeholderTextColor="#A9B4C2"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => codeReady && router.replace('/(tabs)')}
                accessibilityLabel="Invite code"
                style={s.codeInput}
              />
              <Tap
                onPress={() => codeReady && router.replace('/(tabs)')}
                style={[s.unlock, !codeReady ? { backgroundColor: '#C3CFDC' } : null]}
                accessibilityRole="button"
                accessibilityState={{ disabled: !codeReady }}
              >
                <Text style={s.unlockText}>Unlock</Text>
              </Tap>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 26, marginBottom: 22 },
  ring: { position: 'absolute', width: 104, height: 104, borderRadius: 52, backgroundColor: C.pink },
  badge: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 10 },
  },
  title: { color: C.pri, fontSize: 30, fontWeight: '900', marginTop: 18, letterSpacing: -0.4 },
  body: { color: C.body, fontSize: 15.5, lineHeight: 23, textAlign: 'center', marginTop: 8, paddingHorizontal: 8 },
  card: { backgroundColor: C.white, borderRadius: 24, padding: 20, marginBottom: 14, ...cardShadow },
  eyebrow: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  place: { color: C.pri, fontSize: 44, fontWeight: '900', marginTop: 4, letterSpacing: -0.5 },
  divider: { alignSelf: 'stretch', height: 1, backgroundColor: '#E8EEF5', marginVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', marginBottom: 8 },
  rowText: { color: C.pri, fontSize: 14.5, fontWeight: '600', flex: 1 },
  cardTitle: { color: C.pri, fontSize: 17, fontWeight: '800' },
  cardSub: { color: C.muted, fontSize: 14, marginTop: 2 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  codeInput: {
    flex: 1, height: 52, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#F6F9FC',
    borderWidth: 1, borderColor: '#E3ECF5', color: C.pri, fontSize: 17, letterSpacing: 2, fontFamily: 'Nunito_700Bold',
  },
  unlock: { height: 52, paddingHorizontal: 20, borderRadius: 26, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  unlockText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
