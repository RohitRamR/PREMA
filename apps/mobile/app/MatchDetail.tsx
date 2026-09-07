import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Dimensions, StyleSheet, LayoutAnimation } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/Icon';
import CelestialBackground from '../components/CelestialBackground';

const { width, height } = Dimensions.get('window');

const PROFILE = {
  name: 'Ananya',
  age: 24,
  location: 'Chennai • Alwarpet',
  occupation: 'Architectural Historian',
  match: '96%',
  bio: 'I spend my days tracing the forgotten histories of Chettinad homes and my evenings trying to perfect my grandmother’s rasam recipe.',
  prompts: [
    {
      question: 'Sundays are sacred for...',
      answer: 'Slow filter coffee, hunting for vintage maps in Moore Market, and dinners cooked together without any screens.'
    },
    {
      question: 'A boundary I firmly hold...',
      answer: 'No work talk after 8 PM. Life is too short to optimize every hour.'
    }
  ],
  traits: ['Emotional Sync', 'Architecture', 'Slow Living', 'Filter Coffee'],
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&q=80&w=1200'
  ],
  archetype: {
    title: 'Vrishabha (Taurus Earth)',
    desc: 'You share a deep craving for stability and aesthetic beauty. Her Earth core perfectly grounds your Water placements.'
  }
};

export default function MatchDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activePhoto, setActivePhoto] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(true);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  
  const toggleDock = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDockExpanded(!isDockExpanded);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F7FD' }}>
      <CelestialBackground />
      
      {/* ── Floating Header ── */}
      <View style={{
        position: 'absolute', top: insets.top, left: 0, right: 0, zIndex: 10,
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10
      }}>
        <Pressable 
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center', justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
          })}
        >
          <Icon name="arrow_back" size={24} color="#2C496A" />
        </Pressable>
        <Pressable 
          style={({ pressed }) => ({
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center', justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
          })}
        >
          <Icon name="more_horiz" size={24} color="#2C496A" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        
        {/* ── 1. Clean Hero Carousel ── */}
        <View style={{ width, height, backgroundColor: '#000' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActivePhoto(Math.round(x / width));
            }}
            scrollEventThrottle={16}
          >
            {PROFILE.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={{ width, height }} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={{
            position: 'absolute', bottom: 120, left: 0, right: 0,
            flexDirection: 'row', justifyContent: 'center', gap: 8
          }}>
            {PROFILE.photos.map((_, i) => (
              <View key={i} style={{
                width: i === activePhoto ? 24 : 8, height: 8, borderRadius: 4,
                backgroundColor: i === activePhoto ? '#ffffff' : 'rgba(255,255,255,0.6)',
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2
              }} />
            ))}
          </View>
        </View>

        {/* ── 2. Profile Header (Moved Below Image) ── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: '#2C496A', fontSize: 34, fontWeight: 'bold' }}>
                {PROFILE.name}, {PROFILE.age}
              </Text>
              <View style={{ width: 22, height: 22, backgroundColor: '#3EA9F5', borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={16} color="white" />
              </View>
            </View>
            <View style={{ backgroundColor: '#74B4F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
              <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{PROFILE.match} MATCH</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="location_on" size={18} color="#8892A3" />
            <Text style={{ color: '#8892A3', fontSize: 16, fontWeight: '500' }}>{PROFILE.location}</Text>
          </View>
        </View>

        {/* ── 3. Dedicated Description / About Section ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Pressable 
            onPress={() => setBioExpanded(!bioExpanded)}
            style={{ 
              backgroundColor: '#ffffff', borderRadius: 24, padding: 24,
              shadowColor: '#E3EDF7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: bioExpanded ? 16 : 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="person_outline" size={22} color="#74B4F2" />
                <Text style={{ color: '#2C496A', fontSize: 18, fontWeight: '700' }}>About {PROFILE.name}</Text>
              </View>
              <Icon name={bioExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={24} color="#8892A3" />
            </View>

            {bioExpanded ? (
              <Text style={{ color: '#3E5C7D', fontSize: 16, lineHeight: 28, fontWeight: '400' }}>
                {PROFILE.bio}
              </Text>
            ) : (
              <Text numberOfLines={1} style={{ color: '#8892A3', fontSize: 15, marginTop: 8 }}>
                Tap to read description...
              </Text>
            )}
          </Pressable>
        </View>

        {/* ── 4. Traits ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ color: '#8892A3', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 }}>
            Interests & Traits
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PROFILE.traits.map(trait => (
              <View key={trait} style={{ 
                paddingHorizontal: 16, paddingVertical: 10, 
                backgroundColor: '#ffffff', borderRadius: 24,
                shadowColor: '#E3EDF7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1
              }}>
                <Text style={{ color: '#3E5C7D', fontSize: 14, fontWeight: '600' }}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 5. Prompts ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          {PROFILE.prompts.map((prompt, i) => (
            <View key={i} style={{ 
              backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 16,
              shadowColor: '#E3EDF7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 
            }}>
              <Text style={{ color: '#8892A3', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                {prompt.question}
              </Text>
              <Text style={{ color: '#2C496A', fontSize: 22, fontFamily: 'Georgia', fontStyle: 'italic', lineHeight: 32 }}>
                "{prompt.answer}"
              </Text>
            </View>
          ))}
        </View>

        {/* ── 6. Archetype Integration ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 140 }}>
          <View style={{
            backgroundColor: '#E7F0F9', borderRadius: 24, padding: 32,
            alignItems: 'center', shadowColor: '#D4E2F0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2
          }}>
            <Icon name="auto_awesome" size={32} color="#74B4F2" />
            <Text style={{ color: '#2C496A', fontSize: 22, fontFamily: 'Georgia', fontStyle: 'italic', marginTop: 16, marginBottom: 12, textAlign: 'center' }}>
              {PROFILE.archetype.title}
            </Text>
            <Text style={{ color: '#3E5C7D', fontSize: 15, lineHeight: 24, textAlign: 'center', fontWeight: '400' }}>
              {PROFILE.archetype.desc}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Cosmic Message Dock ── */}
      <View style={{
        position: 'absolute', bottom: Math.max(insets.bottom, 16),
        alignSelf: 'center',
        width: isDockExpanded ? width - 32 : 64,
        backgroundColor: '#1A2E44', 
        borderRadius: 36,
        padding: 6,
        flexDirection: 'row', alignItems: 'center',
        shadowColor: '#1A2E44', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24,
      }}>
        
        {isDockExpanded ? (
          <>
            {/* Close Button */}
            <Pressable onPress={() => toggleDock()} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={22} color="#FFF" />
            </Pressable>

            {/* Message Input Placeholder */}
            <Pressable onPress={() => router.push('/SanctuaryReservationConcierge')} style={{ flex: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: -2 }}>✎</Text>
              <Text numberOfLines={1} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '500', marginLeft: 10, flex: 1 }}>Send a cosmic signal...</Text>
            </Pressable>

            {/* Send / Sparkle Button */}
            <Pressable onPress={() => router.push('/SanctuaryReservationConcierge')} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FF6B8B', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B8B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 }}>
              <Text style={{ fontSize: 22, color: '#FFF', marginTop: -2 }}>✧</Text>
            </Pressable>
          </>
        ) : (
          /* Collapsed State: Just the Pink Button taking up the exact container bounds */
          <Pressable onPress={() => toggleDock()} style={{ flex: 1, height: 52, borderRadius: 26, backgroundColor: '#FF6B8B', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B8B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 }}>
            <Text style={{ fontSize: 22, color: '#FFF', marginTop: -2 }}>✧</Text>
          </Pressable>
        )}

      </View>
    </View>
  );
}