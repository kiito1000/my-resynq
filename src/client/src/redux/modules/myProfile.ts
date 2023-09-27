import { User } from "@/firebase/db";
import { User as FirebaseUser } from "firebase/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MyProfile = User & {
  user?: FirebaseUser;
};

const initialState: MyProfile = {};

export const myProfileModule = createSlice({
  name: "myProfile",
  initialState,
  reducers: {
    setMyProfile: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    setFirebaseUser: (state, action: PayloadAction<FirebaseUser>) => {
      state.user = action.payload;
    },
    clear: () => {
      return {};
    },
  },
});
