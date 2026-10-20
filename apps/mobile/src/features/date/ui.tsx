// Shared PREMA Date UI. Built on components/prema-ui (palette, Tap, shadows).
import React from 'react';
import { View, Image, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import Text from '../../../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Icon from '../../../components/Icon';
import { C, Tap, cardShadow, serif } from '../../../components/prema-ui';
import {
  STATUS_COPY, catalogue, dayLabel, duration, keyOf, rupees, timeLabel, toggleSave, useDateState,
} from './store';
import type { Activity, BookingStatus, Slot, Subject } from './types';

export const D = {
  green: '#2E8A5D', greenSoft: '#E8F7EF',
  amber: '#9A6A12', amberSoft: '#FBF1DC',
  red: '#B4373F', redSoft: '#FBE4E6',
  greySoft: '#EEF2F6',
};

export function Veil({ id, from = 0.4, to = 0.72 }: { id: string; from?: number; to?: number }) {
  return (
    <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset={String(from)} stopColor="#1A2E44" stopOpacity="0" />
          <Stop offset="1" stopColor="#1A2E44" stopOpacity={String(to)} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

export function SaveButton({ subject, size = 36 }: { subject: Subject; size?: number }) {
  const { saved } = useDateState();
  const on = saved.includes(keyOf(subject));
  return (
    <Tap
      onPress={() => toggleSave(subject)}
      style={[ds.saveBtn, { width: size, height: size, borderRadius: size / 2 }]}
      accessibilityLabel={on ? 'Remove from saved' : 'Save experience'}
      accessibilityState={{ selected: on }}
    >
      <Icon name={on ? 'bookmark' : 'bookmark_border'} size={18} color={on ? C.pri : C.pri} />
    </Tap>
  );
}

/** Honest availability: live slots from the venue vs. a time the venue must confirm. */
export function AvailabilityBadge({ activity }: { activity: Pick<Activity, 'bookingMode' | 'slots'> }) {
  if (activity.bookingMode === 'request') {
    return (
      <View style={[ds.badge, { backgroundColor: D.amberSoft }]}>
        <Icon name="schedule" size={12} color={D.amber} />
        <Text style={[ds.badgeText, { color: D.amber }]}>Request a time</Text>
      </View>
    );
  }
  const open = activity.slots.filter((s) => s.booked < s.capacity).length;
  if (open === 0) {
    return (
      <View style={[ds.badge, { backgroundColor: D.greySoft }]}>
        <Text style={[ds.badgeText, { color: C.muted }]}>No open slots</Text>
      </View>
    );
  }
  return (
    <View style={[ds.badge, { backgroundColor: D.greenSoft }]}>
      <View style={[ds.dot, { backgroundColor: D.green }]} />
      <Text style={[ds.badgeText, { color: D.green }]}>{open} live slot{open > 1 ? 's' : ''}</Text>
    </View>
  );
}

export function StatusPill({ status }: { status: BookingStatus }) {
  const { label, tone } = STATUS_COPY[status];
  const map = {
    sky: [C.accentSoft, '#3B7BBF'], green: [D.greenSoft, D.green], amber: [D.amberSoft, D.amber],
    grey: [D.greySoft, C.muted], red: [D.redSoft, D.red],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[ds.badge, { backgroundColor: bg }]}>
      <Text style={[ds.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={ds.sectionHead}>
      <Text style={ds.sectionTitle}>{title}</Text>
      {action ? (
        <Tap onPress={onAction} accessibilityRole="button" style={{ paddingVertical: 4, paddingLeft: 8 }}>
          <Text style={ds.sectionAction}>{action}</Text>
        </Tap>
      ) : null}
    </View>
  );
}

export function ActivityCard({ activity, width }: { activity: Activity; width?: number }) {
  const router = useRouter();
  const venue = catalogue.venue(activity.venueId);
  const next = activity.slots.filter((s) => s.booked < s.capacity).slice(0, 2);
  return (
    <View style={[ds.card, width ? { width } : null]}>
      <Tap onPress={() => router.push(`/date/activity/${activity.id}`)} pressedStyle={{ opacity: 0.94 }}>
        <ImageBackground source={{ uri: activity.photos[0] }} style={ds.cardImg} imageStyle={ds.cardImgRadius}>
          <Veil id={`ac-${activity.id}`} from={0.55} to={0.45} />
          <View style={ds.cardImgTop}>
            <AvailabilityBadge activity={activity} />
            <SaveButton subject={{ type: 'activity', id: activity.id }} />
          </View>
        </ImageBackground>
        <View style={{ padding: 16 }}>
          <Text style={ds.cardTitle} numberOfLines={1}>{activity.title}</Text>
          <Text style={ds.cardVenue} numberOfLines={1}>{venue?.name} · {venue?.area}</Text>
          <Text style={ds.cardSummary} numberOfLines={2}>{activity.summary}</Text>
          <View style={ds.metaRow}>
            <Text style={ds.price}>{rupees(activity.priceForTwo)}<Text style={ds.priceUnit}>{activity.priceForTwo ? ' for two' : ''}</Text></Text>
            <View style={ds.metaChip}>
              <Icon name="schedule" size={12} color={C.muted} />
              <Text style={ds.metaChipText}>{duration(activity.durationMin)}</Text>
            </View>
          </View>
          {next.length ? (
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {next.map((s) => (
                <View key={s.id} style={ds.slotChip}>
                  <Text style={ds.slotChipText}>{dayLabel(s.startsAt)} · {timeLabel(s.startsAt)}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={ds.viewRow}>
            <Text style={ds.viewText}>View details</Text>
            <Icon name="arrow_forward" size={16} color={C.pri} />
          </View>
        </View>
      </Tap>
    </View>
  );
}

/** Horizontal slot picker. Shows seats honestly; full slots are disabled. */
export function SlotPicker({ slots, value, onChange }: { slots: Slot[]; value: string | null; onChange: (id: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 2 }}>
      {slots.map((s) => {
        const full = s.booked >= s.capacity;
        const left = s.capacity - s.booked;
        const on = value === s.id;
        return (
          <Tap
            key={s.id}
            onPress={full ? undefined : () => onChange(s.id)}
            style={[ds.slot, on ? ds.slotOn : null, full ? { opacity: 0.45 } : null]}
            accessibilityRole="radio"
            accessibilityState={{ checked: on, disabled: full }}
          >
            <Text style={[ds.slotDay, on ? { color: C.white } : null]}>{dayLabel(s.startsAt)}</Text>
            <Text style={[ds.slotTime, on ? { color: C.white } : null]}>{timeLabel(s.startsAt)}</Text>
            <Text style={[ds.slotLeft, on ? { color: 'rgba(255,255,255,0.75)' } : null]}>
              {full ? 'Full' : `${left} of ${s.capacity} open`}
            </Text>
          </Tap>
        );
      })}
    </ScrollView>
  );
}

/** Photo header for detail screens, with floating back + save. */
export function DetailHero({ photo, subject, height = 320, children }: {
  photo: string; subject?: Subject; height?: number; children?: React.ReactNode;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground source={{ uri: photo }} style={{ height, justifyContent: 'space-between', paddingTop: insets.top + 6, padding: 20 }}>
      <Veil id="hero" from={0.3} to={0.75} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Tap onPress={() => router.back()} style={ds.glassBtn} accessibilityLabel="Go back">
          <Icon name="arrow_back" size={22} color={C.white} />
        </Tap>
        {subject ? <SaveButton subject={subject} size={42} /> : null}
      </View>
      <View style={{ marginBottom: 26 }}>{children}</View>
      {/* Page curves up over the photo so there is no hard edge. */}
      <View pointerEvents="none" style={ds.heroLip} />
    </ImageBackground>
  );
}

export function InfoList({ title, items, icon = 'check', tone = 'sky' }: { title: string; items: string[]; icon?: string; tone?: 'sky' | 'muted' }) {
  if (!items.length) return null;
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={ds.listTitle}>{title}</Text>
      {items.map((t) => (
        <View key={t} style={ds.listRow}>
          <Icon name={icon} size={16} color={tone === 'sky' ? C.accent : C.muted} />
          <Text style={ds.listText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export function PreviewNotice() {
  return (
    <View style={ds.preview}>
      <Icon name="info" size={14} color={C.muted} />
      <Text style={ds.previewText}>Preview data — venues, prices and times are samples until partner listings go live.</Text>
    </View>
  );
}

export function Avatar({ uri, size = 32 }: { uri: string; size?: number }) {
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.accentSoft }} />;
}

export function MissingListing() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Icon name="search" size={28} color={C.accent} />
      <Text style={{ color: C.pri, fontSize: 20, marginTop: 10, ...serif }}>This listing isn’t available</Text>
      <Text style={{ color: C.muted, fontSize: 14, marginTop: 6, textAlign: 'center' }}>It may have been paused by the venue.</Text>
      <Tap onPress={() => router.back()} style={{ marginTop: 16, backgroundColor: C.pri, paddingHorizontal: 18, height: 42, borderRadius: 21, justifyContent: 'center' }}>
        <Text style={{ color: C.white, fontWeight: '600' }}>Go back</Text>
      </Tap>
    </View>
  );
}

export const ds = StyleSheet.create({
  saveBtn: { backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  heroLip: {
    position: 'absolute', left: 0, right: 0, bottom: -1, height: 30,
    backgroundColor: C.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30,
  },
  glassBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  dot: { width: 6, height: 6, borderRadius: 3 },

  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 30, marginBottom: 12 },
  sectionTitle: { color: C.pri, fontSize: 21, flexShrink: 1, ...serif },
  sectionAction: { color: C.accent, fontSize: 13, fontWeight: '700' },

  card: { backgroundColor: C.white, borderRadius: 24, ...cardShadow },
  cardImg: { height: 170, padding: 12 },
  cardImgRadius: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  cardImgTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitle: { color: C.pri, fontSize: 19, ...serif },
  cardVenue: { color: C.muted, fontSize: 13, marginTop: 2 },
  cardSummary: { color: C.body, fontSize: 13.5, lineHeight: 19, marginTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  price: { color: C.pri, fontSize: 17, fontWeight: '700' },
  priceUnit: { color: C.muted, fontSize: 12, fontWeight: '500' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F2F6FB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9 },
  metaChipText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  slotChip: { backgroundColor: C.accentSoft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9 },
  slotChipText: { color: C.body, fontSize: 11.5, fontWeight: '600' },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line },
  viewText: { color: C.pri, fontSize: 14, fontWeight: '600' },

  slot: { width: 112, borderRadius: 18, padding: 12, backgroundColor: C.white, borderWidth: 1, borderColor: '#E3ECF5' },
  slotOn: { backgroundColor: C.pri, borderColor: C.pri },
  slotDay: { color: C.muted, fontSize: 12, fontWeight: '600' },
  slotTime: { color: C.pri, fontSize: 17, fontWeight: '700', marginTop: 2 },
  slotLeft: { color: C.muted, fontSize: 11, marginTop: 4 },

  listTitle: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 },
  listRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 4 },
  listText: { color: C.body, fontSize: 14, lineHeight: 20, flex: 1 },

  preview: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, marginTop: 24 },
  previewText: { color: C.muted, fontSize: 11.5, textAlign: 'center', flexShrink: 1 },
});
