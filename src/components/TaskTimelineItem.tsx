import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TaskId } from '../types/tasks';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';

interface TaskTimelineItemProps {
  id: TaskId;
  order: number;
  title: string;
  iconName: string;
  description: string;
  completed: boolean;
  onToggle: (id: TaskId) => void;
  onPressItem?: () => void;
}

export const TaskTimelineItem: React.FC<TaskTimelineItemProps> = ({
  id,
  order,
  title,
  iconName,
  description,
  completed,
  onToggle,
  onPressItem,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (onPressItem) {
          onPressItem();
        } else {
          onToggle(id);
        }
      }}
      style={[
        styles.container,
        {
          backgroundColor: completed ? theme.primarySurface : theme.card,
          borderColor: completed ? theme.primary : theme.border,
          shadowColor: theme.cardShadow,
        },
      ]}
    >
      {/* Right side: Checkbox */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onToggle(id)}
        style={[
          styles.checkbox,
          {
            backgroundColor: completed ? theme.primary : 'transparent',
            borderColor: completed ? theme.primary : theme.border,
          },
        ]}
      >
        {completed && <Ionicons name="checkmark" size={18} color={BRAND_COLORS.white} />}
      </TouchableOpacity>

      {/* Middle: Title & Description */}
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: completed ? theme.primaryDark : theme.text,
                textDecorationLine: completed ? 'line-through' : 'none',
              },
            ]}
          >
            {title}
          </Text>
          <View
            style={[
              styles.orderBadge,
              {
                backgroundColor: completed ? theme.primary : theme.iconBg,
              },
            ]}
          >
            <Text
              style={[
                styles.orderText,
                { color: completed ? BRAND_COLORS.white : theme.textMuted },
              ]}
            >
              {order}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.description,
            {
              color: completed ? theme.textSecondary : theme.textMuted,
            },
          ]}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      {/* Left side: Category Icon */}
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: completed ? theme.primary : theme.iconBg,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={22}
          color={completed ? BRAND_COLORS.white : theme.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1.5,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  orderBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  description: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
});
