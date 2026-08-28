import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, Gender, UserProfile } from '../types/auth';
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await HapticService.mediumTap();

      // Standard Google Account Profile payload
      const mockGoogleUser: UserProfile = {
        id: `google_${Date.now()}`,
        name: 'عبدالله بن محمد',
        email: 'user@gmail.com',
        gender: null, // Prompt user after sign in
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveUserProfile(mockGoogleUser);
      setUser(mockGoogleUser);
      await HapticService.success();
    } catch (e) {
      console.error('Google sign in error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await HapticService.mediumTap();
      await StorageService.removeUserProfile();
      setUser(null);
    } catch (e) {
      console.error('Sign out error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGender = async (gender: 'male' | 'female') => {
    if (!user) return;
    try {
      const updatedUser: UserProfile = {
        ...user,
        gender,
      };
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
      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
      };
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
        signInWithGoogle,
        signOut,
        updateGender,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
