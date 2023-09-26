import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "./app";

if (import.meta.env.DEV) {
  // Enable debug mode of App Check
  self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN === "false"
      ? false
      : import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN ?? true;
}

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});
