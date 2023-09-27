import { answererStatesModule } from "./modules/answererStates";
import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import { projectListModule } from "./modules/projectList";
import { viewModule } from "./modules/view";
import { rootSaga } from "./sagas";
import { authSagaModule } from "./sagas/auth";
import { myProfileModule } from "./modules/myProfile";
import { slideEditorModule } from "./modules/slideEditor";
import { projectListSagaModule } from "./sagas/projectList";
import { slideEditorSagaModule } from "./sagas/slideEditor";
import { slideStatesModule } from "./modules/slideStates";
import { slideStatesSagaModule } from "./sagas/slideStates";
import { answererStatesSagaModule } from "./sagas/answererStates";
import { presentationModule } from "./modules/presentation";
import { presentationSagaModule } from "./sagas/presentation";
import { presenterModule } from "./modules/presenter";
import { presenterSagaModule } from "./sagas/presenter";
import { myProfileSagaModule } from "./sagas/myProfile";
import { dbSagaModule } from "./sagas/db";

// Redux Design Pattern: https://react-redux.js.org/tutorials/typescript-quick-start

const sagaMiddleware = createSagaMiddleware();

const reducer = {
  view: viewModule.reducer,
  slideEditor: slideEditorModule.reducer,
  myProfile: myProfileModule.reducer,
  slideStates: slideStatesModule.reducer,
  projectList: projectListModule.reducer,
  answererStates: answererStatesModule.reducer,
  presentation: presentationModule.reducer,
  presenter: presenterModule.reducer,
} as const;

export const actionCreator = {
  view: viewModule.actions,
  slideEditor: {
    ...slideEditorModule.actions,
    ...slideEditorSagaModule.actions,
  },
  auth: authSagaModule.actions,
  myProfile: { ...myProfileModule.actions, ...myProfileSagaModule.actions },
  slideStates: {
    ...slideStatesModule.actions,
    ...slideStatesSagaModule.actions,
  },
  projectList: {
    ...projectListModule.actions,
    ...projectListSagaModule.actions,
  },
  answererStates: {
    ...answererStatesModule.actions,
    ...answererStatesSagaModule.actions,
  },
  presentation: {
    ...presentationModule.actions,
    ...presentationSagaModule.actions,
  },
  presenter: { ...presenterModule.actions, ...presenterSagaModule.actions },
  db: dbSagaModule.actions,
} as const;

export const store = configureStore({
  reducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
