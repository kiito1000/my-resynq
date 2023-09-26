import {
  LocalProject,
  ParticipantMap,
  Presentation,
  Project,
} from "@/firebase/db";
import { Role } from "@redux/modules/presentation";
import { put } from "@redux/utils/saga";
import { createAction } from "@reduxjs/toolkit";
import { strings } from "@strings";
import {
  convertToLocalPresentationStatus,
  convertToLocalProject,
  convertToPresentationStatus,
} from "@utils/dbConverter";
import {
  createRanking,
  getNextStatus,
  getPreviousStatus,
} from "@utils/presentation";
import dayjs from "dayjs";
import { all, call, takeLatest, takeLeading } from "typed-redux-saga";
import { v4 as uuid } from "uuid";
import { getUserId } from "./selectors/user";
import { get, remove, set } from "./utils/firebase/database";
import { pages, router } from "@router";
import { enqueueSnackbar } from "notistack";

const actions = {
  getRole: "presentation/getRole",
  createPresentation: "presentation/createPresentation",
  startPresentation: "presentation/startPresentation",
  setNextStatus: "presentation/setNextStatus",
  setPreviousStatus: "presentation/setPreviousStatus",
  cancelPresentation: "presentation/cancelPresentation",
  closePresentation: "presentation/closePresentation",
};

const actionCreators = {
  getRole: createAction<{ presentationId: string }>(actions.getRole),
  createPresentation: createAction<LocalProject>(actions.createPresentation),
  startPresentation: createAction<{ presentationId: string }>(
    actions.startPresentation
  ),
  setNextStatus: createAction<{
    presentationId: string;
  }>(actions.setNextStatus),
  setPreviousStatus: createAction<{
    presentationId: string;
  }>(actions.setPreviousStatus),
  cancelPresentation: createAction<{ presentationId: string }>(
    actions.cancelPresentation
  ),
  closePresentation: createAction<{ presentationId: string }>(
    actions.closePresentation
  ),
};

function* handleGetRole(action: ReturnType<typeof actionCreators.getRole>) {
  const { presentationId } = action.payload;

  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const presentationData = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );
  if (presentationData.success && presentationData.value != null) {
    const { ownerUserId } = presentationData.value;
    const role: Role = userId === ownerUserId ? "presenter" : "answerer";
    yield* put(({ presentation }) => presentation.setRole(role));
  } else {
    yield* put(({ presentation }) => presentation.setRole("answerer"));
  }
}

function* handleCreatePresentation(
  action: ReturnType<typeof actionCreators.createPresentation>
) {
  const project = action.payload;

  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const presentation: Presentation = {
    ownerUserId: userId,
    projectId: project.id,
    name: project.name,
    hashtag: project.hashtag,
    status: { type: "start" },
    participants: 0,
  };
  const presentationId = uuid();
  const presentationResult = yield* call(() =>
    set(`/presentations/${presentationId}`, presentation)
  );
  if (!presentationResult.success) {
    console.error(presentationResult.error);
    enqueueSnackbar({
      key: "do_not_start_event",
      variant: "error",
      message: strings.errors.doNotStartEvent,
    });
    return;
  }
  const projectResult = yield* call(() =>
    set(`/projects/${userId}/${project.id}/presentationId`, presentationId)
  );
  if (!projectResult.success) {
    console.error(projectResult.error);
    enqueueSnackbar({
      key: "do_not_start_event",
      variant: "error",
      message: strings.errors.doNotStartEvent,
    });
    return;
  }

  const participantMap: ParticipantMap = {};
  const participantResult = yield* call(() =>
    set(`/participants/${presentationId}`, participantMap)
  );
  if (!participantResult.success) {
    console.error(participantResult.error);
    enqueueSnackbar({
      key: "do_not_start_event",
      variant: "error",
      message: strings.errors.doNotStartEvent,
    });
    return;
  }

  yield* call(() => router.navigate(pages.presentation(presentationId)));
}

