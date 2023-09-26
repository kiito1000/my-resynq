import { LocalProject, Project } from "@/firebase/db";
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
import { v4 as uuid } from "uuid";
import { getUserId } from "./selectors/user";
import { listen, remove, set } from "./utils/firebase/database";
import { enqueueSnackbar } from "notistack";

const actions = {
  setListener: "projectList/setListener",
  clearListener: "projectList/clearListener",
  createProject: "projectList/createProject",
  updateProject: "projectList/updateProject",
  deleteProject: "projectList/deleteProject",
  copyProject: "projectList/copyProject",
} as const;

const actionCreators = {
  setListener: createAction(actions.setListener),
  clearListener: createAction(actions.clearListener),
  createProject: createAction<Pick<LocalProject, "name" | "hashtag">>(
    actions.createProject
  ),
  updateProject: createAction<{
    project: LocalProject;
  }>(actions.updateProject),
  deleteProject: createAction<{
    projectId: string;
  }>(actions.deleteProject),
  copyProject: createAction<{
    project: LocalProject;
  }>(actions.copyProject),
};

function* listenProjects(userId: string) {
  const channel = yield* call(() =>
    listen<Record<string, Project>>(`/projects/${userId}`)
  );

  try {
    while (true) {
      const result = yield* take(channel);
      if (!result.success) {
        console.error(result.error);
        continue;
      }

      const { value = {} } = result;
      yield* put(({ projectList }) => projectList.setProjectList(value));
    }
  } finally {
    channel.close();
  }
}

function* listenerSaga() {
  while (true) {
    yield* take(actionCreators.setListener);
    const userId = yield* getUserId();
    if (userId == null) {
      continue;
    }
    const task = yield* fork(dbListenerAction(listenProjects), userId);
    yield* take(actionCreators.clearListener);
    yield* cancel(task);
  }
}

function* createProject(
  action: ReturnType<typeof actionCreators.createProject>
) {
  const { name, hashtag } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  // 空配列はRealtimeDBに送信できないので配列は最低1つ入れておく
  const dbProject: Project = {
    name,
    createDate: dayjs().unix(),
    hashtag,
    slide: {
      questions: [
        {
          id: uuid(),
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
        },
      ],
    },
  };
  const projectId = uuid();
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}`, dbProject)
  );
  if (!result.success) {
    console.error(result);
    enqueueSnackbar({
      key: "fail_to_create_event",
      variant: "error",
      message: strings.errors.failToCreateEvent,
    });
  }
}

function* updateProject(
  action: ReturnType<typeof actionCreators.updateProject>
) {
  const {
    project: { id: projectId, ...project },
  } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const dbProject: Project = {
    ...project,
    createDate: project.createDate.unix(),
    holdDate: project.holdDate?.unix(),
  };
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}`, dbProject)
  );
  if (!result.success) {
    console.error(result);
    enqueueSnackbar({
      key: "fail_to_update_event",
      variant: "error",
      message: strings.errors.failToUpdateEvent,
    });
  }
}

function* deleteProject(
  action: ReturnType<typeof actionCreators.deleteProject>
) {
  const { projectId } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const result = yield* call(() => remove(`/projects/${userId}/${projectId}`));
  if (!result.success) {
    console.error(result);
    enqueueSnackbar({
      key: "fail_to_delete_event",
      variant: "error",
      message: strings.errors.failToDeleteEvent,
    });
  }
}

function* copyProject(action: ReturnType<typeof actionCreators.copyProject>) {
  const { project } = action.payload;
  const userId = yield* getUserId();
  if (userId == null) {
    return;
  }

  const dbProject: Project = {
    ...project,
    name: `${project.name} のコピー`,
    createDate: dayjs().unix(),
    holdDate: undefined,
    presentationId: undefined,
  };
  const projectId = uuid();
  const result = yield* call(() =>
    set(`/projects/${userId}/${projectId}`, dbProject)
  );
  if (!result.success) {
    console.error(result);
    enqueueSnackbar({
      key: "fail_to_copy_event",
      variant: "error",
      message: strings.errors.failToCopyEvent,
    });
  }
}

export function* projectListSagas() {
  yield* fork(listenerSaga);
  yield* takeLeading(actions.createProject, createProject);
  yield* takeLatest(actions.updateProject, updateProject);
  yield* takeLeading(actions.deleteProject, deleteProject);
  yield* takeLeading(actions.copyProject, copyProject);
}

export const projectListSagaModule = {
  actions: actionCreators,
};
