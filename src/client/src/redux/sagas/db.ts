import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import { call, cancel, fork, take } from "typed-redux-saga";
import { listen } from "./utils/firebase/database";
import { enqueueSnackbar } from "notistack";

const actions = {
  subscribeConnection: "db/subscribeConnection",
  unsubscribeConnection: "db/unsubscribeConnection",
};

const actionCreators = {
  subscribeConnection: createAction(actions.subscribeConnection),
  unsubscribeConnection: createAction(actions.unsubscribeConnection),
};

function* notifyConnectionStatus() {
  const channel = yield* call(() => listen<boolean>(".info/connected"));

  // 最初に接続が成功しても通知しない
  let connected = true;
  try {
    while (true) {
      const result = yield* take(channel);
      const prevConnected: boolean = connected;
      connected = result.success && result.value === true;
      if (prevConnected === connected) {
        continue;
      }

      if (connected) {
        enqueueSnackbar({
          key: "reconnect_server",
          variant: "success",
          message: strings.db.reconnectServer,
        });
      } else {
        enqueueSnackbar({
          key: "disconnect_server",
          variant: "error",
          message: strings.db.disconnectServer,
        });
      }
    }
  } finally {
    channel.close();
  }
}

export function* dbSagas() {
  while (true) {
    yield* take(actions.subscribeConnection);
    const task = yield* fork(notifyConnectionStatus);
    yield* take(actions.unsubscribeConnection);
    yield* cancel(task);
  }
}

export const dbSagaModule = {
  actions: actionCreators,
};
