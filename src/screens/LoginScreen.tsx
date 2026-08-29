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
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';
import { FONTS } from '../constants/fonts';
import { STRINGS } from '../constants/strings';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [privacyModalVisible, setPrivacyModalVisible] = useState<boolean>(false);

  // دالة المتابعة بدون حساب والانتقال المباشر للشاشة الرئيسية
  const handleContinueWithoutAccount = async () => {
    try {
      await HapticService.mediumTap();
      
      const guestUser = {
        id: `guest_${Date.now()}`,
        name: 'مستخدم رحيق',
        email: '',
        gender: null,
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveUserProfile(guestUser);
      navigation.replace('Main');
    } catch (e) {
      console.error('Continue without account error', e);
    }
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
          {/* النص الأصفر الجديد المطلوب */}
          <Text style={styles.yellowSubtitle}>
            سجل معنا بلا حاجة لحساب او نقل اي بيانات لك
          </Text>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          {/* زر المتابعة بدون حساب */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinueWithoutAccount}
            style={[
              styles.continueButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.cardShadow,
              },
            ]}
          >
            <Text style={[styles.continueButtonText, { color: theme.text }]}>
              المتابعة بدون حساب
            </Text>
          </TouchableOpacity>

          <Text style={[styles.hintText, { color: theme.textMuted }]}>
            التسجيل محلي وآمن بضغطة زر
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
  yellowSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    color: '#FFD700', // اللون الأصفر المطلوب
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    textAlign: 'center',
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