function* handleStartPresentation(
  action: ReturnType<typeof actionCreators.startPresentation>
) {
  const { presentationId } = action.payload;

  const presentationData = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );
  if (!presentationData.success || presentationData.value == null) {
    console.error(presentationData);
    enqueueSnackbar({
      key: "do_not_start_event",
      variant: "error",
      message: strings.errors.doNotStartEvent,
    });
    return;
  }

  const now = dayjs();
  const presentation: Presentation = {
    ...presentationData.value,
    startDate: now.unix(),
  };
  const presentationResult = yield* call(() =>
    set(`/presentations/${presentationId}`, presentation)
  );
  if (!presentationResult.success) {
    console.error(presentationResult.error);
    enqueueSnackbar({
      key: "do_not_start_event",
      variant: "error",
      message: strings.errors.doNotStartEvent,
    });
  }
}

function* getCurrentStatus(presentationId: string) {
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const presentationResult = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );
  if (!presentationResult.success || presentationResult.value == null) {
    console.error(presentationResult);
    return;
  }

  const presentation = presentationResult.value;
  const { projectResult, participantsResult } = yield* all({
    projectResult: get<Project>(
      `/projects/${userId}/${presentation.projectId}`
    ),
    participantsResult: get<ParticipantMap>(`/participants/${presentationId}`),
  });
  if (!projectResult.success || projectResult.value == null) {
    console.error(projectResult);
    return;
  }
  if (!participantsResult.success) {
    console.error(participantsResult);
    return;
  }

  const participants = participantsResult.value ?? {};
  const status = convertToLocalPresentationStatus(
    presentationResult.value.status
  );
  const project = convertToLocalProject(
    presentation.projectId,
    projectResult.value
  );

  return { status, project, participants };
}

function* handleSetNextStatus(
  action: ReturnType<typeof actionCreators.setNextStatus>
) {
  const { presentationId } = action.payload;
  const current = yield* getCurrentStatus(presentationId);
  if (current == null) {
    enqueueSnackbar({
      key: "do_not_go_next_page",
      variant: "error",
      message: strings.errors.doNotGoNextPage,
    });
    return;
  }

  const now = dayjs();
  const nextLocalStatus = getNextStatus(
    current.status,
    current.project,
    current.participants,
    now
  );
  if (nextLocalStatus.type === "error") {
    console.error(nextLocalStatus);
    enqueueSnackbar({
      key: "do_not_go_next_page",
      variant: "error",
      message: strings.errors.doNotGoNextPage,
    });
    return;
  }

  const nextStatus = convertToPresentationStatus(nextLocalStatus);
  const presentationStatusResult = yield* call(() =>
    set(`/presentations/${presentationId}/status`, nextStatus)
  );
  if (!presentationStatusResult.success) {
    console.error(presentationStatusResult.error);
    enqueueSnackbar({
      key: "do_not_go_next_page",
      variant: "error",
      message: strings.errors.doNotGoNextPage,
    });
    return;
  }

  if (
    nextLocalStatus.type !== "calculate" &&
    current.status.type !== "start" &&
    current.status.type !== "rank"
  ) {
    return;
  }

  // クイズ開始後、各クイズ集計後、結果発表前にランキングを更新する
  const { questions } = current.project.slide;
  const ranking = createRanking(questions, current.participants);
  const rankingResult = yield* call(() =>
    set(`/presentations/${presentationId}/ranking`, ranking)
  );
  if (!rankingResult.success) {
    console.error(rankingResult.error);
    enqueueSnackbar({
      key: "fail_to_update_ranking",
      variant: "error",
      message: strings.errors.failToUpdateRanking,
    });
    return;
  }
}

function* handleSetPreviousStatus(
  action: ReturnType<typeof actionCreators.setPreviousStatus>
) {
  const { presentationId } = action.payload;
  const current = yield* getCurrentStatus(presentationId);
  if (current == null) {
    enqueueSnackbar({
      key: "do_not_back_previous_page",
      variant: "error",
      message: strings.errors.doNotBackPreviousPage,
    });
    return;
  }

  const now = dayjs();
  const previousLocalStatus = getPreviousStatus(
    current.status,
    current.project,
    current.participants,
    now
  );
  if (previousLocalStatus.type === "error") {
    console.error(previousLocalStatus);
    enqueueSnackbar({
      key: "do_not_back_previous_page",
      variant: "error",
      message: strings.errors.doNotBackPreviousPage,
    });
    return;
  }

  const previousStatus = convertToPresentationStatus(previousLocalStatus);
  const presentationStatusResult = yield* call(() =>
    set(`/presentations/${presentationId}/status`, previousStatus)
  );
  if (!presentationStatusResult.success) {
    console.error(presentationStatusResult.error);
    enqueueSnackbar({
      key: "do_not_back_previous_page",
      variant: "error",
      message: strings.errors.doNotBackPreviousPage,
    });
  }
}

