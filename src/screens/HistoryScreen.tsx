import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { StorageService } from '../services/storageService';
import { DayHistoryRecord, StreakStats } from '../types/history';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HistoryScreen: React.FC<HistoryScreenProps> = () => {
  const { theme, isDark } = useTheme();
  const { tasksState } = useTask();

  const [records, setRecords] = useState<DayHistoryRecord[]>([]);
  const [stats, setStats] = useState<StreakStats>({
    currentStreak: 0,
    bestStreak: 0,
    perfectDaysCount: 0,
    totalDaysLogged: 0,
    totalTasksCompleted: 0,
  });

  useEffect(() => {
    loadHistory();
  }, [tasksState]);

  const loadHistory = async () => {
    try {
      const historyList = await StorageService.getHistoryRecords();
      const streakStats = await StorageService.getStreakStats();
      setRecords(historyList);
      setStats(streakStats);
    } catch (e) {
      console.error('Error loading history records', e);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.card}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {STRINGS.streakTitle}
        </Text>
      </View>

      {/* Streak Statistics Grid */}
      <View style={styles.statsGrid}>
        {/* Card 1: Consecutive Streak */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.statIconWrapper,
              { backgroundColor: theme.primarySurface },
            ]}
          >
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={BRAND_COLORS.gold}
            />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
            {STRINGS.currentStreak}
          </Text>
        </View>

        {/* Card 2: 100% Perfect Days */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.statIconWrapper,
              { backgroundColor: theme.primarySurface },
            ]}
          >
            <Ionicons
              name="checkmark-done-circle"
              size={24}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.perfectDaysCount}
          </Text>
          <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
            {STRINGS.perfectDays}
          </Text>
        </View>

        {/* Card 3: Total Completed Tasks */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View
            style={[
              styles.statIconWrapper,
              { backgroundColor: theme.primarySurface },
            ]}
          >
            <Ionicons
              name="ribbon-outline"
              size={24}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.totalTasksCompleted + tasksState.completedCount}
          </Text>
          <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
            {STRINGS.totalCompletedTasks}
          </Text>
        </View>
      </View>

      {/* History List Section Title */}
      <View style={styles.historySectionHeader}>
        <Text style={[styles.historySectionTitle, { color: theme.text }]}>
          {STRINGS.historyListTitle}
        </Text>
      </View>

      {/* Day Records List */}
      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={56}
            color={theme.textMuted}
          />
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            {STRINGS.emptyHistory}
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.dateKey}
          renderItem={({ item }) => (
            <View
              style={[
                styles.recordCard,
                {
                  backgroundColor: item.perfect
                    ? theme.primarySurface
                    : theme.card,
                  borderColor: item.perfect ? theme.primary : theme.border,
                  shadowColor: theme.cardShadow,
                },
              ]}
            >
              {/* Top Row: Title, Date and Percentage */}
              <View style={styles.recordHeaderRow}>
                <View
                  style={[
                    styles.percentagePill,
                    {
                      backgroundColor: item.perfect
                        ? theme.primary
                        : theme.cardSecondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.percentagePillText,
                      {
                        color: item.perfect
                          ? BRAND_COLORS.white
                          : theme.primary,
                      },
                    ]}
                  >
                    {item.percentage}%
                  </Text>
                </View>
                <View style={styles.dayInfo}>
                  <Text
                    style={[
                      styles.recordMainTitle,
                      { color: theme.text },
                    ]}
                  >
                    {STRINGS.dayRecordTitle(
                      item.dayNumber,
                      item.dateDisplayStr,
                      item.percentage
                    )}
                  </Text>
                  <Text style={[styles.recordHijri, { color: theme.textSecondary }]}>
                    {item.hijriDisplayStr} ({item.completedCount} من {item.totalCount} مهام)
                  </Text>
                </View>
              </View>

              {/* Progress bar inside record */}
              <View
                style={[
                  styles.recordProgressTrack,
                  { backgroundColor: theme.borderLight },
                ]}
              >
                <View
                  style={[
                    styles.recordProgressFill,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: item.perfect
                        ? BRAND_COLORS.primaryLight
                        : theme.primary,
                    },
                  ]}
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  statsGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  historySectionHeader: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  historySectionTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  recordCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1.5,
  },
  recordHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  recordMainTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    marginBottom: 3,
  },
  recordHijri: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  percentagePill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  percentagePillText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  recordProgressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  recordProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 24,
  },
});
