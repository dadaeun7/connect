"use client";

import { Tooltip } from "@/components/share/ToolTip";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

interface IssueHistoryResponse {
  id: number;
  issueId: number;
  modifierEmail: string;
  category: string;
  content: string;
  createdAt: string;
}

interface IssueHistoryTimelineProps {
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  issueId: number;
}

export default function IssueHistoryLine({
  showHistory,
  setShowHistory,
  issueId,
}: IssueHistoryTimelineProps) {
  if (!showHistory) return null;

  const [loading, setLoading] = useState(false);
  const [historys, setHistorys] = useState<IssueHistoryResponse[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/issue/history/list?issueId=${issueId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setHistorys(data);
        }
      } catch (error) {
        console.error("히스토리 내역 불러오는 중 에러: ", error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [showHistory]);

  const renderHistory = () => {
    if (!historys || historys.length === 0) {
      return (
        <div className="text-center py-4 text-xs text-[var(--muted-foreground)]">
          발생한 변경 이력이 없습니다.
        </div>
      );
    }
  };

  renderHistory();

  return (
    <>
      <div className="flex items-center mb-2">
        <Tooltip content="뒤로가기" placement="top">
          <ChevronLeft
            className="cursor-pointer hover:bg-[var(--primary)]/10 rounded m-2 transition-colors shadow-xs"
            onClick={() => {
              setShowHistory(false);
            }}
          />
        </Tooltip>
        <h1 className="text-[17px] font-black ml-1">이슈 히스토리</h1>
      </div>

      <span className="text-[13px] ml-5">이슈 변경 내역을 확인합니다.</span>
      <div className="mt-3 ml-5 space-y-3 font-sans text-sm border-l border-[var(--border)] pl-3 ml-1">
        {historys.map((hist) => {
          return (
            <div key={hist.id} className="relative space-y-5">
              <div className="absolute -left-[1rem] top-1 w-2 h-2 rounded-full bg-[var(--muted-foreground)]/60" />
              <p className="text-[var(--foreground)] font-semibold">
                <span className="font-bold text-[var(--muted-foreground)] mr-1">
                  {hist.modifierEmail}
                </span>
                님이&nbsp;
                <span className="font-mono text-amber-500">
                  [{hist.category}]
                </span>{" "}
                했습니다.
              </p>
              <p className="text-[var(--muted-foreground)] text-[13px]">
                <span className="text-[var(--foreground)] font-bold">
                  {hist.content}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
