import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CustomButton } from './CustomButton';
import { FONTS } from '../constants/fonts';
import { STRINGS } from '../constants/strings';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();

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
            styles.modalContent,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeIconBtn, { backgroundColor: theme.iconBg }]}
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
              <Text style={[styles.title, { color: theme.text }]}>
                {STRINGS.privacyPolicyModalTitle}
              </Text>
            </View>
          </View>

          {/* Body Text */}
          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.quoteContainer,
                {
                  backgroundColor: theme.primarySurface,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text style={[styles.bodyText, { color: theme.text }]}>
                {STRINGS.privacyPolicyBody}
              </Text>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <CustomButton
              title={STRINGS.agreeAndContinue}
              onPress={onClose}
              variant="primary"
              size="medium"
            />
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
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    marginVertical: 8,
  },
  quoteContainer: {
    borderRadius: 16,
    padding: 18,
    borderRightWidth: 4,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    lineHeight: 28,
    textAlign: 'right',
  },
  footer: {
    marginTop: 16,
  },
});
