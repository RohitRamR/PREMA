import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Animated } from 'react-native';
import Text, { NunitoScope } from '../components/PremaText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { AuraRing } from '../components/Aura';
import { C, Tap, cardShadow, serif } from '../components/prema-ui';
import {
  useConversation, sendMessage, markRead, timeLabel, type Message,
} from '../src/store/chats';

const GROUP_GAP_MS = 10 * 60_000;

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

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(convo.id, text);
    setDraft('');
    setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      sendMessage(convo.id, REPLIES[convo.messages.length % REPLIES.length], 'them');
    }, 2200);
  };

  const scrollToEnd = () => requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

  return (
    <View style={s.screen}>
      <CelestialBackground />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 6 }]}>
        <Tap onPress={() => router.back()} style={s.roundBtn} accessibilityLabel="Go back">
          <Icon name="arrow_back" size={22} color={C.pri} />
        </Tap>
        <Tap style={s.headerId} onPress={() => router.push('/MatchDetail')} pressedStyle={{ opacity: 0.8 }}>
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
            />
          ))}

          {typing ? <TypingBubble photo={convo.photo} /> : null}
        </ScrollView>

        {/* Composer */}
        <View style={[s.composerWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={s.composer}>
            <TextInput
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
    </View>
  );
}

function Bubble({ m, prev, next, photo }: { m: Message; prev?: Message; next?: Message; photo: string }) {
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
        <View
          style={[
            s.bubble,
            mine ? s.mine : s.theirs,
            mine && endsGroup ? { borderBottomRightRadius: 6 } : null,
            !mine && endsGroup ? { borderBottomLeftRadius: 6 } : null,
          ]}
        >
          <Text style={[s.bubbleText, mine ? { color: C.white } : null]}>{m.text}</Text>
        </View>
      </View>
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
});

export default function ChatScreen() {
  return (
    <NunitoScope>
      <ChatScreenInner />
    </NunitoScope>
  );
}
