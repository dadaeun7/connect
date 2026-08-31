import { useCallback, useEffect, useMemo, useState } from "react";
import { MainTimelineProps } from "../types/timeline";
import {
  assignRows,
  buildMonthDays,
  formatDateKey,
} from "../utils/timelineUtils";
import { useProjectStore } from "@/app/store/useProjectStore";
import { IssueTitleResponse } from "@/components/workline/types/type";

export const useMainTimeLine = ({
  getMonthlyIssue,
}: Pick<MainTimelineProps, "getActivity" | "getMonthlyIssue">) => {
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
      const end = visibleDays.at(-1)!;

      const fetchStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      const fetchEnd = new Date(end.getFullYear(), end.getMonth() + 2, 0);

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

  return {
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
  };
};
