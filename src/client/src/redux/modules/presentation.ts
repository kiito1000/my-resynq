import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "answerer" | "presenter";

export type PresentationState = {
  role?: Role;
};

const initialState: PresentationState = {
  role: undefined,
};

export const presentationModule = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
  },
});
