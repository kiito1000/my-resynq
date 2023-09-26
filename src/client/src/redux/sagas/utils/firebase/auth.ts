import { auth } from "@/firebase/auth";
import {
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup as firebaseSignInWithPopup,
  signInWithRedirect as firebaseSignInWithRedirect,
  signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential as firebaseReauthenticateWithCredential,
  getRedirectResult as firebaseGetRedirectResult,
} from "@firebase/auth";
import {
  AuthCredential,
  AuthError,
  AuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  User,
} from "@firebase/auth";
import { CompleteFn, ErrorFn, FirebaseError } from "@firebase/util";
import { END, eventChannel } from "@redux-saga/core";
import { call } from "typed-redux-saga";
import { Result } from "..";

export const listen = () => {
  return eventChannel<Result<User | null>>((emitter) => {
    const nextOrObserver: NextOrObserver<User> = (user) => {
      emitter({ success: true, value: user });
    };
    const error: ErrorFn = (error) => {
      emitter({ success: false, error });
    };
    const completed: CompleteFn = () => {
      emitter(END);
    };
    const unsubscribe = onAuthStateChanged(
      auth,
      nextOrObserver,
      error,
      completed
    );
    return unsubscribe;
  });
};

export function* signInAnonymously() {
  try {
    const credentials = yield* call(() => firebaseSignInAnonymously(auth));
    return { success: true, value: credentials };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* signInWithPopup(authProvider: AuthProvider) {
  try {
    const credentials = yield* call(() =>
      firebaseSignInWithPopup(auth, authProvider)
    );
    return { success: true, value: credentials };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* signInWithRedirect(authProvider: AuthProvider) {
  try {
    yield* call(() => firebaseSignInWithRedirect(auth, authProvider));
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* signOut() {
  try {
    yield* call(() => firebaseSignOut(auth));
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* deleteUser(user: User) {
  try {
    yield* call(() => firebaseDeleteUser(user));
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* reauthenticateWithCredential(
  user: User,
  authCredential: AuthCredential
) {
  try {
    const userCredential = yield* call(() =>
      firebaseReauthenticateWithCredential(user, authCredential)
    );
    return { success: true, value: userCredential };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}

export function* getRedirectResult() {
  try {
    const result = yield* call(() => firebaseGetRedirectResult(auth));
    return { success: true, value: result };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error as AuthError };
    }
    throw error;
  }
}
