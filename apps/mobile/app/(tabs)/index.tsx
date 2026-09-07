import React, { useRef, useState } from 'react';
import { View, Text, Image, Dimensions, Pressable, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/Icon';
import { BlurView } from 'expo-blur';
import CelestialBackground from '../../components/CelestialBackground';
import Svg, { Path } from 'react-native-svg';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.74; // Smaller card to show more of side cards
const CARD_SPACING = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const PROFILES = [
  {
    id: '1',
    name: 'Ananya',
    age: 22,
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
    ],
    overlayText: "Good Conversations\nBrighter Days"
  },
  {
    id: '2',
    name: 'Priya',
    age: 24,
    verified: true,
    occupation: 'Architect',
    distance: '5 km away',
    image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=800&auto=format&fit=crop',
    quote: '"Looking for my next adventure"',
    interests: [
      { id: '5', name: 'Art', icon: 'palette' },
      { id: '6', name: 'Hiking', icon: 'landscape' },
    ],
    overlayText: "Wanderlust\nAnd City Dust"
  },
  {
    id: '3',
    name: 'Neha',
    age: 23,
    verified: true,
    occupation: 'Software Engineer',
    distance: '10 km away',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    quote: '"Debugging life one coffee at a time"',
    interests: [
      { id: '7', name: 'Tech', icon: 'computer' },
      { id: '8', name: 'Reading', icon: 'menu-book' },
    ],
    overlayText: "Code & Coffee\nRepeat"
  }
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const currentProfile = PROFILES[activeIdx];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIdx(viewableItems[0].index);
    }
  }).current;

  const renderProfileCard = ({ item, index }) => {
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
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/MatchDetail')}>
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
            <Pressable style={({ pressed }) => ({
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

          {/* Text Overlay */}
          <View style={{ position: 'absolute', top: 32, left: 24, right: 24 }}>
            <Text style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 28, color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 2 } }}>{item.overlayText}</Text>
          </View>

          <View className="absolute bottom-0 left-0 right-0 pt-8 pb-5 px-6">
            <View className="flex-row items-center z-10">
              <Text className="text-white text-3xl font-bold" style={{ textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 }}>{item.name}, {item.age}</Text>
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
            <Pressable className="relative w-10 h-10 bg-[#F1F7FD] rounded-full items-center justify-center border border-[#E3EDF7]">
              <Icon name="notifications-none" size={22} color="#2B4A6A" />
              <View className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF6B8B] rounded-full border-2 border-[#F1F7FD]" />
            </Pressable>
            <Pressable className="w-10 h-10 bg-[#F1F7FD] rounded-full items-center justify-center border border-[#E3EDF7]">
              <Icon name="tune" size={22} color="#2B4A6A" />
            </Pressable>
          </View>
        </View>

        {/* Swipeable Horizontal Cards - Flex 1 to take all remaining space */}
        <View className="flex-1 z-10">
          <Animated.FlatList
            ref={flatListRef}
            data={PROFILES}
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

        {/* User Info Section - Fixed Height */}
        <View className="px-6 mt-2 z-20">
          <View className="bg-[#E7F0F9] rounded-3xl py-3 px-4 items-center">
            <Text className="text-[#3E5C7D] text-sm font-medium mb-2 text-center">{currentProfile?.quote}</Text>
            <View className="flex-row flex-wrap justify-center gap-2 w-full">
              {currentProfile?.interests.map((interest) => (
                <View key={interest.id} className="flex-row items-center bg-white rounded-full px-3 py-1.5 gap-1.5 shadow-sm shadow-[#E3EDF7]">
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
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-md shadow-[#E3EDF7]"
          >
            <Icon name="close" size={28} color="#8892A3" />
          </Pressable>
          
          <Pressable 
            className="w-20 h-20 bg-[#74B4F2] rounded-full items-center justify-center shadow-lg shadow-[#74B4F2]/50"
          >
            <Icon name="favorite" size={38} color="white" />
          </Pressable>

          <Pressable 
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-md shadow-[#E3EDF7]"
          >
            <Icon name="star" size={28} color="#74B4F2" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
