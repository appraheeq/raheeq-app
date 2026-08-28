import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { Header } from '../components/Header';
import { LiveClock } from '../components/LiveClock';
import { ProgressBar } from '../components/ProgressBar';
import { TaskTimelineItem } from '../components/TaskTimelineItem';
import { GenderSelectionModal } from '../components/GenderSelectionModal';
import { DAILY_TASKS_DATA, STRINGS } from '../constants/strings';
import { FONTS } from '../constants/fonts';
import { TaskId } from '../types/tasks';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { tasksState, toggleTask } = useTask();
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);

  const handleTaskItemClick = (taskId: TaskId) => {
    // If it is morning adhkar, evening adhkar, or tasbeeh, provide deep navigation or direct toggle
    if (taskId === 'morning_adhkar') {
      navigation.navigate('Adhkar', { initialCategory: 'morning' });
    } else if (taskId === 'evening_adhkar') {
      navigation.navigate('Adhkar', { initialCategory: 'evening' });
    } else if (taskId === 'tasbeeh_minute') {
      navigation.navigate('Tasbeeh');
    } else {
      toggleTask(taskId);
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

      {/* Top Header */}
      <Header onProfilePress={() => setGenderModalVisible(true)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Saudi Clock & Dates */}
        <LiveClock />

        {/* Daily Completion Progress Banner */}
        <ProgressBar />

        {/* Daily Timeline Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {STRINGS.dailyTimelineTitle}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            {STRINGS.dailyTimelineSubtitle}
          </Text>
        </View>

        {/* 9 Chronological Tasks */}
        <View style={styles.timelineList}>
          {DAILY_TASKS_DATA.map((task) => {
            const isCompleted = !!tasksState.tasks[task.id];
            return (
              <TaskTimelineItem
                key={task.id}
                id={task.id}
                order={task.order}
                title={task.title}
                iconName={task.iconName}
                description={task.description}
                completed={isCompleted}
                onToggle={(id) => toggleTask(id)}
                onPressItem={() => handleTaskItemClick(task.id)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Profile / Gender Modal */}
      <GenderSelectionModal
        visible={genderModalVisible}
        onClose={() => setGenderModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginBottom: 12,
    marginTop: 6,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 2,
    textAlign: 'right',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  timelineList: {
    marginTop: 4,
  },
});
