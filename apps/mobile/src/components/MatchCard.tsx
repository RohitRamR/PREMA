import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

export interface MatchData {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  isVerified: boolean;
  score: number;
  breakdown: { label: string; score: number }[];
  friction: string;
}

interface MatchCardProps {
  match: MatchData;
  onLike: () => void;
  onPass: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onPass }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: match.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{match.name} · {match.age} {match.isVerified && '✓'}</Text>
          <Text style={styles.location}>{match.location}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{match.score}%</Text>
          <Text style={styles.scoreLabel}>PREMA MATCH</Text>
        </View>

        <View style={styles.breakdown}>
          {match.breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>♥ {item.label}</Text>
              <Text style={styles.breakdownScore}>{item.score}%</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.whyMatchBtn}>
          <Text style={styles.whyMatchText}>Why you match →</Text>
        </TouchableOpacity>

        <View style={styles.frictionContainer}>
          <Text style={styles.frictionLabel}>Potential friction:</Text>
          <Text style={styles.frictionText}>{match.friction}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={onPass}>
            <Text style={styles.passText}>PASS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={onLike}>
            <Text style={styles.likeText}>LIKE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    margin: spacing.md,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: spacing.lg,
  },
  headerRow: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  location: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  scoreValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.primary,
    marginRight: spacing.xs,
  },
  scoreLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primaryAccent,
    letterSpacing: 1,
  },
  breakdown: {
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  breakdownLabel: {
    fontSize: typography.sizes.base,
    color: colors.primary,
  },
  breakdownScore: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primary,
  },
  whyMatchBtn: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  whyMatchText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primaryAccent,
  },
  frictionContainer: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  frictionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  frictionText: {
    fontSize: typography.sizes.base,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passBtn: {
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  likeBtn: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  passText: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: colors.primary,
  },
  likeText: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: colors.white,
  },
});
