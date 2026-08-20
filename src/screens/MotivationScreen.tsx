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
import { Heart, Target, Sparkles, Save, Check } from 'lucide-react-native';
import { useGlowUp } from '../context/GlowUpContext';

export const MotivationScreen: React.FC = () => {
  const { state, updateMotivation } = useGlowUp();

  const [whyText, setWhyText] = useState(state.motivation.whyIStarted);
  const [goals, setGoals] = useState<string[]>(state.motivation.targetGoals);
  const [newGoalInput, setNewGoalInput] = useState('');

  const handleSaveWhy = () => {
    updateMotivation(whyText, goals);
    Alert.alert('Tersimpan', 'Alasan kamu memulai berhasil diperbarui!');
  };

  const handleAddGoal = () => {
    if (newGoalInput.trim()) {
      const updated = [...goals, newGoalInput.trim()];
      setGoals(updated);
      updateMotivation(whyText, updated);
      setNewGoalInput('');
    }
  };

  const handleDeleteGoal = (index: number) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
    updateMotivation(whyText, updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mindset & Vision</Text>
          <Text style={styles.headerSubtitle}>Pengingat Alasan Kamu Memulai Perjalanan GLOW UP ini</Text>
        </View>

        {/* Motivation Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Heart size={20} color="#3B82F6" />
            </View>
            <Text style={styles.cardTitle}>ALASAN KAMU MEMULAI SEMUA INI</Text>
          </View>
          <Text style={styles.guideText}>
            Tulis alasan mendalam kamu di sini. Saat merasa malas atau ingin menyerah, baca lagi bagian ini!
          </Text>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={whyText}
            onChangeText={setWhyText}
            placeholder="Tuliskan motivasi & impian kamu di sini..."
            placeholderTextColor="#64748B"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveWhy}>
            <Save size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Simpan Motivasi</Text>
          </TouchableOpacity>
        </View>

        {/* Target Goals Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Target size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.cardTitle, { color: '#3B82F6' }]}>TARGET & COMPASS GOALS</Text>
          </View>
          <Text style={styles.guideText}>
            Hasil nyata yang ingin kamu capai di akhir {state.configuration.targetDays} hari challenge.
          </Text>

          {/* Add Goal Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={newGoalInput}
              onChangeText={setNewGoalInput}
              placeholder="+ Tambah Goal Impian Kamu"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddGoal}>
              <Text style={styles.addBtnText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {/* Goals Checklist */}
          <View style={styles.goalsList}>
            {goals.map((goal, idx) => (
              <View key={idx} style={styles.goalItem}>
                <View style={styles.checkIcon}>
                  <Check size={14} color="#3B82F6" />
                </View>
                <Text style={styles.goalText}>{goal}</Text>
                <TouchableOpacity onPress={() => handleDeleteGoal(idx)}>
                  <Text style={styles.deleteGoalText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Encouragement Banner */}
        <View style={styles.quoteCard}>
          <Sparkles size={24} color="#3B82F6" style={{ marginBottom: 10 }} />
          <Text style={styles.quoteText}>
            "Template ini cuma alat. Yang bikin perubahan itu kamu yang muncul tiap hari — bahkan di hari yang lagi malas."
          </Text>
          <Text style={styles.quoteAuthor}>— GLOW UP 1.0 Note</Text>
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
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  guideText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  textArea: {
    backgroundColor: '#0B1120',
    borderRadius: 14,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0B1120',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  addBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  goalText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  deleteGoalText: {
    color: '#64748B',
    fontSize: 14,
    paddingHorizontal: 6,
  },
  quoteCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  quoteText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
});
