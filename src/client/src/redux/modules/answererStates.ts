import {
  LocalPresentationStatus,
  LocalParticipant,
  LocalPresentation,
} from "@/firebase/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AnswererStates = {
  presentationStatus: LocalPresentationStatus | { type: "blank" };
  presentation?: LocalPresentation;
  answers: LocalParticipant["answers"];
  isJoined: boolean;
  isFull: boolean;
};

const initialState: AnswererStates = {
  presentationStatus: { type: "blank" },
  presentation: undefined,
  answers: {},
  isJoined: false,
  isFull: false,
};

// MEMO: detect fullscreen exit in SlidePageWrapper
export const answererStatesModule = createSlice({
  name: "answererStates",
  initialState,
  reducers: {
    setPresentationStatus: (
      state,
      action: PayloadAction<LocalPresentationStatus>
    ) => {
      state.presentationStatus = action.payload;
    },
    setPresentation: (state, action: PayloadAction<LocalPresentation>) => {
      state.presentation = action.payload;
    },
    setAnswers: (state, action: PayloadAction<LocalParticipant["answers"]>) => {
      state.answers = action.payload;
    },
    setJoined: (state, action: PayloadAction<boolean>) => {
      state.isJoined = action.payload;
    },
    setFull: (state, action: PayloadAction<boolean>) => {
      state.isFull = action.payload;
    },
  },
});
