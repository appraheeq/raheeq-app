import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { AdhkarCard } from '../components/AdhkarCard';
import { DhikrItem, AdhkarCategory } from '../types/adhkar';
import { StorageService } from '../services/storageService';
import { TimeService } from '../services/timeService';
import { HapticService } from '../services/hapticService';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

// Import JSON adhkar datasets
const morningAdhkarData: DhikrItem[] = require('../../assets/data/morning_adhkar.json');
const eveningAdhkarData: DhikrItem[] = require('../../assets/data/evening_adhkar.json');

type AdhkarScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Adhkar'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ route }) => {
  const { theme, isDark } = useTheme();
  const { setTaskCompleted } = useTask();
  const todayDateKey = TimeService.getKSADateKey();

  const [activeCategory, setActiveCategory] = useState<AdhkarCategory>(
    route?.params?.initialCategory || 'morning'
  );

  // State maps: category -> record of counts and completion
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (route?.params?.initialCategory) {
      setActiveCategory(route.params.initialCategory);
    }
  }, [route?.params?.initialCategory]);

  useEffect(() => {
    loadCategoryProgress(activeCategory);
  }, [activeCategory]);

  const loadCategoryProgress = async (category: AdhkarCategory) => {
    try {
      const saved = await StorageService.getAdhkarProgress(category, todayDateKey);
      if (saved) {
        setCounts(saved.progress || {});
        setCompleted(saved.completed || {});
      } else {
        setCounts({});
        setCompleted({});
      }
    } catch (e) {
      console.error('Error loading adhkar progress', e);
    }
  };

  const currentDataset =
    activeCategory === 'morning' ? morningAdhkarData : eveningAdhkarData;

  const handleIncrement = async (dhikrId: string) => {
    const item = currentDataset.find((d) => d.id === dhikrId);
    if (!item) return;

    const current = counts[dhikrId] || 0;
    const nextCount = current + 1;
    const isNowDone = nextCount >= item.count;

    const updatedCounts = { ...counts, [dhikrId]: nextCount };
    const updatedCompleted = { ...completed, [dhikrId]: isNowDone };

    setCounts(updatedCounts);
    setCompleted(updatedCompleted);

    if (isNowDone) {
      await HapticService.success();
    } else {
      await HapticService.lightTap();
    }

    // Save progress
    await saveCurrentProgress(updatedCounts, updatedCompleted);
    checkCategoryCompletion(updatedCompleted);
  };

  const handleToggleDirect = async (dhikrId: string) => {
    const item = currentDataset.find((d) => d.id === dhikrId);
    if (!item) return;

    const currentlyDone = !!completed[dhikrId];
    const isNowDone = !currentlyDone;
    const nextCount = isNowDone ? item.count : 0;

    const updatedCounts = { ...counts, [dhikrId]: nextCount };
    const updatedCompleted = { ...completed, [dhikrId]: isNowDone };

    setCounts(updatedCounts);
    setCompleted(updatedCompleted);

    if (isNowDone) {
      await HapticService.success();
    } else {
      await HapticService.mediumTap();
    }

    await saveCurrentProgress(updatedCounts, updatedCompleted);
    checkCategoryCompletion(updatedCompleted);
  };

  const saveCurrentProgress = async (
    prog: Record<string, number>,
    comp: Record<string, boolean>
  ) => {
    const totalCount = currentDataset.length;
    const completedCount = Object.values(comp).filter(Boolean).length;

    await StorageService.saveAdhkarProgress({
      category: activeCategory,
      dateKey: todayDateKey,
      progress: prog,
      completed: comp,
      totalCount,
      completedCount,
    });
  };

  const checkCategoryCompletion = async (comp: Record<string, boolean>) => {
    const completedCount = currentDataset.filter((d) => !!comp[d.id]).length;
    if (completedCount === currentDataset.length) {
      // Mark corresponding daily task as completed in Timeline
      if (activeCategory === 'morning') {
        await setTaskCompleted('morning_adhkar', true);
      } else {
        await setTaskCompleted('evening_adhkar', true);
      }
    }
  };

  const handleResetCurrentTab = async () => {
    setCounts({});
    setCompleted({});
    await saveCurrentProgress({}, {});
    await HapticService.mediumTap();
  };

  const totalDhikrs = currentDataset.length;
  const completedDhikrs = currentDataset.filter((d) => !!completed[d.id]).length;
  const categoryPercentage = Math.round((completedDhikrs / totalDhikrs) * 100);

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

      {/* Screen Header */}
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
          {STRINGS.tabAdhkar}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleResetCurrentTab}
          style={[styles.resetBtn, { backgroundColor: theme.iconBg }]}
        >
          <Ionicons name="refresh-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.resetBtnText, { color: theme.textSecondary }]}>
            {STRINGS.resetAdhkar}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Morning / Evening Segmented Switcher */}
      <View style={styles.segmentContainer}>
        <View
          style={[
            styles.segmentTrack,
            {
              backgroundColor: theme.cardSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Morning Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setActiveCategory('morning');
              HapticService.selection();
            }}
            style={[
              styles.segmentButton,
              {
                backgroundColor:
                  activeCategory === 'morning' ? theme.primary : 'transparent',
              },
            ]}
          >
            <Ionicons
              name="sunny"
              size={18}
              color={
                activeCategory === 'morning'
                  ? BRAND_COLORS.white
                  : theme.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    activeCategory === 'morning'
                      ? BRAND_COLORS.white
                      : theme.textSecondary,
                },
              ]}
            >
              {STRINGS.morningAdhkarTitle}
            </Text>
          </TouchableOpacity>

          {/* Evening Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setActiveCategory('evening');
              HapticService.selection();
            }}
            style={[
              styles.segmentButton,
              {
                backgroundColor:
                  activeCategory === 'evening' ? theme.primary : 'transparent',
              },
            ]}
          >
            <Ionicons
              name="moon"
              size={17}
              color={
                activeCategory === 'evening'
                  ? BRAND_COLORS.white
                  : theme.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    activeCategory === 'evening'
                      ? BRAND_COLORS.white
                      : theme.textSecondary,
                },
              ]}
            >
              {STRINGS.eveningAdhkarTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Progress Stats Banner */}
      <View
        style={[
          styles.statsCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.statsRow}>
          <Text style={[styles.statsRatio, { color: theme.primary }]}>
            {completedDhikrs} من {totalDhikrs} ذكر ({categoryPercentage}%)
          </Text>
          <Text style={[styles.statsLabel, { color: theme.text }]}>
            نسبة إتمام {activeCategory === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
          </Text>
        </View>
        <View style={[styles.statsTrack, { backgroundColor: theme.borderLight }]}>
          <View
            style={[
              styles.statsFill,
              {
                width: `${categoryPercentage}%`,
                backgroundColor: theme.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Adhkar List */}
      <FlatList
        data={currentDataset}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdhkarCard
            item={item}
            currentCount={counts[item.id] || 0}
            isCompleted={!!completed[item.id]}
            onIncrement={handleIncrement}
            onToggleDirect={handleToggleDirect}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  resetBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  segmentContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  segmentTrack: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  statsRatio: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  statsTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  statsFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 40,
  },
});
