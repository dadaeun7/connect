"use client";

import { create } from "zustand";

interface IssueStore {
  issues: IssueViewResponse[];
  deleteIssue: (issueId: number) => Promise<void>;
  updateIssue: (issueId: number, updateReq: UpdatedPayload) => Promise<void>;
  loading: boolean;
  fetchIssues: (projectId?: number) => Promise<void>;
  getIssuesByProject: (projectId: number) => IssueViewResponse[];
}

export interface ActivityResponse {
  appType: string;
  resourceTarget: string;
  activityTitle: string;
  activityContent: string;
  createdAt: string;
  originUrl: string;
}

export interface IssueTitleResponse {
  id: number;
  title: string;
  state: string | null;
  priorityCode: number;
  statusCode: number;
  dueDate: string | null;
  createdAt: string | null;
  projectId: number;
  githubRepoName: string | null;
  figmaFileKey: string | null;
  notionPageId: string | null;
  notionDbId: string | null;
}

export interface IssueViewResponse {
  preveiw: IssueTitleResponse;
  activity: ActivityResponse[];
}

export interface IssueDetailResponse {
  // 연동 자산 정보
  githubRepoName: string | null;
  githubBranch: string | null;
  githubRepoId: number | null;
  figmaFileKey: string | null;
  figmaFileName: string | null;
  notionDbId: string | null; // 노션 라우팅 규칙 처리 대상 (replaceAll('-', ''))
  notionDbTitle: string | "";
}

export interface UpdatedPayload {
  priorityCode: number;
  statusCode: number;
  dueDate: string | null;
  githubRepoId: number | null;
  githubRepoName: string | null;
  githubBranch: string | null;
  figmaFileKey: string | null;
  figmaFileName: string | null;
  notionDbId: string | null; // 노션 라우팅 규칙 처리 대상 (replaceAll('-', ''))
  notionDbTitle: string | null;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  loading: false,
  fetchIssues: async (projectId) => {
    if (!projectId) return; // 최상위 레이아웃 감지 규칙에 따라 프로젝트 ID는 필수

    set({ loading: true });
    try {
      // 1. GET 요청 명시 및 인증 쿠키를 포함하는 credentials 옵션 추가
      const response = await fetch(`/issue/view/list?projectId=${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 브라우저 세션 쿠키(email 등 포함)를 백엔드로 전달
      });

      if (response.ok) {
        // 백엔드 쿼리로 뽑아낸 유저 정보 없는 경량화된 IssueResponse[] 수신
        const data: IssueViewResponse[] = await response.json();
        set({ issues: data });
      } else {
        console.error(`이슈 목록 로드 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("Zustand 이슈 스트림 수신 에러:", error);
    } finally {
      set({ loading: false });
    }
  },
  getIssuesByProject: (projectId) => {
    return get().issues.filter(
      (issue) => issue.preveiw.projectId === projectId,
    );
  },
  deleteIssue: async (issueId) => {
    if (!issueId) return;
    set({ loading: true });

    try {
      const response = await fetch(`/issue/delete?issueId=${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        location.reload();
      } else {
        console.error(`이슈 삭제 실패: ${response.status}`);
      }
    } catch (error) {
      console.error(`데이터 삭제 중 에러 발생 : `, error);
    } finally {
      set({ loading: false });
    }
  },
  updateIssue: async (issueId, updateReq) => {
    if (!issueId) return;
    set({ loading: true });

    try {
      const response = await fetch(`/issue/modify?issueId=${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateReq),
      });

      if (response.ok) {
        location.reload();
      } else {
        throw new Error(`이슈 업데이트 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("Zustand 이슈 업데이트 에러:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
