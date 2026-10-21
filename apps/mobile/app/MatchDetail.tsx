import React, { useRef, useState } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet, Animated, Easing, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import Icon from '../components/Icon';
import CelestialBackground from '../components/CelestialBackground';
import Text, { NunitoScope } from '../components/PremaText';
import { Tap } from '../components/prema-ui';
import CupidArrow from '../components/CupidArrow';
import { sendMessage, hasConversation } from '../src/store/chats';
import { person, type Person } from '../src/store/people';
import { Alert, Share } from 'react-native';
import { blockPerson } from '../src/store/safety';
import { useProfile, VITAL_FIELDS, type Profile } from '../src/store/profile';
import { goBack } from '../components/nav';
import { useCompatibility, type CompatView } from '../src/features/compatibility';

const { width, height } = Dimensions.get('window');
// The hero photo sits inset from the screen edges with soft curved corners.
const HERO_GAP = 10;
const HERO_W = width - HERO_GAP * 2;
// Pink gradient frame drawn around each profile photo.
const FRAME = 4;
const PHOTO_W = HERO_W - FRAME * 2;

const C = {
  bg: '#F1F7FD',
  ink: '#2C496A',
  body: '#4A6585',
  muted: '#7D8DA3',
  blue: '#74B4F2',
  pink: '#FF6B8B',
  navy: '#1A2E44',
};

// Demo match. Your own profile renders through the same layout via ?me=1.
const ANANYA = {
  chatId: 'ananya',
  name: 'Ananya',
  age: 24,
  location: 'Chennai • Alwarpet',
  occupation: 'Architectural Historian',
  match: '96%',
  bio: 'I spend my days tracing the forgotten histories of Chettinad homes and my evenings trying to perfect my grandmother’s rasam recipe.',
  lookingFor: 'Life partner · in the next 1–2 years',
  vitals: {
    height: '5′4″', religion: 'Hindu', languages: 'Tamil, English',
    education: 'M.Arch, SPA', diet: 'Vegetarian', family: 'Close-knit',
  },

  photoCaption: 'Kanadukathan, last monsoon',
  voice: { question: 'My grandmother taught me…', recorded: true, seconds: 24 },
  prompts: [
    {
      question: 'Sundays are sacred for…',
      answer: 'Slow filter coffee, hunting for vintage maps in Moore Market, and dinners cooked together without any screens.'
    },
    {
      question: 'A boundary I firmly hold…',
      answer: 'No work talk after 8 PM. Life is too short to optimize every hour.'
    }
  ],
  // How well you fit, shown as a ring + three bars.
  fit: {
    score: 96,
    summary: 'Same intent, same pace, three shared loves.',
    parts: [
      { label: 'Values', value: 98, color: '#FF6B8B' },
      { label: 'Intent', value: 100, color: '#FF6B8B' },
      { label: 'Lifestyle', value: 89, color: '#74B4F2' },
    ],
  },
  interests: ['Filter coffee', 'Architecture', 'Slow living', 'Carnatic music', 'Heritage walks', 'Sketching', 'Rasam perfectionist'],

  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&q=80&w=1200'
  ],
  archetype: {
    title: 'Vrishabha · Taurus Earth',
    desc: 'Her Earth core grounds your Water placements: steady, warm, unhurried.'
  }
};

type ProfileView = {
  chatId?: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  lookingFor: string;
  vitals: { icon: string; k: string; v: string }[];
  prompts: { question: string; answer: string }[];
  photos: string[];
  photoCaption: string;
  voice: { question: string; recorded: boolean; seconds: number };
  interests: { label: string; shared: boolean }[];
  fit?: typeof ANANYA.fit;
  archetype?: { title: string; desc: string };
};

const vitalList = (v: Profile['vitals']) =>
  VITAL_FIELDS.filter((f) => v[f.key]?.trim()).map((f) => ({ icon: f.icon, k: f.label, v: v[f.key] }));

