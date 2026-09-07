import { View, Text } from 'react-native';
import React from 'react';
import CelestialBackground from '../../components/CelestialBackground';

export default function chatsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <CelestialBackground />
      <Text>chats screen</Text>
    </View>
  );
}
