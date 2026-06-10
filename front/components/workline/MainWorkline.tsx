"use client";

import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import AddMilestone from "./AddMilstone";
import { useState } from "react";

export default function MainDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)]">
      {/* 상단 헤더 섹션: 충분한 하단 여백(mb-8) 확보 */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] uppercase">
              작업라인
            </h1>
            <span className="text-xs font-bold bg-[var(--card)] text-[var(--muted-foreground)] px-2.5 py-1 rounded-md border border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-mono">
              248
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-2xl">
            <AddMilestone />
          </div>
        </div>
      )}

      {/* 요약 메트릭 그리드: 머티리얼 가이드에 맞춰 gap-6(24px) 적용 및 카드 내부 패딩(p-6) 확대 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "대시보드1",
            value: "42",
            trend: "12%",
            up: true,
            style:
              "border-[var(--primary)]/20 bg-[var(--primary)]/5 text-[var(--primary)]",
          },
          {
            label: "대시보드2",
            value: "18",
            trend: "4.2%",
            up: true,
            style:
              "border-[var(--primary)]/20 bg-[var(--primary)]/5 text-[var(--primary)]",
          },
          {
            label: "대시보드3",
            value: "1.8h",
            trend: "15%",
            up: true,
            style:
              "border-[var(--primary)]/20 bg-[var(--primary)]/5 text-[var(--primary)]",
          },
          {
            label: "대시보드4",
            value: "9",
            trend: "2%",
            up: false,
            style: "border-destructive/20 bg-destructive/5 text-destructive",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[var(--card)] rounded-xl p-6 flex flex-col justify-between min-h-[120px] relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--primary)] opacity-0 dark:group-hover:opacity-100 transition-opacity" />

            <div className="space-y-2">
              <span className="text-[11px] text-[var(--muted-foreground)] font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[var(--foreground)] font-mono">
                  {stat.value}
                </span>
                <span
                  className={`text-[11px] font-bold font-mono border px-2 py-0.5 rounded ${stat.style}`}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 콘트롤 툴바: 요소들의 컴포넌트 높이를 h-11(44px) 이상으로 확장하여 터치 타깃 확보 */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-[4.8px] mb-8">
        <div className="flex items-center gap-6 text-xs font-bold text-[var(--muted-foreground)]">
          <span className="text-[var(--primary)] border-b-2 border-[var(--primary)] pb-[17px] -mb-[18px] cursor-pointer font-black tracking-wider">
            전체
          </span>
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors tracking-wider">
            긴급
          </span>
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors tracking-wider">
            새작업
          </span>
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors tracking-wider">
            완료
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs">
            <Search size={14} className="text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none w-36 text-xs font-medium"
            />
          </div>
          <button className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] px-3.5 py-2.5 rounded-lg text-xs font-bold hover:text-[var(--foreground)] transition-colors">
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] px-3.5 py-2.5 rounded-lg text-xs font-bold hover:text-[var(--foreground)] transition-colors">
            <ArrowUpDown size={13} /> Sort
          </button>
          <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
          <button
            className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-4 py-2.5 rounded-lg text-xs hover:opacity-90 transition-opacity shadow-sm"
            onClick={openModal}
          >
            + Add Lead
          </button>
        </div>
      </div>

      {/* 리스트 간격 조정: 컴포넌트 카드 배치 간격을 `space-y-6`으로 대폭 확장 */}
      <div className="space-y-6">
        <MilestoneCard />
      </div>
    </div>
  );
}
