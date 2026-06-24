"use client";

import { create } from "zustand";

export interface ProjectSimpleDto {
  id: number;
  name: string;
  myRole: string; // 💡 로그인한 사용자의 이 프로젝트 내 권한 (예: ADMIN, MEMBER)
}

interface ProjectStore {
  projects: ProjectSimpleDto[];
  currentProject: ProjectSimpleDto | null;
  isLoading: boolean;
  setProjects: (projects: ProjectSimpleDto[]) => void;
  setCurrentProjectById: (projectId: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: true,

  setProjects: (projects) => set({ projects }),

  // 💡 ID를 넘겨받으면 전체 목록에서 찾아 현재 프로젝트로 셋팅하는 액션
  setCurrentProjectById: (projectId) => {
    const target = get().projects.find((p) => p.id === projectId);
    if (target) {
      set({ currentProject: target });
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
