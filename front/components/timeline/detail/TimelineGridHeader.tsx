import React from "react";
import { DAY_NAMES, TimelineGridHeaderProps } from "../types/timeline";

export default function TimelineGridHeader({
  visibleDays,
  colWidthPct,
  today,
}: Readonly<TimelineGridHeaderProps>) {
  return (
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
            className={`relative flex-shrink-0 h-14 flex flex-col items-center justify-center text-sm border-r transition-colors ${
              isMonthBoundary ? "border-l-2 border-l-[var(--border)]" : ""
            } ${
              isToday
                ? "bg-[var(--foreground)] border-r-[var(--foreground)]/20"
                : isWeekend
                  ? "bg-[var(--muted)]/60 border-r-[var(--border)]/30"
                  : "border-r-[var(--border)]/30"
            }`}
          >
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
  );
}
