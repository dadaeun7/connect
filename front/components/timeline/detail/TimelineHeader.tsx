"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimelineHeaderProps } from "../types/timeline";

export default function TimelineHeader({
  viewDate,
  isMobile,
  onPrev,
  onNext,
  goToToday,
}: Readonly<TimelineHeaderProps>) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg sm:text-2xl font-black tracking-tight font-mono flex items-center">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
          {isMobile && (
            <span className="text-xs text-[var(--muted-foreground)] ml-2 font-sans font-normal">
              (일주일)
            </span>
          )}
        </h2>
      </div>

      <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 shadow-sm gap-0.5">
        <button
          type="button"
          onClick={onPrev}
          className="p-1.5 sm:p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="px-2.5 sm:px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          오늘
        </button>
        <button
          type="button"
          onClick={onNext}
          className="p-1.5 sm:p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
