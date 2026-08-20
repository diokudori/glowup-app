export interface Configuration {
  targetDays: number; // e.g. 60 days challenge
  startDate: string; // ISO date string (YYYY-MM-DD)
  title: string; // e.g. "My Glow Up 1.0 Challenge"
}

export interface Group {
  id: string;
  name: string; // e.g., "Pagi (Setelah Mandi)", "Malam", "Workout"
  order: number;
  color?: string;
}

export interface Mission {
  id: string;
  groupId: string;
  name: string; // e.g., "Sabun Cuci Muka, Toner, Serum", "Minum Air 2L"
  icon?: string;
}

export interface MissionLog {
  id: string;
  missionId: string;
  dateString: string; // YYYY-MM-DD format
  timestamp: number;
}

export interface Motivation {
  whyIStarted: string; // Motivation statement
  targetGoals: string[];
}

export interface GlowUpState {
  configuration: Configuration;
  groups: Group[];
  missions: Mission[];
  missionLogs: MissionLog[];
  motivation: Motivation;
  selectedDate: string; // YYYY-MM-DD
}
