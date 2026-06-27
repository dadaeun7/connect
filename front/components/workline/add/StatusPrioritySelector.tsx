import React from "react";

export const PRIORITY_COLORS: Record<string, { color: string; bg: string }> = {
  high: { color: "var(--task-rose)", bg: "var(--task-rose-bg)" },
  medium: { color: "var(--task-amber)", bg: "var(--task-amber-bg)" },
  low: { color: "var(--task-teal)", bg: "var(--task-teal-bg)" },
};

export const STATUS_COLORS: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  inprogress: {
    color: "var(--task-blue)",
    bg: "var(--task-blue-bg)",
    label: "In Progress",
  },
  done: { color: "var(--task-teal)", bg: "var(--task-teal-bg)", label: "Done" },
  blocked: {
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
    label: "Blocked",
  },
  review: {
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
    label: "Review",
  },
};

interface SelectorProps {
  currentStatus: string;
  setCurrentStatus: (val: string) => void;
  currentPriority: string;
  setCurrentPriority: (val: string) => void;
}

export default function StatusPrioritySelector({
  currentStatus,
  setCurrentStatus,
  currentPriority,
  setCurrentPriority,
}: SelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* 1. 진행 상태 세그먼트 */}
        <div className="flex flex-col space-y-2 col-span-3">
          <label className="text-xs font-bold text-[var(--muted-foreground)] tracking-wider">
            진행 상태
          </label>
          <div className="flex bg-[var(--muted)]/50 p-1 rounded-lg border border-[var(--border)] w-full gap-1">
            {Object.keys(STATUS_COLORS).map((status) => {
              const isActive = currentStatus === status;
              const config = STATUS_COLORS[status];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCurrentStatus(status)}
                  style={{
                    color: isActive ? config.color : undefined,
                    backgroundColor: isActive ? config.bg : undefined,
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer text-center border border-transparent ${
                    isActive
                      ? "shadow-sm font-black"
                      : "text-[var(--muted-foreground)]/70 hover:text-[var(--foreground)]"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 우선순위 세그먼트 */}
        <div className="flex flex-col space-y-2 col-span-2">
          <label className="text-xs font-black text-[var(--muted-foreground)] tracking-wider">
            우선순위
          </label>
          <div className="flex bg-[var(--muted)]/50 p-1 rounded-lg border border-[var(--border)] w-full gap-1">
            {Object.keys(PRIORITY_COLORS).map((priority) => {
              const isActive = currentPriority === priority;
              const config = PRIORITY_COLORS[priority];
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setCurrentPriority(priority)}
                  style={{
                    color: isActive ? config.color : undefined,
                    backgroundColor: isActive
                      ? config.bg
                      : "bg-[var(--background)]",
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer text-center border border-transparent ${
                    isActive
                      ? "shadow-sm font-black"
                      : "text-[var(--muted-foreground)]/70 hover:text-[var(--foreground)]"
                  }`}
                >
                  {priority}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
