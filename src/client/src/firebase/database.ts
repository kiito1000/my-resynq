import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { app } from "./app";

export const database = getDatabase(app);

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === "true")
  connectDatabaseEmulator(database, location.hostname, 8000);