const sameText = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Real "Why you two click" ring, bars and moon-sign card from the matching engine. */
function withEngine(view: ProfileView, c: CompatView | null): ProfileView {
  if (!c) return view;
  const bar = (label: string, value: number, color: string) => ({ label, value, color });
  return {
    ...view,
    fit: {
      score: c.score,
      summary: c.headline,
      parts: [
        bar('Cosmo', c.ratings.cosmo.value, '#FF6B8B'),
        ...(c.ratings.heart ? [bar('Heart', c.ratings.heart.value, '#74B4F2')] : []),
      ],
    },
    archetype: {
      title: `${c.them.moonSign} · ${c.them.moonSignEnglish} Moon`,
      desc: `${c.them.nakshatra} nakshatra. ${c.elements}`,
    },
  };
}


/** Someone else's profile, with interests you both listed marked as shared. */
/** Someone other than Ananya: built from the shared people list. */
function personView(mine: Profile, p: Person): ProfileView {
  return {
    chatId: p.id,
    name: p.name,
    age: p.age,
    location: p.city,
    bio: p.bio,
    lookingFor: p.lookingFor,
    vitals: [{ icon: 'work_outline', k: 'Works as', v: p.job }],
    prompts: [p.prompt, { question: '', answer: '' }],
    photos: p.photos,
    photoCaption: '',
    voice: { question: '', recorded: false, seconds: 0 },
    interests: p.interests
      .map((t) => ({ label: t, shared: mine.interests.some((m) => sameText(m, t)) }))
      .sort((x, y) => Number(y.shared) - Number(x.shared)),
    fit: {
      score: p.match,
      summary: 'Shared intent and a similar pace.',
      parts: [
        { label: 'Values', value: Math.min(100, p.match + 2), color: '#FF6B8B' },
        { label: 'Intent', value: p.match, color: '#FF6B8B' },
        { label: 'Lifestyle', value: Math.max(60, p.match - 6), color: '#74B4F2' },
      ],
    },
  };
}

function matchView(mine: Profile): ProfileView {
  return {
    ...ANANYA,
    lookingFor: ANANYA.lookingFor,
    vitals: vitalList(ANANYA.vitals),
    interests: ANANYA.interests
      .map((t) => ({ label: t, shared: mine.interests.some((m) => sameText(m, t)) }))
      .sort((x, y) => Number(y.shared) - Number(x.shared)),
  };
}

/** Your own profile exactly as others will see it — everything comes from Edit Profile. */
function myView(mine: Profile): ProfileView {
  return {
    name: mine.name,
    age: mine.age,
    location: mine.location,
    bio: mine.about,
    lookingFor: mine.intent,
    vitals: vitalList(mine.vitals),
    prompts: [mine.prompt, { question: 'A boundary I firmly hold…', answer: mine.boundary }],
    photos: mine.photos,
    photoCaption: mine.photoCaption,
    voice: mine.voice,
    interests: mine.interests.map((t) => ({ label: t, shared: false })),
  };
}

// Fixed pseudo-random heights so the voice waveform looks natural.
const WAVE = Array.from({ length: 28 }, (_, k) => 10 + ((k * 37) % 23));

/** Small round heart used to react to a photo or answer. */
function ReactHeart({ on, onPress, solid }: { on: boolean; onPress: () => void; solid?: boolean }) {
  return (
    <Tap
      onPress={onPress}
      style={solid ? s.reactSolid : s.reactSoft}
      pressedStyle={{ transform: [{ scale: 0.92 }] }}
      accessibilityLabel={on ? 'Reacted' : 'React and send a note'}
    >
      <Icon name={on ? 'favorite' : 'favorite_border'} size={solid ? 22 : 20} color={C.pink} />
    </Tap>
  );
}

/** Circular match score: a pink arc filled to the score. */
function ScoreRing({ score, size = 64, stroke = 7 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }} accessible accessibilityLabel={`${score} percent match`}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#FFE0E8" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r} stroke={C.pink} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${(circ * score) / 100} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: C.ink, fontSize: 17, fontWeight: '900' }}>{score}%</Text>
      </View>
    </View>
  );
}

