import { database } from "@/firebase/database";
import * as Database from "@firebase/database";
import { eventChannel } from "@redux-saga/core";
import { CallEffect } from "@redux-saga/core/effects";
import { DataSnapshot } from "firebase/database";
import { call } from "typed-redux-saga";
import { NoContentResult, Result } from "..";

export const listen = <T>(path: string) => {
  return eventChannel<Result<T | undefined>>((emitter) => {
    const dbRef = Database.ref(database, path);
    const callback = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        emitter({ success: true, value: snapshot.val() });
      } else {
        emitter({ success: true, value: undefined });
      }
    };
    const cancelCallback = (error: Error) => {
      emitter({ success: false, error });
    };
    Database.onValue(dbRef, callback, cancelCallback);
    const unsubscribe = () => {
      Database.off(dbRef);
    };
    return unsubscribe;
  });
};

export function* get<T>(
  path: string
): Generator<CallEffect<Database.DataSnapshot>, Result<T | undefined>> {
  try {
    const dbRef = Database.ref(database, path);
    const snapshot = yield* call(() => Database.get(dbRef));
    if (snapshot.exists()) {
      return { success: true, value: snapshot.val() };
    } else {
      return { success: true, value: undefined };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
    throw error;
  }
}

export function* set<T>(
  path: string,
  value: T
): Generator<CallEffect<void>, NoContentResult> {
  try {
    const dbRef = Database.ref(database, path);
    // undefinedなどが許容されていないのでJsonに変換してからセットする
    yield* call(() => Database.set(dbRef, JSON.parse(JSON.stringify(value))));
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
    throw error;
  }
}

export function* update<T>(
  path: string,
  value: T
): Generator<CallEffect<void>, NoContentResult> {
  try {
    const dbRef = Database.ref(database, path);
    // undefinedなどが許容されていないのでJsonに変換してからセットする
    yield* call(() =>
      Database.update(dbRef, JSON.parse(JSON.stringify(value)))
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
    throw error;
  }
}

export function* remove(
  path: string
): Generator<CallEffect<void>, NoContentResult> {
  try {
    const dbRef = Database.ref(database, path);
    yield* call(() => Database.remove(dbRef));
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
    throw error;
  }
}
