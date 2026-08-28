import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from './CustomButton';
import { FONTS } from '../constants/fonts';
import { BRAND_COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

interface GenderSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const GenderSelectionModal: React.FC<GenderSelectionModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { user, updateGender } = useAuth();
  const [selected, setSelected] = useState<'male' | 'female'>(
    user?.gender || 'male'
  );

  const handleSave = async () => {
    await updateGender(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.iconCircle}>
            <Ionicons name="person-circle-outline" size={44} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {STRINGS.genderModalTitle}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {STRINGS.genderModalSubtitle}
          </Text>

          {/* Gender Options */}
          <View style={styles.optionsRow}>
            {/* Male Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelected('male')}
              style={[
                styles.genderOption,
                {
                  borderColor:
                    selected === 'male' ? BRAND_COLORS.male : theme.border,
                  backgroundColor:
                    selected === 'male'
                      ? BRAND_COLORS.maleLight
                      : theme.cardSecondary,
                },
              ]}
            >
              <View
                style={[
                  styles.avatarPreview,
                  { backgroundColor: BRAND_COLORS.male },
                ]}
              >
                <Ionicons name="person" size={26} color={BRAND_COLORS.white} />
              </View>
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      selected === 'male'
                        ? BRAND_COLORS.male
                        : theme.textSecondary,
                  },
                ]}
              >
                {STRINGS.genderMale}
              </Text>
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      selected === 'male' ? BRAND_COLORS.male : theme.border,
                    backgroundColor:
                      selected === 'male' ? BRAND_COLORS.male : 'transparent',
                  },
                ]}
              >
                {selected === 'male' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>

            {/* Female Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelected('female')}
              style={[
                styles.genderOption,
                {
                  borderColor:
                    selected === 'female' ? BRAND_COLORS.female : theme.border,
                  backgroundColor:
                    selected === 'female'
                      ? BRAND_COLORS.femaleLight
                      : theme.cardSecondary,
                },
              ]}
            >
              <View
                style={[
                  styles.avatarPreview,
                  { backgroundColor: BRAND_COLORS.female },
                ]}
              >
                <Ionicons name="person" size={26} color={BRAND_COLORS.white} />
              </View>
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      selected === 'female'
                        ? BRAND_COLORS.female
                        : theme.textSecondary,
                  },
                ]}
              >
                {STRINGS.genderFemale}
              </Text>
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      selected === 'female' ? BRAND_COLORS.female : theme.border,
                    backgroundColor:
                      selected === 'female' ? BRAND_COLORS.female : 'transparent',
                  },
                ]}
              >
                {selected === 'female' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.footerButtons}>
            <CustomButton
              title={STRINGS.saveAndStart}
              onPress={handleSave}
              variant="primary"
              size="medium"
              style={{ width: '100%' }}
            />
            <TouchableOpacity onPress={onClose} style={styles.skipButton}>
              <Text style={[styles.skipText, { color: theme.textMuted }]}>
                {STRINGS.skipOptional}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  genderOption: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPreview: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  genderText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.white,
  },
  footerButtons: {
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    marginTop: 12,
    padding: 6,
  },
  skipText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
});
