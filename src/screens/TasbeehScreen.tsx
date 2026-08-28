import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { HapticService } from '../services/hapticService';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const TASBEEH_PHRASES = [
  'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  'سُبْحَانَ اللَّهِ الْعَظِيمِ',
  'الْحَمْدُ لِلَّهِ',
  'لَا إِلَهَ إِلَّا اللَّهُ',
  'اللَّهُ أَكْبَرُ',
  'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
  'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
];

type TasbeehScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Tasbeeh'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const TasbeehScreen: React.FC<TasbeehScreenProps> = () => {
  const { theme, isDark } = useTheme();
  const { setTaskCompleted } = useTask();

  const [counter, setCounter] = useState<number>(0);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState<number>(0);
  
  // 1-minute countdown timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);

  // Animation for tactile button press
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      // 1 minute session complete!
      setIsTimerRunning(false);
      setTimerCompleted(true);
      HapticService.success();
      setTaskCompleted('tasbeeh_minute', true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleTap = async () => {
    // Tactile button bounce
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger haptic vibration on every press
    await HapticService.lightTap();

    setCounter((prev) => {
      const next = prev + 1;
      // If user reaches 33 or 100, trigger celebratory haptic
      if (next % 33 === 0 || next === 100) {
        HapticService.success();
      }
      return next;
    });

    // Automatically start timer on first tap if not already running
    if (!isTimerRunning && !timerCompleted && timerSeconds === 60) {
      setIsTimerRunning(true);
    }
  };

  const handleReset = async () => {
    setCounter(0);
    setTimerSeconds(60);
    setIsTimerRunning(false);
    setTimerCompleted(false);
    await HapticService.mediumTap();
  };

  const nextPhrase = () => {
    setSelectedPhraseIndex((prev) => (prev + 1) % TASBEEH_PHRASES.length);
    HapticService.selection();
  };

  const prevPhrase = () => {
    setSelectedPhraseIndex((prev) =>
      prev === 0 ? TASBEEH_PHRASES.length - 1 : prev - 1
    );
    HapticService.selection();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
          {STRINGS.tasbeehTitle}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleReset}
          style={[styles.resetBtn, { backgroundColor: theme.iconBg }]}
        >
          <Ionicons name="refresh-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.resetBtnText, { color: theme.textSecondary }]}>
            {STRINGS.resetCounter}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Top 1-Minute Timer Card */}
        <View
          style={[
            styles.timerBanner,
            {
              backgroundColor: timerCompleted
                ? theme.primarySurface
                : theme.card,
              borderColor: timerCompleted ? theme.primary : theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.timerContentRow}>
            <View style={styles.timerTextSection}>
              <Text
                style={[
                  styles.timerLabel,
                  {
                    color: timerCompleted
                      ? theme.primary
                      : theme.textSecondary,
                  },
                ]}
              >
                {timerCompleted ? 'تم إنجاز دقيقة التسبيح 🌿' : 'مؤقت دقيقة التسبيح'}
              </Text>
              <Text
                style={[
                  styles.timerTime,
                  { color: timerCompleted ? theme.primary : theme.text },
                ]}
              >
                {formatTimer(timerSeconds)}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (timerCompleted) {
                  setTimerSeconds(60);
                  setTimerCompleted(false);
                  setIsTimerRunning(true);
                } else {
                  setIsTimerRunning(!isTimerRunning);
                }
                HapticService.selection();
              }}
              style={[
                styles.timerPlayBtn,
                { backgroundColor: theme.primary },
              ]}
            >
              <Ionicons
                name={
                  isTimerRunning
                    ? 'pause'
                    : timerCompleted
                    ? 'checkmark-done'
                    : 'play'
                }
                size={22}
                color={BRAND_COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phrase Selector Box */}
        <View
          style={[
            styles.phraseCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.phraseNavRow}>
            <TouchableOpacity onPress={prevPhrase} style={styles.navArrow}>
              <Ionicons name="chevron-back" size={24} color={theme.primary} />
            </TouchableOpacity>
            <View style={styles.phraseTextWrapper}>
              <Text
                style={[styles.phraseText, { color: theme.text }]}
                numberOfLines={2}
              >
                {TASBEEH_PHRASES[selectedPhraseIndex]}
              </Text>
            </View>
            <TouchableOpacity onPress={nextPhrase} style={styles.navArrow}>
              <Ionicons name="chevron-forward" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Big Serene Interactive Tasbeeh Circular Button */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleTap}
              style={[
                styles.tasbeehMainCircle,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.primary,
                  shadowColor: theme.primary,
                },
              ]}
            >
              {/* Outer Decorative Ring */}
              <View
                style={[
                  styles.innerCircle,
                  {
                    backgroundColor: theme.primarySurface,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* Counter Number */}
                <Text style={[styles.counterNumber, { color: theme.primaryDark }]}>
                  {counter}
                </Text>
                <Text style={[styles.tapPrompt, { color: theme.primary }]}>
                  {STRINGS.tapToCount}
                </Text>
                <MaterialCommunityIcons
                  name="hand-pointing-down"
                  size={24}
                  color={theme.primary}
                  style={styles.tapHandIcon}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom Total / Completion Tag */}
        {timerCompleted && (
          <View
            style={[
              styles.completedNotification,
              { backgroundColor: theme.primarySurface },
            ]}
          >
            <Ionicons name="sparkles" size={18} color={BRAND_COLORS.gold} />
            <Text
              style={[
                styles.completedNotificationText,
                { color: theme.primaryDark },
              ]}
            >
              {STRINGS.tasbeehCompletedMessage}
            </Text>
          </View>
        )}
      </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerBanner: {
    width: '100%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  timerContentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerTextSection: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  timerTime: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  timerPlayBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseCard: {
    width: '100%',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginVertical: 10,
  },
  phraseNavRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navArrow: {
    padding: 8,
  },
  phraseTextWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  phraseText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  tasbeehMainCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  innerCircle: {
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  counterNumber: {
    fontSize: 54,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  tapPrompt: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  tapHandIcon: {
    marginTop: 6,
    opacity: 0.8,
  },
  completedNotification: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginHorizontal: 10,
  },
  completedNotificationText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    flex: 1,
  },
});
