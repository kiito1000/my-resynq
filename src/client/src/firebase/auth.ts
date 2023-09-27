import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { app } from "./app";

export const auth = getAuth(app);

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === "true")
  connectAuthEmulator(auth, `${location.protocol}//${location.hostname}:8099`);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");

export const twitterProvider = new TwitterAuthProvider();
