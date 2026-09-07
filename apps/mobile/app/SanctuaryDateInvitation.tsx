import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/Icon';

const VENUES = [
  { id: '1', name: 'Amethyst Cafe', area: 'Royapettah', mood: 'Garden & Coffee', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Pumpkin Tales', area: 'Bheemanna Mudali', mood: 'Bright & Airy', image: 'https://images.unsplash.com/photo-1525610553991-56e11c2f4623?auto=format&fit=crop&q=80&w=400' },
];

const TIMES = ['Sat, 4:00 PM', 'Sat, 6:30 PM', 'Sun, 11:00 AM', 'Sun, 5:00 PM'];

export default function SanctuaryDateInvitation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedVenue, setSelectedVenue] = useState('1');
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F4' }}>
      
      {/* ── Header ── */}
      <View style={{ 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: 16 
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Icon name="arrow_back" size={24} color="#021625" />
        </Pressable>
        <Text style={{ color: '#021625', fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Date Invitation
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}>
        
        {/* ── Invitation Intro ── */}
        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: -8, borderWidth: 2, borderColor: '#FAF9F4', zIndex: 2 }} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }} style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#FAF9F4', zIndex: 1 }} />
          </View>
          <Text style={{ color: '#021625', fontSize: 24, fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginBottom: 8 }}>
            Propose a meeting.
          </Text>
          <Text style={{ color: '#73777c', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 }}>
            Select a verified sanctuary venue and time. We will send an elegant invitation to Ananya.
          </Text>
        </View>

        {/* ── Venue Selection ── */}
        <View style={{ marginBottom: 48 }}>
          <Text style={{ color: '#a0a5ab', fontSize: 10, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            Sanctuary Venues
          </Text>
          <View style={{ gap: 16 }}>
            {VENUES.map((venue) => (
              <Pressable
                key={venue.id}
                onPress={() => setSelectedVenue(venue.id)}
                style={({ pressed }) => ({
                  flexDirection: 'row', alignItems: 'center', gap: 16,
                  padding: 12, borderRadius: 16,
                  backgroundColor: selectedVenue === venue.id ? '#ffffff' : 'transparent',
                  borderWidth: 1, borderColor: selectedVenue === venue.id ? '#021625' : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Image source={{ uri: venue.image }} style={{ width: 64, height: 64, borderRadius: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#021625', fontSize: 15, fontWeight: selectedVenue === venue.id ? '600' : '400', marginBottom: 4 }}>
                    {venue.name}
                  </Text>
                  <Text style={{ color: '#73777c', fontSize: 12 }}>{venue.area} • {venue.mood}</Text>
                </View>
                {selectedVenue === venue.id && (
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#021625', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={14} color="#ffffff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Time Selection ── */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: '#a0a5ab', fontSize: 10, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            Proposed Time
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {TIMES.map((time) => (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                style={({ pressed }) => ({
                  paddingHorizontal: 20, paddingVertical: 12,
                  borderRadius: 24,
                  backgroundColor: selectedTime === time ? '#021625' : '#ffffff',
                  borderWidth: 1, borderColor: selectedTime === time ? '#021625' : '#EAE8E1',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ 
                  color: selectedTime === time ? '#ffffff' : '#021625', 
                  fontSize: 14, fontWeight: selectedTime === time ? '600' : '400' 
                }}>
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Floating CTA ── */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 24),
        backgroundColor: 'rgba(250, 249, 244, 0.95)',
      }}>
        <Pressable
          onPress={() => router.push('/(tabs)')}
          style={({ pressed }) => ({
            width: '100%', height: 56, borderRadius: 28,
            backgroundColor: '#021625',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: pressed ? 0.8 : 1,
            shadowColor: '#021625', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16
          })}
        >
          <Icon name="send" size={16} color="#b1e0fe" />
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Send Invitation</Text>
        </Pressable>
      </View>

    </View>
  );
}