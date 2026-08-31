"use client";

import React from "react";
import { TimelineTaskRow } from "./detail/TimelinTaskRow";
import TimelineHeader from "./detail/TimelineHeader";
import IssueSidebar from "./detail/IssueSidebar";
import TimelineGridHeader from "./detail/TimelineGridHeader";
import { MainTimelineProps } from "./types/timeline";
import { useMainTimeLine } from "./hooks/useMainTimeLine";

export default function MainTimeLine({
  getActivity,
  getMonthlyIssue,
}: Readonly<MainTimelineProps>) {
  const {
    displayDate,
    isMobile,
    handlePrev,
    handleNext,
    handleToday,
    expandedId,
    activeIssue,
    setExpandedId,
    visibleDays,
    colWidthPct,
    today,
    maxRow,
    isFetching,
    monthlyIssue,
    assignedTasks,
  } = useMainTimeLine({ getActivity, getMonthlyIssue });
  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-3 sm:p-8 text-[var(--foreground)] animate-in fade-in duration-300">
      <TimelineHeader
        viewDate={displayDate}
        isMobile={isMobile}
        onPrev={handlePrev}
        onNext={handleNext}
        goToToday={handleToday}
      />

      <IssueSidebar
        getActivity={getActivity}
        expandedId={expandedId}
        activeIssue={activeIssue}
        onClose={() => setExpandedId(null)}
      />

      <div className="border border-[var(--border)] rounded-2xl bg-[var(--card)] shadow-sm overflow-hidden">
        <div className="w-full relative">
          <TimelineGridHeader
            visibleDays={visibleDays}
            colWidthPct={colWidthPct}
            today={today}
          />

          <div
            className="relative w-full"
            style={{ minHeight: `${Math.max(1, maxRow + 1) * 56 + 32}px` }}
          >
            <div className="relative py-4 space-y-2 w-full">
              {isFetching && monthlyIssue.length === 0 ? (
                <div className="text-center py-12 text-xs text-[var(--muted-foreground)]">
                  타임라인 연동 중...
                </div>
              ) : (
                Array.from({ length: maxRow + 1 }, (_, rowIdx) => (
                  <TimelineTaskRow
                    key={rowIdx}
                    rowIdx={rowIdx}
                    assignedTasks={assignedTasks}
                    colWidthPct={colWidthPct}
                    expandedId={expandedId}
                    onToggleExpand={setExpandedId}
                  />
                ))
              )}

              {!isFetching && assignedTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-[var(--muted-foreground)] font-medium">
                  지정된 범위 내 작업이 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
