"use client";

import { create } from "zustand";
import { AppListResponse } from "@/types/app";

interface AppStore {
  connectedApps: AppListResponse;
  setConnectedApps: (apps: AppListResponse) => void;
  isLinked: (provider: string) => boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  connectedApps: {},
  setConnectedApps: (apps) => set({ connectedApps: apps }),
  isLinked: (provider) => provider.toLowerCase() in get().connectedApps,
}));
