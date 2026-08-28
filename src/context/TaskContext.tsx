import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { DayTasksState, TaskContextType, TaskId } from '../types/tasks';
import { DAILY_TASKS_DATA } from '../constants/strings';
import { TimeService } from '../services/timeService';
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';
import { DayHistoryRecord, StreakStats } from '../types/history';

const TOTAL_TASKS_COUNT = DAILY_TASKS_DATA.length; // 9 tasks

const getInitialTasksRecord = (): Record<TaskId, boolean> => ({
  fajr_prayer: false,
  quran_reading: false,
  morning_adhkar: false,
  dhuhr_prayer: false,
  asr_prayer: false,
  maghrib_prayer: false,
  evening_adhkar: false,
  isha_prayer: false,
  tasbeeh_minute: false,
});

const calculateState = (dateKey: string, tasks: Record<TaskId, boolean>): DayTasksState => {
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const percentage = Math.round((completedCount / TOTAL_TASKS_COUNT) * 100);
  return {
    dateKey,
    tasks,
    completedCount,
    totalCount: TOTAL_TASKS_COUNT,
    percentage,
    lastUpdated: new Date().toISOString(),
  };
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayDateKey = TimeService.getKSADateKey();
  const [tasksState, setTasksState] = useState<DayTasksState>(() =>
    calculateState(todayDateKey, getInitialTasksRecord())
  );
  
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadAndCheckDayTasks();

    // Check midnight transition every 10 seconds
    const interval = setInterval(() => {
      checkAndPerformMidnightReset();
    }, 10000);

    // Also check on app resume / foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkAndPerformMidnightReset();
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const loadAndCheckDayTasks = async () => {
    try {
      const currentKSADateKey = TimeService.getKSADateKey();
      const saved = await StorageService.getTodayTasks();

      if (!saved) {
        // No saved state yet, initialize for today
        const fresh = calculateState(currentKSADateKey, getInitialTasksRecord());
        await StorageService.saveTodayTasks(fresh);
        setTasksState(fresh);
        return;
      }

      if (saved.dateKey === currentKSADateKey) {
        // Same day, use saved tasks
        setTasksState(saved);
      } else {
        // Date has changed! Archive previous day into history and reset
        await archiveDayAndReset(saved, currentKSADateKey);
      }
    } catch (e) {
      console.error('Error loading day tasks', e);
    }
  };

  const archiveDayAndReset = async (previousDay: DayTasksState, newDateKey: string) => {
    try {
      // Create history record for the previous day
      const prevDate = new Date(previousDay.lastUpdated || Date.now());
      const historyRecords = await StorageService.getHistoryRecords();
      const dayNumber = historyRecords.length + 1;
      const isPerfect = previousDay.percentage === 100;

      const record: DayHistoryRecord = {
        dayNumber,
        dateKey: previousDay.dateKey,
        dateDisplayStr: TimeService.formatArabicGregorian(prevDate),
        hijriDisplayStr: TimeService.getHijriDate(prevDate).formatted,
        completedCount: previousDay.completedCount,
        totalCount: previousDay.totalCount,
        percentage: previousDay.percentage,
        perfect: isPerfect,
        completedTasks: Object.entries(previousDay.tasks)
          .filter(([_, done]) => done)
          .map(([id]) => id),
        archivedAt: new Date().toISOString(),
      };

      await StorageService.appendHistoryRecord(record);

      // Update streaks
      const currentStats = await StorageService.getStreakStats();
      const updatedStats: StreakStats = {
        currentStreak: isPerfect ? currentStats.currentStreak + 1 : 0,
        bestStreak: isPerfect
          ? Math.max(currentStats.bestStreak, currentStats.currentStreak + 1)
          : currentStats.bestStreak,
        perfectDaysCount: isPerfect ? currentStats.perfectDaysCount + 1 : currentStats.perfectDaysCount,
        totalDaysLogged: currentStats.totalDaysLogged + 1,
        totalTasksCompleted: currentStats.totalTasksCompleted + previousDay.completedCount,
      };
      await StorageService.saveStreakStats(updatedStats);

      // Initialize brand new day state
      const newDayState = calculateState(newDateKey, getInitialTasksRecord());
      await StorageService.saveTodayTasks(newDayState);
      setTasksState(newDayState);
    } catch (e) {
      console.error('Error during archiveDayAndReset', e);
    }
  };

  const checkAndPerformMidnightReset = async () => {
    const currentKSADateKey = TimeService.getKSADateKey();
    if (tasksState.dateKey !== currentKSADateKey) {
      await archiveDayAndReset(tasksState, currentKSADateKey);
    }
  };

  const toggleTask = async (taskId: TaskId) => {
    const currentDone = !!tasksState.tasks[taskId];
    await setTaskCompleted(taskId, !currentDone);
  };

  const setTaskCompleted = async (taskId: TaskId, completed: boolean) => {
    const updatedTasks = {
      ...tasksState.tasks,
      [taskId]: completed,
    };

    const newState = calculateState(tasksState.dateKey, updatedTasks);
    setTasksState(newState);
    await StorageService.saveTodayTasks(newState);

    if (completed) {
      if (newState.percentage === 100) {
        await HapticService.success();
      } else {
        await HapticService.mediumTap();
      }
    } else {
      await HapticService.lightTap();
    }
  };

  const resetTodayTasks = async () => {
    const resetState = calculateState(tasksState.dateKey, getInitialTasksRecord());
    setTasksState(resetState);
    await StorageService.saveTodayTasks(resetState);
    await HapticService.mediumTap();
  };

  return (
    <TaskContext.Provider
      value={{
        tasksState,
        toggleTask,
        setTaskCompleted,
        resetTodayTasks,
        checkAndPerformMidnightReset,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
