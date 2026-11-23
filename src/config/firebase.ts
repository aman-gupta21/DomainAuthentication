import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigReady = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (Platform.OS === 'web' && typeof window === 'undefined') return null;
  if (authInstance) return authInstance;

  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
    return authInstance;
  }

  try {
    // Firebase exposes this helper in its React Native entry point. The
    // package's shared type entry does not include the platform export.
    const getReactNativePersistence = (firebaseAuth as unknown as {
      getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
    }).getReactNativePersistence;
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    authInstance = getAuth(app);
  }
  return authInstance;
}

export default app;
