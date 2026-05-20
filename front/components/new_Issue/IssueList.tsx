"use client";

import { ChevronDown, Send, User } from "lucide-react";
import { useState } from "react";

interface Issue {
  id: number;
  title: string;
  status: string;
  date: string;
  contents?: string[];
}

export default function IssueList({ list }: { list: Issue[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(3);

  return (
    <div className="space-y-4">
      {list.map((issue) => (
        <div
          key={issue.id}
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between p-6 gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center font-mono text-[var(--primary)] font-bold text-sm">
                {issue.id}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base tracking-tight text-[var(--foreground)]">
                    {issue.title}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      issue.status === "검토전"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <span className="text-xs mt-1.5 block font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
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
            <div className="px-6 pb-6 space-y-3 bg-[var(--muted)]/20">
              <div className="h-[1px] bg-[var(--border)]/60 mb-4" />
              {issue.contents.map((content, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--card)] border border-[var(--border)]/80 p-4 rounded-xl flex justify-between items-center hover:border-[var(--primary)]/40 transition-colors"
                >
                  <span className="text-sm text-[var(--foreground)]/90 leading-relaxed font-medium">
                    {content}
                  </span>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="w-6 h-6 bg-[var(--muted)] border border-[var(--border)] rounded-full flex items-center justify-center text-xs text-[var(--muted-foreground)]">
                      <User size={12} />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]/60 font-mono">
                      2026-04-30
                    </span>
                  </div>
                </div>
              ))}

              {/* 하단 댓글 콘트롤 캡슐 바 */}
              <div className="mt-5 pt-4 border-t border-[var(--border)]/60">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-2.5 flex gap-3 items-center">
                  <input
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm py-2 px-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none"
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
