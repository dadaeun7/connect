"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface TimelineHeaderProps {
  viewDate: Date;
  goMonth: (delta: number) => void;
  goToToday: () => void;
}

export default function TimelineHeader({
  viewDate,
  goMonth,
  goToToday,
}: TimelineHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight font-mono flex items-center">
          {MONTH_NAMES[viewDate.getMonth()]}&nbsp;
          <span className="text-[var(--muted-foreground)] font-bold ml-1.5 text-lg sm:text-xl">
            {viewDate.getFullYear()}
          </span>
        </h2>
        <p className="text-xs sm:text-s font-semibold text-[var(--muted-foreground)] tracking-wide mt-0.5">
          작업을 클릭하여 연결된 외부 서비스 히스토리를 전체적으로 확인합니다.
        </p>
      </div>

      <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 shadow-sm gap-0.5">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          오늘
        </button>
        <button
          type="button"
          onClick={() => goMonth(1)}
          className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
