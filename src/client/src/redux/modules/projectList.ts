import { LocalProject, Project } from "@/firebase/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertToLocalProject } from "@utils/dbConverter";

export type ProjectList = LocalProject[];

const initialState: ProjectList = [];

export const projectListModule = createSlice({
  name: "projectList",
  initialState,
  reducers: {
    setProjectList: (
      _state,
      action: PayloadAction<Record<string, Project>>
    ) => {
      return Object.entries(action.payload).map(([projectId, project]) =>
        convertToLocalProject(projectId, project)
      );
    },
  },
});
