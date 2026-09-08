import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '../../src/theme/theme';
const PREMA_THEME = { colors, spacing, radii };
import Icon from '../../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');

const SETTINGS = [
  { id: 'preferences', label: 'Discovery Preferences', icon: 'tune' },
  { id: 'dna', label: 'Compatibility DNA', icon: 'auto_awesome' },
  { id: 'safety', label: 'Safety & Verification', icon: 'shield' },
  { id: 'membership', label: 'PREMA Membership', icon: 'stars' },
];

export default function ProfileTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      
      {/* 1. Bold Brand Header (Inspired by Ref 3 Light Mode) */}
      <View style={[styles.headerBackground, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerNav}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable 
            style={({pressed}) => [styles.settingsButton, pressed && { opacity: 0.7 }]}
          >
            <Icon name="settings" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* 2. White Bottom Sheet Content Area */}
      <View style={styles.contentSheet}>
        
        {/* Overlapping Avatar Container */}
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }}
            style={styles.avatarImage}
          />
          {/* Edit / Camera Badge */}
          <Pressable style={({pressed}) => [styles.editBadge, pressed && { opacity: 0.8 }]}>
            <Icon name="edit" size={18} color={PREMA_THEME.colors.deepNavy} />
          </Pressable>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Vikram, 28</Text>
            <Text style={styles.userLocation}>Bengaluru • Architect</Text>
          </View>

          {/* Archetype Premium Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBox}>
                <Icon name="auto_awesome" size={18} color={PREMA_THEME.colors.deepNavy} />
              </View>
              <Text style={styles.cardSubtitle}>Your Archetype</Text>
            </View>
            <Text style={styles.cardTitle}>Vrishchika (Scorpio)</Text>
            <Text style={styles.cardBody}>
              Deep emotional reserves with a need for profound connection. You seek authenticity over surface-level charm.
            </Text>
          </View>

          {/* Grouped Settings List (Inspired by Ref 3) */}
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.settingsGroup}>
            {SETTINGS.map((item, index) => (
              <Pressable 
                key={item.id}
                style={({pressed}) => [
                  styles.settingsRow,
                  index === SETTINGS.length - 1 && { borderBottomWidth: 0 },
                  pressed && { backgroundColor: 'rgba(0,0,0,0.02)' }
                ]}
              >
                <View style={styles.settingsRowLeft}>
                  <View style={styles.settingsIconCircle}>
                    <Icon name={item.icon} size={20} color={PREMA_THEME.colors.deepNavy} />
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>
                <Icon name="chevron_right" size={24} color={PREMA_THEME.colors.mutedBlueGrey} />
              </Pressable>
            ))}
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PREMA_THEME.colors.deepNavy, // The absolute background is navy
  },
  headerBackground: {
    height: 240, // Tall header for the avatar to overlap
    backgroundColor: PREMA_THEME.colors.deepNavy,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    height: 56,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  settingsButton: {
    position: 'absolute',
    right: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  contentSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background for Prema
    borderTopLeftRadius: 40, // Huge rounded corners like the reference
    borderTopRightRadius: 40,
    marginTop: -40, // Pulls the sheet up over the navy background slightly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -60, // Exactly straddles the boundary!
    marginBottom: 16,
    position: 'relative',
    zIndex: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#FFFFFF', // Seamless cutout effect against the white sheet
    backgroundColor: '#F0F4F8',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: PREMA_THEME.colors.skyBlue, // Brand accent color
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF', // Seamless cutout for the badge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Tab bar clearance
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: PREMA_THEME.colors.deepNavy,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  userLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: PREMA_THEME.colors.mutedBlueGrey,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: PREMA_THEME.colors.deepNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(44,73,106,0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconBox: {
    backgroundColor: '#F0F4F8',
    padding: 8,
    borderRadius: 14,
  },
  cardSubtitle: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardBody: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 15,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: PREMA_THEME.colors.mutedBlueGrey,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: PREMA_THEME.colors.deepNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 24,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(44,73,106,0.04)',
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44,73,106,0.05)',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: PREMA_THEME.colors.deepNavy,
  },
});
