"use client";

import { create } from "zustand";
import { AppListResponse } from "@/types/app";

interface AppStore {
  connectedApps: AppListResponse;
  appList: string[];
  setConnectedApps: (apps: AppListResponse) => void;
  isLinked: (provider: string) => boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  connectedApps: {},
  appList: [],
  setConnectedApps: (apps) =>
    set({ connectedApps: apps, appList: Object.keys(apps) }),
  isLinked: (provider) => provider.toLowerCase() in get().connectedApps,
}));
