import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

export const ProgressBar: React.FC = () => {
  const { theme } = useTheme();
  const { tasksState } = useTask();

  const { completedCount, totalCount, percentage } = tasksState;
  const isAllDone = percentage === 100;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isAllDone ? theme.primarySurface : theme.card,
          borderColor: isAllDone ? theme.primary : theme.border,
          shadowColor: theme.cardShadow,
        },
      ]}
    >
      {/* Top Details Row */}
      <View style={styles.topRow}>
        <View style={styles.ratioBadge}>
          <Text style={[styles.ratioText, { color: theme.primary }]}>
            {STRINGS.tasksCompletedOf(completedCount, totalCount)}
          </Text>
        </View>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>
            {STRINGS.dailyProgress}
          </Text>
          <Text style={[styles.percentageText, { color: theme.primary }]}>
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Progress Track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.borderLight,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: isAllDone ? BRAND_COLORS.primaryLight : theme.primary,
            },
          ]}
        />
      </View>

      {/* Status or Congrats Note */}
      {isAllDone ? (
        <View style={styles.congratsRow}>
          <Ionicons name="sparkles" size={18} color={BRAND_COLORS.gold} />
          <Text style={[styles.congratsText, { color: theme.primaryDark }]}>
            {STRINGS.allCompletedTitle}
          </Text>
        </View>
      ) : (
        <View style={styles.resetNoticeRow}>
          <Ionicons name="information-circle-outline" size={14} color={theme.textMuted} />
          <Text style={[styles.resetNoticeText, { color: theme.textMuted }]}>
            {STRINGS.autoResetNotice}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  percentageText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  ratioBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(18, 112, 25, 0.1)',
  },
  ratioText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    flexDirection: 'row-reverse',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  congratsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  congratsText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  resetNoticeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  resetNoticeText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    flex: 1,
  },
});
