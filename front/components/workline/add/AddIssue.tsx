"use client";
import React from "react";
import StatusPrioritySelector from "../sidebar/common/StatusPrioritySelector";
import ModernInputField from "../sidebar/common/ModernInputFiled";
import AppPlatformIntegration from "../sidebar/common/AppPlatformIntegration";
import CstAlert from "@/components/share/CstAlert";
import { Tooltip } from "@/components/share/ToolTip";
import { useAddIssue } from "../hooks/useAddIssue";

export default function AddIssue({
  onClose,
  getGithubRepo,
  getGitBrach,
  getFigmaState,
  getNotionList,
}: any) {
  const {
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
  } = useAddIssue({
    onClose,
    getGithubRepo,
    getGitBrach,
    getFigmaState,
    getNotionList,
  });

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
