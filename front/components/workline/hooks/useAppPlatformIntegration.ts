import {
  GithubBranch,
  GithubRepo,
} from "@/app/project/[projectId]/workline/page";
import { useEffect, useState } from "react";

export const useAppPlatformIntegration = (
  githubRepo: GithubRepo[],
  curGitRepo: GithubRepo | null,
  selectedRepo: string,
  setCurGitRepo: React.Dispatch<React.SetStateAction<GithubRepo | null>>,
  githubBranch: GithubBranch[],
  curGitBranch: GithubBranch | null,
  setCurGitBranch: React.Dispatch<React.SetStateAction<GithubBranch | null>>,
) => {
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

  return {
    gitRepoShow,
    setGitRepoShow,
    gitBranchShow,
    setGitBranchShow,
    notionDbShow,
    setNotionDbShow,
  };
};
