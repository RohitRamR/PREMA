// Everything that happened while you were away: messages, likes, date invites and reminders.
// Built from the live stores where they exist, so tapping one always lands somewhere real.
import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import Text, { NunitoScope } from '../components/PremaText';
import { C, ScreenHeader, Tap, cardShadow } from '../components/prema-ui';
import { useConversations, timeLabel } from '../src/store/chats';
import { useDateState, catalogue, describe, isUpcoming, whenLabel } from '../src/features/date/store';

type Note = {
  id: string; icon: string; tint: 'pink' | 'sky' | 'amber'; title: string; body: string;
  at: number; photo?: string; href: Href;
};

const HOUR = 3600_000;

export default function Notifications() {
  return (
    <NunitoScope>
      <NotificationsInner />
    </NunitoScope>
  );
}

function NotificationsInner() {
  const router = useRouter();
  const convos = useConversations();
  const { invitations, bookings } = useDateState();
  const [readUpTo, setReadUpTo] = useState(0);

  const notes: Note[] = ([
    ...convos.filter((c) => c.unread > 0).map((c) => ({
      id: `msg-${c.id}`, icon: 'chat_bubble', tint: 'sky' as const,
      title: `${c.name} sent you ${c.unread > 1 ? `${c.unread} notes` : 'a note'}`,
      body: c.messages.at(-1)?.text ?? '', at: c.messages.at(-1)?.at ?? Date.now(), photo: c.photo,
      href: { pathname: '/Chat', params: { id: c.id } } as Href,
    })),
    ...invitations.filter((i) => !i.fromMe && i.status === 'sent').map((i) => {
      const m = convos.find((c) => c.id === i.matchId);
      return {
        id: `inv-${i.id}`, icon: 'local_activity', tint: 'pink' as const,
        title: `${m?.name ?? 'A match'} invited you on a date`,
        body: describe(i.subject)?.title ?? '', at: +new Date(i.createdAt), photo: m?.photo,
        href: '/date/invitations' as Href,
      };
    }),
    ...bookings.filter(isUpcoming).map((b) => ({
      id: `bk-${b.id}`, icon: b.status === 'payment_pending' ? 'payments' : 'event_available', tint: 'amber' as const,
      title: b.status === 'payment_pending' ? 'Payment needed to confirm your date' : 'Upcoming date',
      body: `${describe(b.subject)?.title ?? ''} · ${whenLabel(b.startsAt)}`, at: +new Date(b.createdAt),
      href: (b.status === 'payment_pending' ? `/date/pay/${b.id}` : `/date/booking/${b.id}`) as Href,
    })),
    {
      id: 'likes', icon: 'favorite', tint: 'pink', title: '4 people liked you',
      body: 'Each with a note on something that resonated.', at: Date.now() - 3 * HOUR, href: '/likes',
    },
    {
      id: 'intros', icon: 'auto_awesome', tint: 'sky', title: 'Today’s introductions are ready',
      body: 'Three thoughtful matches, picked for you at 9:00 AM.', at: Date.now() - 6 * HOUR, href: '/(tabs)',
    },
    {
      id: 'event', icon: 'celebration', tint: 'amber', title: `New: ${catalogue.events[0]?.title ?? 'Couples event'}`,
      body: 'A few spots left this weekend.', at: Date.now() - 26 * HOUR,
      href: (catalogue.events[0] ? `/date/event/${catalogue.events[0].id}` : '/date/explore') as Href,
    },
  ] as Note[]).sort((a, b) => b.at - a.at);

  const today = notes.filter((n) => Date.now() - n.at < 24 * HOUR);
  const earlier = notes.filter((n) => Date.now() - n.at >= 24 * HOUR);
  const unreadCount = notes.filter((n) => n.at > readUpTo).length;

  const section = (title: string, list: Note[]) => list.length ? (
    <>
      <Text style={s.section}>{title}</Text>
      <View style={s.card}>
        {list.map((n, i) => {
          const unread = n.at > readUpTo;
          return (
            <Tap key={n.id} onPress={() => router.push(n.href)} style={[s.row, i < list.length - 1 ? s.divider : null]}
              pressedStyle={{ backgroundColor: 'rgba(255,107,139,0.05)' }}>
              <View>
                {n.photo ? <Image source={{ uri: n.photo }} style={s.avatar} /> : (
                  <View style={[s.avatar, s.iconOnly, { backgroundColor: TINT[n.tint].bg }]}>
                    <Icon name={n.icon} size={22} color={TINT[n.tint].fg} />
                  </View>
                )}
                {n.photo ? (
                  <View style={[s.badge, { backgroundColor: TINT[n.tint].fg }]}>
                    <Icon name={n.icon} size={11} color={C.white} />
                  </View>
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.title, unread ? { fontWeight: '900' } : null]} numberOfLines={2}>{n.title}</Text>
                {n.body ? <Text style={s.body} numberOfLines={1}>{n.body}</Text> : null}
                <Text style={s.time}>{timeLabel(n.at)}</Text>
              </View>
              {unread ? <View style={s.dot} /> : null}
            </Tap>
          );
        })}
      </View>
    </>
  ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader
        eyebrow={unreadCount ? `${unreadCount} new` : 'All caught up'}
        title="Notifications"
        right={unreadCount ? (
          <Tap onPress={() => setReadUpTo(Date.now())} style={s.markAll} accessibilityRole="button">
            <Text style={s.markAllText}>Mark all read</Text>
          </Tap>
        ) : undefined}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        {notes.length === 0 ? (
          <View style={s.empty}>
            <Icon name="notifications_none" size={36} color={C.pink} />
            <Text style={s.emptyTitle}>Nothing new yet</Text>
            <Text style={s.emptyBody}>Likes, notes and date invites will show up here.</Text>
          </View>
        ) : null}
        {section('Today', today)}
        {section('Earlier', earlier)}
      </ScrollView>
    </View>
  );
}

const TINT = {
  pink: { bg: C.pinkSoft, fg: C.pink },
  sky: { bg: C.accentSoft, fg: '#3E8FDB' },
  amber: { bg: '#FBF1DC', fg: '#C98A12' },
};

const s = StyleSheet.create({
  section: { color: C.pri, fontSize: 17, fontWeight: '900', marginTop: 18, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: C.white, borderRadius: 24, ...cardShadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.accentSoft },
  iconOnly: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', right: -2, bottom: -2, width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.white, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.pri, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  body: { color: C.muted, fontSize: 13.5, marginTop: 2 },
  time: { color: '#A3AEBD', fontSize: 12, fontWeight: '700', marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.pink },
  markAll: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: C.white },
  markAllText: { color: C.pink, fontSize: 13, fontWeight: '800' },
  empty: { alignItems: 'center', backgroundColor: C.white, borderRadius: 24, padding: 32, marginTop: 20 },
  emptyTitle: { color: C.pri, fontSize: 19, fontWeight: '900', marginTop: 10 },
  emptyBody: { color: C.muted, fontSize: 14, marginTop: 4, textAlign: 'center' },
});
