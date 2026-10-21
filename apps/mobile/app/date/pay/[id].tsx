// Payment for an accepted date. Opens straight after both people accept.
// Two ways to pay: one of you covers it all, or you split it in two.
import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../../../components/CelestialBackground';
import Icon from '../../../components/Icon';
import Text from '../../../components/PremaText';
import { C, ScreenHeader, Tap, cardShadow } from '../../../components/prema-ui';
import { useConversations } from '../../../src/store/chats';
import {
  describe, halfOf, payBooking, previewPartnerPaysHalf, rupees, useDateState, whenLabel,
} from '../../../src/features/date/store';
import { MissingListing, PreviewNotice } from '../../../src/features/date/ui';
import type { PaymentMode } from '../../../src/features/date/types';

const METHODS = [
  { id: 'upi', label: 'UPI', icon: 'qr_code_2' },
  { id: 'card', label: 'Card', icon: 'credit_card' },
  { id: 'apple', label: 'Apple Pay', icon: 'phone_iphone' },
] as const;

export default function PayForDate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings } = useDateState();
  const matches = useConversations();
  const b = bookings.find((x) => x.id === id);
  const [mode, setMode] = useState<PaymentMode>(b?.payment?.mode ?? 'split');
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('upi');
  if (!b) return <MissingListing />;

  const info = describe(b.subject);
  const m = matches.find((x) => x.id === b.matchId);
  const name = m?.name ?? 'your date';
  const total = b.totalPaise;
  const half = halfOf(total);
  const due = mode === 'full' ? total : half;

  const paidMyHalf = b.payment?.mode === 'split' && b.payment.mePaid;
  const confirmed = b.status === 'confirmed';
  const locked = paidMyHalf || confirmed;

  const option = (k: PaymentMode, title: string, sub: string, amount: string, icon: string) => {
    const on = mode === k;
    return (
      <Tap
        onPress={locked ? undefined : () => setMode(k)}
        style={[s.option, on ? s.optionOn : null, locked && !on ? { opacity: 0.45 } : null]}
        pressedStyle={{ opacity: 0.9 }}
        accessibilityRole="radio"
        accessibilityState={{ checked: on, disabled: locked }}
      >
        <View style={[s.optIcon, on ? { backgroundColor: C.pink } : null]}>
          <Icon name={icon} size={22} color={on ? C.white : C.pri} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.optTitle}>{title}</Text>
          <Text style={s.optSub}>{sub}</Text>
        </View>
        <Text style={[s.optAmount, on ? { color: C.pink } : null]}>{amount}</Text>
      </Tap>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Both of you said yes" title="Pay for your date" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 170 }}>
        {/* What you're paying for */}
        <View style={s.summary}>
          {info ? <Image source={{ uri: info.photo }} style={s.summaryImg} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.summaryTitle} numberOfLines={2}>{info?.title}</Text>
            <Text style={s.summaryMeta} numberOfLines={1}>{whenLabel(b.startsAt)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
              {m ? <Image source={{ uri: m.photo }} style={{ width: 20, height: 20, borderRadius: 10 }} /> : null}
              <Text style={s.summaryMeta}>With {name}</Text>
            </View>
          </View>
        </View>

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total for two</Text>
          <Text style={s.totalValue}>{rupees(total)}</Text>
        </View>

        {/* Full or split */}
        <Text style={s.section}>How would you like to pay?</Text>
        <View style={{ gap: 12 }}>
          {option('split', 'Split it in two', `You pay half, ${name} pays half`, rupees(half), 'call_split')}
          {option('full', 'Pay in full', `Treat ${name} to this date`, rupees(total), 'favorite')}
        </View>

        {/* Split progress */}
        {mode === 'split' && !confirmed ? (
          <View style={s.splitCard}>
            <SplitRow label="Your half" amount={rupees(half)} done={paidMyHalf} />
            <SplitRow label={`${name}’s half`} amount={rupees(total - half)} done={!!b.payment?.themPaid} last />
          </View>
        ) : null}

        {/* Method */}
        {!locked ? (
          <>
            <Text style={s.section}>Pay with</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {METHODS.map((x) => {
                const on = method === x.id;
                return (
                  <Tap key={x.id} onPress={() => setMethod(x.id)} style={[s.method, on ? s.methodOn : null]}
                    accessibilityRole="radio" accessibilityState={{ checked: on }}>
                    <Icon name={x.icon} size={20} color={on ? C.pink : C.pri} />
                    <Text style={[s.methodText, on ? { color: C.pink } : null]}>{x.label}</Text>
                  </Tap>
                );
              })}
            </View>
          </>
        ) : null}

        {paidMyHalf && !confirmed ? (
          <View style={s.waiting}>
            <Icon name="hourglass_empty" size={20} color={C.pink} />
            <Text style={s.waitingText}>Your half is paid. We’ll confirm the date as soon as {name} pays theirs.</Text>
          </View>
        ) : null}

        {confirmed ? (
          <View style={s.waiting}>
            <Icon name="check_circle" size={20} color="#3BB273" />
            <Text style={s.waitingText}>All paid. Your date is confirmed and your pass is ready.</Text>
          </View>
        ) : null}

        <PreviewNotice />
      </ScrollView>

      {/* Footer action */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {confirmed ? (
          <Tap onPress={() => router.replace(`/date/pass/${b.id}`)} style={s.cta} pressedStyle={{ opacity: 0.88 }}>
            <Icon name="qr_code_2" size={20} color={C.white} />
            <Text style={s.ctaText}>View your pass</Text>
          </Tap>
        ) : paidMyHalf ? (
          <Tap onPress={() => previewPartnerPaysHalf(b.id)} style={[s.cta, s.ctaGhost]} pressedStyle={{ opacity: 0.88 }}>
            <Text style={[s.ctaText, { color: C.muted, fontSize: 14 }]}>Preview: {name} pays their half</Text>
          </Tap>
        ) : (
          <Tap onPress={() => payBooking(b.id, mode)} style={s.cta} pressedStyle={{ opacity: 0.88 }} accessibilityRole="button">
            <Icon name="lock" size={17} color={C.white} />
            <Text style={s.ctaText}>Pay {rupees(due)}</Text>
          </Tap>
        )}
        <Text style={s.trust}>Secure checkout · Refunds follow the venue’s policy</Text>
      </View>
    </View>
  );
}

function SplitRow({ label, amount, done, last }: { label: string; amount: string; done: boolean; last?: boolean }) {
  return (
    <View style={[s.splitRow, last ? { borderBottomWidth: 0 } : null]}>
      <View style={[s.splitDot, done ? s.splitDotDone : null]}>
        {done ? <Icon name="check" size={12} color={C.white} /> : null}
      </View>
      <Text style={s.splitLabel}>{label}</Text>
      <Text style={[s.splitAmount, done ? { color: '#2E8A5D' } : null]}>{done ? 'Paid' : amount}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  summary: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: C.white, borderRadius: 24, padding: 12, marginTop: 4, ...cardShadow },
  summaryImg: { width: 84, height: 84, borderRadius: 18, backgroundColor: C.accentSoft },
  summaryTitle: { color: C.pri, fontSize: 17, fontWeight: '900' },
  summaryMeta: { color: C.muted, fontSize: 13, fontWeight: '600', marginTop: 2 },

  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, marginTop: 16 },
  totalLabel: { color: C.muted, fontSize: 14, fontWeight: '700' },
  totalValue: { color: C.pri, fontSize: 22, fontWeight: '900' },

  section: { color: C.pri, fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 12, marginLeft: 4 },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 22,
    backgroundColor: C.white, borderWidth: 2, borderColor: 'transparent', ...cardShadow,
  },
  optionOn: {
    borderColor: C.pink, backgroundColor: '#FFF4F7',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 4,
  },
  optIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EAF2FB', alignItems: 'center', justifyContent: 'center' },
  optTitle: { color: C.pri, fontSize: 16.5, fontWeight: '900' },
  optSub: { color: C.muted, fontSize: 13, fontWeight: '600', marginTop: 2 },
  optAmount: { color: C.pri, fontSize: 18, fontWeight: '900' },

  splitCard: { marginTop: 12, backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, ...cardShadow },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line },
  splitDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C9D5E3', alignItems: 'center', justifyContent: 'center' },
  splitDotDone: { backgroundColor: '#3BB273', borderColor: '#3BB273' },
  splitLabel: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '700' },
  splitAmount: { color: C.pri, fontSize: 15, fontWeight: '900' },

  method: {
    flex: 1, height: 64, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', gap: 4,
    borderWidth: 2, borderColor: 'transparent', ...cardShadow,
  },
  methodOn: { borderColor: C.pink, backgroundColor: '#FFF4F7' },
  methodText: { color: C.pri, fontSize: 13, fontWeight: '800' },

  waiting: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, backgroundColor: C.pinkSoft, borderRadius: 18, padding: 14 },
  waitingText: { flex: 1, color: C.pri, fontSize: 14, fontWeight: '700', lineHeight: 20 },

  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(241,247,253,0.96)' },
  cta: {
    height: 56, borderRadius: 28, backgroundColor: C.pink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 3,
  },
  ctaGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#F5B9C6', shadowOpacity: 0 },
  ctaText: { color: C.white, fontSize: 16.5, fontWeight: '900' },
  trust: { color: C.muted, fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 10 },
});
