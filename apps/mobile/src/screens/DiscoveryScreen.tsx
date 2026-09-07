import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../theme/theme';
import { MatchCard, MatchData } from '../components/MatchCard';

// Dummy match for MVP Discovery
const dummyMatch: MatchData = {
  id: 'm1',
  name: 'Ananya',
  age: 24,
  location: 'Chennai',
  imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  isVerified: true,
  score: 96,
  breakdown: [
    { label: 'Communication', score: 94 },
    { label: 'Values', score: 97 },
    { label: 'Long-term', score: 96 },
  ],
  friction: 'Different social pace'
};

export const DiscoveryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <MatchCard 
          match={dummyMatch}
          onLike={() => console.log('Liked Ananya')}
          onPass={() => console.log('Passed Ananya')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  }
});
