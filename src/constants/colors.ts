export const BRAND_COLORS = {
  primary: '#127019',
  primaryDark: '#0D4E12',
  primaryLight: '#1B8C24',
  primarySurface: '#EBF7EC',
  primarySurfaceDark: '#142A16',
  dark: '#1A1A1A',
  lime: '#EAF95E',
  white: '#FFFFFF',
  male: '#2563EB',
  maleLight: '#DBEAFE',
  female: '#EC4899',
  femaleLight: '#FCE7F3',
  gold: '#F59E0B',
  goldLight: '#FEF3C7',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  card: string;
  cardSecondary: string;
  border: string;
  borderLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySurface: string;
  accent: string;
  accentText: string;
  cardShadow: string;
  iconBg: string;
  success: string;
  successBg: string;
  warning: string;
  danger: string;
}

export const lightTheme: ThemeColors = {
  background: '#F6F9F6',
  backgroundSecondary: '#EEF4EE',
  card: '#FFFFFF',
  cardSecondary: '#F8FAF8',
  border: '#E3ECE4',
  borderLight: '#EDF3EE',
  text: '#1A1A1A',
  textSecondary: '#4A5568',
  textMuted: '#8C9A8E',
  primary: '#127019',
  primaryDark: '#0D4E12',
  primaryLight: '#1B8C24',
  primarySurface: '#EBF7EC',
  accent: '#EAF95E',
  accentText: '#127019',
  cardShadow: 'rgba(18, 112, 25, 0.06)',
  iconBg: '#F0F7F0',
  success: '#127019',
  successBg: '#EBF7EC',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const darkTheme: ThemeColors = {
  background: '#121613',
  backgroundSecondary: '#181E19',
  card: '#1A211B',
  cardSecondary: '#212A23',
  border: '#273429',
  borderLight: '#202C22',
  text: '#FFFFFF',
  textSecondary: '#C8D5CA',
  textMuted: '#7E8F81',
  primary: '#1EA629',
  primaryDark: '#127019',
  primaryLight: '#34D399',
  primarySurface: '#152C18',
  accent: '#EAF95E',
  accentText: '#121613',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  iconBg: '#212D23',
  success: '#34D399',
  successBg: '#152C18',
  warning: '#FBBF24',
  danger: '#F87171',
};
