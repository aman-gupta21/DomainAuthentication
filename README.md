# Domain Auth App

Cross-platform Expo application with Google sign-in restricted to the `hbplus.fit` domain. The web build uses Firebase Authentication's Google popup flow. Native Android and iOS use Nitro Google Sign-In and exchange the Google ID token for a Firebase session.

## Requirements

- Node.js and npm
- A Firebase project with Google enabled as an Authentication provider
- Android Studio/JDK for local Android development; a Mac or Expo Build for iOS development
- A development build; Google native sign-in does not run in Expo Go

## Firebase and Google setup

1. Open Firebase Console and select the project used by `.env`.
2. Under **Authentication → Sign-in method**, enable **Google** and set the support email. Under **Authentication → Settings → Authorized domains**, keep `localhost` for local web and add the eventual deployment hostname.
3. Under **Project settings → General → Your apps**, add an Android app with package name `fit.hbplus.domainauthapp`. Add the Android SHA-1 signing fingerprint under that app's certificate fingerprints. Download the updated `google-services.json` to the project root.
4. Add an iOS app with bundle ID `fit.hbplus.domainauthapp`. Download `GoogleService-Info.plist` to the project root. These identifiers are set in `app.json`; keep them stable after registering the apps.
5. In `.env`, keep the Firebase **Web app** config values (`EXPO_PUBLIC_FIREBASE_*`). Do not put OAuth client secrets or service-account keys in `.env`.

The native config files are ignored by Git. They are required on disk for local native builds. For remote builds, upload them in Expo dashboard → **Project settings → Environment variables** as secret file variables named `GOOGLE_SERVICES_JSON` and `GOOGLE_SERVICE_INFO_PLIST`. `app.config.js` passes those file paths to the Expo config plugin during EAS builds. Also add the `EXPO_PUBLIC_FIREBASE_*` values and `EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit` as build environment variables; `.env` is not uploaded with the project.

## Run on Android

1. Install Android Studio and an Android emulator, or connect an Android device with USB debugging enabled.
2. Confirm `google-services.json` and `.env` are present.
3. From the project directory, run:

   ```powershell
   npx expo prebuild --clean
   npx expo run:android
   ```

4. For later JavaScript changes, start Metro with `npx expo start` and open the development build. Rebuild after changing native config, Google config files, or native dependencies.

For Android SHA-1, use the debug signing certificate for local testing and the Play App Signing certificate for a Play Store release. Firebase's **Project settings → General → Your apps → Android app → SHA certificate fingerprints** page accepts both. See Google's [Android signing certificate guide](https://developers.google.com/android/guides/client-auth).

## Run on iOS

Use a Mac with Xcode and run `npx expo prebuild --clean` followed by `npx expo run:ios`. On Windows, create a development build with Expo Build in the cloud. You need an Expo account and Apple signing credentials for an iPhone install. Set up Expo Build with `npx eas-cli@latest build:configure`, then build using a development profile. Upload `GoogleService-Info.plist` to Expo as the file variable described above. Expo Build's [first-build guide](https://docs.expo.dev/build/setup/) covers the Expo login and Apple credential prompts.

## Authentication flow

1. Web uses Firebase's Google popup. Native apps use Nitro Google Sign-In with the Firebase native config files.
2. Firebase validates the Google credential and creates the app session.
3. The app only exposes the dashboard when the Firebase user's email ends with `@hbplus.fit`; other users are signed out and shown the access restriction message.
4. Auth state is observed on startup. Native sessions use AsyncStorage persistence. The `/dashboard` route redirects to `/` without an authorized user.
5. Logout clears both Firebase and native Google sessions.

The domain check in the client controls app access and user experience. Any future database or API resource must also enforce authorization with Firebase Security Rules or a trusted backend; client-side route protection alone is not a data security boundary.

## Commands

- `npm run web` — run in a browser
- `npx expo run:android` — build and launch Android
- `npx expo run:ios` — build and launch iOS (Mac required)
- `npx expo lint` — lint
- `npx tsc --noEmit` — typecheck

## Web deployment

The project is configured for Expo Router's static web output. Build with `npx expo export --platform web` and deploy `dist/` to Netlify. Add the deployed hostname to Firebase Authentication's Authorized domains. Add the public deployment URL here after deployment.
