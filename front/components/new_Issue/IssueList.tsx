"use client";

import { ChevronDown, Send, User, UserRound } from "lucide-react";
import { useState } from "react";

interface Comment {
  user: string;
  message: string;
  writeAt: string;
}
interface Issue {
  id: number;
  title: string;
  status: string;
  date: string;
  contents?: Comment[];
}

export default function IssueList({ list }: { list: Issue[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(3);

  return (
    <div className="space-y-1">
      {list.map((issue) => (
        <div
          key={issue.id}
          className="bg-[var(--card)] border border-[var(--border)]/50 rounded-lg overflow-hidden shadow-xs"
        >
          <div className="flex flex-col md:flex-row justify-between p-6 gap-2">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      issue.status === "검토전"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20"
                    }`}
                  >
                    {issue.status}
                  </span>
                  <span className="font-bold text-[14px] text-[var(--foreground)]">
                    {issue.title}
                  </span>
                </div>
                <span className="ml-1 text-sm mt-1.5 block font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                  {issue.date}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="bg-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border)] px-4 py-2 rounded-lg text-xs font-bold text-[var(--muted-foreground)] transition-colors">
                DELETE
              </button>
              <button className="bg-[var(--muted)] hover:bg-[var(--secondary)] border border-[var(--border)] px-4 py-2 rounded-lg text-xs font-bold text-[var(--foreground)] transition-colors">
                MERGE
              </button>
              {issue.status !== "검토전" && (
                <button
                  onClick={() =>
                    setExpandedId(expandedId === issue.id ? null : issue.id)
                  }
                  className={`p-2 border rounded-lg transition-all ${expandedId === issue.id ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]"}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedId === issue.id ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* 아코디언 상세 토글 뷰 */}
          {expandedId === issue.id && issue.contents && (
            <div className="px-6 pb-6 space-y-1 bg-[var(--muted)]/20">
              <div className="h-[1px] bg-[var(--border)]/60 mb-4" />
              {issue.contents.map((content, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl flex justify-between items-center 
                  hover:bg-[var(--primary)]/10 transition-colors
                  animate-in fade-in duration-300"
                >
                  <div className="flex">
                    {/**프로필 사진 */}
                    <div
                      className="w-9 h-9 bg-[var(--muted)] mr-4
                        border border-[var(--border)] 
                        rounded-lg flex items-center justify-center 
                        text-xs text-[var(--muted-foreground)]"
                    >
                      <UserRound size={13} />
                    </div>
                    {/**프로필 사진 오른쪽 */}
                    <div>
                      {/**사용자 이름 + 작성 날짜 */}
                      <div>
                        <span className="font-bold">{content.user}</span>
                        <span className="ml-2 text-sm text-[var(--muted-foreground)]/60 font-mono">
                          2026-04-30
                        </span>
                      </div>
                      {/** 메세지 */}
                      <div className="text-[13px] text-[var(--foreground)]/90 leading-relaxed font-medium">
                        {content.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 하단 댓글 콘트롤 캡슐 바 */}
              <div className="mt-5 p-3 border border-[var(--border)]/60 bg-[var(--card)]">
                <div className="rounded-xl flex gap-3 items-center">
                  <input
                    placeholder="해당 이슈에 대한 의견을 적어주세요."
                    className="flex-1 bg-transparent text-sm px-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none"
                  />
                  <button className="bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded-lg hover:opacity-90 transition-opacity">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
