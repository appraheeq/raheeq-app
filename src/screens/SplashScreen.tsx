import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition after 2.2 seconds
    const timeout = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }
    }, 2200);

    return () => clearTimeout(timeout);
  }, [user, isLoading]);

  const logoSource = isDark
    ? require('../../assets/logos/logo3.png')
    : require('../../assets/logos/logo1.png');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? BRAND_COLORS.dark : BRAND_COLORS.white,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.tagline, { color: theme.primary }]}>
          {STRINGS.appTagline}
        </Text>
      </Animated.View>

      {/* Subtle bottom indicator */}
      <View style={styles.footer}>
        <View
          style={[
            styles.dot,
            { backgroundColor: theme.primary },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
});
