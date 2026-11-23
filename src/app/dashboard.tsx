import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AuthLoading } from '@/components/auth-loading';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardScreen() {
  const { user, loading, signOut } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user]);

  if (loading || !user) return <AuthLoading />;

  const handleSignOut = async () => {
    setError('');
    setBusy(true);
    try {
      await signOut();
      router.replace('/');
    } catch {
      setError('Could not sign out. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>HB PLUS WORKSPACE</Text>
            <Text style={styles.heading}>Dashboard</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={handleSignOut} disabled={busy} style={styles.logout}>
            <Text style={styles.logoutText}>{busy ? 'Signing out…' : 'Log out'}</Text>
          </Pressable>
        </View>
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{(user.displayName ?? user.email ?? 'U').slice(0, 1).toUpperCase()}</Text></View>
          <Text style={styles.welcome}>Welcome{user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.accessBadge}><View style={styles.dot} /><Text style={styles.accessText}>Authorized workspace access</Text></View>
        </View>
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Text style={styles.note}>You are signed in with an approved company account.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: '100%', backgroundColor: '#F4F6FB' },
  container: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  eyebrow: { color: '#5268B5', fontSize: 11, letterSpacing: 1.4, fontWeight: '700', marginBottom: 7 },
  heading: { color: '#182235', fontSize: 30, fontWeight: '700' },
  logout: { borderRadius: 10, borderWidth: 1, borderColor: '#D9DFEA', backgroundColor: '#FFF', paddingVertical: 11, paddingHorizontal: 16 },
  logoutText: { color: '#344054', fontSize: 14, fontWeight: '600' },
  welcomeCard: { maxWidth: 640, backgroundColor: '#FFF', borderRadius: 20, padding: 28, boxShadow: '0 12px 42px rgba(25, 39, 74, 0.07)' },
  avatar: { height: 54, width: 54, borderRadius: 18, backgroundColor: '#E8EDFF', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  avatarText: { color: '#3657D6', fontSize: 22, fontWeight: '700' },
  welcome: { color: '#182235', fontSize: 23, fontWeight: '700' },
  email: { color: '#68758B', fontSize: 15, marginTop: 7 },
  accessBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ECFDF3', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 99, marginTop: 22 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#12B76A' },
  accessText: { color: '#067647', fontSize: 12, fontWeight: '600' },
  note: { color: '#68758B', fontSize: 13, marginTop: 20 },
  error: { color: '#B42318', marginTop: 14 },
});
