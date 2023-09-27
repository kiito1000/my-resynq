import { all, fork } from "typed-redux-saga";
import { authSagas } from "./auth";
import { slideEditorSagas } from "./slideEditor";
import { projectListSagas } from "./projectList";
import { slideStatesSagas } from "./slideStates";
import { answererStatesSagas } from "./answererStates";
import { presentationSagas } from "./presentation";
import { presenterSagas } from "./presenter";
import { myProfileSagas } from "./myProfile";
import { dbSagas } from "./db";

// Redux-Saga Design Pattern: https://redux-saga.js.org/docs/advanced/RootSaga

export function* rootSaga() {
  yield* all([
    fork(slideStatesSagas),
    fork(answererStatesSagas),
    fork(projectListSagas),
    fork(authSagas),
    fork(slideEditorSagas),
    fork(presentationSagas),
    fork(presenterSagas),
    fork(myProfileSagas),
    fork(dbSagas),
  ]);
}
