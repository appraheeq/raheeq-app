import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

interface HeaderProps {
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();

  // Determine avatar background based on gender
  const getAvatarBgColor = () => {
    if (user?.gender === 'male') return BRAND_COLORS.male;
    if (user?.gender === 'female') return BRAND_COLORS.female;
    return theme.primary;
  };

  // Select appropriate logo based on theme
  const logoSource = isDark
    ? require('../../assets/logos/logo4.png')
    : require('../../assets/logos/logo2.png');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Right side: Greeting and User Name */}
        <View style={styles.userSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onProfilePress}
            style={[
              styles.avatarContainer,
              {
                backgroundColor: getAvatarBgColor(),
                shadowColor: getAvatarBgColor(),
              },
            ]}
          >
            <Ionicons name="person" size={20} color={BRAND_COLORS.white} />
          </TouchableOpacity>
          <View style={styles.greetingTextContainer}>
            <Text style={[styles.greetingSub, { color: theme.textMuted }]}>
              {STRINGS.welcome}
            </Text>
            <Text
              style={[styles.userName, { color: theme.text }]}
              numberOfLines={1}
            >
              {user?.name || 'ضيف رحيق الكريم'}
            </Text>
          </View>
        </View>

        {/* Left side: Large Official Raheeq Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  greetingTextContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  greetingSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoImage: {
    width: 130,
    height: 42,
  },
});
