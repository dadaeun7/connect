"use client";

import { IssueTitleResponse } from "@/app/store/useIssueStore";
import { Tooltip } from "@/components/share/ToolTip";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/workline/type";
import React from "react";

interface TimelineTaskRowProps {
  rowIdx: number;
  assignedTasks: {
    issue: IssueTitleResponse;
    row: number;
    segment: { startIdx: number; endIdx: number };
  }[];
  colWidthPct: number;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
}

export const TimelineTaskRow = React.memo(
  ({
    rowIdx,
    assignedTasks,
    colWidthPct,
    expandedId,
    onToggleExpand,
  }: TimelineTaskRowProps) => (
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
              <Tooltip key={issue.id} content={issue.title} placement="top">
                <button
                  type="button"
                  className="w-full h-full flex items-center px-3.5 py-3 gap-1 bg-[var(--secondary-foreground)]/[0.06] hover:bg-[var(--secondary-foreground)]/[0.12] text-[var(--foreground)] border border-[var(--border)] shadow-sm transition-all duration-150 cursor-pointer text-left overflow-hidden rounded-lg"
                  onClick={() => onToggleExpand(issue.id)}
                >
                  <span className="ml-1 text-[13px] text-[var(--secondary-foreground)] font-bold tracking-tight truncate flex-1">
                    {issue.title}
                  </span>
                  <span
                    className="text-[12px] font-bold px-3 py-1 rounded-xl whitespace-nowrap border"
                    style={{
                      color: STATUS_MAP[issue.statusCode]?.color,
                      backgroundColor: `color-mix(in srgb, ${STATUS_MAP[issue.statusCode]?.bg} 50%, transparent)`,
                      borderColor: `color-mix(in srgb, ${STATUS_MAP[issue.statusCode]?.color} 10%, transparent)`,
                    }}
                  >
                    {STATUS_MAP[issue.statusCode]?.label}
                  </span>
                  <span
                    className="text-[12px] font-bold px-3 py-1 rounded-xl whitespace-nowrap border"
                    style={{
                      color: PRIORITY_MAP[issue.priorityCode]?.color,
                      backgroundColor: `color-mix(in srgb, ${PRIORITY_MAP[issue.priorityCode]?.bg} 50%, transparent)`,
                      borderColor: `color-mix(in srgb, ${PRIORITY_MAP[issue.priorityCode]?.color} 10%, transparent)`,
                    }}
                  >
                    {PRIORITY_MAP[issue.priorityCode]?.label}
                  </span>
                </button>
              </Tooltip>
            </div>
          );
        })}
    </div>
  ),
);

TimelineTaskRow.displayName = "TimelineTaskRow";
