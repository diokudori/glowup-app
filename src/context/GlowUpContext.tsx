import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, Group, Mission, MissionLog, Motivation, GlowUpState } from '../types';

const STORAGE_KEY = '@glowup_app_state_v1';

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_STATE: GlowUpState = {
  configuration: {
    targetDays: 60,
    startDate: getTodayString(),
    title: 'GLOW UP 1.0 Challenge',
  },
  groups: [
    { id: 'g1', name: 'Pagi ( Setelah Mandi )', order: 1, color: '#3B82F6' },
    { id: 'g2', name: 'Workout / Gym', order: 2, color: '#2563EB' },
    { id: 'g3', name: 'Malam ( Setelah Mandi )', order: 3, color: '#60A5FA' },
    { id: 'g4', name: 'Sebelum Tidur', order: 4, color: '#94A3B8' },
  ],
  missions: [
    { id: 'm1', groupId: 'g1', name: 'Sabun Cuci Muka + Toner + Serum' },
    { id: 'm2', groupId: 'g1', name: 'Sunscreen SPF 50' },
    { id: 'm3', groupId: 'g1', name: 'Minum Air Putih 500ml (Bangun)' },
    { id: 'm4', groupId: 'g2', name: 'Workout / Stretching 30 Menit' },
    { id: 'm5', groupId: 'g2', name: 'Target Protein 80g Tercapai' },
    { id: 'm6', groupId: 'g3', name: 'Mandi Malam + Handbody' },
    { id: 'm7', groupId: 'g3', name: 'Night Skincare Routine' },
    { id: 'm8', groupId: 'g4', name: 'Baca Buku 15 Halaman' },
    { id: 'm9', groupId: 'g4', name: 'Tidur Cukup 7 - 8 Jam' },
  ],
  missionLogs: [],
  motivation: {
    whyIStarted: 'Saya ingin menjadi versi terbaik dari diri saya sendiri. Lebih sehat, lebih percaya diri, disiplin, dan glowing setiap hari! ✨',
    targetGoals: [
      'Kulit sehat, bersih & terawat',
      'Tubuh fit, bugar & stamina tinggi',
      'Pola tidur konsisten 7-8 jam',
      'Fokus & disiplin dalam rutinitas harian'
    ]
  },
  selectedDate: getTodayString(),
};

interface GlowUpContextType {
  state: GlowUpState;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  toggleMission: (missionId: string, dateStr?: string) => void;
  isMissionCompleted: (missionId: string, dateStr?: string) => boolean;
  addMission: (name: string, groupId: string) => void;
  deleteMission: (missionId: string) => void;
  addGroup: (name: string, color?: string) => void;
  deleteGroup: (groupId: string) => void;
  updateTargetDays: (days: number) => void;
  updateMotivation: (why: string, goals: string[]) => void;
  resetChallenge: (newTargetDays?: number) => void;
  // Computed values
  getTodayScore: (dateStr?: string) => number; // 0 - 100
  getChallengeDay: (dateStr?: string) => { currentDay: number; totalDays: number; daysLeft: number };
  getOverallProgress: () => number; // 0 - 100
  getStreakInfo: () => { currentStreak: number; longestStreak: number };
  getWeeklyData: () => Array<{ date: string; dayName: string; score: number; completedCount: number }>;
}

const GlowUpContext = createContext<GlowUpContextType | undefined>(undefined);

