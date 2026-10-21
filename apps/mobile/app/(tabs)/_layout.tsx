import { Tabs } from 'expo-router';
import { View, Platform, Text } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useUnreadCount } from '../../src/store/chats';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function CustomTab({ name, title, focused, isMeetButton }: { name: string; title: string; focused: boolean; isMeetButton?: boolean }) {
  const unread = useUnreadCount();
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
            {/* LAYER 3: Meet symbol — two hearts coming together */}
            <Svg width="34" height="30" viewBox="0 0 34 30" fill="none">
              <Path
                d="M12 26 C5 20.5 1.5 16.5 1.5 11.6 C1.5 7.9 4.3 5 7.8 5 C9.7 5 11.2 5.9 12 7.3 C12.8 5.9 14.3 5 16.2 5 C19.7 5 22.5 7.9 22.5 11.6 C22.5 16.5 19 20.5 12 26 Z"
                fill="#FFFFFF"
              />
              <Path
                d="M22 23 C16.8 19 14.2 16 14.2 12.4 C14.2 9.7 16.3 7.6 18.8 7.6 C20.2 7.6 21.4 8.3 22 9.3 C22.6 8.3 23.8 7.6 25.2 7.6 C27.7 7.6 29.8 9.7 29.8 12.4 C29.8 16 27.2 19 22 23 Z"
                fill="#FF6685"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

      </View>
    );
  }

  const renderIcon = () => {
    if (name === 'chats') {
      return (
        <View style={{ position: 'relative' }}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color={focused ? '#74B4F2' : '#A0AAB8'} />
          {unread > 0 ? <View style={{
            position: 'absolute',
            top: -2,
            right: -4,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#FF6B8B',
            borderWidth: 2,
            borderColor: '#FFFFFF',
          }} /> : null}
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
      <Tabs.Screen name="meet" options={{ tabBarIcon: ({ focused }) => <CustomTab name="meet" title="" focused={focused} isMeetButton /> }} />
      <Tabs.Screen name="chats" options={{ tabBarIcon: ({ focused }) => <CustomTab name="chats" title="Chats" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <CustomTab name="person-outline" title="Profile" focused={focused} /> }} />
    </Tabs>
  );
}
