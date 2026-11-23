import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { AuthLoading } from '@/components/auth-loading';
import { LoginScreen } from '@/components/login-screen';
import { firebaseConfigReady } from '@/config/firebase';
import { useAuth } from '@/hooks/use-auth';

export default function NativeLoginRoute() {
  const { user, loading: authLoading, signInWithGoogleIdToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const configured = firebaseConfigReady;

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user]);

  const startLogin = async () => {
    setError('');
    if (!configured) {
      setError('Firebase or Google sign-in is not configured. Complete the setup in the README.');
      return;
    }
    setBusy(true);
    try {
      // This native module is available in a custom development/production build,
      // but not in Expo Go. Load it only when the user starts native sign-in so
      // Expo Router can still load the app and its routes in Expo Go.
      const {
        GoogleOneTapSignIn,
        isNoSavedCredentialFoundResponse,
        isSuccessResponse,
      } = await import('react-native-nitro-google-signin');
      GoogleOneTapSignIn.configure({ webClientId: 'autoDetect' });
      await GoogleOneTapSignIn.checkPlayServices();
      let result = await GoogleOneTapSignIn.signIn();
      if (isNoSavedCredentialFoundResponse(result)) {
        result = await GoogleOneTapSignIn.createAccount();
      }
      if (isNoSavedCredentialFoundResponse(result)) {
        result = await GoogleOneTapSignIn.presentExplicitSignIn();
      }
      if (isSuccessResponse(result)) {
        await signInWithGoogleIdToken(result.data.idToken);
      } else if (result.type !== 'cancelled') {
        throw new Error('Google sign-in did not return an account. Please try again.');
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Sign-in failed. Please try again.';
      setError(
        message.includes('NitroModules') || message.includes('native module')
          ? 'Google Sign-In needs the installed development build. Open this app in its custom build instead of Expo Go.'
          : message,
      );
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) return <AuthLoading />;
  return <LoginScreen busy={busy} error={error} configured={configured} onLogin={startLogin} />;
}
