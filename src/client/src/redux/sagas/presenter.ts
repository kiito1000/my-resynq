import { ParticipantMap, Presentation, Project } from "@/firebase/db";
import { dbListenerAction, put } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { createAnswers, createSlidePages } from "@utils/presentation";
import compact from "lodash.compact";
import { call, cancel, fork, take } from "typed-redux-saga";
import {
  convertToLocalParticipant,
  convertToLocalPresentation,
  convertToLocalPresentationStatus,
  convertToLocalProject,
} from "../../utils/dbConverter";
import { getUserId } from "./selectors/user";
import { get, listen, set } from "./utils/firebase/database";
import { pages, router } from "@router";

const actions = {
  setListener: "presenter/setListener",
  clearListener: "presenter/clearListener",
};

const actionCreators = {
  setListener: createAction<{ presentationId: string }>(actions.setListener),
  clearListener: createAction(actions.clearListener),
};

function* handleGetProject(userId: string, projectId: string) {
  // 発表中にイベント情報が更新される必要はないので一回でよい
  const projectData = yield* call(() =>
    get<Project>(`/projects/${userId}/${projectId}`)
  );

  if (!projectData.success || projectData.value == null) {
    console.error(projectData);
    return undefined;
  }

  const { value } = projectData;
  const project = convertToLocalProject(projectId, value);
  const slidePages = createSlidePages(project);
  yield* put(({ presenter }) => presenter.setPages(slidePages));

  return project;
}

function* handleGetProjectId(presentationId: string) {
  const result = yield* call(() =>
    get<string>(`/presentations/${presentationId}/projectId`)
  );
  if (result.success) {
    return result.value;
  }
  return undefined;
}

function* setPresentationListener(presentationId: string) {
  const channel = yield* call(() =>
    listen<Presentation>(`/presentations/${presentationId}`)
  );

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success) {
        continue;
      }
      if (result.value == null) {
        yield* call(() => router.navigate(pages.notFound(), { replace: true }));
        break;
      }

      const { value } = result;
      const localPresentation = convertToLocalPresentation(
        presentationId,
        value
      );
      yield* put(({ presenter }) =>
        presenter.setPresentation(localPresentation)
      );

      const localPresentationStatus = convertToLocalPresentationStatus(
        result.value.status
      );
      yield* put(({ presenter }) =>
        presenter.setPresentationStatus(localPresentationStatus)
      );
      yield* put(({ presenter }) =>
        presenter.updatePageStatus(localPresentationStatus)
      );
      yield* put(({ presenter }) =>
        presenter.updateActivePage(localPresentationStatus)
      );
      yield* put(({ presenter }) =>
        presenter.updateRanking(localPresentation.ranking)
      );
    }
  } finally {
    channel.close();
  }
}

function* setParticipantsListener(presentationId: string) {
  const channel = yield* call(() =>
    listen<ParticipantMap>(`/participants/${presentationId}`)
  );

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success) {
        console.error(result.error);
        continue;
      }

      const { value = {} } = result;
      yield* put(({ presenter }) => presenter.setAnswers(createAnswers(value)));
      const localParticipants = compact(
        Object.entries(value).map(
          ([userId, participant]) =>
            participant && convertToLocalParticipant(userId, participant)
        )
      );
      yield* put(({ presenter }) =>
        presenter.setParticipants(localParticipants)
      );
      const participantResult = yield* call(() =>
        set(
          `/presentations/${presentationId}/participants`,
          localParticipants.length
        )
      );
      if (!participantResult.success) {
        console.error(participantResult.error);
      }
    }
  } finally {
    channel.close();
  }
}

function* listenerSaga() {
  while (true) {
    const {
      payload: { presentationId },
    } = yield* take(actionCreators.setListener);

    const userId = yield* getUserId();
    if (userId == null) {
      continue;
    }

    const projectId = yield* call(() => handleGetProjectId(presentationId));
    if (projectId == null) {
      yield* call(() => router.navigate(pages.notFound(), { replace: true }));
      continue;
    }
    const project = yield* call(() => handleGetProject(userId, projectId));
    if (project == null) {
      yield* call(() => router.navigate(pages.notFound(), { replace: true }));
      continue;
    }

    const presentationListener = yield* fork(
      dbListenerAction(setPresentationListener),
      presentationId
    );

    const participantsListener = yield* fork(
      setParticipantsListener,
      presentationId
    );

    yield* take(actionCreators.clearListener);

    yield* cancel(presentationListener);
    yield* cancel(participantsListener);
    yield* put(({ presenter }) => presenter.unsetPresentation());
  }
}

export function* presenterSagas() {
  yield* fork(listenerSaga);
}

export const presenterSagaModule = {
  actions: actionCreators,
};
