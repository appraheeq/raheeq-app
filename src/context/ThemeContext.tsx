import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, ThemeColors } from '../constants/colors';
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeColors;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedMode = await StorageService.getThemeMode();
      if (savedMode) {
        setThemeState(savedMode);
      } else {
        setThemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    } catch (e) {
      console.error('Failed to load theme mode', e);
    }
  };

  const setThemeMode = async (mode: 'light' | 'dark') => {
    setThemeState(mode);
    await StorageService.saveThemeMode(mode);
    await HapticService.selection();
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        themeMode,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
