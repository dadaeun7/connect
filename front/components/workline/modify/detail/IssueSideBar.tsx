"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import {
  IssueDetailResponse,
  IssueViewResponse,
  UpdatedPayload,
  useIssueStore,
} from "@/app/store/useIssueStore";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/app/project/[projectId]/workline/page";
import IssueHistoryLine from "./IssueHistoryLine";
import AppPlatformIntegration from "../../sidebar/common/AppPlatformIntegration";
import StatusPrioritySelector, {
  priorityId,
  statusId,
} from "../../sidebar/common/StatusPrioritySelector";
import ModernInputField from "../../sidebar/common/ModernInputFiled";
import { Tooltip } from "@/components/share/ToolTip";
import { useConfirmation } from "@/components/share/ConfirmationContext";

interface IssueSidebarProps {
  expandedId: number | null;
  activeIssue: IssueViewResponse;
  onClose: () => void;
  getGithubRepo: () => Promise<GithubRepo[]>;
  getGitBrach: (repo: string) => Promise<GithubBranch[]>;
  getFigmaState: (url: string) => Promise<FigmaState>;
  getNotionList: () => Promise<NotionList[]>;
  getIssueDetail: (issueId: number | null) => Promise<any>;
}

export default function IssueSideBar(props: IssueSidebarProps) {
  const {
    getIssueDetail,
    expandedId,
    activeIssue,
    onClose,
    getGithubRepo,
    getGitBrach,
    getFigmaState,
    getNotionList,
  } = props;
  const { updateIssue, deleteIssue } = useIssueStore();

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
      await updateIssue(activeIssue.preveiw.id, payload);
      onClose();
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
        deleteIssue(activeIssue!.preveiw.id);
      },
      onCancel: () => {},
    });
  };
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--card)] h-full overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {showHistory ? (
          <IssueHistoryLine
            setShowHistory={setShowHistory}
            showHistory={showHistory}
            issueId={activeIssue.preveiw.id}
          />
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <h2 className="text-xl font-bold">이슈 수정</h2>
                  <Tooltip
                    content="해당 이슈의 수정 내역을 볼 수 있습니다."
                    placement="bottom"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowHistory(true);
                      }}
                      className="flex ml-3 mt-[4px] text-[13px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      수정 내역
                      <ChevronDown size={13} className="mt-1 ml-1.5" />
                    </button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {/* 삭제 버튼 */}
                  <button
                    onClick={handleDelete}
                    className="p-2 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 item-center">
                <div className="col-span-3">
                  <span className="flex gap-1 text-[12px] font-black text-[var(--sidebar-foreground)]/50 tracking-wider ml-1 mb-1">
                    이슈명
                  </span>
                  <div
                    className="relative w-full flex items-center justify-between border border-[var(--border)] rounded-lg 
              px-3 py-[11.5px] text-[12px] text-[var(--sidebar-foreground)]/70 bg-[var(--background)] 
              focus:outline-none focus:border-[var(--primary)] font-medium"
                  >
                    {activeIssue?.preveiw.title}
                  </div>
                </div>

                <div className="col-span-2">
                  <ModernInputField
                    type="date"
                    label="마감일"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 mb-9 space-y-9">
              <StatusPrioritySelector
                currentStatusId={currentStatusId}
                setCurrentStatusId={setCurrentStatusId}
                currentPriorityId={currentPriorityId}
                setCurrentPriorityId={setCurrentPriorityId}
              />
            </div>
            <AppPlatformIntegration
              {...props}
              githubRepo={githubRepo}
              githubBranch={githubBranch}
              selectedRepo={selectedRepo}
              setSelectedRepo={setSelectedRepo}
              loading={loading}
              notionLoading={notionLoading}
              getFigmaState={getFigmaState}
              figmaFileUrl={figmaFileUrl}
              figmaState={figmaState}
              setFigmaState={setFigmaState}
              setFigmaFileUrl={setFigmaFileUrl}
              notionDbs={notionDbs}
              curGitRepo={curGitRepo}
              curGitBranch={curGitBranch}
              setCurGitRepo={setCurGitRepo}
              setCurGitBranch={setCurGitBranch}
              curNotionDb={curNotionDb}
              setCurNotionDb={setCurNotionDb}
            />
            <div className="flex items-center justify-end w-full mt-12 gap-3">
              <button
                type="button"
                onClick={handleComplete}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-[13px] font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                이슈 완료하기
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-[13px] font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                수정하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
