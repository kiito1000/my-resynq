import { Presentation, PresentationStatus } from "@/firebase/db";
import { dbListenerAction, put } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { call, cancel, fork, take } from "typed-redux-saga";
import {
  convertToLocalPresentation,
  convertToLocalPresentationStatus,
} from "./../../utils/dbConverter";
import { get, listen } from "./utils/firebase/database";
import { pages, router } from "@router";

const actions = {
  setPresentationStatusListener: "slide/presentationStatus/setListener",
  clearPresentationStatusListener: "slide/presentationStatus/clearListener",
};

const actionCreators = {
  setPresentationStatusListener: createAction<{ presentationId: string }>(
    actions.setPresentationStatusListener
  ),
  clearPresentationStatusListener: createAction(
    actions.clearPresentationStatusListener
  ),
};

function* setPresentationStatusListener(
  action: ReturnType<typeof actionCreators.setPresentationStatusListener>
) {
  const { presentationId } = action.payload;
  const channel = yield* call(() =>
    listen<PresentationStatus>(`/presentations/${presentationId}/status`)
  );

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success) {
        console.error(result.error);
        continue;
      }
      if (result.value == null) {
        yield* call(() => router.navigate(pages.notFound(), { replace: true }));
        break;
      }

      const { value } = result;
      yield* put(({ slideStates }) =>
        slideStates.setPresentationStatus(
          convertToLocalPresentationStatus(value)
        )
      );
    }
  } finally {
    channel.close();
  }
}

function* getPresentation(presentationId: string) {
  // 回答中にイベント情報が更新される必要はないので一回でよい
  const presentationData = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );

  if (!presentationData.success || presentationData.value == null) {
    console.error(presentationData);
    yield* call(() => router.navigate(pages.notFound(), { replace: true }));
    return;
  }

  const { value } = presentationData;
  yield* put(({ slideStates }) =>
    slideStates.setPresentation(
      convertToLocalPresentation(presentationId, value)
    )
  );
}

function* listenerSaga() {
  while (true) {
    const action = yield* take(actionCreators.setPresentationStatusListener);
    yield* call(getPresentation, action.payload.presentationId);
    const task = yield* fork(
      dbListenerAction(setPresentationStatusListener),
      action
    );
    yield* take(actionCreators.clearPresentationStatusListener);
    yield* cancel(task);
  }
}

export function* slideStatesSagas() {
  yield* fork(listenerSaga);
}

export const slideStatesSagaModule = {
  actions: actionCreators,
};
