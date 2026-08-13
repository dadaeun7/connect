"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ActivityResponse,
  IssueTitleResponse,
} from "@/app/store/useIssueStore";
import { TimelineTaskRow } from "./detail/TimelinTaskRow";
import TimelineHeader from "./detail/TimelineHeader";
import IssueSidebar from "./detail/IssueSidebar";
import TimelineGridHeader from "./detail/TimelineGridHeader";
import { useProjectStore } from "@/app/store/useProjectStore";

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthDays(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d, 0, 0, 0, 0));
  }
  return days;
}

function assignRows(issues: IssueTitleResponse[], visibleDays: Date[]) {
  // 기존 assignRows 및 getTaskSegment 동일하게 유지
  const result: {
    issue: IssueTitleResponse;
    row: number;
    segment: any;
  }[] = [];
  const rowEnds: number[] = [];

  for (const issue of issues) {
    const segment = getTaskSegment(issue, visibleDays);
    if (!segment) continue;

    let rowIndex = rowEnds.findIndex((end) => end < segment.startIdx);
    if (rowIndex === -1) {
      rowIndex = rowEnds.length;
      rowEnds.push(segment.endIdx);
    } else {
      rowEnds[rowIndex] = segment.endIdx;
    }

    result.push({ issue, row: rowIndex, segment });
  }
  return result;
}

function getTaskSegment(issue: IssueTitleResponse, visibleDays: Date[]) {
  if (visibleDays.length === 0 || !issue.dueDate || !issue.createdAt)
    return null;

  const rawStart = new Date(issue.createdAt);
  const rawEnd = new Date(issue.dueDate);
  if (isNaN(rawStart.getTime()) || isNaN(rawEnd.getTime())) return null;

  let taskStart = new Date(
    rawStart.getFullYear(),
    rawStart.getMonth(),
    rawStart.getDate(),
  );
  let taskEnd = new Date(
    rawEnd.getFullYear(),
    rawEnd.getMonth(),
    rawEnd.getDate(),
  );

  if (taskStart > taskEnd) taskStart = new Date(taskEnd);

  const rangeStart = visibleDays[0];
  const rangeEnd = visibleDays[visibleDays.length - 1];

  if (taskEnd < rangeStart || taskStart > rangeEnd) return null;

  const clippedStart = taskStart < rangeStart ? rangeStart : taskStart;
  const clippedEnd = taskEnd > rangeEnd ? rangeEnd : taskEnd;

  const startIdx = visibleDays.findIndex(
    (d) => formatDateKey(d) === formatDateKey(clippedStart),
  );
  const endIdx = visibleDays.findIndex(
    (d) => formatDateKey(d) === formatDateKey(clippedEnd),
  );

  if (startIdx === -1 || endIdx === -1) return null;

  return { startIdx, endIdx };
}

interface MainTimelineProps {
  projectId?: number;
  getActivity: (
    issueId: number | null,
    newPage: number,
  ) => Promise<ActivityResponse[]>;
  getMonthlyIssue: (
    projectId: number | undefined,
    startDate: string,
    endDate: string,
  ) => Promise<IssueTitleResponse[]>;
}

export default function MainTimeLine({
  getActivity,
  getMonthlyIssue,
}: Readonly<MainTimelineProps>) {
  const today = useMemo(() => new Date(), []);

  // 모바일 화면 여부 감지 (기준: 768px)
  const [isMobile, setIsMobile] = useState(false);

  // 데스크톱 전용 기준 월 state
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // 모바일 전용 기준 시작일 state (7일 단위 창)
  const [mobileStartDate, setMobileStartDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { currentProject } = useProjectStore();
  const [monthlyIssue, setMonthlyIssue] = useState<IssueTitleResponse[]>([]);

  // 화면 리사이즈 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleDays = useMemo(() => {
    if (isMobile) {
      const days: Date[] = [];
      const start = new Date(mobileStartDate);
      start.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }
      return days;
    } else {
      return buildMonthDays(viewDate);
    }
  }, [isMobile, mobileStartDate, viewDate]);

  const colWidthPct = useMemo(() => 100 / visibleDays.length, [visibleDays]);

  const assignedTasks = useMemo(
    () => assignRows(monthlyIssue, visibleDays),
    [monthlyIssue, visibleDays],
  );
  const maxRow = useMemo(
    () => assignedTasks.reduce((m, t) => Math.max(m, t.row), -1),
    [assignedTasks],
  );

  const handlePrev = useCallback(() => {
    if (isMobile) {
      setMobileStartDate((prev) => {
        const next = new Date(prev);
        next.setDate(prev.getDate() - 7);
        return next;
      });
    } else {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }, [isMobile]);

  const handleNext = useCallback(() => {
    if (isMobile) {
      setMobileStartDate((prev) => {
        const next = new Date(prev);
        next.setDate(prev.getDate() + 7);
        return next;
      });
    } else {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }
  }, [isMobile]);

  const handleToday = useCallback(() => {
    const now = new Date();
    if (isMobile) {
      setMobileStartDate(
        new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      );
    } else {
      setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [isMobile]);

  const activeIssue = useMemo(
    () => monthlyIssue.find((t) => t.id === expandedId) || null,
    [expandedId, monthlyIssue],
  );

  // 이슈 데이터 조회
  const fetchIssues = useCallback(async () => {
    if (!currentProject?.id || visibleDays.length === 0) return;
    setIsFetching(true);
    try {
      const start = visibleDays[0];
      const end = visibleDays[visibleDays.length - 1];

      const fetchStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      const fetchEnd = new Date(end.getFullYear(), end.getMonth() + 2, 0);

      console.log("fetchStart:", fetchStart);
      console.log("fetchEnd:", fetchEnd);
      const data = await getMonthlyIssue(
        currentProject.id,
        formatDateKey(fetchStart),
        formatDateKey(fetchEnd),
      );

      if (data) {
        setMonthlyIssue((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const uniqueNew = data.filter((i) => !existingIds.has(i.id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [currentProject?.id, visibleDays, getMonthlyIssue]);

  useEffect(() => {
    fetchIssues();
  }, [visibleDays[0]?.getTime(), currentProject?.id]);

  const displayDate = isMobile ? visibleDays[0] || today : viewDate;

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
