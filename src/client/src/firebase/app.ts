import { envs } from "@envs";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: envs.firebase.apiKey,
  authDomain: envs.firebase.authDomain,
  databaseURL: envs.firebase.databaseURL,
  projectId: envs.firebase.projectId,
  storageBucket: envs.firebase.storageBucket,
  messagingSenderId: envs.firebase.messagingSenderId,
  appId: envs.firebase.appId,
  measurementId: envs.firebase.measurementId,
};

export const app = initializeApp(firebaseConfig);
