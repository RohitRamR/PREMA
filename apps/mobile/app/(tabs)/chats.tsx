import React, { useMemo, useState } from 'react';
import { View, Image, ScrollView, TextInput, StyleSheet } from 'react-native';
import Text, { NunitoScope } from '../../components/PremaText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { AuraLegend, AuraRing } from '../../components/Aura';
import { C, Tap, cardShadow, serif } from '../../components/prema-ui';
import { useConversations, NEW_MATCHES, timeLabel } from '../../src/store/chats';
import { useScoreOf } from '../../src/features/compatibility';
import StatusFade from '../../components/StatusFade';

function ChatsTabInner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scoreFor = useScoreOf();
  const conversations = useConversations();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...conversations]
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .sort((a, b) => (b.messages.at(-1)?.at ?? 0) - (a.messages.at(-1)?.at ?? 0));
  }, [conversations, query]);


  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 150 }}
      >
        {/* Header */}
        <View style={s.header}>
<Logo width={74} height={31} tintColor="#2C496A" style={{ marginBottom: 2 }} />
          <Text style={s.title}>Love Notes</Text>
        </View>

        {/* Search */}
        <View style={s.search}>
          <Icon name="search" size={20} color={C.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your notes"
            placeholderTextColor="#A9B4C2"
            style={s.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* New matches */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 24 }}>
          <Text style={s.sectionLabel}>New connections</Text>
          <AuraLegend style={{ marginTop: 12 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          {NEW_MATCHES.filter((m) => !conversations.some((c) => c.id === m.id)).map((m) => (
            <Tap key={m.id} style={{ alignItems: 'center', width: 72 }} onPress={() => router.push({ pathname: '/MatchDetail', params: { id: m.id } })}>
              <AuraRing score={scoreFor(m.id, m.match)} size={70}>
                <Image source={{ uri: m.photo }} style={{ width: '100%', height: '100%' }} />
              </AuraRing>
              <Text style={s.matchName} numberOfLines={1}>{m.name}</Text>
            </Tap>
          ))}
        </ScrollView>

        {/* Conversations */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>Messages</Text>
        <View style={s.listCard}>
          {list.length === 0 ? (
            <View style={s.empty}>
              <Icon name="forum" size={28} color={C.accent} />
              <Text style={s.emptyTitle}>No conversations found</Text>
              <Text style={s.emptySub}>Try another name.</Text>
            </View>
          ) : list.map((c, i) => {
            const last = c.messages.at(-1);
            const unread = c.unread > 0;
            return (
              <Tap
                key={c.id}
                onPress={() => router.push({ pathname: '/Chat', params: { id: c.id } })}
                style={[s.row, i < list.length - 1 ? s.rowDivider : null]}
                pressedStyle={{ backgroundColor: 'rgba(116,180,242,0.06)' }}
                accessibilityLabel={`${c.name}${unread ? `, ${c.unread} unread` : ''}`}
              >
                <AuraRing score={scoreFor(c.id, c.match)} size={56} stroke={2.5} gap={2}>
                  <Image source={{ uri: c.photo }} style={{ width: '100%', height: '100%' }} />
                </AuraRing>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={s.rowTop}>
                    <Text style={s.name} numberOfLines={1}>{c.name}</Text>
                    <Text style={s.time}>{last ? timeLabel(last.at) : ''}</Text>
                  </View>
                  <Text style={[s.preview, unread ? s.previewUnread : null]} numberOfLines={1}>
                    {last ? `${last.from === 'me' ? 'You: ' : ''}${last.text || '📷 Photo'}` : 'New match · say hello'}
                  </Text>
                </View>
              </Tap>
            );
          })}
        </View>

        <View style={s.footerNote}>
          <Icon name="spa" size={16} color={C.muted} />
          <Text style={s.footerText}>Love notes open only with mutual connections.</Text>
        </View>
      </ScrollView>

      <StatusFade />
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 24, marginBottom: 16 },
  eyebrow: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { color: C.pri, fontSize: 34, lineHeight: 42, ...serif },

  search: {
    marginHorizontal: 20, height: 48, borderRadius: 24, backgroundColor: C.white,
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, ...cardShadow,
  },
  searchInput: { flex: 1, fontSize: 15, color: C.pri, fontFamily: 'Nunito_600SemiBold' },

  auraHelp: { color: C.muted, fontSize: 12.5, fontWeight: '700' },
  sectionLabel: {
    color: C.muted, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase',
    marginTop: 24, marginBottom: 12, marginLeft: 24,
  },

  matchRing: {
    width: 68, height: 68, borderRadius: 34, padding: 3,
    borderWidth: 2, borderColor: C.pink, alignItems: 'center', justifyContent: 'center',
  },
  matchAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.accentSoft },
  matchBadge: {
    marginTop: -10, backgroundColor: C.white, paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1, borderColor: '#F3D5DD',
  },
  matchBadgeText: { color: C.pink, fontSize: 10, fontWeight: '800' },
  matchName: { color: C.pri, fontSize: 13, fontWeight: '600', marginTop: 4 },

  listCard: { marginHorizontal: 20, backgroundColor: C.white, borderRadius: 24, paddingVertical: 4, ...cardShadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 13 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.accentSoft },
  online: {
    position: 'absolute', right: 1, bottom: 1, width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#4CC38A', borderWidth: 2.5, borderColor: C.white,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: C.pri, fontSize: 16.5, fontWeight: '700', flex: 1 },
  previewUnread: { color: C.pri, fontWeight: '800' },
  time: { color: C.muted, fontSize: 12 },
  preview: { color: C.muted, fontSize: 14 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  matchPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  matchPillText: { color: C.body, fontSize: 11, fontWeight: '700' },
  yourTurn: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  unread: {
    marginLeft: 'auto', minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6,
    backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
  },
  unreadText: { color: C.white, fontSize: 12, fontWeight: '800' },

  empty: { alignItems: 'center', paddingVertical: 36, gap: 6 },
  emptyTitle: { color: C.pri, fontSize: 16, fontWeight: '700', marginTop: 4 },
  emptySub: { color: C.muted, fontSize: 13 },

  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  footerText: { color: C.muted, fontSize: 12 },
});

export default function ChatsTab() {
  return (
    <NunitoScope>
      <ChatsTabInner />
    </NunitoScope>
  );
}
