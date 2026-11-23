import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { AuthLoading } from '@/components/auth-loading';
import { LoginScreen } from '@/components/login-screen';
import { firebaseConfigReady } from '@/config/firebase';
import { useAuth } from '@/hooks/use-auth';

export default function WebLoginRoute() {
  const { user, loading: authLoading, signInWithGooglePopup } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user]);

  const startLogin = async () => {
    setError('');
    if (!firebaseConfigReady) {
      setError('Firebase is not configured. Add the required Firebase values to your environment.');
      return;
    }
    setBusy(true);
    try {
      await signInWithGooglePopup();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) return <AuthLoading />;
  return <LoginScreen busy={busy} error={error} configured={firebaseConfigReady} onLogin={startLogin} />;
}
