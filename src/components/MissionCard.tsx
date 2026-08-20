import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  isCompleted: boolean;
  groupColor?: string;
  onToggle: () => void;
  onDelete?: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isCompleted,
  groupColor = '#3B82F6',
  onToggle,
  onDelete
}) => {
  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <TouchableOpacity
        style={styles.clickableRow}
        activeOpacity={0.7}
        onPress={onToggle}
      >
        <View style={styles.contentLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onToggle}
            style={[
              styles.checkbox,
              { borderColor: groupColor },
              isCompleted && { backgroundColor: groupColor, borderColor: groupColor }
            ]}
          >
            {isCompleted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              isCompleted && styles.titleCompleted
            ]}
            numberOfLines={2}
          >
            {mission.name}
          </Text>
        </View>
      </TouchableOpacity>

      {onDelete ? (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.6}
        >
          <Trash2 size={16} color="#64748B" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardCompleted: {
    backgroundColor: '#0A0F1D',
    borderColor: '#151E2E',
  },
  clickableRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  titleCompleted: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
});
