import { Tabs } from 'expo-router';
import { View, Platform, Text } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function CustomTab({ name, title, focused, isMeetButton }: { name: string; title: string; focused: boolean; isMeetButton?: boolean }) {
  if (isMeetButton) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 60 }}>
        {/* LAYER 1: Floating solid white circular disk (Platform / Halo) */}
        <View style={{
          position: 'absolute',
          top: -28, 
          width: 82, 
          height: 82,
          borderRadius: 41,
          backgroundColor: '#FFFFFF', 
          alignItems: 'center',
          justifyContent: 'center',
          // Soft diffuse gray floating shadow
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 7,
        }}>
          {/* LAYER 2: Inset Coral Circle (NO border, solid fill) */}
          <View style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: '#FF6685', // Soft coral
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* LAYER 3: Pure white, thin, elegant rounded plus icon */}
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path 
                d="M 12 4.5 L 12 19.5 M 4.5 12 L 19.5 12" 
                stroke="#FFFFFF" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
              />
            </Svg>
          </View>
        </View>

        {/* Meet Label centered just below floating disk */}
        <Text style={{
          position: 'absolute',
          bottom: -4, 
          fontSize: 10,
          fontWeight: '500', // Understated clean typography
          color: '#9AA0AA', // Muted gray
        }}>
          {title}
        </Text>
      </View>
    );
  }

  const renderIcon = () => {
    if (name === 'chats') {
      return (
        <View style={{ position: 'relative' }}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color={focused ? '#74B4F2' : '#A0AAB8'} />
          <View style={{
            position: 'absolute',
            top: -2,
            right: -4,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#FF6B8B',
            borderWidth: 2,
            borderColor: '#FFFFFF',
          }} />
        </View>
      );
    }
    return <Icon name={name} size={28} color={focused ? '#74B4F2' : '#A0AAB8'} />;
  };

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 70, // Provide enough width for the text
      height: 60, // Provide enough height
    }}>
      {renderIcon()}
      <Text style={{
        marginTop: 4,
        fontSize: 10, // slightly smaller text to fit "Discover"
        fontWeight: '600',
        color: focused ? '#74B4F2' : '#A0AAB8',
      }}>
        {title}
      </Text>
      {focused && name === 'home' && (
        <View style={{ width: 16, height: 3, borderRadius: 1.5, backgroundColor: '#74B4F2', marginTop: 4 }} />
      )}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabHeight = 80 + (Platform.OS === 'ios' ? insets.bottom : 10);
  const center = width / 2;
  const scoopRadius = 55; // Graceful scoop width
  const scoopDepth = 30; // Smooth dip depth
  
  // Custom SVG path for the rounded tab bar with a center scoop
  const tabPath = `
    M 0 32
    Q 0 0 32 0
    L ${center - scoopRadius} 0
    C ${center - scoopRadius + 22} 0, ${center - 20} ${scoopDepth}, ${center} ${scoopDepth}
    C ${center + 20} ${scoopDepth}, ${center + scoopRadius - 22} 0, ${center + scoopRadius} 0
    L ${width - 32} 0
    Q ${width} 0 ${width} 32
    L ${width} ${tabHeight}
    L 0 ${tabHeight}
    Z
  `;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: 'transparent', // Transparent because SVG handles the background
          borderTopWidth: 0,
          elevation: 0,
          height: tabHeight,
          paddingTop: 30, 
          paddingBottom: (Platform.OS === 'ios' ? insets.bottom : 10),
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Svg width={width} height={tabHeight} viewBox={`0 0 ${width} ${tabHeight}`}>
              <Path d={tabPath} fill="#FFFFFF" />
            </Svg>
            {/* Optional shadow layer could go here if needed, but keeping it clean */}
          </View>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <CustomTab name="home" title="Discover" focused={focused} /> }} />
      <Tabs.Screen name="likes" options={{ tabBarIcon: ({ focused }) => <CustomTab name="favorite-border" title="Likes" focused={focused} /> }} />
      <Tabs.Screen name="meet" options={{ tabBarIcon: ({ focused }) => <CustomTab name="meet" title="Meet" focused={focused} isMeetButton /> }} />
      <Tabs.Screen name="chats" options={{ tabBarIcon: ({ focused }) => <CustomTab name="chats" title="Chats" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <CustomTab name="person-outline" title="Profile" focused={focused} /> }} />
    </Tabs>
  );
}
