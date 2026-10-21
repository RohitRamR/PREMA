import React, { useMemo, useRef, useState } from 'react';
import { View, Image, Dimensions, Pressable, FlatList, Animated, Share } from 'react-native';
import Text, { NunitoScope } from '../../components/PremaText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/Icon';
import { BlurView } from 'expo-blur';
import CelestialBackground from '../../components/CelestialBackground';
import Svg, { Path } from 'react-native-svg';
import { AuraFrame } from '../../components/Aura';
import { useSafety } from '../../src/store/safety';
import { useRankedDeck } from '../../src/features/compatibility';
import { PEOPLE } from '../../src/store/people';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.74; // Smaller card to show more of side cards
const CARD_SPACING = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

// Icons for interest chips on the deck (MaterialIcons names).
const INTEREST_ICONS: [RegExp, string][] = [
  [/coffee|chai/i, 'local-cafe'], [/music|ghazal|carnatic|song/i, 'music-note'], [/travel|road trip/i, 'flight'],
  [/hik|trek|nature/i, 'landscape'], [/art|sketch|paint|pottery|ceramic/i, 'palette'], [/read|book|writ/i, 'menu-book'],
  [/tech|code/i, 'computer'], [/cook|bak|biryani|food/i, 'restaurant'], [/yoga|slow|spa/i, 'self-improvement'],
  [/photo/i, 'photo-camera'], [/dance/i, 'music-note'], [/garden|plant/i, 'local-florist'], [/game/i, 'casino'],
  [/temple|heritage|architecture/i, 'account-balance'], [/family/i, 'home'], [/volunteer/i, 'volunteer-activism'],
];
const iconFor = (interest: string) => INTEREST_ICONS.find(([re]) => re.test(interest))?.[1] ?? 'favorite-border';

// Ananya is the hand-made demo card; everyone else comes from the shared people list.
const ANANYA_CARD = {
  id: 'ananya',
  name: 'Ananya',
  match: 96, // fallback only — the matching engine supplies the real score
  age: 24,
  verified: true,
  occupation: 'Design Student',
  distance: '3 km away',
  image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800&auto=format&fit=crop',
  quote: '"Coffee, good people and a better tomorrow"',
  interests: [
    { id: '1', name: 'Coffee', icon: 'local-cafe' },
    { id: '2', name: 'Music', icon: 'music-note' },
    { id: '3', name: 'Travel', icon: 'flight' },
    { id: '4', name: 'Dogs', icon: 'pets' },
  ]
};

const PROFILES = [
  ANANYA_CARD,
  ...Object.values(PEOPLE).map((p) => ({
    id: p.id,
    name: p.name,
    match: p.match, // fallback only — the matching engine supplies the real score
    age: p.age,
    verified: true,
    occupation: p.job,
    distance: p.city,
    image: p.photos[0]!,
    quote: `"${p.prompt.answer}"`,
    interests: p.interests.slice(0, 4).map((name, i) => ({ id: `${p.id}-${i}`, name, icon: iconFor(name) })),
  })),
];

export default function DiscoverScreen() {
  return (
    <NunitoScope>
      <DiscoverInner />
    </NunitoScope>
  );
}

