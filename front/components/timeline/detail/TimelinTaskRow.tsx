"use client";

import { Tooltip } from "@/components/share/ToolTip";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/workline/types/type";
import React from "react";
import { TimelineTaskRowProps } from "../types/timeline";

export const TimelineTaskRow = React.memo(
  ({
    rowIdx,
    assignedTasks,
    colWidthPct,
    expandedId,
    onToggleExpand,
  }: Readonly<TimelineTaskRowProps>) => (
    <div className="relative h-[48px] w-full">
      {assignedTasks
        .filter((t) => t.row === rowIdx)
        .map(({ issue, segment }) => {
          const leftPct = segment.startIdx * colWidthPct;

          const widthPct =
            (segment.endIdx - segment.startIdx + 1) * colWidthPct;
          const isExpanded = expandedId === issue.id;

          return (
            <div
              key={issue.id}
              className="absolute top-0 h-full"
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                zIndex: isExpanded ? 20 : 10,
              }}
            >
              <button
                type="button"
                className="w-full h-full flex items-center px-3.5 py-3 gap-1 bg-[var(--secondary-foreground)]/[0.06] hover:bg-[var(--secondary-foreground)]/[0.12] text-[var(--foreground)] border border-[var(--border)] shadow-sm transition-all duration-150 cursor-pointer text-left overflow-hidden rounded-lg"
                onClick={() => onToggleExpand(issue.id)}
              >
                <div className="flex-1 shrink-0 min-w-[50px] overflow-hidden">
                  <Tooltip
                    key={issue.id}
                    content={issue.title}
                    placement="top"
                    className="w-full flex items-center"
                  >
                    <span
                      className="block text-[13px] text-[var(--secondary-foreground)] font-bold tracking-tight truncate min-w-[18px]"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {issue.title}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1 shrink min-w-0 overflow-hidden">
                  {STATUS_MAP[issue.statusCode] && (
                    <span
                      className="text-[12px] font-bold px-1.5 py-0.5 rounded-lg whitespace-nowrap border shrink min-w-[18px] max-w-[48px] sm:max-w-[70px] truncate text-center"
                      title={STATUS_MAP[issue.statusCode]?.label}
                      style={{
                        color: STATUS_MAP[issue.statusCode]?.color,
                        backgroundColor: `color-mix(in srgb, ${STATUS_MAP[issue.statusCode]?.bg} 50%, transparent)`,
                        borderColor: `color-mix(in srgb, ${STATUS_MAP[issue.statusCode]?.color} 10%, transparent)`,
                      }}
                    >
                      {STATUS_MAP[issue.statusCode]?.label}
                    </span>
                  )}
                  {PRIORITY_MAP[issue.priorityCode] && (
                    <span
                      className="text-[12px] font-bold px-1.5 py-0.5 rounded-lg whitespace-nowrap border shrink min-w-[18px] max-w-[48px] sm:max-w-[70px] truncate text-center"
                      title={PRIORITY_MAP[issue.priorityCode]?.label}
                      style={{
                        color: PRIORITY_MAP[issue.priorityCode]?.color,
                        backgroundColor: `color-mix(in srgb, ${PRIORITY_MAP[issue.priorityCode]?.bg} 50%, transparent)`,
                        borderColor: `color-mix(in srgb, ${PRIORITY_MAP[issue.priorityCode]?.color} 10%, transparent)`,
                      }}
                    >
                      {PRIORITY_MAP[issue.priorityCode]?.label}
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
    </div>
  ),
);

TimelineTaskRow.displayName = "TimelineTaskRow";
