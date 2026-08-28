import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticService = {
  /**
   * Light haptic feedback for tasbeeh taps and normal button clicks
   */
  async lightTap(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback gracefully if not supported
    }
  },

  /**
   * Medium haptic feedback for toggling daily task items
   */
  async mediumTap(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback gracefully
    }
  },

  /**
   * Heavy / Success feedback when completing a task or completing a dhikr target
   */
  async success(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Fallback gracefully
    }
  },

  /**
   * Selection feedback for tab switching
   */
  async selection(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Fallback gracefully
    }
  },
};
