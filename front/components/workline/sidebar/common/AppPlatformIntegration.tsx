"use client";

import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/app/project/[projectId]/workline/page";
import React, { useEffect, useState } from "react";
import NotionInput from "../inputs/NotionInput";
import FigmaInput from "../inputs/FigmaInput";
import GithubInput from "../inputs/GihubInput";
import { IssueViewResponse } from "@/app/store/useIssueStore";
import { useAppPlatformIntegration } from "../../hooks/useAppPlatformIntegration";

interface PlatformProps {
  activeIssue?: IssueViewResponse;
  githubRepo: GithubRepo[];
  githubBranch: GithubBranch[];
  selectedRepo: string;
  setSelectedRepo: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  notionLoading?: boolean;
  figmaFileUrl: string;
  figmaState: FigmaState | undefined;
  setFigmaState: (s: FigmaState) => void;
  setFigmaFileUrl: (v: string) => void;
  notionDbs: NotionList[];
  curGitRepo: GithubRepo | null;
  curGitBranch: GithubBranch | null;
  setCurGitRepo: React.Dispatch<React.SetStateAction<GithubRepo | null>>;
  setCurGitBranch: React.Dispatch<React.SetStateAction<GithubBranch | null>>;
  curNotionDb: NotionList | null;
  setCurNotionDb: React.Dispatch<React.SetStateAction<NotionList | null>>;
  getFigmaState: (url: string) => Promise<FigmaState>;
}

export default function AppPlatformIntegration({
  activeIssue,
  githubRepo,
  githubBranch,
  selectedRepo,
  setSelectedRepo,
  loading,
  notionLoading,
  figmaFileUrl,
  figmaState,
  setFigmaState,
  setFigmaFileUrl,
  notionDbs,
  curGitRepo,
  curGitBranch,
  setCurGitRepo,
  setCurGitBranch,
  curNotionDb,
  setCurNotionDb,
  getFigmaState,
}: Readonly<PlatformProps>) {
  const {
    gitRepoShow,
    setGitRepoShow,
    gitBranchShow,
    setGitBranchShow,
    notionDbShow,
    setNotionDbShow,
  } = useAppPlatformIntegration(
    githubRepo,
    curGitRepo,
    selectedRepo,
    setCurGitRepo,
    githubBranch,
    curGitBranch,
    setCurGitBranch,
  );

  return (
    <div>
      <div className="space-y-9 text-sm">
        <GithubInput
          githubRepo={githubRepo}
          githubBranch={githubBranch}
          setSelectedRepo={setSelectedRepo}
          loading={loading}
          gitRepoShow={gitRepoShow}
          setGitRepoShow={setGitRepoShow}
          gitBranchShow={gitBranchShow}
          setGitBranchShow={setGitBranchShow}
          curGitRepo={curGitRepo}
          curGitBranch={curGitBranch}
          setCurGitRepo={setCurGitRepo}
          setCurGitBranch={setCurGitBranch}
        />
        <FigmaInput
          figmaFileUrl={figmaFileUrl}
          figmaState={figmaState}
          setFigmaState={setFigmaState}
          setFigmaFileUrl={setFigmaFileUrl}
          getFigmaState={getFigmaState}
        />
        <NotionInput
          activeIssue={activeIssue}
          notionDbs={notionDbs}
          notionDbShow={notionDbShow}
          setNotionDbShow={setNotionDbShow}
          curNotionDb={curNotionDb}
          setCurNotionDb={setCurNotionDb}
          notionLoading={notionLoading}
        />
      </div>
    </div>
  );
}
