"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useMemo, useRef } from "react";

const COL_WIDTH = 48;

export default function IntegratedFluidTimeline() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1));
  const [expandedId, setExpandedId] = useState<string | null>("m2");
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const lastDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
    ).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [viewDate]);

  const milestones = [
    {
      id: "m1",
      title: "인프라 코어 파이프라인 동기화 모듈",
      start: 5,
      end: 12,
      status: "In Progress",
    },
    {
      id: "m2",
      title: "외부 연동 API 동기화 가동 엔진 리팩토링 검증",
      start: 9,
      end: 24,
      contents: [
        {
          id: 1,
          text: "Slack Webhook 서명 검증 가동 패치 반영 완료",
          time: "2026-04-29 14:23",
        },
        {
          id: 2,
          text: "Figma 파일 엔드포인트 변경 핸들링 감지 모듈 탑재",
          time: "2026-04-29 15:40",
        },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] font-mono">
            {viewDate.getFullYear()}.{" "}
            {String(viewDate.getMonth() + 1).padStart(2, "0")}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] font-semibold mt-1">
            워크스페이스 각 노드에서 동기화된 일정을 타임라인 매트릭스로
            제어합니다.
          </p>
        </div>

        <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-1.5 shadow-sm">
          <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="px-4 text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors border-x border-[var(--border)]/60">
            Today
          </button>
          <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar" ref={scrollRef}>
          <div
            style={{ width: `${days.length * COL_WIDTH}px` }}
            className="relative"
          >
            <div className="flex border-b border-[var(--border)] bg-[var(--muted)]/50 sticky top-0 z-30 backdrop-blur-md">
              {days.map((d) => {
                const isToday =
                  today.getDate() === d &&
                  today.getMonth() === viewDate.getMonth();
                return (
                  <div
                    key={d}
                    style={{ width: `${COL_WIDTH}px` }}
                    className={`flex-shrink-0 h-12 flex flex-col items-center justify-center text-xs border-r border-[var(--border)]/40 font-mono font-bold transition-colors
                      ${isToday ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]/80"}`}
                  >
                    <span>{String(d).padStart(2, "0")}</span>
                  </div>
                );
              })}
            </div>

            <div className="relative p-6 flex flex-col gap-4 min-h-[500px]">
              <div className="absolute inset-0 flex pointer-events-none">
                {days.map((d) => (
                  <div
                    key={d}
                    style={{ width: `${COL_WIDTH}px` }}
                    className="h-full border-r border-[var(--border)]/30 shrink-0"
                  />
                ))}
              </div>

              {milestones.map((m) => {
                const left = (m.start - 1) * COL_WIDTH;
                const width = (m.end - m.start + 1) * COL_WIDTH;
                const isExpanded = expandedId === m.id;

                return (
                  <div key={m.id} className="relative w-full">
                    <div
                      className={`relative flex flex-col border rounded-xl overflow-hidden transition-all duration-200
                        ${isExpanded ? "bg-[var(--card)] border-[var(--primary)]/50 z-20 shadow-md" : "bg-[var(--muted)]/40 border-[var(--border)]/80 z-10 hover:border-[var(--border)]"}`}
                      style={{
                        marginLeft: `${left}px`,
                        width: isExpanded ? "550px" : `${width}px`,
                        minWidth: `${width}px`,
                      }}
                    >
                      <div
                        className="h-12 flex items-center px-4 cursor-pointer justify-between relative select-none bg-[var(--card)]/40 text-sm"
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full shadow-md transition-colors ${isExpanded ? "bg-[var(--primary)] shadow-primary" : "bg-[var(--muted-foreground)]/40"}`}
                          />
                          <span
                            className={`font-bold tracking-tight truncate ${isExpanded ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
                          >
                            {m.title}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-mono transition-transform duration-200 ${isExpanded ? "rotate-180 text-[var(--primary)]" : "text-[var(--muted-foreground)]/40"}`}
                        >
                          ▼
                        </span>
                      </div>

                      {isExpanded && m.contents && (
                        <div className="bg-[var(--muted)]/20 border-t border-[var(--border)]/50 font-medium text-xs">
                          {m.contents.map((c) => (
                            <div
                              key={c.id}
                              className="flex justify-between items-center p-3.5 border-b border-[var(--border)]/30 last:border-0 hover:bg-[var(--card)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[var(--primary)] font-bold">
                                  🐙
                                </span>
                                <span className="text-[var(--foreground)]/90 font-semibold">
                                  {c.text}
                                </span>
                              </div>
                              <span className="text-xs text-[var(--muted-foreground)]/40 font-mono">
                                {c.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
