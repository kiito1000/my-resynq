import {
  Answers,
  LocalParticipant,
  LocalPresentation,
  LocalPresentationStatus,
  SlidePage,
  UserRecord,
} from "@/firebase/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PresenterStates = {
  presentation?: LocalPresentation;
  presentationStatus: LocalPresentationStatus | { type: "blank" };
  pages: SlidePage[];
  answers: Answers;
  participants: LocalParticipant[];
  activePage?: number;
};

const initialState: PresenterStates = {
  pages: [],
  presentation: undefined,
  presentationStatus: { type: "blank" },
  answers: {},
  participants: [],
  activePage: undefined,
};

const findPage = (
  pages: SlidePage[],
  targetStatus: LocalPresentationStatus
) => {
  return pages.find((page) => {
    switch (targetStatus.type) {
      case "start":
      case "rank":
      case "end":
        return page.type === targetStatus.type;
      case "accept":
      case "calculate":
      case "check":
        return (
          page.type === "question" &&
          page.question.id === targetStatus.question.id
        );
    }
  });
};

export const presenterModule = createSlice({
  name: "presenter",
  initialState,
  reducers: {
    setPresentation: (state, action: PayloadAction<LocalPresentation>) => {
      state.presentation = action.payload;
    },
    setPresentationStatus: (
      state,
      action: PayloadAction<LocalPresentationStatus>
    ) => {
      state.presentationStatus = action.payload;
    },
    setPages: (state, action: PayloadAction<SlidePage[]>) => {
      state.pages = action.payload;
    },
    updatePageStatus: (
      state,
      action: PayloadAction<LocalPresentationStatus>
    ) => {
      const status = action.payload;
      const activePage = findPage(state.pages, status);
      state.pages.forEach((page) => {
        page.status = page === activePage ? status : undefined;
        page.isDone = activePage && activePage.index > page.index;
      });
    },
    setAnswers: (state, action: PayloadAction<Answers>) => {
      state.answers = action.payload;
    },
    setParticipants: (state, action: PayloadAction<LocalParticipant[]>) => {
      state.participants = action.payload;
    },
    updateActivePage: (
      state,
      action: PayloadAction<LocalPresentationStatus>
    ) => {
      const page = findPage(state.pages, action.payload);
      state.activePage = page?.index;
    },
    updateRanking: (state, action: PayloadAction<UserRecord[]>) => {
      const page = state.pages.find(
        (page): page is Extract<SlidePage, { type: "rank" }> =>
          page.type === "rank"
      );
      if (page != null) {
        page.ranking = action.payload;
      }
    },
    unsetPresentation: () => initialState,
  },
});
