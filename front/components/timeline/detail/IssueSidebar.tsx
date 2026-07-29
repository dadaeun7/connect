"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/workline/type";
import {
  ActivityResponse,
  IssueTitleResponse,
  IssueViewResponse,
} from "@/app/store/useIssueStore";

const TASK_COLORS = [
  { color: "var(--task-blue)" },
  { color: "var(--task-teal)" },
  { color: "var(--task-violet)" },
  { color: "var(--task-amber)" },
  { color: "var(--task-rose)" },
  { color: "var(--task-sky)" },
];

interface IssueSidebarProps {
  getActivity: (
    issueId: number | null,
    newPage: number,
  ) => Promise<ActivityResponse[]>;
  expandedId: number | null;
  activeIssue: IssueTitleResponse | null;
  onClose: () => void;
}

export default function IssueSidebar({
  getActivity,
  expandedId,
  activeIssue,
  onClose,
}: Readonly<IssueSidebarProps>) {
  const activeTaskColor = useMemo(() => {
    if (!activeIssue) return null;
    return TASK_COLORS[activeIssue.id % TASK_COLORS.length];
  }, [activeIssue]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityResponse[]>(
    [],
  );
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchActivityPage = useCallback(
    async (newPage: number) => {
      if (!expandedId) return;
      setIsLoading(true);

      try {
        const data = await getActivity(expandedId, newPage);

        if (data && data.length > 0) {
          console.log(data.length);
          setCurrentActivity(data);
          setCurrentPage(newPage);

          setHasNextPage(data.length === 10);
        }
      } catch (error) {
        console.error(`issue activity get page error: `, error);
      } finally {
        setIsLoading(false);
      }
    },
    [expandedId],
  );

  useEffect(() => {
    if (expandedId) {
      fetchActivityPage(0);
    }
  }, [expandedId, fetchActivityPage]);

  const handlePrevPage = () => {
    if (currentPage > 0 && !isLoading) {
      fetchActivityPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !isLoading) {
      fetchActivityPage(currentPage + 1);
    }
  };

  if (!activeIssue || !activeTaskColor) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${expandedId ? "visible" : "invisible pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${expandedId ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-[var(--card)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out transform rounded-l-xl overflow-hidden ${expandedId ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="pl-4 pt-7 pb-7 border-b border-[var(--border)] relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-[18px] ml-2 mb-2 font-bold text-[var(--foreground)] leading-snug">
              {activeIssue.title}
            </h3>
            <div className="inline-flex items-center gap-3 rounded-full bg-[var(--muted)] px-3 py-1">
              <span className="text-[12px] font-mono font-semibold text-[var(--muted-foreground)]">
                마감일.{" "}
                {activeIssue.dueDate
                  ? new Date(activeIssue.dueDate).toLocaleDateString()
                  : "미지정"}
              </span>
              <div className="mt-[0.5px] flex gap-3">
                <span
                  className="text-[11px] font-bold uppercase tracking-wide"
                  style={{
                    color: STATUS_MAP[activeIssue.statusCode]?.color,
                  }}
                >
                  {STATUS_MAP[activeIssue.statusCode]?.label}
                </span>
                <span
                  className="text-[11px] font-bold uppercase tracking-wide"
                  style={{
                    color: PRIORITY_MAP[activeIssue.priorityCode]?.color,
                  }}
                >
                  {PRIORITY_MAP[activeIssue.priorityCode]?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {currentActivity.length > 0 &&
              currentActivity.map((ca, index) => (
                <div
                  key={index}
                  className="flex flex-col px-5 py-3 bg-[var(--card)] border-b border-[var(--border)] hover:border-[var(--muted-foreground)]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--background)] bg-[var(--foreground)] px-2.5 py-[0.5px] rounded-full">
                      {ca.activityTitle}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[var(--foreground)]/80 leading-relaxed">
                    {ca.activityContent}
                    <a
                      href={ca.originUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-1.5 inline-flex items-center justify-center p-1.5 text-xs font-semibold rounded-full bg-[var(--muted)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-200 cursor-pointer text-[var(--muted-foreground)] align-middle"
                    >
                      <SquareArrowOutUpRight size={12} />
                    </a>
                  </span>
                </div>
              ))}
            {currentActivity.length <= 0 && (
              <div className="text-center py-10 text-xs text-[var(--muted-foreground)] font-medium rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30">
                연결된 앱 활동 내역이 존재하지 않습니다
              </div>
            )}
          </div>
          {/* 사이드바 하단 페이징 컨트롤 바 */}
          <div className="p-4 flex items-center justify-between bg-[var(--card)]">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isLoading}
              className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} /> 이전
            </button>

            <span className="text-xs font-mono font-bold text-[var(--muted-foreground)] bg-[var(--muted)] rounded-full px-3 py-1.5">
              Page {currentPage + 1}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={!hasNextPage || isLoading}
              className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
            >
              다음 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
