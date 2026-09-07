import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/Icon';

const PREMA_THEME = {
  colors: {
    background: '#F8F7F2',
    skyBlue: '#A9D8F5',
    powderBlue: '#DCEFFA',
    deepNavy: '#172B3A',
    mutedBlueGrey: '#6F8492',
    white: '#FFFFFF',
    error: '#D9534F',
    success: '#2E7D32',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  }
};

const SETTINGS = [
  { id: 'preferences', label: 'Discovery Preferences', icon: 'tune' },
  { id: 'dna', label: 'Compatibility DNA', icon: 'auto_awesome' },
  { id: 'safety', label: 'Safety & Verification', icon: 'shield' },
  { id: 'membership', label: 'PREMA Membership', icon: 'stars' },
];

export default function ProfileTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ── Header ── */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable 
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 8 })}
          onPress={() => {}}
        >
          <Icon name="settings" size={24} color={PREMA_THEME.colors.deepNavy} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Profile Hero ── */}
        <View style={styles.heroContainer}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }}
              style={styles.profileImage}
            />
            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={18} color={PREMA_THEME.colors.success} />
            </View>
          </View>

          <Text style={styles.heroName}>Vikram, 28</Text>
          <Text style={styles.heroLocation}>Bengaluru • Architect</Text>

          {/* Edit Profile Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.editButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* ── Archetype Card ── */}
        <View style={styles.archetypeCard}>
          <View style={styles.archetypeHeader}>
            <View style={styles.archetypeIconContainer}>
              <Icon name="auto_awesome" size={16} color={PREMA_THEME.colors.deepNavy} />
            </View>
            <Text style={styles.archetypeLabel}>Your Archetype</Text>
          </View>
          <Text style={styles.archetypeTitle}>Vrishchika (Scorpio Water)</Text>
          <Text style={styles.archetypeDescription}>
            Deep emotional reserves with a need for profound connection. You seek authenticity over surface-level charm.
          </Text>
        </View>

        {/* ── Settings Links ── */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsSectionTitle}>Account Settings</Text>
          
          <View style={styles.settingsList}>
            {SETTINGS.map((item, index) => (
              <Pressable 
                key={item.id}
                style={({ pressed }) => [
                  styles.settingsRow,
                  { opacity: pressed ? 0.6 : 1 },
                  index === SETTINGS.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.settingsRowLeft}>
                  <View style={styles.settingsIconWrapper}>
                    <Icon name={item.icon} size={20} color={PREMA_THEME.colors.deepNavy} />
                  </View>
                  <Text style={styles.settingsRowLabel}>{item.label}</Text>
                </View>
                <Icon name="chevron_right" size={20} color={PREMA_THEME.colors.mutedBlueGrey} />
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PREMA_THEME.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PREMA_THEME.spacing.lg,
    paddingTop: PREMA_THEME.spacing.md,
    paddingBottom: PREMA_THEME.spacing.lg,
  },
  headerTitle: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: PREMA_THEME.spacing.xxl,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: PREMA_THEME.spacing.xxl,
    paddingHorizontal: PREMA_THEME.spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: PREMA_THEME.spacing.lg,
    shadowColor: PREMA_THEME.colors.deepNavy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: PREMA_THEME.colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    backgroundColor: PREMA_THEME.colors.white,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: PREMA_THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroName: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: PREMA_THEME.spacing.xs,
  },
  heroLocation: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 15,
    fontWeight: '400',
  },
  editButton: {
    marginTop: PREMA_THEME.spacing.lg,
    paddingHorizontal: PREMA_THEME.spacing.xl,
    paddingVertical: 14,
    backgroundColor: PREMA_THEME.colors.skyBlue,
    borderRadius: 9999, // Pill button
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  archetypeCard: {
    marginHorizontal: PREMA_THEME.spacing.lg,
    marginBottom: PREMA_THEME.spacing.xxl,
    padding: PREMA_THEME.spacing.lg,
    backgroundColor: PREMA_THEME.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PREMA_THEME.colors.powderBlue,
    shadowColor: PREMA_THEME.colors.deepNavy,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  archetypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PREMA_THEME.spacing.sm,
    marginBottom: PREMA_THEME.spacing.md,
  },
  archetypeIconContainer: {
    backgroundColor: PREMA_THEME.colors.powderBlue,
    padding: 6,
    borderRadius: 12,
  },
  archetypeLabel: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  archetypeTitle: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 22,
    fontWeight: '500',
    marginBottom: PREMA_THEME.spacing.sm,
  },
  archetypeDescription: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 14,
    lineHeight: 22,
  },
  settingsContainer: {
    paddingHorizontal: PREMA_THEME.spacing.lg,
  },
  settingsSectionTitle: {
    color: PREMA_THEME.colors.mutedBlueGrey,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: PREMA_THEME.spacing.md,
    paddingLeft: PREMA_THEME.spacing.sm,
  },
  settingsList: {
    backgroundColor: PREMA_THEME.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PREMA_THEME.colors.powderBlue,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: PREMA_THEME.spacing.md,
    paddingHorizontal: PREMA_THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: PREMA_THEME.colors.powderBlue,
    minHeight: 56, // Accessible touch target
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PREMA_THEME.spacing.md,
  },
  settingsIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PREMA_THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsRowLabel: {
    color: PREMA_THEME.colors.deepNavy,
    fontSize: 16,
    fontWeight: '500',
  },
});