function DiscoverInner() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);

  // Profiles you've passed on or liked leave the deck.
  // Remember only who you've passed/liked, so the deck always reflects the current people list.
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const deckAll = useMemo(() => PROFILES.filter((p) => !doneIds.includes(p.id)), [doneIds]);
  const { blocked } = useSafety();
  // Real compatibility: people your filters/dealbreakers exclude are hidden, best match first.
  const ranked = useRankedDeck(deckAll);
  const deck = ranked.filter((p) => !blocked.includes(p.id));
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeIdx = Math.min(activeIdx, Math.max(deck.length - 1, 0));
  const currentProfile = deck[safeIdx];

  const say = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  // Pass / like / star act on the card in the middle, then move to the next one.
  const act = (kind: 'pass' | 'like' | 'star') => {
    const p = currentProfile;
    if (!p) return;
    setDoneIds((d) => [...d, p.id]);
    const nextIdx = Math.min(safeIdx, deck.length - 2);
    setActiveIdx(Math.max(nextIdx, 0));
    requestAnimationFrame(() => flatListRef.current?.scrollToOffset({ offset: Math.max(nextIdx, 0) * SNAP_INTERVAL, animated: true }));
    say(kind === 'pass' ? `Passed on ${p.name}` : kind === 'like' ? `You liked ${p.name}` : `Super-liked ${p.name}`);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIdx(viewableItems[0].index);
    }
  }).current;

  const renderProfileCard = ({ item, index }: { item: (typeof PROFILES)[number]; index: number }) => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.93, 1, 0.93],
      extrapolate: 'clamp',
    });

    const blurOpacity = scrollX.interpolate({
      inputRange: [
        (index - 1) * SNAP_INTERVAL,
        index * SNAP_INTERVAL - 15,
        index * SNAP_INTERVAL + 15,
        (index + 1) * SNAP_INTERVAL,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ width: CARD_WIDTH, marginHorizontal: CARD_SPACING / 2 }}>
        <Pressable style={{ flex: 1 }} onPress={() => router.push({ pathname: '/MatchDetail', params: { id: item.id } })}>
          <Animated.View 
            className="bg-white overflow-hidden shadow-lg shadow-black/10" 
            style={{ flex: 1, borderRadius: 36, transform: [{ scale }] }}
          >
          <Image 
            source={{ uri: item.image }} 
            className="w-full h-full" 
            resizeMode="cover"
          />
          
          <AnimatedBlurView 
            intensity={60} 
            tint="default"
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: blurOpacity }} 
          />
          
          {/* Cosmic Share Button */}
          <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 30 }}>
            <Pressable onPress={() => Share.share({ message: `Have a look at ${item.name} on Prema.` })} accessibilityLabel={`Share ${item.name}`} style={({ pressed }) => ({
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: 'rgba(0,0,0,0.35)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', 
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
            })}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path d="M 5 12 L 5 16 C 5 19, 7 21, 12 21 C 17 21, 19 19, 19 16 L 19 12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M12 0 C12 6, 17 9, 22 9 C17 9, 12 12, 12 18 C12 12, 7 9, 2 9 C7 9, 12 6, 12 0 Z" fill="#FFFFFF" />
                <Path d="M21 2 C21 3.5, 23 4.5, 25 4.5 C23 4.5, 21 5.5, 21 7 C21 5.5, 19 4.5, 18 4.5 C19 4.5, 21 3.5, 21 2 Z" fill="#FFFFFF" transform="scale(0.8) translate(3, -1)" />
              </Svg>
            </Pressable>
          </View>

          <View className="absolute bottom-0 left-0 right-0 pt-8 pb-5 px-6">
            <View className="flex-row items-center z-10">
              <Text className="text-white text-3xl font-bold" style={{ fontWeight: "900", textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 }}>{item.name}, {item.age}</Text>
              {item.verified && (
                <View className="ml-2 w-6 h-6 bg-[#3EA9F5] rounded-full items-center justify-center">
                  <Icon name="check" size={16} color="white" />
                </View>
              )}
            </View>
            <View className="flex-row items-center mt-2 z-10">
              <Icon name="school" size={16} color="white" />
              <Text className="text-white text-base font-medium ml-1.5" style={{ textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{item.occupation}</Text>
            </View>
            <View className="flex-row items-center mt-1 z-10">
              <Icon name="location-on" size={16} color="white" />
              <Text className="text-white text-base font-medium ml-1.5" style={{ textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{item.distance}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12, zIndex: 10 }}>
              {[0, 1, 2, 3].map((_, i) => (
                <View key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.4)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2 }} />
              ))}
            </View>
          </View>

          {/* Match strength as a colour border (blue → lilac → rose → gold) */}
          <AuraFrame score={item.match} radius={36} width={5} />
          </Animated.View>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F1F7FD]" edges={['top']}>
      <CelestialBackground scrollX={scrollX} />
      <View className="flex-1 pb-[125px]">
        {/* Header - Fixed Height */}
        <View className="px-6 pt-2 pb-4 flex-row justify-end items-center z-50 relative">
          {/* Centered Title */}
          <View className="absolute left-0 right-0 top-2 bottom-4 items-center justify-center pointer-events-none">
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={{ width: 130, height: 44, resizeMode: 'contain', tintColor: '#2C496A' }}
            />
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.push('/Notifications')} accessibilityLabel="Notifications" className="relative w-10 h-10 bg-[#F1F7FD] rounded-full items-center justify-center border border-[#E3EDF7]">
              <Icon name="notifications-none" size={22} color="#2B4A6A" />
              <View className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF6B8B] rounded-full border-2 border-[#F1F7FD]" />
            </Pressable>
            <Pressable onPress={() => router.push('/DiscoveryPreferences')} accessibilityLabel="Discovery preferences" className="w-10 h-10 bg-[#F1F7FD] rounded-full items-center justify-center border border-[#E3EDF7]">
              <Icon name="tune" size={22} color="#2B4A6A" />
            </Pressable>
          </View>
        </View>

        {/* Swipeable Horizontal Cards - Flex 1 to take all remaining space */}
        <View className="flex-1 z-10">
          {deck.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
              <Icon name="favorite" size={40} color="#FF6B8B" />
              <Text style={{ marginTop: 12, fontSize: 22, fontWeight: '800', color: '#2C496A', textAlign: 'center' }}>That’s everyone for today</Text>
              <Text style={{ marginTop: 6, fontSize: 15, color: '#8892A3', textAlign: 'center' }}>New introductions arrive tomorrow morning.</Text>
              <Pressable onPress={() => { setDoneIds([]); setActiveIdx(0); }} style={{ marginTop: 18, paddingHorizontal: 20, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#2C496A', fontWeight: '700' }}>Start over (preview)</Text>
              </Pressable>
            </View>
          ) : null}
          <Animated.FlatList
            ref={flatListRef}
            data={deck}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: (width - CARD_WIDTH) / 2 - (CARD_SPACING / 2),
              paddingVertical: 10,
            }}
            onScroll={handleScroll}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={renderProfileCard}
          />
        </View>

        {toast ? (
          <View pointerEvents="none" style={{ position: 'absolute', alignSelf: 'center', top: 70, zIndex: 60, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, backgroundColor: '#2C496A' }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{toast}</Text>
          </View>
        ) : null}

        {/* User Info Section - Fixed Height */}
        <View className="px-6 mt-2 z-20" style={{ opacity: deck.length ? 1 : 0 }}>
          <View className="bg-[#E7F0F9] rounded-3xl py-3 px-4 items-center">
            <Text className="text-[#3E5C7D] text-sm font-medium mb-2 text-center">{currentProfile?.quote}</Text>
            <View className="flex-row flex-wrap justify-center gap-2 w-full">
              {currentProfile?.interests.map((interest) => (
                <View key={interest.id} className="flex-row items-center bg-white rounded-full px-3 py-1.5 gap-1.5 shadow-sm shadow-surface-variant">
                  <Icon name={interest.icon} size={12} color="#3E5C7D" />
                  <Text className="text-[#3E5C7D] font-medium text-xs">{interest.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons - Fixed Height */}
        <View className="flex-row justify-center items-center mt-2 mb-6 gap-5 z-20">
          <Pressable 
            onPress={() => act('pass')}
            accessibilityLabel="Pass"
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-md shadow-surface-variant"
          >
            <Icon name="close" size={28} color="#8892A3" />
          </Pressable>
          
          <Pressable 
            onPress={() => act('like')}
            accessibilityLabel="Like"
            className="w-20 h-20 bg-[#FF6B8B] rounded-full items-center justify-center shadow-lg shadow-coral/50"
          >
            <Icon name="favorite" size={38} color="white" />
          </Pressable>

          <Pressable 
            onPress={() => act('star')}
            accessibilityLabel="Super like"
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-md shadow-surface-variant"
          >
            <Icon name="star" size={28} color="#FF6B8B" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
