import {
  ActivityResponse,
  IssueTitleResponse,
} from "@/app/store/useIssueStore";

export const TASK_COLORS = [
  { color: "var(--task-blue)" },
  { color: "var(--task-teal)" },
  { color: "var(--task-violet)" },
  { color: "var(--task-amber)" },
  { color: "var(--task-rose)" },
  { color: "var(--task-sky)" },
];

export interface TimelineTaskRowProps {
  rowIdx: number;
  assignedTasks: {
    issue: IssueTitleResponse;
    row: number;
    segment: { startIdx: number; endIdx: number };
  }[];
  colWidthPct: number;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
}

export interface TimelineHeaderProps {
  viewDate: Date;
  isMobile: boolean;
  onPrev: () => void;
  onNext: () => void;
  goToToday: () => void;
}

export interface IssueSidebarProps {
  getActivity: (
    issueId: number | null,
    newPage: number,
  ) => Promise<ActivityResponse[]>;
  expandedId: number | null;
  activeIssue: IssueTitleResponse | null;
  onClose: () => void;
}

export interface MainTimelineProps {
  projectId?: number;
  getActivity: (
    issueId: number | null,
    newPage: number,
  ) => Promise<ActivityResponse[]>;
  getMonthlyIssue: (
    projectId: number | undefined,
    startDate: string,
    endDate: string,
  ) => Promise<IssueTitleResponse[]>;
}

export interface Milestone {
  id: string;
  title: string;
  startDate: string; // "2026-04-05"
  endDate: string; // "2026-04-12"
  logs: { text: string; time: string }[];
}

export const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export interface TimelineGridHeaderProps {
  visibleDays: Date[];
  colWidthPct: number;
  today: Date;
}
