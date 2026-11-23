export async function clearGoogleSession() {
  try {
    const { GoogleOneTapSignIn } = await import('react-native-nitro-google-signin');
    await GoogleOneTapSignIn.signOut();
  } catch {
    // Firebase sign-out must still work when the native module is unavailable
    // (for example, while previewing the app in Expo Go).
  }
}
