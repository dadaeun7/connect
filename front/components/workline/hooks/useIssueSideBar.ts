import { useEffect, useState } from "react";
import {
  IssueDetailResponse,
  priorityId,
  statusId,
  UpdatedPayload,
  WorkIssueSidebarProps,
} from "../types/type";
import { useConfirmation } from "@/components/share/ConfirmationContext";
import { deleteIssueApi, updateIssueApi } from "../api/workline";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/types/worklineApp";

export const useIssueSideBar = ({
  getIssueDetail,
  expandedId,
  activeIssue,
  onClose,
  getGithubRepo,
  getGitBrach,
  getNotionList,
}: Omit<WorkIssueSidebarProps, "getFigmaState">) => {
  const [currentStatusId, setCurrentStatusId] = useState(
    activeIssue?.preveiw.statusCode,
  );
  const [currentPriorityId, setCurrentPriorityId] = useState(
    activeIssue?.preveiw.priorityCode,
  );
  const [dueDate, setDueDate] = useState(() => {
    if (!activeIssue?.preveiw.dueDate) return "";

    // 💡 문자열 자르기(split) 대신 Date 객체로 로컬 시차 복원 후 추출
    const date = new Date(activeIssue.preveiw.dueDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [issueDetail, setIssueDetail] = useState<IssueDetailResponse>();
  // 연동 데이터 상태 (AddIssue와 동일)
  const [githubRepo, setGithubRepo] = useState<GithubRepo[]>([]);
  const [githubBranch, setGithubBranch] = useState<GithubBranch[]>([]);
  const [notionDbs, setNotionDbs] = useState<NotionList[]>([]);
  const [curGitRepo, setCurGitRepo] = useState<GithubRepo | null>(null);
  const [curGitBranch, setCurGitBranch] = useState<GithubBranch | null>(null);
  const [curNotionDb, setCurNotionDb] = useState<NotionList | null>(null);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [figmaFileUrl, setFigmaFileUrl] = useState("");
  const [figmaState, setFigmaState] = useState<FigmaState>();
  const [loading, setLoading] = useState(false);
  const [notionLoading, setNotionLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { openConfirm } = useConfirmation();

  useEffect(() => {
    const init = async () => {
      if (!expandedId) return;

      setLoading(true);
      setNotionLoading(true);

      try {
        // 1. 이슈 상세 정보와 깃허브/노션 목록을 병렬로 동시 Fetch
        const [detailData, repo, result] = await Promise.all([
          getIssueDetail(expandedId),
          getGithubRepo(),
          getNotionList(),
        ]);

        // 2. Fetch해온 결과 목록들 state 업데이트
        let fetchedNotionDbs: typeof notionDbs = [];
        if (repo) setGithubRepo(repo);
        if (result) {
          fetchedNotionDbs = result.filter((r) => r.type === "database");
          setNotionDbs(fetchedNotionDbs);
        }

        // 3. 받아온 detailData를 직접 참조하여 state 세팅 (React 상태 지연 문제 방지)
        if (detailData) {
          setIssueDetail(detailData);

          if (detailData.githubRepoName) {
            setCurGitRepo({
              id: detailData.githubRepoId || 0,
              full_name: detailData.githubRepoName,
            });
            setGithubRepo([]);
          }

          if (detailData.githubBranch) {
            setCurGitBranch({ name: detailData.githubBranch });
            setGithubBranch([]);
          }

          if (detailData.figmaFileKey) {
            setFigmaFileUrl(detailData.figmaFileKey);
          }

          if (detailData.notionDbId) {
            // 비동기 state(notionDbs) 대신방금 가져온 fetchedNotionDbs를 참조
            const matchedDb = fetchedNotionDbs.find(
              (d) => d.id === detailData.notionDbId,
            );

            setCurNotionDb({
              id: detailData.notionDbId,
              type: "database",
              title: detailData.notionDbTitle,
              url: matchedDb?.url ?? "",
            });

            setNotionDbs([]);
          }
        } else {
          setCurGitRepo(null);
          setCurGitBranch(null);
          setCurNotionDb(null);
          setFigmaFileUrl("");
        }
      } catch (error) {
        console.error("❌ Promise.all 요청 중 에러 발생:", error);
      } finally {
        setLoading(false);
        setNotionLoading(false);
      }
    };

    init();
  }, [activeIssue, expandedId]);

  // 브랜치 Fetch는 사용자가 직접 리포지토리를 바꿀 때만 동작
  useEffect(() => {
    const fetchBranches = async () => {
      if (!curGitRepo) {
        setCurGitBranch(null);
        return;
      }
      setLoading(true);
      try {
        const branches = await getGitBrach(curGitRepo.full_name);
        setGithubBranch(branches || []);
        setCurGitBranch(branches[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [curGitRepo]);

  const handleUpdate = async () => {
    if (!activeIssue) return;

    if (
      !statusId.includes(currentStatusId) ||
      !priorityId.includes(currentPriorityId)
    ) {
      console.log(currentStatusId);
      console.log(currentPriorityId);
      alert("진행상태와 우선순위를 다시 선택해주세요");
      return;
    }

    const repoName = curGitRepo?.full_name || null;

    const payload: UpdatedPayload = {
      priorityCode: currentPriorityId,
      statusCode: currentStatusId,
      dueDate: dueDate ? `${dueDate}T18:00+09:00` : null,

      githubRepoId: repoName === null ? null : Number(curGitRepo?.id),
      githubRepoName: repoName,
      githubBranch: repoName === null ? null : curGitBranch?.name || null,

      // Figma 매핑
      figmaFileKey:
        (figmaState?.success
          ? figmaState.fileKey
          : issueDetail?.figmaFileKey) ?? null,
      figmaFileName: (figmaState?.name || issueDetail?.figmaFileName) ?? null,

      notionDbId: curNotionDb?.id || null,
      notionDbTitle: curNotionDb?.title || null,
    };

    try {
      await updateIssueApi(activeIssue.preveiw.id, payload);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const handleComplete = () => {
    openConfirm({
      message:
        "진행할 경우 이슈는 완료되고 더 이상 외부 서비스의 히스토리를 가져오지 않습니다!",
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  const handleDelete = () => {
    openConfirm({
      message:
        "진행할 경우 이슈는 삭제되고 하위 내역까지 삭제되어 복원이 어렵습니다.",
      onConfirm: () => {
        deleteIssueApi(activeIssue!.preveiw.id);
      },
      onCancel: () => {},
    });
  };

  return {
    showHistory,
    setShowHistory,
    handleDelete,
    dueDate,
    setDueDate,
    currentStatusId,
    setCurrentStatusId,
    currentPriorityId,
    setCurrentPriorityId,
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
    handleComplete,
    handleUpdate,
  };
};
