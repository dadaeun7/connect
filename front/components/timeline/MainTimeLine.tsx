"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useMemo, useRef, useCallback } from "react";

// ─── Task 팔레트 ──────────────────────────────────────────────────────────
const TASK_COLORS = [
  { color: "var(--task-blue)" },
  { color: "var(--task-teal)" },
  { color: "var(--task-violet)" },
  { color: "var(--task-amber)" },
  { color: "var(--task-rose)" },
  { color: "var(--task-sky)" },
];

// ─── 상태 / 우선순위 컬러 ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { color: string }> = {
  "In Progress": {
    color: "var(--status-inprogress)",
  },
  Done: { color: "var(--status-done)" },
  Blocked: { color: "var(--status-blocked)" },
  Review: { color: "var(--status-review)" },
  Todo: { color: "var(--status-todo)" },
};

const PRIORITY_STYLES: Record<string, { color: string }> = {
  High: { color: "var(--task-rose)" },
  Medium: { color: "var(--task-amber)" },
  Low: { color: "var(--task-teal)" },
};
interface AssetEvent {
  id: number;
  text: string;
  time: string;
  service?: "github" | "figma" | "notion" | "slack";
}

interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: keyof typeof STATUS_STYLES;
  priority: keyof typeof PRIORITY_STYLES;
  colorIndex?: number;
  assets?: AssetEvent[];
}

const SERVICE_COLORS: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  github: {
    color: "var(--github-text)",
    bg: "var(--github-bg)",
    border: "var(--github-border)",
  },
  figma: {
    color: "var(--figma-text)",
    bg: "var(--figma-bg)",
    border: "var(--figma-border)",
  },
  notion: {
    color: "var(--notion-text)",
    bg: "var(--notion-bg)",
    border: "var(--notion-border)",
  },
  slack: {
    color: "var(--slack-text)",
    bg: "var(--slack-bg)",
    border: "var(--slack-border)",
  },
};

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

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

function getTaskSegment(task: Task, visibleDays: Date[]) {
  if (visibleDays.length === 0) return null;
  const taskStart = parseDate(task.startDate);
  const taskEnd = parseDate(task.endDate);
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

  return {
    startIdx,
    endIdx,
    isStart: taskStart >= rangeStart,
    isEnd: taskEnd <= rangeEnd,
  };
}

function assignRows(tasks: Task[], visibleDays: Date[]) {
  const result: {
    task: Task;
    row: number;
    segment: NonNullable<ReturnType<typeof getTaskSegment>>;
  }[] = [];
  const rowEnds: number[] = [];

  for (const task of tasks) {
    const segment = getTaskSegment(task, visibleDays);
    if (!segment) continue;

    let rowIndex = rowEnds.findIndex((end) => end < segment.startIdx);
    if (rowIndex === -1) {
      rowIndex = rowEnds.length;
      rowEnds.push(segment.endIdx);
    } else {
      rowEnds[rowIndex] = segment.endIdx;
    }

    result.push({ task, row: rowIndex, segment });
  }
  return result;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: "t1",
    title: "인프라 코어 파이프라인 동기화 모듈",
    startDate: "2026-06-05",
    endDate: "2026-06-18",
    status: "In Progress",
    priority: "High",
    colorIndex: 0,
    assets: [
      {
        id: 1,
        text: "CI/CD 파이프라인 설정 완료",
        time: "2026-06-07 10:12",
        service: "github",
      },
      {
        id: 2,
        text: "Docker 컴포즈 환경 구성 문서",
        time: "2026-06-09 14:33",
        service: "notion",
      },
    ],
  },
  {
    id: "t2",
    title: "외부 연동 API 동기화 엔진 리팩토링",
    startDate: "2026-06-10",
    endDate: "2026-07-05",
    status: "In Progress",
    priority: "High",
    colorIndex: 1,
    assets: [
      {
        id: 1,
        text: "Slack Webhook 서명 검증 패치",
        time: "2026-06-12 14:23",
        service: "slack",
      },
      {
        id: 2,
        text: "Figma 파일 엔드포인트 변경 핸들링",
        time: "2026-06-15 15:40",
        service: "figma",
      },
    ],
  },
  {
    id: "t3",
    title: "노션 DB 스키마 마이그레이션",
    startDate: "2026-05-28",
    endDate: "2026-06-08",
    status: "Review",
    priority: "Medium",
    colorIndex: 2,
    assets: [
      {
        id: 1,
        text: "스키마 변경 명세 문서화",
        time: "2026-06-02 11:00",
        service: "notion",
      },
    ],
  },
  {
    id: "t4",
    title: "Slack 알림 배치 스케줄러",
    startDate: "2026-06-20",
    endDate: "2026-06-30",
    status: "Todo",
    priority: "Medium",
    colorIndex: 3,
  },
  {
    id: "t5",
    title: "디자인 시스템 컴포넌트 정리",
    startDate: "2026-06-01",
    endDate: "2026-06-12",
    status: "Done",
    priority: "Low",
    colorIndex: 4,
    assets: [
      {
        id: 1,
        text: "컴포넌트 라이브러리 업데이트",
        time: "2026-06-10 09:15",
        service: "figma",
      },
    ],
  },
  {
    id: "t6",
    title: "성능 모니터링 대시보드 구축",
    startDate: "2026-06-22",
    endDate: "2026-07-10",
    status: "Blocked",
    priority: "High",
    colorIndex: 5,
  },
];

