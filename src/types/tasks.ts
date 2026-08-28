export type TaskId =
  | 'fajr_prayer'
  | 'quran_reading'
  | 'morning_adhkar'
  | 'dhuhr_prayer'
  | 'asr_prayer'
  | 'maghrib_prayer'
  | 'evening_adhkar'
  | 'isha_prayer'
  | 'tasbeeh_minute';

export interface TaskItem {
  id: TaskId;
  order: number;
  title: string;
  iconName: string;
  description: string;
  category: 'prayer' | 'quran' | 'adhkar' | 'tasbeeh';
  completed: boolean;
  completedAt?: string;
}

export interface DayTasksState {
  dateKey: string; // YYYY-MM-DD in KSA timezone
  tasks: Record<TaskId, boolean>;
  completedCount: number;
  totalCount: number;
  percentage: number;
  lastUpdated: string;
}

export interface TaskContextType {
  tasksState: DayTasksState;
  toggleTask: (taskId: TaskId) => Promise<void>;
  setTaskCompleted: (taskId: TaskId, completed: boolean) => Promise<void>;
  resetTodayTasks: () => Promise<void>;
  checkAndPerformMidnightReset: () => Promise<void>;
}
