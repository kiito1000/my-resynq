import { createSlice } from "@reduxjs/toolkit";

export type SlideDisplayStatus = {
  isFullscreen: boolean;
  isQr: boolean;
};

const initialState: SlideDisplayStatus = {
  isFullscreen: false,
  isQr: false,
};

// MEMO: detect fullscreen exit in SlidePageWrapper
export const slideDisplayStatusModule = createSlice({
  name: "slideDisplayStatus",
  initialState,
  reducers: {
    enterFullscreen: (state) => {
      return {
        ...state,
        isFullscreen: true,
      };
    },
    exitFullscreen: (state) => {
      return {
        ...state,
        isFullscreen: false,
      };
    },
    enterQr: (state) => {
      return {
        ...state,
        isQr: true,
      };
    },
    exitQr: (state) => {
      return {
        ...state,
        isQr: false,
      };
    },
  },
});
