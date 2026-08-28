import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-forward" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{STRINGS.aboutScreenHeader}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.cardContainer}>
          {/* Top Decorative Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logos/logo1.png')}
              style={styles.mainLogo}
              resizeMode="contain"
            />
          </View>

          {/* Big Header Title */}
          <Text style={styles.mainTitle}>{STRINGS.aboutScreenHeader}</Text>

          {/* Verbatim Body Text */}
          <Text style={styles.bodyText}>
            {STRINGS.aboutScreenBody}
          </Text>

          {/* Bottom Footer: "فريق رحيق" + Green Logo */}
          <View style={styles.teamSection}>
            <Image
              source={require('../../assets/logos/logo2.png')}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamTitle}>{STRINGS.aboutScreenTeam}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAF8',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  mainLogo: {
    width: 140,
    height: 140,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: '#1A1A1A',
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  teamSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    width: '85%',
  },
  teamLogo: {
    width: 110,
    height: 38,
  },
  teamTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BRAND_COLORS.primary,
  },
});
