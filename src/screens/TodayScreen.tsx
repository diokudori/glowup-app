import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Sparkles, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useGlowUp } from '../context/GlowUpContext';
import { ProgressRing } from '../components/ProgressRing';
import { StreakBadge } from '../components/StreakBadge';
import { MissionCard } from '../components/MissionCard';

export const TodayScreen: React.FC = () => {
  const {
    state,
    selectedDate,
    setSelectedDate,
    toggleMission,
    isMissionCompleted,
    getTodayScore,
    getChallengeDay,
    getStreakInfo,
  } = useGlowUp();

  const score = getTodayScore(selectedDate);
  const { currentDay, totalDays, daysLeft } = getChallengeDay(selectedDate);
  const { currentStreak, longestStreak } = getStreakInfo();

  // Date navigation helpers
  const changeDateBy = (offsetDays: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + offsetDays);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const formatDateDisplay = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) return 'Hari Ini';
    const dateObj = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return dateObj.toLocaleDateString('id-ID', options);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <Sparkles size={14} color="#3B82F6" />
              <Text style={styles.badgeText}>GLOW UP 1.0</Text>
            </View>
            <Text style={styles.headerTitle}>Daily Checklist</Text>
          </View>

          <View style={styles.dayCounterBadge}>
            <Text style={styles.dayCounterLabel}>CHALLENGE</Text>
            <Text style={styles.dayCounterValue}>Hari {currentDay}/{totalDays}</Text>
          </View>
        </View>

        {/* Date Selector Bar */}
        <View style={styles.dateSelector}>
          <TouchableOpacity style={styles.dateArrow} onPress={() => changeDateBy(-1)}>
            <ChevronLeft size={20} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.dateDisplay}>
            <CalendarIcon size={16} color="#3B82F6" style={{ marginRight: 6 }} />
            <Text style={styles.dateText}>{formatDateDisplay(selectedDate)} ({selectedDate})</Text>
          </View>

          <TouchableOpacity style={styles.dateArrow} onPress={() => changeDateBy(1)}>
            <ChevronRight size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Today's Score Ring & Streak */}
        <View style={styles.heroCard}>
          <ProgressRing
            size={170}
            strokeWidth={14}
            progress={score}
            label="TODAY'S SCORE"
            sublabel={`${daysLeft} Hari tersisa`}
          />

          <View style={{ marginTop: 20, width: '100%' }}>
            <StreakBadge currentStreak={currentStreak} longestStreak={longestStreak} />
          </View>
        </View>

        {/* TODAY'S MISSIONS GROUPED BY CATEGORY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S MISSIONS</Text>
          <Text style={styles.sectionSubtitle}>
            {state.missions.filter(m => isMissionCompleted(m.id, selectedDate)).length} dari {state.missions.length} Selesai
          </Text>
        </View>

        {state.groups.map(group => {
          const groupMissions = state.missions.filter(m => m.groupId === group.id);
          if (groupMissions.length === 0) return null;

          const groupCompletedCount = groupMissions.filter(m => isMissionCompleted(m.id, selectedDate)).length;

          return (
            <View key={group.id} style={styles.groupContainer}>
              <View style={styles.groupHeaderRow}>
                <View style={styles.groupTitleRow}>
                  <View style={[styles.colorDot, { backgroundColor: group.color || '#3B82F6' }]} />
                  <Text style={styles.groupName}>{group.name}</Text>
                </View>
                <Text style={styles.groupBadge}>
                  {groupCompletedCount}/{groupMissions.length}
                </Text>
              </View>

              {groupMissions.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isCompleted={isMissionCompleted(mission.id, selectedDate)}
                  groupColor={group.color || '#3B82F6'}
                  onToggle={() => toggleMission(mission.id, selectedDate)}
                />
              ))}
            </View>
          );
        })}

        {state.missions.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada misi. Tambahkan misi di tab Setup! ✨</Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  dayCounterBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'flex-end',
  },
  dayCounterLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dayCounterValue: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  dateArrow: {
    padding: 6,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  groupContainer: {
    marginBottom: 18,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  groupBadge: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
});
