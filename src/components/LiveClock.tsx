import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TimeService, KSATimeInfo } from '../services/timeService';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

export const LiveClock: React.FC = () => {
  const { theme } = useTheme();
  const [timeInfo, setTimeInfo] = useState<KSATimeInfo>(() =>
    TimeService.getKSATimeInfo()
  );

  useEffect(() => {
    // Update live clock every second
    const timer = setInterval(() => {
      setTimeInfo(TimeService.getKSATimeInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
        },
      ]}
    >
      {/* Top Banner: Saudi Time Tag */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.tagBadge,
            {
              backgroundColor: theme.primarySurface,
            },
          ]}
        >
          <View style={styles.pulseDot} />
          <Text style={[styles.tagText, { color: theme.primary }]}>
            {STRINGS.ksaTimeLabel}
          </Text>
        </View>
        <Ionicons name="time-outline" size={18} color={theme.primary} />
      </View>

      {/* Main 24-Hour Digital Clock Display */}
      <View style={styles.clockDisplay}>
        <Text style={[styles.digitalTime, { color: theme.text }]}>
          {timeInfo.time24Str}
        </Text>
      </View>

      {/* Dates Section: Gregorian and Hijri */}
      <View
        style={[
          styles.datesDivider,
          {
            borderTopColor: theme.borderLight,
          },
        ]}
      >
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={15} color={theme.primary} />
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {timeInfo.gregorianDateStr}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="moon-waxing-crescent" size={15} color={BRAND_COLORS.gold} />
          <Text
            style={[
              styles.dateText,
              styles.hijriText,
              { color: theme.text },
            ]}
          >
            {timeInfo.hijriDateStr}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_COLORS.primaryLight,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  clockDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  digitalTime: {
    fontSize: 40,
    fontFamily: FONTS.bold,
    letterSpacing: 2,
    textAlign: 'center',
  },
  datesDivider: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  hijriText: {
    fontFamily: FONTS.bold,
  },
});
