export interface DayHistoryRecord {
  dayNumber: number;
  dateKey: string; // YYYY-MM-DD
  dateDisplayStr: string; // e.g. "الاثنين 1 سبتمبر 2026"
  hijriDisplayStr: string; // e.g. "19 ربيع الأول 1448 هـ"
  completedCount: number;
  totalCount: number;
  percentage: number;
  perfect: boolean;
  completedTasks: string[];
  archivedAt: string;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  perfectDaysCount: number;
  totalDaysLogged: number;
  totalTasksCompleted: number;
}
