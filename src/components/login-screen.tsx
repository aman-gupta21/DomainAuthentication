import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type LoginScreenProps = {
  busy: boolean;
  disabled?: boolean;
  error: string;
  configured: boolean;
  onLogin: () => void;
};

export function LoginScreen({ busy, disabled = false, error, configured, onLogin }: LoginScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <View style={styles.mark}><Text style={styles.markText}>H+</Text></View>
        <Text style={styles.eyebrow}>HB PLUS WORKSPACE</Text>
        <Text style={styles.title}>Sign in to continue</Text>
        <Text style={styles.subtitle}>Use your official @hbplus.fit Google account to access your workspace.</Text>
        {!configured && <Text style={styles.error}>Firebase or Google sign-in is not configured. Complete the setup in the README.</Text>}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          disabled={busy || disabled}
          onPress={onLogin}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, (busy || disabled) && styles.buttonDisabled]}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.buttonText}>{busy ? 'Connecting…' : 'Continue with Google'}</Text>
        </Pressable>
        <Text style={styles.footnote}>Access is limited to authorized company accounts.</Text>
      </View>
      <Text style={styles.footer}>Secure sign-in powered by Google and Firebase</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, minHeight: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6FB', padding: 24 },
  card: { width: '100%', maxWidth: 440, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 36, alignItems: 'center', boxShadow: '0 12px 42px rgba(25, 39, 74, 0.09)' },
  mark: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#3657D6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  markText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  eyebrow: { color: '#5268B5', fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 12 },
  title: { color: '#182235', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#68758B', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 12, marginBottom: 26 },
  button: { width: '100%', minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#D9DFEA', backgroundColor: '#FFFFFF', gap: 12 },
  buttonPressed: { backgroundColor: '#F6F8FC' },
  buttonDisabled: { opacity: 0.6 },
  googleG: { color: '#4285F4', fontSize: 18, fontWeight: '800' },
  buttonText: { color: '#263349', fontSize: 15, fontWeight: '600' },
  error: { alignSelf: 'stretch', color: '#B42318', fontSize: 13, lineHeight: 19, backgroundColor: '#FEF3F2', padding: 12, borderRadius: 10, marginBottom: 14 },
  footnote: { color: '#8A95A8', fontSize: 12, textAlign: 'center', marginTop: 18 },
  footer: { color: '#8A95A8', fontSize: 12, marginTop: 22, textAlign: 'center' },
});