export const GlowUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlowUpState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Load from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            selectedDate: getTodayString()
          });
        }
      } catch (err) {
        console.error('Failed to load state:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Save state changes
  const saveState = async (newState: GlowUpState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  };

  const toggleMission = (missionId: string, dateStr = selectedDate) => {
    const existingIndex = state.missionLogs.findIndex(
      log => log.missionId === missionId && log.dateString === dateStr
    );

    let newLogs: MissionLog[] = [];
    if (existingIndex >= 0) {
      // Remove log (uncomplete)
      newLogs = state.missionLogs.filter((_, i) => i !== existingIndex);
    } else {
      // Add log (complete)
      newLogs = [
        ...state.missionLogs,
        {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          missionId,
          dateString: dateStr,
          timestamp: Date.now()
        }
      ];
    }

    saveState({
      ...state,
      missionLogs: newLogs
    });
  };

  const isMissionCompleted = (missionId: string, dateStr = selectedDate) => {
    return state.missionLogs.some(
      log => log.missionId === missionId && log.dateString === dateStr
    );
  };

  const addMission = (name: string, groupId: string) => {
    if (!name.trim()) return;
    const newMission: Mission = {
      id: `m_${Date.now()}`,
      groupId,
      name: name.trim()
    };
    saveState({
      ...state,
      missions: [...state.missions, newMission]
    });
  };

  const deleteMission = (missionId: string) => {
    saveState({
      ...state,
      missions: state.missions.filter(m => m.id !== missionId),
      missionLogs: state.missionLogs.filter(l => l.missionId !== missionId)
    });
  };

  const addGroup = (name: string, color = '#EC4899') => {
    if (!name.trim()) return;
    const newGroup: Group = {
      id: `g_${Date.now()}`,
      name: name.trim(),
      order: state.groups.length + 1,
      color
    };
    saveState({
      ...state,
      groups: [...state.groups, newGroup]
    });
  };

  const deleteGroup = (groupId: string) => {
    const missionIdsToRemove = state.missions.filter(m => m.groupId === groupId).map(m => m.id);
    saveState({
      ...state,
      groups: state.groups.filter(g => g.id !== groupId),
      missions: state.missions.filter(m => m.groupId !== groupId),
      missionLogs: state.missionLogs.filter(l => !missionIdsToRemove.includes(l.missionId))
    });
  };

  const updateTargetDays = (days: number) => {
    saveState({
      ...state,
      configuration: {
        ...state.configuration,
        targetDays: Math.max(1, days)
      }
    });
  };

  const updateMotivation = (why: string, goals: string[]) => {
    saveState({
      ...state,
      motivation: {
        whyIStarted: why,
        targetGoals: goals
      }
    });
  };

  const resetChallenge = (newTargetDays = 60) => {
    const freshState: GlowUpState = {
      ...DEFAULT_STATE,
      configuration: {
        ...DEFAULT_STATE.configuration,
        targetDays: newTargetDays,
        startDate: getTodayString()
      },
      missionLogs: []
    };
    saveState(freshState);
  };

  // Computations
  const getTodayScore = (dateStr = selectedDate) => {
    if (state.missions.length === 0) return 0;
    const completedCount = state.missions.filter(m => isMissionCompleted(m.id, dateStr)).length;
    return Math.round((completedCount / state.missions.length) * 100);
  };

  const getChallengeDay = (dateStr = selectedDate) => {
    const start = new Date(state.configuration.startDate).getTime();
    const target = new Date(dateStr).getTime();
    const diffTime = target - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.max(1, diffDays);
    const totalDays = state.configuration.targetDays;
    const daysLeft = Math.max(0, totalDays - currentDay);
    return { currentDay, totalDays, daysLeft };
  };

  const getOverallProgress = () => {
    const { currentDay, totalDays } = getChallengeDay();
    return Math.min(100, Math.round((currentDay / totalDays) * 100));
  };

  const getStreakInfo = () => {
    if (state.missionLogs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique dates with at least 1 completed mission
    const dateMap = new Map<string, number>();
    state.missionLogs.forEach(log => {
      dateMap.set(log.dateString, (dateMap.get(log.dateString) || 0) + 1);
    });

    const dates = Array.from(dateMap.keys()).sort();
    if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let longest = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    dates.forEach(dStr => {
      const curDate = new Date(dStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak += 1;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) longest = tempStreak;
      prevDate = curDate;
    });

    // Calculate current streak relative to today
    const todayStr = getTodayString();
    let currentStreak = 0;
    let checkDate = new Date(todayStr);

    // If today has completed tasks
    const todayCompleted = dateMap.get(todayStr) || 0;
    if (todayCompleted > 0) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      if ((dateMap.get(dateString) || 0) > 0) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longest, currentStreak)
    };
  };

  const getWeeklyData = () => {
    const result = [];
    const today = new Date(selectedDate);
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const score = getTodayScore(dateStr);
      const completedCount = state.missions.filter(m => isMissionCompleted(m.id, dateStr)).length;
      result.push({
        date: dateStr,
        dayName: dayNames[d.getDay()],
        score,
        completedCount
      });
    }

    return result;
  };

  if (!loaded) return null;

  return (
    <GlowUpContext.Provider
      value={{
        state,
        selectedDate,
        setSelectedDate,
        toggleMission,
        isMissionCompleted,
        addMission,
        deleteMission,
        addGroup,
        deleteGroup,
        updateTargetDays,
        updateMotivation,
        resetChallenge,
        getTodayScore,
        getChallengeDay,
        getOverallProgress,
        getStreakInfo,
        getWeeklyData,
      }}
    >
      {children}
    </GlowUpContext.Provider>
  );
};

export const useGlowUp = () => {
  const context = useContext(GlowUpContext);
  if (!context) {
    throw new Error('useGlowUp must be used within a GlowUpProvider');
  }
  return context;
};
