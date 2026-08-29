import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, Gender, UserProfile } from '../types/navigation'; // أو مسار الـ types عندك
import { StorageService } from '../services/storageService';
import { HapticService } from '../services/hapticService';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithCredential, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
// تأكد من أنك مستورد الـ app الخاص بـ firebase من ملف التكوين لديك (مثلا firebaseConfig)
import { app } from '../services/firebaseConfig'; 

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const auth = getAuth(app);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // إعداد طلب الـ Google Auth من Expo
  // ملاحظة: ضع الـ Web Client ID الخاص بـ Firebase هنا إذا لزم، أو استخدم الإعدادات التلقائية
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com', // أو استبدله بـ Client ID الصحيح من جوجل كلاود إن وجد، أو اتركه يتكفل به الـ Firebase
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    loadUser();
  }, []);

  // مراقبة استجابة تسجيل الدخول بجوجل
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleFirebaseGoogleLogin(id_token);
    }
  }, [response]);

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

  const handleFirebaseGoogleLogin = async (idToken: string) => {
    try {
      setIsLoading(true);
      // ربط توكن جوجل مع Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const firebaseUser = result.user;

      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'مستخدم رحيق',
        email: firebaseUser.email || '',
        gender: null, // سيطلب منه اختيار الجنس بعد أول تسجيل
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveUserProfile(userProfile);
      setUser(userProfile);
      await HapticService.success();
    } catch (e) {
      console.error('Firebase Google login error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await HapticService.mediumTap();
      // تشغيل نافذة جوجل للحصول على التوكن
      await promptAsync();
    } catch (e) {
      console.error('Google sign in prompt error', e);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await HapticService.mediumTap();
      await firebaseSignOut(auth);
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
