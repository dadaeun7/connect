export interface NewIssue {
  id: number;
  matchKeyword: string;
  status: string;
  createdAt: string;
  originalMessage: string;
  slackUrl: string;
  detectedMessage: string;
}

export interface IssueAllList {
  id: number;
  title: string;
}

export type MenuKey = "전체" | "OPEN" | "MERGE";
