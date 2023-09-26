import { LocalQuestion, Project, Question } from "@/firebase/db";
import { dbListenerAction, put, select } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import produce from "immer";
import compact from "lodash.compact";
import { buffers, Task } from "redux-saga";
import {
  actionChannel,
  call,
  cancel,
  delay,
  fork,
  take,
  takeLatest,
} from "typed-redux-saga";
import { v4 as uuid } from "uuid";
import { getUserId } from "./selectors/user";
import { listen, set } from "./utils/firebase/database";
import { pages, router } from "@router";
import { enqueueSnackbar } from "notistack";

const actions = {
  setProjectListener: "slideEditor/setListener",
  clearProjectListener: "slideEditor/clearListener",
  addQuestion: "slideEditor/addQuestion",
  sortQuestions: "slideEditor/sortQuestion",
  removeQuestion: "slideEditor/removeQuestion",
  editQuestion: "slideEditor/editQuestion",
} as const;

const actionCreators = {
  setProjectListener: createAction<{ projectId: string }>(
    actions.setProjectListener
  ),
  clearProjectListener: createAction(actions.clearProjectListener),
  addQuestion: createAction(actions.addQuestion),
  sortQuestions: createAction<{ questionIds: string[] }>(actions.sortQuestions),
  removeQuestion: createAction<{ questionId: string }>(actions.removeQuestion),
  editQuestion: createAction<{ question: LocalQuestion }>(actions.editQuestion),
};

function* listenProject(params: { userId: string; projectId: string }) {
  const channel = yield* call(() =>
    listen<Project>(`/projects/${params.userId}/${params.projectId}`)
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
      yield* put(({ slideEditor }) =>
        slideEditor.setProject({
          projectId: params.projectId,
          project: value,
        })
      );
    }
  } finally {
    channel.close();
  }
}

function* listenerSaga() {
  while (true) {
    const action = yield* take(actionCreators.setProjectListener);
    const userId = yield* getUserId();
    if (userId == null) {
      continue;
    }
    const task = yield* fork(dbListenerAction(listenProject), {
      userId,
      projectId: action.payload.projectId,
    });
    yield* take(actionCreators.clearProjectListener);
    yield* cancel(task);
  }
}

function* handleAddQuestion(
  _action: ReturnType<typeof actionCreators.addQuestion>
) {
  const localProject = yield* select((state) => state.slideEditor.project);
  if (localProject == null) {
    return;
  }
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const projectId = localProject.id;
  const questionId = uuid();
  const updatedQuestions: Question[] = produce(
    localProject.slide.questions,
    (draft) => {
      draft.push({
        id: questionId,
        title: "",
        choices: [
          {
            id: uuid(),
            label: "",
            isCorrect: false,
          },
          {
            id: uuid(),
            label: "",
            isCorrect: false,
          },
        ],
      });
    }
  );
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}/slide/questions`, updatedQuestions)
  );
  if (!result.success) {
    console.error(result.error);
    enqueueSnackbar({
      key: "fail_to_add_question",
      variant: "error",
      message: strings.errors.failToAddQuestion,
    });
    return;
  }

  yield put(({ slideEditor }) => slideEditor.selectQuestion(questionId));
}

function* handleSortQuestions(
  action: ReturnType<typeof actionCreators.sortQuestions>
) {
  const { questionIds } = action.payload;
  const localProject = yield* select((state) => state.slideEditor.project);
  if (localProject == null) {
    return;
  }
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const projectId = localProject.id;
  const updatedQuestions: Question[] = compact(
    questionIds.map((id) =>
      localProject.slide.questions.find((question) => question.id === id)
    )
  );
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}/slide/questions`, updatedQuestions)
  );
  if (!result.success) {
    console.error(result.error);
    enqueueSnackbar({
      key: "fail_to_sort_questions",
      variant: "error",
      message: strings.errors.failToSortQuestions,
    });
  }
}

function* handleRemoveQuestions(
  action: ReturnType<typeof actionCreators.removeQuestion>
) {
  const { questionId } = action.payload;
  const localProject = yield* select((state) => state.slideEditor.project);
  if (localProject == null) {
    return;
  }
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const projectId = localProject.id;
  const updatedQuestions: Question[] = localProject.slide.questions.filter(
    (question) => question.id !== questionId
  );
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}/slide/questions`, updatedQuestions)
  );
  if (!result.success) {
    console.error(result.error);
    enqueueSnackbar({
      key: "fail_to_remove_question",
      variant: "error",
      message: strings.errors.failToRemoveQuestion,
    });
  }
}

function* handleEditQuestion(
  action: ReturnType<typeof actionCreators.editQuestion>
) {
  const { question: updatedQuestion } = action.payload;
  const localProject = yield* select((state) => state.slideEditor.project);
  if (localProject == null) {
    return;
  }
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const projectId = localProject.id;
  const questions: Question[] = localProject.slide.questions;
  const questionIndex = questions.findIndex(
    (question) => question.id === updatedQuestion.id
  );
  if (questionIndex === -1) {
    return;
  }

  const result = yield* call(() =>
    set(
      `/projects/${userId}/${projectId}/slide/questions/${questionIndex}`,
      updatedQuestion
    )
  );
  if (!result.success) {
    console.error(result.error);
    enqueueSnackbar({
      key: "fail_to_edit_question",
      variant: "error",
      message: strings.errors.failToEditQuestion,
    });
  }

  yield* put(({ slideEditor }) => slideEditor.setStatus("done"));
}

// 最後のAction発行から500ms後に遅れてDBと同期する (ステータス更新あり)
function* lazySyncQuestionSaga() {
  const throttleChannel = yield* actionChannel<
    ReturnType<typeof actionCreators.editQuestion>
  >(actions.editQuestion, buffers.sliding(1));

  let lastTask: Task | undefined;
  while (true) {
    const action = yield* take(throttleChannel);
    yield* put(({ slideEditor }) => slideEditor.setStatus("doing"));
    if (lastTask) {
      yield* cancel(lastTask);
    }

    yield* delay(500);
    lastTask = yield* fork(handleEditQuestion, action);
  }
}

export function* slideEditorSagas() {
  yield* takeLatest(actions.addQuestion, handleAddQuestion);
  yield* takeLatest(actions.sortQuestions, handleSortQuestions);
  yield* takeLatest(actions.removeQuestion, handleRemoveQuestions);
  yield* fork(lazySyncQuestionSaga);
  yield* fork(listenerSaga);
}

export const slideEditorSagaModule = {
  actions: actionCreators,
};
