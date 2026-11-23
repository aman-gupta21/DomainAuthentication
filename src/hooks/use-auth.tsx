import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { firebaseConfigReady, getFirebaseAuth } from '@/config/firebase';
import { clearGoogleSession } from '@/utils/clear-google-session';
import { isAllowedEmail } from '@/utils/domainValidation';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  signInWithGooglePopup: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function requireFirebaseAuth() {
  const instance = getFirebaseAuth();
  if (!instance) throw new Error('Firebase Authentication is unavailable in this environment.');
  return instance;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigReady);

  useEffect(() => {
    const instance = firebaseConfigReady ? getFirebaseAuth() : null;
    if (!instance) {
      return;
    }

    return onAuthStateChanged(instance, async (nextUser) => {
      if (nextUser && !isAllowedEmail(nextUser.email)) {
        await firebaseSignOut(instance);
        setUser(null);
      } else {
        setUser(nextUser);
      }
      setLoading(false);
    });
  }, []);

  const signInWithGoogleIdToken = useCallback(async (idToken: string) => {
    const instance = requireFirebaseAuth();
    const result = await signInWithCredential(
      instance,
      GoogleAuthProvider.credential(idToken),
    );
    if (!isAllowedEmail(result.user.email)) {
      await firebaseSignOut(instance);
      throw new Error(
        'Access restricted. Please login using your official domain email.',
      );
    }
    setUser(result.user);
  }, []);

  const signInWithGooglePopup = useCallback(async () => {
    const instance = requireFirebaseAuth();
    if (Platform.OS !== 'web') {
      throw new Error('Google popup sign-in is only available on web.');
    }
    const result = await signInWithPopup(instance, new GoogleAuthProvider());
    if (!isAllowedEmail(result.user.email)) {
      await firebaseSignOut(instance);
      throw new Error(
        'Access restricted. Please login using your official domain email.',
      );
    }
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([
      firebaseSignOut(requireFirebaseAuth()),
      clearGoogleSession(),
    ]);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInWithGoogleIdToken,
      signInWithGooglePopup,
      signOut,
    }),
    [user, loading, signInWithGoogleIdToken, signInWithGooglePopup, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
