import { User } from "@/firebase/db";
import { put } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import { call, cancel, fork, take, takeLeading } from "typed-redux-saga";
import { getUserId } from "./selectors/user";
import { listen, set } from "./utils/firebase/database";
import { enqueueSnackbar } from "notistack";

const actions = {
  subscribe: "myProfile/subscribe",
  unsubscribe: "myProfile/unsubscribe",
  update: "myProfile/update",
};

const actionCreators = {
  subscribe: createAction(actions.subscribe),
  unsubscribe: createAction(actions.unsubscribe),
  update: createAction<User>(actions.update),
};

function* handleSubscribe(userId: string) {
  const channel = yield* call(() => listen<User>(`/users/${userId}`));

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success) {
        console.error(result.error);
        yield* put(({ myProfile }) => myProfile.clear());
        continue;
      }

      const { value: user } = result;
      yield* put(({ myProfile }) => myProfile.setMyProfile(user ?? {}));
    }
  } finally {
    channel.close();
  }
}

function* listenerSagas() {
  while (true) {
    yield* take(actions.subscribe);
    const userId = yield* getUserId();
    if (userId == null) {
      continue;
    }
    const task = yield* fork(handleSubscribe, userId);
    yield* take(actions.unsubscribe);
    yield* cancel(task);
  }
}

function* handleUpdateMyProfile(
  action: ReturnType<typeof actionCreators.update>
) {
  const user = action.payload;

  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const result = yield* call(() => set(`/users/${userId}`, user));
  if (!result.success) {
    console.error(result.error);
    enqueueSnackbar({
      key: "fail_to_update_user_profile",
      variant: "error",
      message: strings.errors.failToUpdateUserProfile,
    });
  }
}

export function* myProfileSagas() {
  yield* fork(listenerSagas);
  yield* takeLeading(actions.update, handleUpdateMyProfile);
}

export const myProfileSagaModule = {
  actions: actionCreators,
};
