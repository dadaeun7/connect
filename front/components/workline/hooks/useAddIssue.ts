import { ProjectSimpleDto, useProjectStore } from "@/app/store/useProjectStore";
import { useEffect, useState } from "react";
import { PAYLOAD } from "../types/type";
import { issueCreate } from "../api/workline";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/types/worklineApp";

export const useAddIssue = ({
  onClose,
  getGithubRepo,
  getGitBrach,
  getNotionList,
}: any) => {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] =
    useState<ProjectSimpleDto | null>(null);
  const [issueName, setIssueName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currentStatusId, setCurrentStatusId] = useState(1);
  const [currentPriorityId, setCurrentPriorityId] = useState(6);
  const [loading, setLoading] = useState(false);
  const [githubRepo, setGithubRepo] = useState<GithubRepo[]>([]);
  const [githubBranch, setGithubBranch] = useState<GithubBranch[]>([]);
  const [curNotionDb, setCurNotionDb] = useState<NotionList | null>(null);
  const [curGitRepo, setCurGitRepo] = useState<GithubRepo | null>(null);
  const [curGitBranch, setCurGitBranch] = useState<GithubBranch | null>(null);
  const [figmaState, setFigmaState] = useState<FigmaState>();
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [figmaFileUrl, setFigmaFileUrl] = useState<string>("");
  const [notionDbs, setNotionDbs] = useState<NotionList[]>([]);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const [repo, result] = await Promise.all([
          getGithubRepo(),
          getNotionList(),
        ]);

        if (repo && Array.isArray(repo)) {
          setGithubRepo(repo);
        }

        if (result && Array.isArray(result)) {
          setNotionDbs(result.filter((r) => r.type === "database"));
        }
      } catch (error) {
        console.error("데이터 초기화 실패:", error);
      }
    };
    initFetch();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (curGitRepo === null) {
        setGithubBranch([]);
        setCurGitBranch(null);
        return;
      }
      setLoading(true);
      try {
        const branches = await getGitBrach(curGitRepo.full_name);
        setGithubBranch(branches || []);
        if (!curGitBranch && branches && branches.length > 0) {
          setCurGitBranch(branches[0]);
        }
      } catch (e) {
        console.error("브랜치 로드 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [curGitRepo]);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "인증 시간이 만료되었습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const handleSubmit = async () => {
    if (figmaFileUrl && figmaFileUrl.trim() !== "" && !figmaState?.success) {
      setAlertConfig((prop) => ({
        ...prop,
        isOpen: true,
        message: "피그마 유효성을 체크해주세요",
        type: "error",
      }));
      return;
    }
    if (!issueName) {
      setAlertConfig((prop) => ({
        ...prop,
        isOpen: true,
        message: "프로젝트 이름을 입력해주세요",
        type: "error",
      }));
      return;
    }

    if (selectedProject?.id == null) {
      setAlertConfig((prop) => ({
        ...prop,
        isOpen: true,
        message: "매핑할 프로젝트를 선택해주세요.",
        type: "error",
      }));
      return;
    }

    const payload: PAYLOAD = {
      title: issueName,
      projectId: Number(selectedProject?.id),
      statusCode: currentStatusId,
      priorityCode: currentPriorityId,
      dueDate: dueDate ? `${dueDate}T18:00:00Z` : null,
      githubRepoId: curGitRepo?.id ? Number(curGitRepo.id) : null,
      githubRepoName: curGitRepo?.full_name || null,
      githubBranch: curGitBranch?.name || null,
      figmaFileKey:
        figmaState?.url?.match(/\/file\/([a-zA-Z0-9]+)/)?.[1] || null,
      figmaFileName: figmaState?.name || null,
      notionDbId: curNotionDb?.id || null,
      notionDbTitle: curNotionDb?.title || null,
    };

    try {
      await issueCreate(payload);
      onClose();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    alertConfig,
    issueName,
    setIssueName,
    currentStatusId,
    setCurrentStatusId,
    currentPriorityId,
    setCurrentPriorityId,
    dueDate,
    setDueDate,
    selectedProject,
    projects,
    setSelectedProject,
    githubRepo,
    githubBranch,
    selectedRepo,
    setSelectedRepo,
    loading,
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
    handleSubmit,
  };
};
