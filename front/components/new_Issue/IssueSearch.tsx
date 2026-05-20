import { Search } from "lucide-react";

export default function IssueSearch() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="relative flex-1">
        <input
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[var(--primary)] transition-colors font-medium"
          placeholder="Search issues..."
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]/60" />
      </div>
      <button className="bg-[var(--card)] border border-[var(--border)] px-5 py-2 rounded-xl text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors uppercase tracking-wider">
        FILTER
      </button>
    </div>
  );
}