function* handleCancelPresentation(
  action: ReturnType<typeof actionCreators.cancelPresentation>
) {
  const { presentationId } = action.payload;
  const presentationData = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );
  if (!presentationData.success || presentationData.value == null) {
    console.error(presentationData);
    enqueueSnackbar({
      key: "do_not_cancel_event",
      variant: "error",
      message: strings.errors.doNotCancelEvent,
    });
    return;
  }

  const presentation = presentationData.value;
  if (presentation.endDate != null) {
    // 既にイベントが終了している場合はリセットできない
    enqueueSnackbar({
      key: "already_end_event",
      variant: "error",
      message: strings.errors.alreadyEndEvent,
    });
    return;
  }

  // presentationを最後に削除すること(他が削除できなくなるので)
  const participantResult = yield* call(() =>
    remove(`/participants/${presentationId}`)
  );
  if (!participantResult.success) {
    console.error(participantResult.error);
    enqueueSnackbar({
      key: "do_not_cancel_event",
      variant: "error",
      message: strings.errors.doNotCancelEvent,
    });
    return;
  }

  const projectResult = yield* call(() =>
    remove(
      `/projects/${presentation.ownerUserId}/${presentation.projectId}/presentationId`
    )
  );
  if (!projectResult.success) {
    console.error(projectResult.error);
    enqueueSnackbar({
      key: "do_not_cancel_event",
      variant: "error",
      message: strings.errors.doNotCancelEvent,
    });
    return;
  }

  const presentationResult = yield* call(() =>
    remove(`/presentations/${presentationId}`)
  );
  if (!presentationResult.success) {
    console.error(presentationResult.error);
    enqueueSnackbar({
      key: "do_not_cancel_event",
      variant: "error",
      message: strings.errors.doNotCancelEvent,
    });
    return;
  }

  yield* call(() => router.navigate(pages.events()));
}

function* handleClosePresentation(
  action: ReturnType<typeof actionCreators.closePresentation>
) {
  const { presentationId } = action.payload;
  const presentationData = yield* call(() =>
    get<Presentation>(`/presentations/${presentationId}`)
  );
  if (!presentationData.success || presentationData.value == null) {
    console.error(presentationData);
    enqueueSnackbar({
      key: "do_not_close_event",
      variant: "error",
      message: strings.errors.doNotCloseEvent,
    });
    return;
  }
  if (presentationData.value.startDate == null) {
    // イベントが開始していない場合は終了できない
    enqueueSnackbar({
      key: "already_end_event",
      variant: "error",
      message: strings.errors.alreadyEndEvent,
    });
    return;
  }
  const now = dayjs();
  const presentation: Presentation = {
    ...presentationData.value,
    endDate: now.unix(),
    status: { type: "end" },
  };
  const presentationResult = yield* call(() =>
    set(`/presentations/${presentationId}`, presentation)
  );
  if (!presentationResult.success) {
    console.error(presentationResult.error);
    enqueueSnackbar({
      key: "do_not_close_event",
      variant: "error",
      message: strings.errors.doNotCloseEvent,
    });
    return;
  }

  const { projectId, ownerUserId } = presentationData.value;
  const projectResult = yield* call(() =>
    set(`/projects/${ownerUserId}/${projectId}/holdDate`, now.unix())
  );
  if (!projectResult.success) {
    console.error(projectResult.error);
    enqueueSnackbar({
      key: "do_not_close_event",
      variant: "error",
      message: strings.errors.doNotCloseEvent,
    });
  }
}

export function* presentationSagas() {
  yield* takeLatest(actions.getRole, handleGetRole);
  yield* takeLeading(actions.createPresentation, handleCreatePresentation);
  yield* takeLeading(actions.startPresentation, handleStartPresentation);
  yield* takeLeading(actions.setNextStatus, handleSetNextStatus);
  yield* takeLeading(actions.setPreviousStatus, handleSetPreviousStatus);
  yield* takeLeading(actions.cancelPresentation, handleCancelPresentation);
  yield* takeLeading(actions.closePresentation, handleClosePresentation);
}

export const presentationSagaModule = {
  actions: actionCreators,
};
