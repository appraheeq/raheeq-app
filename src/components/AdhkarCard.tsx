import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DhikrItem } from '../types/adhkar';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';

interface AdhkarCardProps {
  item: DhikrItem;
  currentCount: number;
  isCompleted: boolean;
  onIncrement: (id: string) => void;
  onToggleDirect: (id: string) => void;
}

export const AdhkarCard: React.FC<AdhkarCardProps> = ({
  item,
  currentCount,
  isCompleted,
  onIncrement,
  onToggleDirect,
}) => {
  const { theme } = useTheme();
  const remaining = Math.max(0, item.count - currentCount);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isCompleted ? theme.primarySurface : theme.card,
          borderColor: isCompleted ? theme.primary : theme.border,
          shadowColor: theme.cardShadow,
        },
      ]}
    >
      {/* Top Header Row of the Dhikr */}
      <View style={styles.topRow}>
        {/* Checkbox button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggleDirect(item.id)}
          style={[
            styles.checkbox,
            {
              backgroundColor: isCompleted ? theme.primary : 'transparent',
              borderColor: isCompleted ? theme.primary : theme.border,
            },
          ]}
        >
          {isCompleted && (
            <Ionicons name="checkmark" size={18} color={BRAND_COLORS.white} />
          )}
        </TouchableOpacity>

        {/* Title or Dhikr Number badge */}
        <View style={styles.badgeContainer}>
          {item.title ? (
            <View
              style={[
                styles.titleBadge,
                {
                  backgroundColor: isCompleted
                    ? theme.primary
                    : theme.primarySurface,
                },
              ]}
            >
              <Text
                style={[
                  styles.titleText,
                  {
                    color: isCompleted
                      ? BRAND_COLORS.white
                      : theme.primary,
                  },
                ]}
              >
                {item.title}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.indexBadge,
                { backgroundColor: theme.iconBg },
              ]}
            >
              <Text style={[styles.indexText, { color: theme.textMuted }]}>
                الذكر #{item.order}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Main Dhikr Text */}
      <Text
        style={[
          styles.dhikrText,
          {
            color: isCompleted ? theme.primaryDark : theme.text,
          },
        ]}
      >
        {item.text}
      </Text>

      {/* Bottom Counter & Action Footer */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onIncrement(item.id)}
          style={[
            styles.counterButton,
            {
              backgroundColor: isCompleted ? theme.primary : theme.primary,
            },
          ]}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'finger-print-outline'}
            size={18}
            color={BRAND_COLORS.white}
          />
          <Text style={styles.counterButtonText}>
            {isCompleted
              ? 'اكتمل الذكر'
              : item.count > 1
              ? `اضغط للذكر (${currentCount}/${item.count})`
              : 'تمت القراءة'}
          </Text>
        </TouchableOpacity>

        {/* Repetition Info Badge */}
        <View style={styles.repetitionInfo}>
          <Text style={[styles.countLabel, { color: theme.textSecondary }]}>
            {item.countText}
          </Text>
          {!isCompleted && item.count > 1 && (
            <Text style={[styles.remainingText, { color: theme.primary }]}>
              (متبقي {remaining})
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
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
  badgeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  titleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  titleText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  indexBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  indexText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    lineHeight: 28,
    textAlign: 'right',
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  counterButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  counterButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  repetitionInfo: {
    alignItems: 'flex-start',
  },
  countLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  remainingText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
});
