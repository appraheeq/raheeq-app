import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/auth';
import { DayTasksState } from '../types/tasks';
import { DayHistoryRecord, StreakStats } from '../types/history';
import { DhikrProgressState } from '../types/adhkar';

const KEYS = {
  USER_PROFILE: '@raheeq_user_profile',
  THEME_MODE: '@raheeq_theme_mode',
  TODAY_TASKS: '@raheeq_today_tasks',
  HISTORY_RECORDS: '@raheeq_history_records',
  STREAK_STATS: '@raheeq_streak_stats',
  ADHKAAR_PROGRESS_PREFIX: '@raheeq_adhkar_',
};

export const StorageService = {
  // --- User Profile ---
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading user profile:', e);
      return null;
    }
  },

  async saveUserProfile(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user profile:', e);
    }
  },

  async removeUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_PROFILE);
    } catch (e) {
      console.error('Error removing user profile:', e);
    }
  },

  // --- Theme Mode ---
  async getThemeMode(): Promise<'light' | 'dark' | null> {
    try {
      const mode = await AsyncStorage.getItem(KEYS.THEME_MODE);
      return mode === 'dark' || mode === 'light' ? mode : null;
    } catch (e) {
      console.error('Error reading theme mode:', e);
      return null;
    }
  },

  async saveThemeMode(mode: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME_MODE, mode);
    } catch (e) {
      console.error('Error saving theme mode:', e);
    }
  },

  // --- Today Tasks ---
  async getTodayTasks(): Promise<DayTasksState | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TODAY_TASKS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading today tasks:', e);
      return null;
    }
  },

  async saveTodayTasks(state: DayTasksState): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TODAY_TASKS, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving today tasks:', e);
    }
  },

  // --- History Records ---
  async getHistoryRecords(): Promise<DayHistoryRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.HISTORY_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading history records:', e);
      return [];
    }
  },

  async saveHistoryRecords(records: DayHistoryRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HISTORY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving history records:', e);
    }
  },

  async appendHistoryRecord(record: DayHistoryRecord): Promise<DayHistoryRecord[]> {
    try {
      const records = await this.getHistoryRecords();
      // Remove any existing record with same dateKey to prevent duplication
      const filtered = records.filter(r => r.dateKey !== record.dateKey);
      const updated = [record, ...filtered];
      await this.saveHistoryRecords(updated);
      return updated;
    } catch (e) {
      console.error('Error appending history record:', e);
      return [];
    }
  },

  // --- Streak Stats ---
  async getStreakStats(): Promise<StreakStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.STREAK_STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading streak stats:', e);
    }
    return {
      currentStreak: 0,
      bestStreak: 0,
      perfectDaysCount: 0,
      totalDaysLogged: 0,
      totalTasksCompleted: 0,
    };
  },

  async saveStreakStats(stats: StreakStats): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.STREAK_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving streak stats:', e);
    }
  },

  // --- Adhkar Progress ---
  async getAdhkarProgress(category: 'morning' | 'evening', dateKey: string): Promise<DhikrProgressState | null> {
    try {
      const data = await AsyncStorage.getItem(`${KEYS.ADHKAAR_PROGRESS_PREFIX}${category}_${dateKey}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading adhkar progress:', e);
      return null;
    }
  },

  async saveAdhkarProgress(state: DhikrProgressState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${KEYS.ADHKAAR_PROGRESS_PREFIX}${state.category}_${state.dateKey}`,
        JSON.stringify(state)
      );
    } catch (e) {
      console.error('Error saving adhkar progress:', e);
    }
  },
};
