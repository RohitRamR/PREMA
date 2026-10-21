import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Animated, Alert, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Text, { NunitoScope } from '../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { AuraRing } from '../components/Aura';
import { C, Tap, cardShadow, serif } from '../components/prema-ui';
import {
  useConversation, sendMessage, markRead, timeLabel, removeConversation, reactToMessage, type Message,
} from '../src/store/chats';
import { goBack } from '../components/nav';

const GROUP_GAP_MS = 10 * 60_000;
const REACTIONS = ['❤️', '😂', '😮', '🥹', '👏', '🙏'];
const ICEBREAKERS = [
  'What’s a small thing that made your week?',
  'Mountains or the sea for a slow weekend?',
  'What song have you had on repeat lately?',
  'What’s your most guarded hidden café?',
];

// Gentle canned replies so the demo conversation feels alive.
const REPLIES = [
  'I love that. Tell me more?',
  'That’s such a thoughtful way to put it ✨',
  'Okay, now I’m curious — what made you feel that way?',
  'Same here, honestly. It’s rare to find someone who gets that.',
];

function ChatScreenInner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const convo = useConversation(id);
  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [promptUsed, setPromptUsed] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [menuFor, setMenuFor] = useState<Message | null>(null); // long-pressed message
  const [plusOpen, setPlusOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (id) markRead(id); }, [id]);
  useEffect(() => () => { if (replyTimer.current) clearTimeout(replyTimer.current); }, []);

  if (!convo) {
    return (
      <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: C.muted }}>Conversation not found.</Text>
      </View>
    );
  }

  // Preview only: the match "replies" a moment later and hearts your message.
  const fakeReply = (myText: string) => {
    setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      sendMessage(convo.id, REPLIES[convo.messages.length % REPLIES.length], 'them');
      const mine = [...convo.messages].reverse().find((m) => m.from === 'me' && m.text === myText);
      if (mine) reactToMessage(convo.id, mine.id, '❤️');
    }, 2200);
  };

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    sendMessage(convo.id, text, 'me', replyTo ? { replyTo: { id: replyTo.id, text: replyTo.text || 'Photo', from: replyTo.from } } : undefined);
    setDraft('');
    setReplyTo(null);
    fakeReply(text);
  };
  const send = () => sendText(draft);

  const sendPhoto = async () => {
    setPlusOpen(false);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (res.canceled || !res.assets?.length) return;
    sendMessage(convo.id, '', 'me', { image: res.assets[0].uri });
    fakeReply('');
  };

  // Last message I sent: "Seen" once they've replied after it, otherwise "Delivered".
  const lastMineIdx = convo.messages.map((m) => m.from).lastIndexOf('me');
  const seen = lastMineIdx >= 0 && convo.messages.slice(lastMineIdx + 1).some((m) => m.from === 'them');
  const last = convo.messages.at(-1);
  const suggestions = last?.from === 'them' && !draft
    ? [last.text.includes('?') ? 'Ooh, good question…' : 'Tell me more 🙂', 'Haha, love that', 'Let’s plan a date?']
    : [];

  const openOptions = () => Alert.alert(convo.name, undefined, [
    { text: 'View profile', onPress: () => router.push({ pathname: '/MatchDetail', params: { id: convo.id } }) },
    { text: 'Plan a date', onPress: () => router.push({ pathname: '/date/plan', params: { match: convo.id } }) },
    { text: 'Unmatch', style: 'destructive', onPress: () => Alert.alert(`Unmatch ${convo.name}?`, 'Your chat will be removed for both of you. This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unmatch', style: 'destructive', onPress: () => { removeConversation(convo.id); goBack(router); } },
    ]) },
    { text: 'Report', style: 'destructive', onPress: () => router.push({ pathname: '/Report', params: { id: convo.id } }) },
    { text: 'Cancel', style: 'cancel' },
  ]);

  const scrollToEnd = () => requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

  return (
    <View style={s.screen}>
      <CelestialBackground />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 6 }]}>
        <Tap onPress={() => goBack(router)} style={s.roundBtn} accessibilityLabel="Go back">
          <Icon name="arrow_back" size={22} color={C.pri} />
        </Tap>
        <Tap style={s.headerId} onPress={() => router.push({ pathname: '/MatchDetail', params: { id: convo.id } })} pressedStyle={{ opacity: 0.8 }}>
          <View>
            <AuraRing score={convo.match} size={46} stroke={2.5} gap={2}>
              <Image source={{ uri: convo.photo }} style={{ width: '100%', height: '100%' }} />
            </AuraRing>
            {convo.online ? <View style={s.online} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerName} numberOfLines={1}>{convo.name}, {convo.age}</Text>
            <Text style={s.headerSub} numberOfLines={1}>
              {typing ? 'writing a note…' : convo.online ? 'Here now' : convo.city}
            </Text>
          </View>
        </Tap>
        <Tap onPress={openOptions} style={s.roundBtn} accessibilityLabel="Chat options">
          <Icon name="more_horiz" size={22} color={C.pri} />
        </Tap>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}
        >
          {/* Guided prompt card */}
          <View style={s.promptCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Icon name="spa" size={14} color={C.accent} />
              <Text style={s.promptLabel}>Today’s deep prompt</Text>
            </View>
            <Text style={s.promptText}>“{convo.prompt}”</Text>
            {!promptUsed ? (
              <Tap
                style={s.promptBtn}
                onPress={() => { setDraft((d) => d || ''); setPromptUsed(true); }}
              >
                <Text style={s.promptBtnText}>Answer together</Text>
                <Icon name="arrow_forward" size={16} color={C.pri} />
              </Tap>
            ) : (
              <Text style={s.promptHint}>Share your answer below — it’ll appear in your thread for {convo.name}.</Text>
            )}
          </View>

          {convo.messages.map((m, i) => (
            <Bubble
              key={m.id}
              m={m}
              prev={convo.messages[i - 1]}
              next={convo.messages[i + 1]}
              photo={convo.photo}
              name={convo.name}
              status={i === lastMineIdx ? (seen ? 'Seen' : 'Delivered') : undefined}
              onLongPress={() => setMenuFor(m)}
              onDoubleTap={() => m.from === 'them' && reactToMessage(convo.id, m.id, '❤️')}
            />
          ))}

          {typing ? <TypingBubble photo={convo.photo} /> : null}
        </ScrollView>

        {/* Composer */}
        <View style={[s.composerWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {suggestions.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.suggestRow}>
              {suggestions.map((t) => (
                <Tap key={t} onPress={() => (t === 'Let’s plan a date?' ? router.push({ pathname: '/date/plan', params: { match: convo.id } }) : sendText(t))} style={s.suggest}>
                  <Text style={s.suggestText}>{t}</Text>
                </Tap>
              ))}
            </ScrollView>
          ) : null}
          {replyTo ? (
            <View style={s.replyBar}>
              <View style={s.replyLine} />
              <View style={{ flex: 1 }}>
                <Text style={s.replyWho}>Replying to {replyTo.from === 'me' ? 'yourself' : convo.name}</Text>
                <Text style={s.replyText} numberOfLines={1}>{replyTo.text || 'Photo'}</Text>
              </View>
              <Tap onPress={() => setReplyTo(null)} accessibilityLabel="Cancel reply" style={s.replyClose}>
                <Icon name="close" size={16} color={C.muted} />
              </Tap>
            </View>
          ) : null}
          <View style={s.composer}>
            <Tap onPress={() => setPlusOpen(true)} style={s.plusBtn} accessibilityLabel="More: photo, plan a date, icebreaker">
              <Icon name="add" size={22} color={C.pri} />
            </Tap>
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              placeholder={promptUsed ? 'Your answer…' : `Write to ${convo.name}…`}
              placeholderTextColor="#A9B4C2"
              multiline
              style={s.input}
              onFocus={scrollToEnd}
            />
            <Tap
              onPress={send}
              style={[s.sendBtn, !draft.trim() ? s.sendBtnOff : null]}
              pressedStyle={{ opacity: 0.85 }}
              accessibilityLabel="Send message"
              accessibilityState={{ disabled: !draft.trim() }}
            >
              <Icon name="send" size={18} color={C.white} />
            </Tap>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Long-press menu: react or reply */}
      <Modal visible={!!menuFor} transparent animationType="fade" onRequestClose={() => setMenuFor(null)}>
        <Pressable style={s.backdrop} onPress={() => setMenuFor(null)}>
          <View style={s.menu}>
            <View style={s.reactRow}>
              {REACTIONS.map((e) => (
                <Tap key={e} onPress={() => { if (menuFor) reactToMessage(convo.id, menuFor.id, e); setMenuFor(null); }}
                  style={[s.reactBtn, menuFor?.reaction === e ? s.reactOn : null]} accessibilityLabel={`React ${e}`}>
                  <Text style={{ fontSize: 26 }}>{e}</Text>
                </Tap>
              ))}
            </View>
            <Text style={s.menuPreview} numberOfLines={2}>{menuFor?.text || 'Photo'}</Text>
            <Tap onPress={() => { setReplyTo(menuFor); setMenuFor(null); requestAnimationFrame(() => inputRef.current?.focus()); }} style={s.menuRow}>
              <Icon name="reply" size={20} color={C.pri} /><Text style={s.menuText}>Reply</Text>
            </Tap>
            {menuFor?.from === 'them' ? (
              <Tap onPress={() => { setMenuFor(null); router.push({ pathname: '/Report', params: { id: convo.id } }); }} style={[s.menuRow, { borderBottomWidth: 0 }]}>
                <Icon name="flag" size={20} color={C.danger} /><Text style={[s.menuText, { color: C.danger }]}>Report message</Text>
              </Tap>
            ) : null}
          </View>
        </Pressable>
      </Modal>

      {/* "+" menu: photo, plan a date, icebreaker */}
      <Modal visible={plusOpen} transparent animationType="slide" onRequestClose={() => setPlusOpen(false)}>
        <Pressable style={s.backdrop} onPress={() => setPlusOpen(false)}>
          <Pressable style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]} onPress={() => {}}>
            <View style={s.handle} />
            <View style={s.sheetGrid}>
              <SheetItem icon="photo" label="Photo" onPress={sendPhoto} />
              <SheetItem icon="local_activity" label="Plan a date" onPress={() => { setPlusOpen(false); router.push({ pathname: '/date/plan', params: { match: convo.id } }); }} />
              <SheetItem icon="spa" label="Deep prompt" onPress={() => { setPlusOpen(false); setPromptUsed(true); setDraft(convo.prompt + ' '); requestAnimationFrame(() => inputRef.current?.focus()); }} />
            </View>
            <Text style={s.sheetLabel}>Icebreakers</Text>
            {ICEBREAKERS.map((q) => (
              <Tap key={q} onPress={() => { setPlusOpen(false); setDraft(q); requestAnimationFrame(() => inputRef.current?.focus()); }} style={s.ice}>
                <Icon name="auto_awesome" size={16} color={C.pink} />
                <Text style={s.iceText}>{q}</Text>
              </Tap>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function SheetItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Tap onPress={onPress} style={s.sheetItem} accessibilityRole="button">
      <View style={s.sheetIcon}><Icon name={icon} size={24} color={C.pink} /></View>
      <Text style={s.sheetItemText}>{label}</Text>
    </Tap>
  );
}

function Bubble({ m, prev, next, photo, name, status, onLongPress, onDoubleTap }: {
  m: Message; prev?: Message; next?: Message; photo: string; name: string;
  status?: string; onLongPress: () => void; onDoubleTap: () => void;
}) {
  const lastTap = useRef(0);
  const onPress = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) onDoubleTap();
    lastTap.current = now;
  };
  const mine = m.from === 'me';
  const startsGroup = !prev || prev.from !== m.from || m.at - prev.at > GROUP_GAP_MS;
  const endsGroup = !next || next.from !== m.from || next.at - m.at > GROUP_GAP_MS;
  const showTime = !prev || m.at - prev.at > GROUP_GAP_MS;

  return (
    <>
      {showTime ? <Text style={s.stamp}>{timeLabel(m.at)}</Text> : null}
      <View style={[s.bubbleRow, mine ? { justifyContent: 'flex-end' } : null, { marginTop: startsGroup ? 10 : 3 }]}>
        {!mine ? (
          endsGroup ? <Image source={{ uri: photo }} style={s.bubbleAvatar} /> : <View style={{ width: 28 }} />
        ) : null}
        <Tap
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={300}
          pressedStyle={{ opacity: 0.85 }}
          accessibilityHint="Double-tap to like, long-press for more"
          style={[
            s.bubble,
            mine ? s.mine : s.theirs,
            m.image && !m.text ? { padding: 4 } : null,
            mine && endsGroup ? { borderBottomRightRadius: 6 } : null,
            !mine && endsGroup ? { borderBottomLeftRadius: 6 } : null,
            m.reaction ? { marginBottom: 12 } : null,
          ]}
        >
          {m.replyTo ? (
            <View style={[s.quote, mine ? s.quoteMine : null]}>
              <Text style={[s.quoteWho, mine ? { color: 'rgba(255,255,255,0.8)' } : null]}>{m.replyTo.from === 'me' ? 'You' : name}</Text>
              <Text style={[s.quoteText, mine ? { color: 'rgba(255,255,255,0.85)' } : null]} numberOfLines={2}>{m.replyTo.text}</Text>
            </View>
          ) : null}
          {m.image ? <Image source={{ uri: m.image }} style={s.photo} /> : null}
          {m.text ? <Text style={[s.bubbleText, mine ? { color: C.white } : null]}>{m.text}</Text> : null}
          {m.reaction ? (
            <View style={[s.reaction, mine ? { left: -6 } : { right: -6 }]}>
              <Text style={{ fontSize: 14 }}>{m.reaction}</Text>
            </View>
          ) : null}
        </Tap>
      </View>
      {status ? <Text style={s.status}>{status}</Text> : null}
    </>
  );
}

