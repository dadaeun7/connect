"use client";
import React, { useEffect, useState } from "react";
import { ProjectSimpleDto, useProjectStore } from "@/app/store/useProjectStore";
import StatusPrioritySelector from "../sidebar/common/StatusPrioritySelector";
import ModernInputField from "../sidebar/common/ModernInputFiled";
import AppPlatformIntegration from "../sidebar/common/AppPlatformIntegration";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/app/project/[projectId]/workline/page";
import CstAlert from "@/components/share/CstAlert";
import { Tooltip } from "@/components/share/ToolTip";

export default function AddIssue({
  onClose,
  getGithubRepo,
  getGitBrach,
  getFigmaState,
  getNotionList,
}: any) {
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

    const payload = {
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
    console.log("currentStatusId: ", currentStatusId);
    console.log("currentPriorityId: ", currentPriorityId);

    try {
      const response = await fetch("/issue/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("이슈 저장에 실패했습니다.");
      onClose();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-9">
      <span className="font-black text-lg">이슈 추가</span>
      <span className="ml-2 text-sm">새로운 이슈를 등록합니다.</span>
      <CstAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={alertConfig.onClose}
      />
      <div className="mt-8 space-y-9">
        <ModernInputField
          label="이슈명"
          id="issueName"
          value={issueName}
          onChange={(e) => setIssueName(e.target.value)}
        />
        <StatusPrioritySelector
          currentStatusId={currentStatusId}
          setCurrentStatusId={setCurrentStatusId}
          currentPriorityId={currentPriorityId}
          setCurrentPriorityId={setCurrentPriorityId}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ModernInputField
            type="date"
            label="마감일"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Tooltip
            content="매핑할 프로젝트를 선택하세요."
            placement="top"
            style={{
              marginLeft: "-2.3rem",
              marginTop: "2rem",
            }}
          >
            <ModernInputField
              type="text"
              label="프로젝트"
              id="project"
              placeholder={
                selectedProject ? selectedProject.name : "선택하세요"
              }
              projects={projects}
              onSelectProject={(p) => setSelectedProject(p)}
            />
          </Tooltip>
        </div>
        <AppPlatformIntegration
          githubRepo={githubRepo}
          githubBranch={githubBranch}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
          loading={loading}
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
          getFigmaState={getFigmaState}
        />
        <div className="flex items-center justify-end gap-3 pt-3 ">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-m font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-m font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            저장하기
          </button>
        </div>
      </div>
    </form>
  );
}
