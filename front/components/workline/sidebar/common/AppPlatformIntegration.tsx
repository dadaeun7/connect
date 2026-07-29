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
  const [gitRepoShow, setGitRepoShow] = useState(false);
  const [gitBranchShow, setGitBranchShow] = useState(false);
  const [notionDbShow, setNotionDbShow] = useState(false);

  // 💡 가이드라인 준수: 값이 아직 할당되지 않은 (신규 등록) 모드 일때만 첫 번째 배열 인덱스로 자동 초기화 지정
  useEffect(() => {
    if (githubRepo.length > 0 && !curGitRepo) {
      const current = githubRepo.find((r) => r.full_name === selectedRepo);
      if (current) {
        setCurGitRepo(current);
        setGitRepoShow(true);
        setGitBranchShow(true);
      }
    }
  }, [githubRepo]);

  useEffect(() => {
    if (githubBranch.length > 0 && !curGitBranch) {
      setCurGitBranch(githubBranch[0]);
    }
  }, [curGitBranch, curGitRepo]);

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
