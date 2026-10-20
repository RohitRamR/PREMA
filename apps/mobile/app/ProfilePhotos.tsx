import React from 'react';
import { View, Image, ScrollView, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import Text, { NunitoScope } from '../components/PremaText';
import * as ImagePicker from 'expo-image-picker';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { C, Card, Label, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { useProfile, updateProfile } from '../src/store/profile';

const SLOTS = 6;
const GAP = 12;

// Renders in Nunito like the rest of the profile area.
export default function ProfilePhotos() {
  return (
    <NunitoScope>
      <ProfilePhotosInner />
    </NunitoScope>
  );
}

function ProfilePhotosInner() {
  const { photos } = useProfile();
  const { width } = useWindowDimensions();
  const tile = (width - 40 - GAP * 2) / 3;

  const pick = async () => {
    const room = SLOTS - photos.length;
    if (room <= 0) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: room > 1,
      selectionLimit: room,
      allowsEditing: room === 1,
      aspect: [4, 5],
      quality: 0.85,
    });
    if (res.canceled) return;
    updateProfile((p) => ({ photos: [...p.photos, ...res.assets.map((a) => a.uri)].slice(0, SLOTS) }));
  };

  const options = (i: number) => {
    const isMain = i === 0;
    Alert.alert(isMain ? 'Main photo' : 'Photo', undefined, [
      ...(isMain ? [] : [{
        text: 'Set as main photo',
        onPress: () => updateProfile((p) => {
          const next = [...p.photos];
          const [chosen] = next.splice(i, 1);
          return { photos: [chosen, ...next] };
        }),
      }]),
      {
        text: 'Remove',
        style: 'destructive' as const,
        onPress: () => {
          if (photos.length <= 1) {
            Alert.alert('Keep at least one photo', 'Your profile needs a main photo to stay visible.');
            return;
          }
          updateProfile((p) => ({ photos: p.photos.filter((_, j) => j !== i) }));
        },
      },
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const renderSlot = (i: number, size: number) => {
    const uri = photos[i];
    if (!uri) {
      return (
        <Tap key={i} onPress={pick} style={[s.empty, { width: size, height: size }]} accessibilityLabel="Add photo">
          <View style={s.addCircle}>
            <Icon name="add" size={22} color={C.white} />
          </View>
          {i === 0 ? <Text style={s.emptyText}>Add your main photo</Text> : null}
        </Tap>
      );
    }
    return (
      <Tap key={uri + i} onPress={() => options(i)} style={[s.tile, { width: size, height: size }]} accessibilityLabel={`Photo ${i + 1} options`}>
        <Image source={{ uri }} style={StyleSheet.absoluteFill} />
        {i === 0 ? (
          <View style={s.mainBadge}>
            <Icon name="star" size={13} color={C.white} />
            <Text style={s.mainBadgeText}>Main</Text>
          </View>
        ) : null}
        <View style={s.moreDot}>
          <Icon name="more_horiz" size={16} color={C.pri} />
        </View>
      </Tap>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="Your profile" title="Photos" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={s.intro}>
          Show your everyday self — warm light, real moments. Your first photo is the one matches see first.
        </Text>

        {/* Layout: 2×2 main photo + two stacked tiles, then a row of three */}
        <View style={{ flexDirection: 'row', gap: GAP, marginBottom: GAP }}>
          {renderSlot(0, tile * 2 + GAP)}
          <View style={{ gap: GAP }}>
            {renderSlot(1, tile)}
            {renderSlot(2, tile)}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: GAP, marginBottom: 16 }}>
          {[3, 4, 5].map((i) => renderSlot(i, tile))}
        </View>

        <Card style={{ marginTop: 8 }}>
          <Label>Photo guidance</Label>
          {[
            ['wb_sunny', 'Natural light and a clear view of your face'],
            ['people', 'At least one photo doing something you love'],
            ['verified_user', 'No filters — verified profiles get 2× more intros'],
          ].map(([icon, text]) => (
            <View key={text} style={s.tipRow}>
              <Icon name={icon} size={18} color={C.accent} />
              <Text style={s.tipText}>{text}</Text>
            </View>
          ))}
        </Card>

        <Text style={s.count}>{photos.length} of {SLOTS} photos · tap a photo for options</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  intro: { color: C.body, fontSize: 15, lineHeight: 22, marginBottom: 18, paddingHorizontal: 4 },
  tile: { borderRadius: 20, overflow: 'hidden', backgroundColor: C.accentSoft, ...cardShadow },
  empty: {
    borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#BFD4EA',
    backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  emptyText: { color: C.muted, fontSize: 13, fontWeight: '600', marginTop: 10 },
  addCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.pink,
    alignItems: 'center', justifyContent: 'center',
  },
  mainBadge: {
    position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(26,46,68,0.75)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  mainBadgeText: { color: C.white, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  moreDot: {
    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  tipText: { color: C.body, fontSize: 14, flex: 1 },
  count: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 4 },
});