function TypingBubble({ photo }: { photo: string }) {
  const dots = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];
  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 160),
        Animated.timing(d, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0.3, duration: 320, useNativeDriver: true }),
        Animated.delay((2 - i) * 160),
      ])),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);
  return (
    <View style={[s.bubbleRow, { marginTop: 10 }]}>
      <Image source={{ uri: photo }} style={s.bubbleAvatar} />
      <View style={[s.bubble, s.theirs, { flexDirection: 'row', gap: 5, paddingVertical: 16, borderBottomLeftRadius: 6 }]}>
        {dots.map((d, i) => (
          <Animated.View key={i} style={[s.dot, { opacity: d, transform: [{ scale: d }] }]} />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(241,247,253,0.94)', borderBottomWidth: 1, borderBottomColor: '#E3ECF5',
  },
  roundBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center', ...cardShadow,
  },
  headerId: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.accentSoft },
  online: {
    position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#4CC38A', borderWidth: 2, borderColor: C.white,
  },
  headerName: { color: C.pri, fontSize: 17, fontWeight: '700' },
  headerSub: { color: C.muted, fontSize: 12, marginTop: 1 },
  alignPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14,
  },
  alignText: { color: C.white, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  promptCard: {
    backgroundColor: C.accentSoft, borderRadius: 22, padding: 18, marginBottom: 8, marginTop: 4,
    borderWidth: 1, borderColor: '#D6E6F6',
  },
  promptLabel: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  promptText: { color: C.pri, fontSize: 19, lineHeight: 27, ...serif },
  promptBtn: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14,
    backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18,
  },
  promptBtnText: { color: C.pri, fontSize: 13, fontWeight: '700' },
  promptHint: { color: C.body, fontSize: 13, marginTop: 10 },

  stamp: { alignSelf: 'center', color: C.muted, fontSize: 11, fontWeight: '600', marginTop: 16, letterSpacing: 0.3 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.accentSoft },
  bubble: { maxWidth: '76%', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22 },
  theirs: { backgroundColor: C.white, ...cardShadow },
  mine: {
    backgroundColor: C.pri,
    shadowColor: C.pri, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 2,
  },
  bubbleText: { color: C.pri, fontSize: 15.5, lineHeight: 22 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.accent },

  composerWrap: {
    paddingHorizontal: 12, paddingTop: 10,
    backgroundColor: 'rgba(241,247,253,0.96)', borderTopWidth: 1, borderTopColor: '#E3ECF5',
  },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: C.white, borderRadius: 26, paddingLeft: 18, paddingRight: 6, paddingVertical: 6,
    ...cardShadow,
  },
  input: { flex: 1, fontSize: 16, color: C.pri, maxHeight: 120, paddingTop: 10, paddingBottom: 10, fontFamily: 'Nunito_600SemiBold' },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.pink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 3,
  },
  sendBtnOff: { backgroundColor: '#F5B9C6', shadowOpacity: 0 },
  plusBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center', marginLeft: -10, marginBottom: 2 },
  suggestRow: { gap: 8, paddingBottom: 10, paddingHorizontal: 2 },
  suggest: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: C.white, borderWidth: 1, borderColor: '#FBD3DD' },
  suggestText: { color: C.pri, fontSize: 13.5, fontWeight: '700' },
  replyBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, padding: 10, borderRadius: 16, backgroundColor: C.white },
  replyLine: { width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: C.pink },
  replyWho: { color: C.pink, fontSize: 12.5, fontWeight: '800' },
  replyText: { color: C.body, fontSize: 13.5, marginTop: 1 },
  replyClose: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F2F6FB', alignItems: 'center', justifyContent: 'center' },
  quote: { borderLeftWidth: 3, borderLeftColor: C.pink, paddingLeft: 8, marginBottom: 6, opacity: 0.9 },
  quoteMine: { borderLeftColor: '#FFC2CF' },
  quoteWho: { color: C.pink, fontSize: 12, fontWeight: '800' },
  quoteText: { color: C.body, fontSize: 13, lineHeight: 18 },
  photo: { width: 200, height: 240, borderRadius: 18, backgroundColor: C.accentSoft },
  reaction: { position: 'absolute', bottom: -14, minWidth: 28, height: 26, paddingHorizontal: 5, borderRadius: 13, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...cardShadow },
  status: { alignSelf: 'flex-end', color: C.muted, fontSize: 11.5, fontWeight: '700', marginTop: 4, marginRight: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(26,46,68,0.35)', justifyContent: 'flex-end' },
  menu: { margin: 16, marginBottom: 40, backgroundColor: C.white, borderRadius: 26, padding: 14, ...cardShadow },
  reactRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  reactBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  reactOn: { backgroundColor: C.pinkSoft },
  menuPreview: { color: C.muted, fontSize: 13.5, paddingVertical: 10, paddingHorizontal: 4 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.line },
  menuText: { color: C.pri, fontSize: 16, fontWeight: '700' },
  sheet: { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: '#D5DEE9', marginBottom: 16 },
  sheetGrid: { flexDirection: 'row', gap: 10 },
  sheetItem: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: 20, backgroundColor: '#FFF7F9' },
  sheetIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  sheetItemText: { color: C.pri, fontSize: 13.5, fontWeight: '800' },
  sheetLabel: { color: C.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 20, marginBottom: 6 },
  ice: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  iceText: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '600' },
});

export default function ChatScreen() {
  return (
    <NunitoScope>
      <ChatScreenInner />
    </NunitoScope>
  );
}
