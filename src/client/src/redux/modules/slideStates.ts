import { LocalPresentationStatus, LocalPresentation } from "@/firebase/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DisplayStatus = {
  isFullscreen: boolean;
  isQr: boolean;
};

export type SlideStates = {
  displayStatus: DisplayStatus;
  presentationStatus: LocalPresentationStatus | { type: "blank" };
  presentation: LocalPresentation;
};

const initialState: SlideStates = {
  displayStatus: { isFullscreen: false, isQr: false },
  presentationStatus: { type: "blank" },
  presentation: {
    id: "",
    name: "",
    ownerUserId: "",
    projectId: "",
    participants: 0,
    ranking: [],
  },
};

// MEMO: detect fullscreen exit in SlidePageWrapper
export const slideStatesModule = createSlice({
  name: "slideStates",
  initialState,
  reducers: {
    enterFullscreen: (state) => {
      state.displayStatus.isFullscreen = true;
    },
    exitFullscreen: (state) => {
      state.displayStatus.isFullscreen = false;
    },
    enterQr: (state) => {
      state.displayStatus.isQr = true;
    },
    exitQr: (state) => {
      state.displayStatus.isQr = false;
    },
    setPresentationStatus: (
      state,
      action: PayloadAction<LocalPresentationStatus>
    ) => {
      state.presentationStatus = action.payload;
    },
    setPresentation: (state, action: PayloadAction<LocalPresentation>) => {
      state.presentation = action.payload;
    },
  },
});
