import { Participant, Presentation, PresentationStatus } from "@/firebase/db";
import { dbListenerAction, put } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import dayjs from "dayjs";
import {
  call,
  cancel,
  fork,
  take,
  takeLatest,
  takeLeading,
} from "typed-redux-saga";
import {
  convertToLocalParticipant,
  convertToLocalPresentation,
  convertToLocalPresentationStatus,
} from "../../utils/dbConverter";
import { getUserId } from "./selectors/user";
import { get, listen, set } from "./utils/firebase/database";
import { pages, router } from "@router";
import { enqueueSnackbar } from "notistack";

const actions = {
  setListener: "answerer/setListener",
  clearListener: "answerer/clearListener",
  joinEventAsAnonymousUser: "answerer/joinEventAsAnonymousUser",
  answer: "answerer/answer",
};

const actionCreators = {
  setListener: createAction<{
    presentationId: string;
  }>(actions.setListener),
  clearListener: createAction(actions.clearListener),
  joinEventAsAnonymousUser: createAction<{
    presentationId: string;
    displayName: string;
    iconUrl: string;
  }>(actions.joinEventAsAnonymousUser),
  answer: createAction<{
    presentationId: string;
    questionId: string;
    choiceIds: string[];
  }>(actions.answer),
};

function* setPresentationStatusListener(
  action: ReturnType<typeof actionCreators.setListener>
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
      yield* put(({ answererStates }) =>
        answererStates.setPresentationStatus(
          convertToLocalPresentationStatus(value)
        )
      );
    }
  } finally {
    channel.close();
  }
}

function* setParticipantListener(presentationId: string, userId: string) {
  const channel = yield* call(() =>
    listen<Participant>(`/participants/${presentationId}/${userId}`)
  );

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success || result.value == null) {
        yield* put(({ answererStates }) => answererStates.setJoined(false));
        continue;
      }

      const localParticipant = convertToLocalParticipant(userId, result.value);
      yield* put(({ answererStates }) => answererStates.setJoined(true));
      yield* put(({ answererStates }) =>
        answererStates.setAnswers(localParticipant.answers)
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
  yield* put(({ answererStates }) =>
    answererStates.setPresentation(
      convertToLocalPresentation(presentationId, value)
    )
  );
}

function* joinEventAsAnonymousUser(
  action: ReturnType<typeof actionCreators.joinEventAsAnonymousUser>
) {
  const { presentationId, displayName, iconUrl } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const participant: Participant = {
    joinDate: dayjs().unix(),
    displayName,
    iconUrl,
  };
  const participantResult = yield* call(() =>
    set(`/participants/${presentationId}/${userId}`, participant)
  );
  if (!participantResult.success) {
    console.error(participantResult.error);
    enqueueSnackbar({
      key: "create_participant",
      message: strings.errors.doNotJoinEvent,
      variant: "error",
    });
  }
}

function* handleAnswer(action: ReturnType<typeof actionCreators.answer>) {
  const { presentationId, questionId, choiceIds } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const answerResult = yield* call(() =>
    set(
      `/participants/${presentationId}/${userId}/answers/${questionId}`,
      choiceIds
    )
  );
  if (!answerResult.success) {
    console.error(answerResult.error);
    enqueueSnackbar({
      key: "fail_to_answer",
      variant: "error",
      message: strings.errors.failToAnswer,
    });
  }
}

function* listenerSaga() {
  while (true) {
    const action = yield* take(actionCreators.setListener);

    const userId = yield* getUserId();
    if (userId == null) {
      continue;
    }

    yield* call(getPresentation, action.payload.presentationId);
    const taskOfStatus = yield* fork(
      dbListenerAction(setPresentationStatusListener),
      action
    );
    const taskOfParticipant = yield* fork(
      setParticipantListener,
      action.payload.presentationId,
      userId
    );
    yield* take(actionCreators.clearListener);
    yield* cancel(taskOfStatus);
    yield* cancel(taskOfParticipant);
  }
}

export function* answererStatesSagas() {
  yield* fork(listenerSaga);
  yield* takeLeading(
    actions.joinEventAsAnonymousUser,
    joinEventAsAnonymousUser
  );
  yield* takeLatest(actions.answer, handleAnswer);
}

export const answererStatesSagaModule = {
  actions: actionCreators,
};
