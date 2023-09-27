import { put, viewAction } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import {
  AdditionalUserInfo,
  OAuthCredential,
  OperationType,
  ProviderId,
  User,
} from "firebase/auth";
import FirebaseUI from "firebaseui";
import { enqueueSnackbar } from "notistack";
import {
  call,
  cancel,
  cancelled,
  fork,
  take,
  takeLeading,
} from "typed-redux-saga";
import {
  listen as listenAuth,
  signInAnonymously,
  signOut,
} from "./utils/firebase/auth";
import { set } from "./utils/firebase/database";

interface AuthResult {
  user: User;
  credential: OAuthCredential;
  additionalUserInfo: AdditionalUserInfo;
  operationType: (typeof OperationType)[keyof typeof OperationType];
}

const actions = {
  handleSignInSuccess: "auth/handleSignInSuccess",
  handleSignInFailure: "auth/handleSignInFailure",
  signInAnonymously: "auth/signInAnonymously",
  logout: "auth/logout",
  subscribe: "auth/subscribe",
  unsubscribe: "auth/unsubscribe",
};

const actionCreators = {
  handleSignInSuccess: createAction<AuthResult>(actions.handleSignInSuccess),
  handleSignInFailure: createAction<FirebaseUI.auth.AuthUIError>(
    actions.handleSignInFailure
  ),
  signInAnonymously: createAction(actions.signInAnonymously),
  logout: createAction(actions.logout),
  subscribe: createAction<{ autoLogin: boolean }>(actions.subscribe),
  unsubscribe: createAction(actions.unsubscribe),
};

function createUser(authResult: AuthResult) {
  const { user, additionalUserInfo } = authResult;
  const { displayName, photoURL, email } = user;
  const description = (() => {
    switch (additionalUserInfo.providerId) {
      case ProviderId.GOOGLE:
        return email;
      case ProviderId.TWITTER:
        return additionalUserInfo?.username;
      default:
        return undefined;
    }
  })();

  return {
    displayName: displayName ?? undefined,
    iconUrl: photoURL ?? undefined,
    description: description ?? undefined,
  };
}

function* handleSignInSuccess(
  action: ReturnType<typeof actionCreators.handleSignInSuccess>
) {
  const authResult = action.payload;

  if (authResult.operationType !== "signIn") {
    return;
  }

  const user = createUser(authResult);
  const { uid } = authResult.user;
  const userResult = yield* call(() => set(`users/${uid}`, user));
  if (!userResult.success) {
    console.error(userResult.error);
    enqueueSnackbar({
      key: "fail_to_login",
      variant: "error",
      message: strings.errors.failToLogin,
    });
  }
}

function handleSignInFailure(
  action: ReturnType<typeof actionCreators.handleSignInFailure>
) {
  const error = action.payload;
  console.error(error.message);
  enqueueSnackbar({
    key: "fail_to_login",
    variant: "error",
    message: strings.errors.failToLogin,
  });
}

function* handleLogout(_action: ReturnType<typeof actionCreators.logout>) {
  yield* call(() => signOut());
}

function* handleSubscribeAuth(autoLogin: boolean) {
  const channel = yield* call(listenAuth);
  try {
    yield* put(({ view }) => view.startAction());

    while (true) {
      const response = yield* take(channel);
      let user: User | undefined;
      if (response.success && response.value != null) {
        user = response.value;
      } else if (autoLogin) {
        // TODO: ページ遷移時に匿名ユーザーを作らないようにする
        const signInResponse = yield* call(() => signInAnonymously());
        if (signInResponse.success && signInResponse.value != null) {
          user = signInResponse.value.user;
        }
      }

      if (user != null) {
        const myUser = user;
        yield* put(({ myProfile }) => myProfile.setFirebaseUser(myUser));
        yield* put(({ myProfile }) => myProfile.subscribe());
        yield* put(({ view }) => view.endAction());
      } else {
        yield* put(({ myProfile }) => myProfile.unsubscribe());
        yield* put(({ myProfile }) => myProfile.clear());
      }
    }
  } finally {
    if (yield* cancelled()) {
      channel.close();
    }
    yield* put(({ view }) => view.endAction());
  }
}

function* listenerSagas() {
  while (true) {
    const action = yield* take(actionCreators.subscribe);
    const { autoLogin } = action.payload;
    const task = yield* fork(handleSubscribeAuth, autoLogin);
    yield* take(actions.unsubscribe);
    yield* cancel(task);
  }
}

export function* authSagas() {
  yield* takeLeading(
    actions.handleSignInSuccess,
    viewAction(handleSignInSuccess)
  );
  yield* takeLeading(
    actions.handleSignInFailure,
    viewAction(handleSignInFailure)
  );
  yield* takeLeading(actions.logout, viewAction(handleLogout));
  yield* fork(listenerSagas);
}

export const authSagaModule = {
  actions: actionCreators,
};