const MONTH_NAMES = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export default function IntegratedFluidTimeline() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleDays = useMemo(() => buildVisibleDays(viewDate), [viewDate]);
  const colWidthPct = 100 / visibleDays.length;

  const assignedTasks = useMemo(
    () => assignRows(SAMPLE_TASKS, visibleDays),
    [visibleDays],
  );
  const maxRow = assignedTasks.reduce((m, t) => Math.max(m, t.row), -1);

  const goToToday = useCallback(() => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

  const goMonth = (delta: number) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  const activeTask = useMemo(
    () => SAMPLE_TASKS.find((t) => t.id === expandedId),
    [expandedId],
  );
  const activeTaskColor = activeTask
    ? TASK_COLORS[activeTask.colorIndex ?? 0]
    : null;

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)]">
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight font-mono">
            {MONTH_NAMES[viewDate.getMonth()]}&nbsp;
            <span className="text-[var(--muted-foreground)] font-bold">
              {viewDate.getFullYear()}
            </span>
          </h2>
          <p className="text-sm font-semibold text-[var(--muted-foreground)] tracking-wide mt-1">
            워크스페이스 각 노드에서 동기화된 일정을 타임라인으로 제어합니다
          </p>
        </div>

        <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 shadow-sm gap-0.5">
          <button
            onClick={() => goMonth(-1)}
            className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors border-x border-[var(--border)]/60"
          >
            Today
          </button>
          <button
            onClick={() => goMonth(1)}
            className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 우측 슬라이드 인 사이드바 */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${expandedId ? "visible" : "invisible pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${expandedId ? "opacity-100" : "opacity-0"}`}
          onClick={() => setExpandedId(null)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-[var(--card)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out transform ${expandedId ? "translate-x-0" : "translate-x-full"}`}
        >
          {activeTask && activeTaskColor && (
            <div className="h-full flex flex-col">
              <div className="p-5 border-b border-[var(--border)] relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandedId(null);
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-[var(--muted)] text-[var(--muted-foreground)] rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: activeTaskColor.color }}
                  />
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">
                    {activeTask.startDate} → {activeTask.endDate}
                  </span>
                </div>
                <h3 className="text-base font-black text-[var(--foreground)] pr-8 leading-snug">
                  {activeTask.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-3">
                  <span
                    className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded border"
                    style={{
                      color: STATUS_STYLES[activeTask.status].color,
                      background: `color-mix(in srgb, ${STATUS_STYLES[activeTask.status].color} 15%, transparent)`,
                      borderColor: `color-mix(in srgb, ${STATUS_STYLES[activeTask.status].color} 30%, transparent)`,
                    }}
                  >
                    {activeTask.status}
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded border"
                    style={{
                      color: PRIORITY_STYLES[activeTask.priority].color,
                      background: `color-mix(in srgb, ${PRIORITY_STYLES[activeTask.priority].color} 15%, transparent)`,
                      borderColor: `color-mix(in srgb, ${PRIORITY_STYLES[activeTask.priority].color} 30%, transparent)`,
                    }}
                  >
                    {activeTask.priority}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1 px-1">
                  연동 데이터 자산 (Assets)
                </span>
                {activeTask.assets && activeTask.assets.length > 0 ? (
                  activeTask.assets.map((asset) => {
                    const svc = asset.service
                      ? SERVICE_COLORS[asset.service]
                      : null;
                    return (
                      <div
                        key={asset.id}
                        className="flex flex-col p-3.5 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] hover:border-[var(--muted-foreground)]/20 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          {svc && asset.service && (
                            <span
                              className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded border"
                              style={{
                                color: svc.color,
                                background: svc.bg,
                                borderColor: svc.border,
                              }}
                            >
                              {asset.service}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-[var(--muted-foreground)]/60">
                            {asset.time}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[var(--foreground)]/90 leading-relaxed">
                          {asset.text}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-[var(--muted-foreground)] font-medium">
                    연결된 데이터 자산 내역이 존재하지 않습니다
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 타임라인 본체 */}
      <div
        className="border border-[var(--border)] rounded-2xl bg-[var(--card)] shadow-sm overflow-hidden"
        ref={scrollRef}
      >
        <div className="w-full relative">
          {/* 날짜 헤더 */}
          <div className="flex w-full border-b border-[var(--border)] bg-[var(--muted)]/40 sticky top-0 z-30 backdrop-blur-md">
            {visibleDays.map((d, idx) => {
              const isToday =
                d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear();
              const isMonthBoundary = d.getDate() === 1 && idx !== 0;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;

              return (
                <div
                  key={idx}
                  style={{ width: `${colWidthPct}%` }}
                  className={`relative flex-shrink-0 h-14 flex flex-col items-center justify-center text-sm border-r transition-colors ${isMonthBoundary ? "border-l-2 border-l-[var(--border)]" : ""} ${isToday ? "bg-[var(--foreground)] border-r-[var(--foreground)]/20" : isWeekend ? "bg-[var(--muted)]/60 border-r-[var(--border)]/30" : "border-r-[var(--border)]/30"}`}
                >
                  {isMonthBoundary && (
                    <span className="absolute top-0.5 left-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]/60 whitespace-nowrap">
                      {MONTH_NAMES[d.getMonth()]}
                    </span>
                  )}
                  <span
                    className={`font-mono font-bold leading-none text-sm ${isToday ? "text-[var(--background)]" : isWeekend ? "text-[var(--muted-foreground)]/50" : "text-[var(--muted-foreground)]/80"}`}
                  >
                    {String(d.getDate()).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-0.5 ${isToday ? "text-[var(--background)]/70" : "text-[var(--muted-foreground)]/40"}`}
                  >
                    {DAY_NAMES[d.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 그리드 + Task 바 */}
          <div
            className="relative w-full"
            style={{ minHeight: `${(maxRow + 1) * 60 + 32}px` }}
          >
            <div className="absolute inset-0 flex w-full pointer-events-none">
              {visibleDays.map((d, idx) => {
                const isToday =
                  d.getDate() === today.getDate() &&
                  d.getMonth() === today.getMonth() &&
                  d.getFullYear() === today.getFullYear();
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isMonthBoundary = d.getDate() === 1 && idx !== 0;
                return (
                  <div
                    key={idx}
                    style={{ width: `${colWidthPct}%` }}
                    className={`h-full shrink-0 border-r transition-colors ${isMonthBoundary ? "border-l-2 border-l-[var(--border)]/60" : ""} ${isToday ? "bg-[var(--foreground)]/[0.025] border-r-[var(--foreground)]/10" : isWeekend ? "bg-[var(--muted)]/30 border-r-[var(--border)]/20" : "border-r-[var(--border)]/20"}`}
                  />
                );
              })}
            </div>

            <div className="relative p-4 space-y-2 w-full">
              {Array.from({ length: maxRow + 1 }, (_, rowIdx) => (
                <div key={rowIdx} className="relative h-[48px] w-full">
                  {assignedTasks
                    .filter((t) => t.row === rowIdx)
                    .map(({ task, segment }) => {
                      const taskColor = TASK_COLORS[task.colorIndex ?? 0];
                      const leftPct = segment.startIdx * colWidthPct;
                      const widthPct =
                        (segment.endIdx - segment.startIdx + 1) * colWidthPct;
                      const isExpanded = expandedId === task.id;
                      const statusStyle = STATUS_STYLES[task.status];
                      const priorityStyle = PRIORITY_STYLES[task.priority];

                      const borderRadius = [
                        segment.isStart ? "8px" : "0px",
                        segment.isEnd ? "8px" : "0px",
                        segment.isEnd ? "8px" : "0px",
                        segment.isStart ? "8px" : "0px",
                      ].join(" ");

                      return (
                        <div
                          key={task.id}
                          className="absolute top-0 h-full"
                          style={{
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            zIndex: isExpanded ? 20 : 10,
                          }}
                        >
                          {/* 연속 마커 점선 처리 */}
                          {!segment.isStart && (
                            <div
                              className="absolute left-0 top-0 h-full w-2 pointer-events-none"
                              style={{
                                background: `repeating-linear-gradient(90deg, ${taskColor.color}40 0px, ${taskColor.color}40 4px, transparent 4px, transparent 8px)`,
                              }}
                            />
                          )}
                          {!segment.isEnd && (
                            <div
                              className="absolute right-0 top-0 h-full w-2 pointer-events-none"
                              style={{
                                background: `repeating-linear-gradient(90deg, transparent 0px, transparent 4px, ${taskColor.color}40 4px, ${taskColor.color}40 8px)`,
                              }}
                            />
                          )}

                          <button
                            type="button"
                            className="w-full h-full flex items-center px-3.5 gap-3 bg-[var(--secondary-foreground)]/8 hover:bg-[var(--secondary-foreground)]/20 text-[var(--foreground)] border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer text-left overflow-hidden"
                            style={{
                              borderRadius,
                              boxShadow: isExpanded
                                ? `0 0 0 2px ${taskColor.color}25, 0 4px 12px rgba(0,0,0,0.05)`
                                : undefined,
                            }}
                            onClick={() =>
                              setExpandedId(isExpanded ? null : task.id)
                            }
                          >
                            <span className="text-[13px] font-semibold tracking-tight truncate leading-none text-[var(--sidebar-foreground)]/80">
                              {!segment.isStart && "← "}
                              {task.title}
                              {!segment.isEnd && " →"}
                            </span>

                            {/* 상태 배지 - 명도/채도를 완벽하게 가다듬은 color-mix 스크립트 */}
                            <span
                              className="text-[11px] font-semibold tracking-wide ml-auto shrink-0 px-2 py-0.5 rounded border"
                              style={{
                                color: statusStyle.color,
                                background: `color-mix(in srgb, ${statusStyle.color} 12%, transparent)`,
                                borderColor: `color-mix(in srgb, ${statusStyle.color} 25%, transparent)`,
                              }}
                            >
                              {task.status}
                            </span>

                            {/* 우선순위 배지 */}
                            <span
                              className="hidden sm:inline text-[11px] font-semibold tracking-wide shrink-0 px-2 py-0.5 rounded border"
                              style={{
                                color: priorityStyle.color,
                                background: `color-mix(in srgb, ${priorityStyle.color} 12%, transparent)`,
                                borderColor: `color-mix(in srgb, ${priorityStyle.color} 25%, transparent)`,
                              }}
                            >
                              {task.priority}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              ))}

              {assignedTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-[var(--muted-foreground)] font-medium">
                  이번 달에 등록된 태스크가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 범례 디자인 싱크 정렬 */}
      <div className="mt-5 flex items-center gap-3 flex-wrap border-t border-[var(--border)] pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mr-1">
          상태 구분
        </span>
        {Object.entries(STATUS_STYLES).map(([key, val]) => (
          <span
            key={key}
            className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border"
            style={{
              color: val.color,
              background: `color-mix(in srgb, ${val.color} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${val.color} 25%, transparent)`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: val.color }}
            />
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}
