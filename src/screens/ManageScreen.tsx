import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { Settings, Plus, FolderPlus, Trash2, RotateCcw } from 'lucide-react-native';
import { useGlowUp } from '../context/GlowUpContext';

export const ManageScreen: React.FC = () => {
  const {
    state,
    updateTargetDays,
    addGroup,
    deleteGroup,
    addMission,
    deleteMission,
    resetChallenge,
  } = useGlowUp();

  const [targetDaysInput, setTargetDaysInput] = useState(
    String(state.configuration.targetDays)
  );
  const [newGroupName, setNewGroupName] = useState('');
  const [newMissionName, setNewMissionName] = useState('');
  const [selectedGroupIdForMission, setSelectedGroupIdForMission] = useState(
    state.groups.length > 0 ? state.groups[0].id : ''
  );

  const handleSaveTargetDays = () => {
    const num = parseInt(targetDaysInput, 10);
    if (!isNaN(num) && num > 0) {
      updateTargetDays(num);
      Alert.alert('Sukses', `Target challenge diperbarui menjadi ${num} Hari!`);
    } else {
      Alert.alert('Error', 'Masukkan jumlah hari yang valid');
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim(), '#3B82F6');
      setNewGroupName('');
    }
  };

  const handleAddMission = () => {
    if (!newMissionName.trim()) return;
    const targetGroup = selectedGroupIdForMission || (state.groups[0] ? state.groups[0].id : '');
    if (!targetGroup) {
      Alert.alert('Perhatian', 'Buat Group terlebih dahulu sebelum menambah misi!');
      return;
    }
    addMission(newMissionName.trim(), targetGroup);
    setNewMissionName('');
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'Reset Challenge?',
      'Semua riwayat centang harian akan direset ke Hari Ke-1. Konfigurasi dan daftar misi tetap tersimpan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetChallenge(state.configuration.targetDays)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Setup & Configurations</Text>
          <Text style={styles.headerSubtitle}>Kelola 3 Database Utama: Configuration, Groups, dan Missions</Text>
        </View>

        {/* 1️⃣ STEP 1: CONFIGURATION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Settings size={18} color="#3B82F6" />
            <Text style={styles.sectionTitle}>1️⃣ STEP 1 — CONFIGURATION</Text>
          </View>
          <Text style={styles.sectionGuideText}>
            Atur durasi hari challenge GLOW UP kamu (misal: 30, 60, atau 90 hari).
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={targetDaysInput}
              onChangeText={setTargetDaysInput}
              keyboardType="numeric"
              placeholder="Jumlah Hari Target"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.actionBtn} onPress={handleSaveTargetDays}>
              <Text style={styles.actionBtnText}>Simpan Target</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleConfirmReset}>
            <RotateCcw size={16} color="#94A3B8" style={{ marginRight: 6 }} />
            <Text style={styles.resetBtnText}>Reset Challenge ke Hari 1</Text>
          </TouchableOpacity>
        </View>

        {/* 2️⃣ STEP 2: GROUPS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <FolderPlus size={18} color="#60A5FA" />
            <Text style={[styles.sectionTitle, { color: '#60A5FA' }]}>2️⃣ STEP 2 — GROUPS</Text>
          </View>
          <Text style={styles.sectionGuideText}>
            Kelompokkan kebiasaan berdasarkan waktu / aktivitas nyata (misal: Pagi, Malam, Workout).
          </Text>

          {/* Add Group Form */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="+ Tambah Nama Group Baru"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.actionBtn} onPress={handleAddGroup}>
              <Plus size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Groups List */}
          <View style={styles.itemList}>
            {state.groups.map(group => (
              <View key={group.id} style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <View style={[styles.dot, { backgroundColor: group.color || '#3B82F6' }]} />
                  <Text style={styles.itemName}>{group.name}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteGroup(group.id)}>
                  <Trash2 size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 3️⃣ STEP 3: MISSIONS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Plus size={18} color="#94A3B8" />
            <Text style={[styles.sectionTitle, { color: '#94A3B8' }]}>3️⃣ STEP 3 — MISSIONS</Text>
          </View>
          <Text style={styles.sectionGuideText}>
            Kebiasaan harian yang mau kamu centang setiap hari. Pilih Group untuk memasukkannya.
          </Text>

          {/* Select Group for new mission */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupChipsScroll}>
            {state.groups.map(group => {
              const isSelected = selectedGroupIdForMission === group.id;
              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupChip,
                    isSelected && { backgroundColor: group.color || '#3B82F6', borderColor: group.color || '#3B82F6' }
                  ]}
                  onPress={() => setSelectedGroupIdForMission(group.id)}
                >
                  <Text style={[styles.groupChipText, isSelected && { color: '#FFFFFF' }]}>
                    {group.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Add Mission Form */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={newMissionName}
              onChangeText={setNewMissionName}
              placeholder="+ Nama Kebiasaan Baru"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.actionBtn} onPress={handleAddMission}>
              <Plus size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Missions List */}
          <View style={styles.itemList}>
            {state.missions.map(mission => {
              const group = state.groups.find(g => g.id === mission.groupId);
              return (
                <View key={mission.id} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.groupTag}>[{group ? group.name : 'No Group'}]</Text>
                    <Text style={styles.itemName} numberOfLines={1}>{mission.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteMission(mission.id)}>
                    <Trash2 size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 8,
  },
  sectionGuideText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0B1120',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  actionBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 4,
    backgroundColor: '#0B1120',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  resetBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  itemList: {
    gap: 8,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  groupTag: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 6,
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  groupChipsScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  groupChip: {
    backgroundColor: '#0B1120',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  groupChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
