import { LocalProject, Project } from "@/firebase/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertToLocalProject } from "@utils/dbConverter";

type SlideEditorStatus = "none" | "doing" | "done";

export type SlideEditorState = {
  selectedQuestionId?: string;
  project?: LocalProject;
  status: SlideEditorStatus;
};

const initialState: SlideEditorState = {
  selectedQuestionId: undefined,
  status: "none",
};

export const slideEditorModule = createSlice({
  name: "slideEditor",
  initialState,
  reducers: {
    selectQuestion: (state, action: PayloadAction<string | undefined>) => {
      state.selectedQuestionId = action.payload;
    },
    setProject: (
      state,
      action: PayloadAction<{ projectId: string; project: Project }>
    ) => {
      state.project = convertToLocalProject(
        action.payload.projectId,
        action.payload.project
      );
    },
    setStatus: (state, action: PayloadAction<SlideEditorStatus>) => {
      state.status = action.payload;
    },
  },
});
