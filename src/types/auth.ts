export type Gender = 'male' | 'female' | null;

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  gender: Gender;
  createdAt: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateGender: (gender: 'male' | 'female') => Promise<void>;
  updateName: (name: string) => Promise<void>;
}
