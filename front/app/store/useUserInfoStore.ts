"use client";

import { create } from "zustand";

export interface UserInfo {
  name: string;
  email: string;
  affiliation: string;
  joinType: string;
}

interface UserInfoStore {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}

export const useUserInfoStore = create<UserInfoStore>((set, _get) => ({
  userInfo: {
    name: "",
    email: "",
    affiliation: "",
    joinType: "",
  },
  setUserInfo: (info) => set({ userInfo: info }),
}));
