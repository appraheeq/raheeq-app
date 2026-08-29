import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/navigation';
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';

interface LocalAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  saveUserProfile: (name: string, gender: 'male' | 'female') => Promise<void>;
  updateGender: (gender: 'male' | 'female') => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const savedUser = await StorageService.getUserProfile();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (e) {
      console.error('Failed to load user profile', e);
    } finally {
      setIsLoading(false);
    }
  };

  // حفظ الملف الشخصي لأول مرة (بدون تسجيل دخول)
  const saveUserProfile = async (name: string, gender: 'male' | 'female') => {
    try {
      setIsLoading(true);
      await HapticService.mediumTap();

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: '',
        gender,
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveUserProfile(newUser);
      setUser(newUser);
      await HapticService.success();
    } catch (e) {
      console.error('Save user profile error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGender = async (gender: 'male' | 'female') => {
    if (!user) return;
    try {
      const updatedUser: UserProfile = { ...user, gender };
      await StorageService.saveUserProfile(updatedUser);
      setUser(updatedUser);
      await HapticService.selection();
    } catch (e) {
      console.error('Update gender error', e);
    }
  };

  const updateName = async (name: string) => {
    if (!user || !name.trim()) return;
    try {
      const updatedUser: UserProfile = { ...user, name: name.trim() };
      await StorageService.saveUserProfile(updatedUser);
      setUser(updatedUser);
      await HapticService.selection();
    } catch (e) {
      console.error('Update name error', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        saveUserProfile,
        updateGender,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
