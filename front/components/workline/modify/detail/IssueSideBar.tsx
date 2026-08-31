"use client";

import React from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import IssueHistoryLine from "./IssueHistoryLine";
import AppPlatformIntegration from "../../sidebar/common/AppPlatformIntegration";
import ModernInputField from "../../sidebar/common/ModernInputFiled";
import { Tooltip } from "@/components/share/ToolTip";
import { WorkIssueSidebarProps } from "../../types/type";
import { useIssueSideBar } from "../../hooks/useIssueSideBar";
import StatusPrioritySelector from "../../sidebar/common/StatusPrioritySelector";

export default function IssueSideBar(props: Readonly<WorkIssueSidebarProps>) {
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

  const {
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
  } = useIssueSideBar({
    getIssueDetail,
    expandedId,
    activeIssue,
    onClose,
    getGithubRepo,
    getGitBrach,
    getNotionList,
  });

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
                    type="button"
                    onClick={handleDelete}
                    className="p-2 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    type="button"
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
