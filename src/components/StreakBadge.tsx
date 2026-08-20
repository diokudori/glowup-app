import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Trophy } from 'lucide-react-native';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ currentStreak, longestStreak }) => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
          <Flame size={20} color="#3B82F6" />
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.valueText}>{currentStreak} Hari</Text>
          <Text style={styles.labelText}>CURRENT STREAK</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(148, 163, 184, 0.15)' }]}>
          <Trophy size={18} color="#94A3B8" />
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.valueText}>{longestStreak} Hari</Text>
          <Text style={styles.labelText}>LONGEST REKOR</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textGroup: {
    flexDirection: 'column',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  labelText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#1E293B',
    marginHorizontal: 12,
  },
});
