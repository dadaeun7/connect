import { Search, SlidersHorizontal } from "lucide-react";

export default function IssueSearch() {
  return (
    <div className="flex justify-end gap-1 mb-3">
      {/* 1. 부모 div에 transition-all과 focus-within:w-64(원하는 확장 너비)를 추가합니다. */}
      <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs w-48 transition-all duration-300 ease-in-out focus-within:w-120 focus-within:border-[var(--muted-foreground)]">
        <Search size={14} className="text-[var(--muted-foreground)] shrink-0" />
        {/* 2. input창의 고정 너비(w-36)를 지우고 w-full로 변경하여 부모가 늘어날 때 같이 늘어나도록 합니다. */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none w-full text-sm font-medium"
        />
      </div>
      <button
        className="flex items-center gap-1
      bg-[var(--card)] border border-[var(--border)] px-5 py-2 rounded-lg text-sm font-bold text-[var(--muted-foreground)] 
      hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors tracking-wider"
      >
        <SlidersHorizontal size={13} /> <span>Fiter </span>
      </button>
    </div>
  );
}
