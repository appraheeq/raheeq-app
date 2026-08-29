import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PrivacyModal } from '../components/PrivacyModal';
import { GenderSelectionModal } from '../components/GenderSelectionModal';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  const [privacyModalVisible, setPrivacyModalVisible] = useState<boolean>(false);
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // After signing in, open Gender modal for initial setup
    setGenderModalVisible(true);
  };

  const handleGenderModalClose = () => {
    setGenderModalVisible(false);
    navigation.replace('Main');
  };

  const logoSource = isDark
    ? require('../../assets/logos/logo3.png')
    : require('../../assets/logos/logo1.png');

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.container}>
        {/* Top & Center Branding */}
        <View style={styles.centerSection}>
          <Image
            source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>
            {STRINGS.welcome} في رحيق
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {STRINGS.welcomeSub}
          </Text>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          {/* Google Sign In Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={[
              styles.googleButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.cardShadow,
              },
            ]}
          >
            <View style={styles.googleIconContainer}>
              <Ionicons name="logo-google" size={22} color="#EA4335" />
            </View>
            <Text style={[styles.googleButtonText, { color: theme.text }]}>
              {STRINGS.googleSignIn}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.hintText, { color: theme.textMuted }]}>
            {STRINGS.googleSignInHint}
          </Text>

          {/* Privacy Policy Link */}
          <View style={styles.privacyContainer}>
            <Text style={[styles.privacyNotice, { color: theme.textMuted }]}>
              {STRINGS.privacyPolicyNotice}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPrivacyModalVisible(true)}
              style={styles.privacyLinkButton}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={theme.primary}
              />
              <Text style={[styles.privacyLinkText, { color: theme.primary }]}>
                {STRINGS.privacyPolicyLink}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Privacy Policy Modal */}
      <PrivacyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />

      {/* Optional Gender Selection Modal */}
      <GenderSelectionModal
        visible={genderModalVisible}
        onClose={handleGenderModalClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  googleIconContainer: {
    marginLeft: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  hintText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },
  privacyContainer: {
    alignItems: 'center',
  },
  privacyNotice: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: 6,
  },
  privacyLinkButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  privacyLinkText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    textDecorationLine: 'underline',
  },
});
