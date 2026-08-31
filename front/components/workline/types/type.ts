import { ProjectSimpleDto } from "@/app/store/useProjectStore";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/types/worklineApp";

export type StatusType = "inprogress" | "done" | "blocked" | "review" | "todo";
/** 
-  status: todo: 이슈가 등록되었으나, 담당자 할정 전 검토가 필요한 상태.
-  status: inprogress 담당자가 할당되어 실제 작업 중.
-  status: review 코드나 기획안 작성이 끝나고 동료의 검토를 기다리는 중.
-  status: done 테스트 서버에서 검증이 완료되어 배포 대기 중.
-  status: blocked 오류가 아니거나, 수정하지 않기로 결정된 경우.
 */

export type PriorityType = "high" | "medium" | "low";
/**
 * priority: high 높은 우선순위의 작업으로, 빠른 시일 내에 처리해야 하는 경우.
 * priority: medium 보통 우선순위의 작업으로, 일정 내에 처리하면 되는 경우.
 * priority: low 낮은 우선순위의 작업으로, 여유가 있을 때 처리해도 되는 경우.
 */

export const StatusList = ["inprogress", "done", "blocked", "review", "todo"];
export const PriorityList = ["high", "medium", "low"];

export const PRIORITY_COLORS = {
  High: { color: "var(--task-rose)", bg: "var(--task-rose-bg)" },
  Medium: { color: "var(--task-amber)", bg: "var(--task-amber-bg)" },
  Low: { color: "var(--task-teal)", bg: "var(--task-teal-bg)" },
};

export const STATUS_COLORS = {
  "In Progress": {
    color: "var(--task-blue)",
    bg: "var(--task-blue-bg)",
  },
  Done: {
    color: "var(--task-teal)",
    bg: "var(--task-teal-bg)",
  },
  Blocked: {
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
  },
  Review: {
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
  },
};

export const STATUS_MAP: Record<
  number,
  { key: string; label: string; color: string; bg: string }
> = {
  1: {
    key: "todo",
    label: "Todo",
    color: "var(--status-todo)",
    bg: "var(--secondary)",
  },
  2: {
    key: "inprogress",
    label: "Progress",
    color: "var(--task-blue)",
    bg: "var(--task-blue-bg)",
  },
  3: {
    key: "review",
    label: "Review",
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
  },
  4: {
    key: "done",
    label: "Done",
    color: "var(--task-teal)",
    bg: "var(--task-teal-bg)",
  },
  5: {
    key: "blocked",
    label: "Blocked",
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
  },
};

export const PRIORITY_MAP: Record<
  number,
  { key: string; label: string; color: string; bg: string }
> = {
  6: {
    key: "high",
    label: "High",
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
  },
  7: {
    key: "medium",
    label: "Medium",
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
  },
  8: {
    key: "low",
    label: "Low",
    color: "var(--task-teal)",
    bg: "var(--task-teal-bg)",
  },
};

export interface WorkIssueSidebarProps {
  expandedId: number | null;
  activeIssue: IssueViewResponse;
  onClose: () => void;
  getGithubRepo: () => Promise<GithubRepo[]>;
  getGitBrach: (repo: string) => Promise<GithubBranch[]>;
  getFigmaState: (url: string) => Promise<FigmaState>;
  getNotionList: () => Promise<NotionList[]>;
  getIssueDetail: (issueId: number | null) => Promise<any>;
}

export interface PAYLOAD {
  title: string;
  projectId: number;
  statusCode: number;
  priorityCode: number;
  dueDate: string | null;
  githubRepoId: number | null;
  githubRepoName: string | null;
  githubBranch: string | null;
  figmaFileKey: string | null;
  figmaFileName: string | null;
  notionDbId: string | null;
  notionDbTitle: string | null;
}

export interface IssueHistoryResponse {
  id: number;
  issueId: number;
  modifierEmail: string;
  category: string;
  content: string;
  createdAt: string;
}

export interface IssueHistoryTimelineProps {
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  issueId: number;
}

export interface SelectorProps {
  currentStatusId: number;
  setCurrentStatusId: (id: number) => void;
  currentPriorityId: number;
  setCurrentPriorityId: (id: number) => void;
}

export const statusId = [1, 2, 3, 4, 5];
export const priorityId = [6, 7, 8];

export interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projects?: ProjectSimpleDto[];
  onSelectProject?: (project: ProjectSimpleDto) => void;
}

export interface IssueCardProps {
  issue: IssueViewResponse;
  onDetailClick?: (id: number) => void;
}

export const menu = ["전체", "긴급", "새작업", "완료"];

export type MenuKey = "전체" | "긴급" | "새작업" | "완료";
export type FilterCode = "ALL" | number;
export type SortOrder = "DESC" | "ASC";

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
