"use client";

import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { useState } from "react";
import Issue from "./Issue";
import AddIssue from "./add/AddIssue";

export default function MainDashboard({
  getGithubRepo,
}: Readonly<{ getGithubRepo: () => Promise<void> }>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const menu = ["전체", "긴급", "새작업", "완료"];
  return (
    <div className="@container flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)] animate-in fade-in duration-300">
      {/* 상단 헤더 섹션 */}
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

      {/* 우측 슬라이드 인 사이드바 (구조 및 클래스 전면 수정) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isModalOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* 배경 딤드 처리 (클릭 시 무조건 닫힘) */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${
            isModalOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        />

        {/* 사이드바 본체 */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xl bg-[var(--card)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out ${
            isModalOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* 상단 닫기 버튼 배치 */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            className="absolute top-5 right-5 z-10 p-2 hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="h-full overflow-y-auto p-6">
            <AddIssue onClose={closeModal} getGithubRepo={getGithubRepo} />
          </div>
        </div>
      </div>

      {/* 콘트롤 툴바 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-8 border-b border-[var(--border)] px-1 w-full">
          {menu.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold tracking-wider transition-all relative uppercase ${
                activeTab === tab
                  ? "text-[var(--primary)] font-black"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="@container flex items-center gap-1 justify-end mb-3">
        {/* 1. 부모 div에 transition-all과 focus-within:w-64(원하는 확장 너비)를 추가합니다. */}
        <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs w-48 transition-all duration-300 ease-in-out focus-within:w-120 focus-within:border-[var(--muted-foreground)]">
          <Search
            size={14}
            className="text-[var(--muted-foreground)] shrink-0"
          />
          {/* 2. input창의 고정 너비(w-36)를 지우고 w-full로 변경하여 부모가 늘어날 때 같이 늘어나도록 합니다. */}
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none w-full text-sm font-medium"
          />
        </div>
        <button className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] px-3.5 py-2.5 rounded-lg text-sm font-bold hover:text-[var(--foreground)] transition-colors">
          <SlidersHorizontal size={13} />{" "}
          <span className="hidden @min-[700px]:inline">Filter</span>
        </button>
        <button className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] px-3.5 py-2.5 rounded-lg text-sm font-bold hover:text-[var(--foreground)] transition-colors">
          <ArrowUpDown size={13} />{" "}
          <span className="hidden @min-[700px]:inline">Sort</span>
        </button>
        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
        <button
          className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-4 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          onClick={openModal}
        >
          +Add <span className="hidden @min-[900px]:inline"> Issue</span>
        </button>
      </div>

      <div className="space-y-6">
        <Issue />
      </div>
    </div>
  );
}
