import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react-native';
import { useGlowUp } from '../context/GlowUpContext';

export const StatsScreen: React.FC = () => {
  const {
    state,
    getChallengeDay,
    getOverallProgress,
    getStreakInfo,
    getWeeklyData
  } = useGlowUp();

  const { currentDay, totalDays, daysLeft } = getChallengeDay();
  const overallProgress = getOverallProgress();
  const { currentStreak, longestStreak } = getStreakInfo();
  const weeklyData = getWeeklyData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress & Analytics</Text>
          <Text style={styles.headerSubtitle}>Pantau konsistensi & perkembangan GLOW UP kamu</Text>
        </View>

        {/* Challenge Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <TrendingUp size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>CHALLENGE PROGRESS</Text>
              <Text style={styles.cardSubtitle}>Total Target: {totalDays} Hari</Text>
            </View>
            <Text style={styles.progressPercent}>{overallProgress}%</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
          </View>

          <View style={styles.progressFooterRow}>
            <Text style={styles.progressFooterText}>
              Hari Ke-{currentDay} dari {totalDays}
            </Text>
            <Text style={styles.daysLeftText}>{daysLeft} Hari Tersisa 🎯</Text>
          </View>
        </View>

        {/* Weekly Progress Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Calendar size={20} color="#3B82F6" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>WEEKLY PROGRESS</Text>
              <Text style={styles.cardSubtitle}>Performa 7 Hari Terakhir</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.barColumn}>
                <Text style={styles.barScoreText}>{item.score}%</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(8, item.score)}%`,
                        backgroundColor: item.score >= 80 ? '#2563EB' : item.score >= 50 ? '#3B82F6' : '#334155'
                      }
                    ]}
                  />
                </View>
                <Text style={styles.barDayText}>{item.dayName}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak & Consistency Record */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(148, 163, 184, 0.15)' }]}>
              <Award size={20} color="#94A3B8" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>RECORD STREAK</Text>
              <Text style={styles.cardSubtitle}>Kunci perubahan adalah konsistensi</Text>
            </View>
          </View>

          <View style={styles.streakGrid}>
            <View style={styles.streakBox}>
              <Text style={styles.streakBoxValue}>{currentStreak}</Text>
              <Text style={styles.streakBoxLabel}>Current Streak (Hari)</Text>
            </View>
            <View style={styles.streakBox}>
              <Text style={[styles.streakBoxValue, { color: '#94A3B8' }]}>{longestStreak}</Text>
              <Text style={styles.streakBoxLabel}>Longest Record (Hari)</Text>
            </View>
          </View>
        </View>

        {/* Mission History Logs */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <CheckCircle2 size={20} color="#3B82F6" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>MISSION LOGS</Text>
              <Text style={styles.cardSubtitle}>Total {state.missionLogs.length} Aktivitas Selesai</Text>
            </View>
          </View>

          <View style={styles.logsList}>
            {state.missionLogs.slice(-6).reverse().map(log => {
              const mission = state.missions.find(m => m.id === log.missionId);
              return (
                <View key={log.id} style={styles.logItem}>
                  <Text style={styles.logMissionName}>{mission ? mission.name : 'Mission'}</Text>
                  <Text style={styles.logDate}>{log.dateString}</Text>
                </View>
              );
            })}
            {state.missionLogs.length === 0 && (
              <Text style={styles.emptyLogsText}>Belum ada riwayat misi yang diselesaikan.</Text>
            )}
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
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  progressPercent: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  progressFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressFooterText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  daysLeftText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barScoreText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  barTrack: {
    width: 16,
    height: 90,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDayText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  streakGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  streakBox: {
    flex: 1,
    backgroundColor: '#0B1120',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  streakBoxValue: {
    color: '#3B82F6',
    fontSize: 24,
    fontWeight: '800',
  },
  streakBoxLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  logsList: {
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  logMissionName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  logDate: {
    color: '#94A3B8',
    fontSize: 11,
  },
  emptyLogsText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
