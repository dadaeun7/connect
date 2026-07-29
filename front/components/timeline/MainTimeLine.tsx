"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  ActivityResponse,
  IssueTitleResponse,
} from "@/app/store/useIssueStore";
import { TimelineTaskRow } from "./detail/TimelinTaskRow";
import TimelineHeader from "./detail/TimelineHeader";
import IssueSidebar from "./detail/IssueSidebar";
import TimelineGridHeader from "./detail/TimelineGridHeader";
import { useProjectStore } from "@/app/store/useProjectStore";
import { getMonthRange } from "../share/UtilFun";

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildVisibleDays(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function getTaskSegment(issue: IssueTitleResponse, visibleDays: Date[]) {
  if (visibleDays.length === 0 || !issue.dueDate || !issue.createdAt)
    return null;

  const taskEnd = new Date(issue.dueDate);
  const taskStart = new Date(issue.createdAt);

  const rangeStart = new Date(visibleDays[0]);
  const rangeEnd = new Date(visibleDays[visibleDays.length - 1]);

  if (isNaN(taskEnd.getTime()) || isNaN(taskStart.getTime())) {
    return null;
  }

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

function assignRows(issues: IssueTitleResponse[], visibleDays: Date[]) {
  const result: {
    issue: IssueTitleResponse;
    row: number;
    segment: NonNullable<ReturnType<typeof getTaskSegment>>;
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
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isFetching, setIsFetching] = useState(false);
  const { currentProject } = useProjectStore();
  const [monthlyIssue, setMonthlyIssue] = useState<IssueTitleResponse[]>([]);

  const visibleDays = useMemo(() => buildVisibleDays(viewDate), [viewDate]);
  const colWidthPct = useMemo(() => 100 / visibleDays.length, [visibleDays]);

  const assignedTasks = useMemo(
    () => assignRows(monthlyIssue, visibleDays),
    [monthlyIssue, visibleDays],
  );
  const maxRow = useMemo(
    () => assignedTasks.reduce((m, t) => Math.max(m, t.row), -1),
    [assignedTasks],
  );

  const goToToday = useCallback(() => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

  const goMonth = useCallback((delta: number) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }, []);

  const handleToggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const activeIssue = useMemo(
    () => monthlyIssue.find((t) => t.id === expandedId) || null,
    [expandedId, monthlyIssue],
  );

  const settingMonthlyIssue = useCallback(
    async (projectId: number, startDate: string, endDate: string) => {
      setIsFetching(true);
      try {
        const data = await getMonthlyIssue(projectId, startDate, endDate);

        if (data === undefined) return [];

        setMonthlyIssue((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewData = data.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewData];
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    },
    [currentProject?.id, viewDate],
  );

  useEffect(() => {
    if (!currentProject?.id) return;

    const { startDate, endDate } = getMonthRange(viewDate);
    settingMonthlyIssue(currentProject.id, startDate, endDate);
  }, [viewDate, currentProject?.id]);

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] animate-in fade-in duration-300">
      <TimelineHeader
        viewDate={viewDate}
        goMonth={goMonth}
        goToToday={goToToday}
      />

      <IssueSidebar
        getActivity={getActivity}
        expandedId={expandedId}
        activeIssue={activeIssue}
        onClose={() => setExpandedId(null)}
      />

      <div
        className="border border-[var(--border)] rounded-2xl bg-[var(--card)] shadow-sm overflow-hidden"
        ref={scrollRef}
      >
        <div className="w-full relative">
          <TimelineGridHeader
            visibleDays={visibleDays}
            colWidthPct={colWidthPct}
            today={today}
          />

          <div
            className="relative w-full"
            style={{ minHeight: `${(maxRow + 1) * 60 + 32}px` }}
          >
            <div className="relative p-4 space-y-2 w-full">
              {isFetching ? (
                <div className="text-center py-12 text-xs text-[var(--muted-foreground)]">
                  타임라인 팩트 연동 중...
                </div>
              ) : (
                Array.from({ length: maxRow + 1 }, (_, rowIdx) => (
                  <TimelineTaskRow
                    key={rowIdx}
                    rowIdx={rowIdx}
                    assignedTasks={assignedTasks}
                    colWidthPct={colWidthPct}
                    expandedId={expandedId}
                    onToggleExpand={handleToggleExpand}
                  />
                ))
              )}

              {!isFetching && assignedTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-[var(--muted-foreground)] font-medium">
                  이번 달 범위에 지정된 마감 이슈가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
