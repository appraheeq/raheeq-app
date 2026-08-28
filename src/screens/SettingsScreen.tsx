import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GenderSelectionModal } from '../components/GenderSelectionModal';
import { CustomButton } from '../components/CustomButton';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, signOut, updateName } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);
  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(user?.name || '');

  const openInstagram = async () => {
    try {
      await Linking.openURL(STRINGS.instagramUrl);
    } catch {
      Alert.alert('خطأ', 'تعذر فتح الرابط');
    }
  };

  const openTelegram = async () => {
    try {
      await Linking.openURL(STRINGS.telegramUrl);
    } catch {
      Alert.alert('خطأ', 'تعذر فتح الرابط');
    }
  };

  const handleSaveName = async () => {
    if (editedName.trim()) {
      await updateName(editedName);
      setNameModalVisible(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      STRINGS.signOutConfirmTitle,
      STRINGS.signOutConfirmMessage,
      [
        { text: STRINGS.cancel, style: 'cancel' },
        {
          text: STRINGS.confirmSignOut,
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const getGenderText = () => {
    if (user?.gender === 'male') return STRINGS.genderMale;
    if (user?.gender === 'female') return STRINGS.genderFemale;
    return 'غير محدد';
  };

  const getAvatarBgColor = () => {
    if (user?.gender === 'male') return BRAND_COLORS.male;
    if (user?.gender === 'female') return BRAND_COLORS.female;
    return theme.primary;
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

      {/* Header */}
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
          {STRINGS.settingsTitle}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: User Profile */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {STRINGS.profileSection}
          </Text>
        </View>

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
          {/* User Name Item */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setEditedName(user?.name || '');
              setNameModalVisible(true);
            }}
            style={styles.settingRow}
          >
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: getAvatarBgColor() },
                ]}
              >
                <Ionicons name="person" size={18} color={BRAND_COLORS.white} />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.nameLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {user?.name || 'غير محدد'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

          {/* Gender Item */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setGenderModalVisible(true)}
            style={styles.settingRow}
          >
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.iconBg },
                ]}
              >
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={20}
                  color={theme.primary}
                />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.genderLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {getGenderText()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 2: Appearance & Theme */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {STRINGS.appearanceSection}
          </Text>
        </View>

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
          <View style={styles.settingRow}>
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.iconBg },
                ]}
              >
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={isDark ? BRAND_COLORS.gold : theme.primary}
                />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.darkModeLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {STRINGS.darkModeSub}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.border,
                true: theme.primary,
              }}
              thumbColor={BRAND_COLORS.white}
            />
          </View>
        </View>

        {/* Section 3: Social & About */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {STRINGS.connectSection}
          </Text>
        </View>

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
          {/* Instagram */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openInstagram}
            style={styles.settingRow}
          >
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: '#FDF2F8' },
                ]}
              >
                <Ionicons name="logo-instagram" size={20} color="#E1306C" />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.instagramLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {STRINGS.instagramSub}
                </Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

          {/* Telegram */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openTelegram}
            style={styles.settingRow}
          >
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: '#EFF6FF' },
                ]}
              >
                <Ionicons name="paper-plane" size={19} color="#0088CC" />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.telegramLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {STRINGS.telegramSub}
                </Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

          {/* About Us (من نحن؟) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('About')}
            style={styles.settingRow}
          >
            <View style={styles.rowRight}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.primarySurface },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={theme.primary}
                />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {STRINGS.aboutAppLabel}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  {STRINGS.aboutAppSub}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 4: Sign Out */}
        <View style={styles.signOutWrapper}>
          <CustomButton
            title={STRINGS.signOutLabel}
            onPress={handleSignOut}
            variant="danger"
            size="medium"
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={BRAND_COLORS.white}
              />
            }
          />
        </View>
      </ScrollView>

      {/* Gender Selection Modal */}
      <GenderSelectionModal
        visible={genderModalVisible}
        onClose={() => setGenderModalVisible(false)}
      />

      {/* Edit Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.nameModalOverlay}>
          <View
            style={[
              styles.nameModalCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.nameModalTitle, { color: theme.text }]}>
              تعديل الاسم
            </Text>
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="اكتب اسمك الكريم..."
              placeholderTextColor={theme.textMuted}
              style={[
                styles.nameInput,
                {
                  backgroundColor: theme.cardSecondary,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              textAlign="right"
            />
            <View style={styles.nameModalButtons}>
              <CustomButton
                title="حفظ الاسم"
                onPress={handleSaveName}
                variant="primary"
                size="medium"
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                onPress={() => setNameModalVisible(false)}
                style={styles.nameCancelBtn}
              >
                <Text style={[styles.nameCancelText, { color: theme.textMuted }]}>
                  إلغاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 14,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  textColumn: {
    alignItems: 'flex-end',
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 2,
    textAlign: 'right',
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  signOutWrapper: {
    marginTop: 30,
  },
  nameModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  nameModalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  nameModalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  nameInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: FONTS.medium,
    marginBottom: 20,
  },
  nameModalButtons: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  nameCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nameCancelText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
