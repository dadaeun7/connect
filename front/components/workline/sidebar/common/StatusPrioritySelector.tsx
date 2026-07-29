import React from "react";
import { PRIORITY_MAP, STATUS_MAP } from "../../type";

interface SelectorProps {
  currentStatusId: number;
  setCurrentStatusId: (id: number) => void;
  currentPriorityId: number;
  setCurrentPriorityId: (id: number) => void;
}

export const statusId = [1, 2, 3, 4, 5];
export const priorityId = [6, 7, 8];

export default function StatusPrioritySelector({
  currentStatusId,
  setCurrentStatusId,
  currentPriorityId,
  setCurrentPriorityId,
}: SelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {/* 1. 진행 상태 세그먼트 */}
        <div className="flex flex-col space-y-1 col-span-3">
          <label className="text-sm font-bold text-[var(--foreground)] tracking-wider">
            진행 상태
          </label>
          <div className="flex bg-[var(--muted)]/50 p-1 rounded-lg border border-[var(--border)] w-full gap-1">
            {statusId.map((id) => {
              const config = STATUS_MAP[id];
              if (!config) return null; // 혹시 모를 언디파인드 방어

              const isActive = currentStatusId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCurrentStatusId(id);
                  }}
                  style={{
                    color: isActive ? config.color : undefined,
                    backgroundColor: isActive ? config.bg : undefined,
                  }}
                  className={`flex-1 px-1 py-2 text-[12px] font-bold rounded-md transition-all duration-150 cursor-pointer text-center border border-transparent ${
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
        <div className="flex flex-col space-y-1 col-span-2">
          <label className="text-sm font-bold text-[var(--foreground)] tracking-wider">
            우선순위
          </label>
          <div className="flex bg-[var(--muted)]/50 p-1 rounded-lg border border-[var(--border)] w-full gap-1">
            {priorityId.map((id) => {
              const config = PRIORITY_MAP[id];
              if (!config) return null; // 혹시 모를 언디파인드 방어

              const isActive = currentPriorityId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCurrentPriorityId(id);
                  }}
                  style={{
                    color: isActive ? config.color : undefined,
                    backgroundColor: isActive ? config.bg : undefined,
                  }}
                  className={`flex-1 px-1 py-2 text-[12px] font-bold rounded-md transition-all duration-150 cursor-pointer text-center border border-transparent ${
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
      </div>
    </div>
  );
}
