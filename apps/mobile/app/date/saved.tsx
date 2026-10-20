import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import Text from '../../components/PremaText';
import { useRouter } from 'expo-router';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import { C, ScreenHeader, Tap, cardShadow, serif } from '../../components/prema-ui';
import { describe, rupees, toggleSave, useDateState } from '../../src/features/date/store';
import { PreviewNotice } from '../../src/features/date/ui';
import type { Subject, SubjectType } from '../../src/features/date/types';

const LABEL: Record<SubjectType, string> = { activity: 'Experience', offer: 'Free Coffee', event: 'Event' };

export default function Saved() {
  const router = useRouter();
  const { saved } = useDateState();
  const items = saved
    .map((k) => { const [type, id] = k.split(':') as [SubjectType, string]; return { type, id } as Subject; })
    .map((sub) => ({ sub, info: describe(sub) }))
    .filter((x) => x.info);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="PREMA Date" title="Saved" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
        {items.length === 0 ? (
          <View style={s.empty}>
            <Icon name="bookmark_border" size={26} color={C.accent} />
            <Text style={s.emptyTitle}>Nothing saved yet</Text>
            <Text style={s.emptyBody}>Tap the bookmark on any experience to keep it for later.</Text>
            <Tap onPress={() => router.push('/date/explore')} style={s.emptyBtn}><Text style={s.emptyBtnText}>Explore experiences</Text></Tap>
          </View>
        ) : items.map(({ sub, info }) => (
          <Tap key={`${sub.type}:${sub.id}`} onPress={() => router.push(`/date/${sub.type}/${sub.id}`)} style={s.row} pressedStyle={{ opacity: 0.92 }}>
            <Image source={{ uri: info!.photo }} style={s.img} />
            <View style={{ flex: 1 }}>
              <Text style={s.kind}>{LABEL[sub.type]}</Text>
              <Text style={s.title} numberOfLines={1}>{info!.title}</Text>
              <Text style={s.meta} numberOfLines={1}>{info!.venue?.name} · {rupees(info!.priceForTwo)}</Text>
            </View>
            <Tap onPress={() => toggleSave(sub)} style={s.remove} accessibilityLabel="Remove from saved">
              <Icon name="bookmark" size={20} color={C.pri} />
            </Tap>
          </Tap>
        ))}
        <PreviewNotice />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 20, padding: 10, ...cardShadow },
  img: { width: 76, height: 76, borderRadius: 16, backgroundColor: C.accentSoft },
  kind: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { color: C.pri, fontSize: 17, marginTop: 2, ...serif },
  meta: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  remove: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
  empty: { backgroundColor: C.white, borderRadius: 22, padding: 28, alignItems: 'center' },
  emptyTitle: { color: C.pri, fontSize: 19, marginTop: 8, ...serif },
  emptyBody: { color: C.muted, fontSize: 13.5, marginTop: 4, textAlign: 'center' },
  emptyBtn: { marginTop: 14, backgroundColor: C.pri, paddingHorizontal: 18, height: 40, borderRadius: 20, justifyContent: 'center' },
  emptyBtnText: { color: C.white, fontSize: 14, fontWeight: '600' },
});