/** Rounded pink gradient frame that sits behind a photo card. */
function PinkFrame({ id, radius, style, children }: { id: string; radius: number; style?: object; children: React.ReactNode }) {
  return (
    <View style={[{ width: HERO_W, borderRadius: radius, padding: FRAME, overflow: 'hidden' }, style]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFB3C6" />
            <Stop offset="0.5" stopColor="#FF8FAB" />
            <Stop offset="1" stopColor="#FF5C80" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

/** Vertical fade drawn with SVG (no extra native gradient dependency). */
function Fade({ id, color, from, to, style }: { id: string; color: string; from: number; to: number; style: object }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={from} />
            <Stop offset="1" stopColor={color} stopOpacity={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

export default function MatchDetail() {
  const router = useRouter();
  const { me, id } = useLocalSearchParams<{ me?: string; id?: string }>();
  const isMe = me === '1';
  const other = person(id);
  const mine = useProfile();
  const compat = useCompatibility(isMe ? undefined : other?.id ?? 'ananya');
  const P = isMe ? myView(mine) : withEngine(other ? personView(mine, other) : matchView(mine), compat);
  const sharedCount = P.interests.filter((t) => t.shared).length;
  const insets = useSafeAreaInsets();
  const [activePhoto, setActivePhoto] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [reacted, setReacted] = useState<Record<string, boolean>>({});
  const [playing, setPlaying] = useState(false);
  // Photo ends above the floating note button so nothing overlaps the name.
  const heroH = height - insets.top - Math.max(insets.bottom, 16) - 96;

  // Dock open/close: one animated value drives width, colour and content fade.
  const dock = useRef(new Animated.Value(0)).current;
  const toggleDock = () => {
    if (!isDockExpanded) {
      setIsDockExpanded(true);
      Animated.spring(dock, { toValue: 1, useNativeDriver: false, damping: 20, stiffness: 160, mass: 0.9 }).start();
    } else {
      Animated.timing(dock, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false })
        .start(() => setIsDockExpanded(false));
    }
  };
  // Send the note into her conversation and jump straight to the chat.
  const sendNote = () => {
    const text = note.trim();
    const chatId = P.chatId ?? 'ananya';
    setNote('');
    dock.setValue(0);
    setIsDockExpanded(false);
    // You can only chat with mutual matches. Otherwise the note travels with your like.
    if (!hasConversation(chatId)) {
      Alert.alert('Arrow sent', `${P.name} will see your note with your like. If she likes you back, you can chat.`);
      return;
    }
    if (text) sendMessage(chatId, text);
    router.push({ pathname: '/Chat', params: { id: chatId } });
  };
  // Safety actions from the ••• menu and the links at the bottom.
  const targetId = P.chatId ?? 'ananya';
  const shareProfile = () => Share.share({ message: `Have a look at ${P.name} on Prema.` });
  const reportProfile = () => router.push({ pathname: '/Report', params: { id: targetId } });
  const hideProfile = () => Alert.alert(`Hide ${P.name}?`, 'You won’t see each other in Discover again.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Hide', style: 'destructive', onPress: () => { blockPerson(targetId); goBack(router); } },
  ]);
  const openMenu = () => Alert.alert(P.name, undefined, [
    { text: 'Share profile', onPress: shareProfile },
    { text: `Hide ${P.name}`, onPress: hideProfile },
    { text: 'Report', style: 'destructive', onPress: reportProfile },
    { text: 'Cancel', style: 'cancel' },
  ]);

  // Reacting to a photo or answer marks it and opens the note bar.
  const react = (key: string) => () => {
    setReacted((r) => ({ ...r, [key]: true }));
    if (!isDockExpanded) toggleDock();
  };
  const dockWidth = dock.interpolate({ inputRange: [0, 1], outputRange: [68, width - 32] });
  const dockBg = dock.interpolate({ inputRange: [0, 1], outputRange: ['#FFFFFF', C.navy] });
  const dockContent = dock.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 0, 1] });
  const dockSlide = dock.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  // The arrow tilts up as if aimed, then levels out as the bar opens.
  const sparkSpin = dock.interpolate({ inputRange: [0, 1], outputRange: ['-35deg', '0deg'] });
  const fit = isMe ? undefined : P.fit;
  const voiceLength = `0:${String(P.voice.seconds).padStart(2, '0')}`;

  return (
    <NunitoScope>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <CelestialBackground />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

          {/* ── Hero photo, framed ── */}
          <PinkFrame id="heroFrame" radius={36 + FRAME} style={{ marginHorizontal: HERO_GAP, marginTop: insets.top + 4 }}>
          <View style={[s.hero, { height: heroH - FRAME * 2 }]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => setActivePhoto(Math.round(e.nativeEvent.contentOffset.x / PHOTO_W))}
              scrollEventThrottle={16}
            >
              {P.photos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={{ width: PHOTO_W, height: heroH - FRAME * 2 }} resizeMode="cover" />
              ))}
            </ScrollView>

            <Fade id="heroTop" color={C.navy} from={0.45} to={0} style={[s.fill, { height: 150 }]} />
            <Fade id="heroBottom" color={C.navy} from={0} to={0.88} style={[s.fill, { top: undefined, bottom: 0, height: 320 }]} />

            {/* Story-style photo bars */}
            <View style={s.bars} pointerEvents="none">
              {P.photos.map((_, i) => (
                <View key={i} style={[s.bar, { backgroundColor: i === activePhoto ? '#FFFFFF' : 'rgba(255,255,255,0.38)' }]} />
              ))}
            </View>

            {/* Top controls */}
            <View style={s.topRow}>
              <Tap onPress={() => goBack(router)} style={s.glassBtn} pressedStyle={{ opacity: 0.7 }} accessibilityLabel="Go back">
                <Icon name="arrow_back" size={22} color="#FFFFFF" />
              </Tap>
              {isMe ? (
                <Tap onPress={() => router.push('/EditProfile')} style={s.glassBtn} pressedStyle={{ opacity: 0.7 }} accessibilityLabel="Edit profile">
                  <Icon name="edit" size={20} color="#FFFFFF" />
                </Tap>
              ) : (
                <Tap onPress={openMenu} style={s.glassBtn} pressedStyle={{ opacity: 0.7 }} accessibilityLabel="More options">
                  <Icon name="more_horiz" size={22} color="#FFFFFF" />
                </Tap>
              )}
            </View>

            {/* Name block on the photo */}
            <View style={s.heroInfo} pointerEvents="none">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.name}>{P.name}, {P.age}</Text>
                <View style={s.verified}><Icon name="check" size={14} color="#FFFFFF" /></View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <Icon name="location_on" size={17} color="rgba(255,255,255,0.9)" />
                <Text style={s.location}>{P.location}</Text>
              </View>
            </View>
          </View>
          </PinkFrame>

          {/* ── Why you two click ── */}
          {fit ? (
          <View style={[s.card, s.fitCard, { marginTop: 14 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <ScoreRing score={fit.score} />
              <View style={{ flex: 1 }}>
                <Text style={s.fitTitle}>Why you two click</Text>
                <Text style={s.fitSummary}>{fit.summary}</Text>
              </View>
            </View>
            <View style={{ marginTop: 14, gap: 10 }}>
              {fit.parts.map((p) => (
                <View key={p.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={s.fitLabel}>{p.label}</Text>
                  <View style={s.fitTrack}>
                    <View style={{ width: `${p.value}%`, height: '100%', borderRadius: 4, backgroundColor: p.color }} />
                  </View>
                  <Text style={s.fitValue}>{p.value}%</Text>
                </View>
              ))}
            </View>
          </View>
          ) : null}

          {/* ── Looking for + vitals ── */}
          <View style={[s.card, { marginTop: 12 }]}>
            <View style={s.intent}>
              <View style={s.intentIcon}><Icon name="favorite" size={19} color="#FFFFFF" /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.intentK}>Looking for</Text>
                <Text style={s.intentV}>{P.lookingFor}</Text>
              </View>
            </View>
            {P.vitals.length ? <View style={s.vitalGrid}>
              {P.vitals.map((v) => (
                <View key={v.k} style={s.vital}>
                  <View style={s.vitalIcon}><Icon name={v.icon} size={16} color="#3E8FDB" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.vitalK}>{v.k}</Text>
                    <Text style={s.vitalV} numberOfLines={1}>{v.v}</Text>
                  </View>
                </View>
              ))}
            </View> : null}
          </View>

          {/* ── About ── */}
          <Tap onPress={() => setBioExpanded(!bioExpanded)} style={[s.card, { marginTop: 12 }]} pressedStyle={{ opacity: 0.9 }}>
            <Text style={s.cardTitle}>About {P.name}</Text>
            <Text style={s.bio} numberOfLines={bioExpanded ? undefined : 3}>{P.bio}</Text>
            <Text style={s.readMore}>{bioExpanded ? 'Show less' : 'Read more'}</Text>
          </Tap>

          {/* ── Prompt 1 ── */}
          {P.prompts[0].answer ? (
            <View style={[s.card, { marginTop: 12 }]}>
              <Text style={s.promptQ}>{P.prompts[0].question}</Text>
              <Text style={s.promptA}>{P.prompts[0].answer}</Text>
              {!isMe ? <View style={s.reactCorner}><ReactHeart on={!!reacted.p1} onPress={react('p1')} /></View> : null}
            </View>
          ) : null}

          {/* ── Photo 2 ── */}
          {P.photos[1] ? (
            <PinkFrame id="photo2Frame" radius={30 + FRAME} style={{ marginTop: 12, marginHorizontal: HERO_GAP }}>
            <View style={s.photo2}>
              <Image source={{ uri: P.photos[1] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              {P.photoCaption ? <View style={s.caption}><Text style={s.captionText}>{P.photoCaption}</Text></View> : null}
              {!isMe ? (
                <View style={{ position: 'absolute', right: 14, bottom: 14 }}>
                  <ReactHeart solid on={!!reacted.ph2} onPress={react('ph2')} />
                </View>
              ) : (
                <Tap onPress={() => router.push('/ProfilePhotos')} style={s.photoEdit} pressedStyle={{ opacity: 0.8 }} accessibilityLabel="Change this photo">
                  <Icon name="edit" size={16} color={C.ink} />
                  <Text style={s.photoEditText}>Change</Text>
                </Tap>
              )}
            </View>
            </PinkFrame>
          ) : null}

          {/* ── Voice answer ── */}
          {P.voice.recorded ? (
          <View style={s.voice}>
            <Text style={s.voiceQ}>In my own voice · {P.voice.question}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <Tap onPress={() => setPlaying(!playing)} style={s.voicePlay} accessibilityLabel={playing ? 'Pause voice answer' : 'Play voice answer'}>
                <Icon name={playing ? 'pause' : 'play_arrow'} size={26} color="#FFFFFF" />
              </Tap>
              <View style={s.waveRow}>
                {WAVE.map((h, k) => (
                  <View key={k} style={[s.waveBar, { height: h, backgroundColor: k < (playing ? 14 : 9) ? '#FF8FA8' : 'rgba(255,255,255,0.32)' }]} />
                ))}
              </View>
              <Text style={s.voiceLen}>{voiceLength}</Text>
            </View>
          </View>
          ) : null}

          {/* ── Into (shared interests first) ── */}
          {P.interests.length ? (
          <View style={[s.card, { marginTop: 12 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[s.cardTitle, { marginBottom: 0 }]}>Into</Text>
              {sharedCount ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.pink }} />
                  <Text style={s.sharedText}>You share {sharedCount}</Text>
                </View>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {P.interests.map((t) => (
                <View key={t.label} style={[s.chip, t.shared ? s.chipShared : s.chipPlain]}>
                  <Text style={[s.chipText, { color: t.shared ? '#FFFFFF' : C.ink }]}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
          ) : null}

          {/* ── Prompt 2 ── */}
          {P.prompts[1].answer ? (
            <View style={[s.card, { marginTop: 12 }]}>
              <Text style={s.promptQ}>{P.prompts[1].question}</Text>
              <Text style={s.promptA}>{P.prompts[1].answer}</Text>
              {!isMe ? <View style={s.reactCorner}><ReactHeart on={!!reacted.p2} onPress={react('p2')} /></View> : null}
            </View>
          ) : null}

          {/* ── Archetype ── */}
          {P.archetype ? (
          <View style={s.archetype}>
            <View style={s.archetypeIcon}><Icon name="auto_awesome" size={22} color={C.blue} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.archetypeTitle}>{P.archetype.title}</Text>
              <Text style={s.archetypeDesc}>{P.archetype.desc}</Text>
            </View>
          </View>
          ) : null}

          {/* ── Quiet safety links ── */}
          {!isMe ? <View style={s.links}>
            {(['Share profile', 'Hide', 'Report'] as const).map((l) => (
              <Tap key={l} onPress={l === 'Share profile' ? shareProfile : l === 'Hide' ? hideProfile : reportProfile} style={{ paddingVertical: 8 }} accessibilityRole="button">
                <Text style={s.linkText}>{l}</Text>
              </Tap>
            ))}
          </View> : null}
        </ScrollView>

        {/* Soft fades so content doesn't hit the status bar or dock hard */}
        <Fade id="screenTop" color={C.bg} from={1} to={0} style={[s.fill, { height: insets.top + 34 }]} />
        <Fade id="screenBottom" color={C.bg} from={0} to={1} style={[s.fill, { top: undefined, bottom: 0, height: 110 }]} />

        {/* ── Previewing yourself: one clear way back to editing ── */}
        {isMe ? (
          <Tap onPress={() => router.push('/EditProfile')} style={[s.editPill, { bottom: Math.max(insets.bottom, 16) }]} accessibilityRole="button">
            <Icon name="edit" size={18} color="#FFFFFF" />
            <Text style={s.editPillText}>Edit profile</Text>
          </Tap>
        ) : (
        /* ── Message dock ── */
        <Animated.View style={[s.dock, { bottom: Math.max(insets.bottom, 16), width: dockWidth, backgroundColor: dockBg }]}>
          {isDockExpanded ? (
            <Animated.View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', opacity: dockContent, transform: [{ translateX: dockSlide }] }}>
              <Tap onPress={toggleDock} style={s.dockClose} accessibilityLabel="Close">
                <Icon name="close" size={22} color="#FFFFFF" />
              </Tap>
              <TextInput
                placeholder="Let your arrow fly…"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={note}
                onChangeText={setNote}
                returnKeyType="send"
                onSubmitEditing={sendNote}
                style={s.dockInput}
                accessibilityLabel={`Message to ${P.name}`}
              />
            </Animated.View>
          ) : null}
          <Tap
            onPress={isDockExpanded ? sendNote : toggleDock}
            style={s.spark}
            accessibilityLabel={isDockExpanded ? 'Send your arrow' : `Send ${P.name} your arrow`}
          >
            <Animated.View style={{ transform: [{ rotate: sparkSpin }] }}>
              <CupidArrow size={isDockExpanded ? 26 : 28} />
            </Animated.View>
          </Tap>
        </Animated.View>
        )}
      </View>
    </NunitoScope>
  );
}

const s = StyleSheet.create({
  fill: { position: 'absolute', left: 0, right: 0, top: 0 },
  hero: {
    width: PHOTO_W,
    borderRadius: 36, overflow: 'hidden', backgroundColor: C.navy,
  },
  bars: { position: 'absolute', top: 14, left: 20, right: 20, flexDirection: 'row', gap: 5 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  topRow: { position: 'absolute', top: 30, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  glassBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroInfo: { position: 'absolute', left: 22, right: 22, bottom: 24 },
  matchPill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  matchText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  name: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -0.5 },
  verified: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#3EA9F5', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  location: { color: 'rgba(255,255,255,0.92)', fontSize: 15, fontWeight: '600' },
  fact: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#FFFFFF',
    shadowColor: C.ink, shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  factText: { color: C.ink, fontSize: 13.5, fontWeight: '700' },
  card: {
    marginHorizontal: 16, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF',
    shadowColor: C.ink, shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  fitCard: { backgroundColor: '#FFF7F9', borderWidth: 1, borderColor: '#FFE6EC' },
  fitTitle: { color: C.ink, fontSize: 18, fontWeight: '900' },
  fitSummary: { color: '#5E7290', fontSize: 14, lineHeight: 20, fontWeight: '600', marginTop: 2 },
  fitLabel: { width: 70, color: '#5E7290', fontSize: 13, fontWeight: '800' },
  fitTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  fitValue: { width: 40, textAlign: 'right', color: C.ink, fontSize: 13, fontWeight: '900' },
  cardTitle: { color: C.ink, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  bio: { color: C.body, fontSize: 15, lineHeight: 23, fontWeight: '500' },
  readMore: { color: '#3E8FDB', fontSize: 13.5, fontWeight: '800', marginTop: 8 },
  eyebrow: { color: C.muted, fontSize: 13, fontWeight: '700', marginBottom: 10, marginLeft: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  chipShared: { backgroundColor: C.pink },
  chipPlain: { backgroundColor: '#F4F8FC' },
  chipText: { fontSize: 13.5, fontWeight: '800' },
  sharedText: { color: '#C9406A', fontSize: 13, fontWeight: '800' },
  intent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: '#FFF1F4' },
  intentIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  intentK: { color: '#C9406A', fontSize: 12.5, fontWeight: '800' },
  intentV: { color: C.ink, fontSize: 16, fontWeight: '900', marginTop: 1 },
  vitalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  vital: { width: '48.5%', flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, borderRadius: 14, backgroundColor: '#F4F8FC' },
  vitalIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  vitalK: { color: '#6B7F99', fontSize: 11.5, fontWeight: '700' },
  vitalV: { color: C.ink, fontSize: 14, fontWeight: '800' },
  promptQ: { color: C.pink, fontSize: 13.5, fontWeight: '800', marginBottom: 8 },
  promptA: { color: C.ink, fontSize: 21, lineHeight: 29, fontWeight: '800', paddingRight: 50, letterSpacing: -0.2 },
  reactCorner: { position: 'absolute', right: 14, bottom: 14 },
  reactSoft: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF1F4', borderWidth: 1, borderColor: '#FBD3DD', alignItems: 'center', justifyContent: 'center' },
  reactSolid: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.navy, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
  },
  photo2: { height: 430, borderRadius: 30, overflow: 'hidden', backgroundColor: C.navy },
  photoEdit: {
    position: 'absolute', right: 14, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    shadowColor: C.navy, shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
  },
  photoEditText: { color: C.ink, fontSize: 14, fontWeight: '800' },
  caption: { position: 'absolute', left: 14, bottom: 16, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: 'rgba(26,46,68,0.6)' },
  captionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  voice: { marginTop: 12, marginHorizontal: 16, padding: 18, borderRadius: 24, backgroundColor: C.navy },
  voiceQ: { color: '#9EC9F5', fontSize: 13.5, fontWeight: '800' },
  voicePlay: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  waveRow: { flex: 1, height: 36, flexDirection: 'row', alignItems: 'center', gap: 3 },
  waveBar: { flex: 1, borderRadius: 2 },
  voiceLen: { color: '#9EC9F5', fontSize: 13, fontWeight: '800' },
  archetype: {
    marginHorizontal: 16, marginTop: 12, padding: 18, borderRadius: 24,
    backgroundColor: '#E7F0F9', flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  archetypeIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  archetypeTitle: { color: C.ink, fontSize: 16, fontWeight: '900' },
  archetypeDesc: { color: C.body, fontSize: 13.5, lineHeight: 20, marginTop: 2, fontWeight: '600' },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 16 },
  linkText: { color: '#6B7F99', fontSize: 13.5, fontWeight: '800' },
  dock: {
    position: 'absolute', alignSelf: 'center', height: 68, borderRadius: 34, padding: 6,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    shadowColor: C.navy, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 22, elevation: 8,
  },
  editPill: {
    position: 'absolute', alignSelf: 'center', height: 56, paddingHorizontal: 26, borderRadius: 28,
    backgroundColor: C.navy, flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 18,
  },
  editPillText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  dockClose: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  dockInput: { flex: 1, color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_600SemiBold', paddingHorizontal: 14 },
  spark: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.pink, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12,
  },
});
