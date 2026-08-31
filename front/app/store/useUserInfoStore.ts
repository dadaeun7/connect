"use client";

import { getUserInfo } from "@/actions/workline";
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
  fetchUserInfo: () => Promise<void>;
}

export const useUserInfoStore = create<UserInfoStore>((set, _get) => ({
  userInfo: {
    name: "",
    email: "",
    affiliation: "",
    joinType: "",
  },
  setUserInfo: (info) => set({ userInfo: info }),
  fetchUserInfo: async () => {
    try {
      const info = await getUserInfo();
      if (info) {
        set({ userInfo: info });
      }
    } catch (error) {
      console.error("유저 정보 로드 실패:", error);
    }
  },
}));
