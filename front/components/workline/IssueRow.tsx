import { ChevronDown, ExternalLink, GitBranch } from "lucide-react";

export default function IssueRow({
  title,
  isTable = false,
}: {
  title: string;
  isTable?: boolean;
}) {
  return (
    <div className="bg-[var(--card)] rounded-md border border-[var(--border)]/80 overflow-hidden shadow-xs">
      <div className="p-3.5 flex justify-between items-center bg-[var(--card)]/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />
          <span className="text-sm font-semibold text-[var(--foreground)]/90 truncate">
            {title}
          </span>
        </div>

        <div className="flex gap-2 items-center shrink-0 ml-2">
          <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-tight border border-[var(--primary)]/20 font-mono">
            In Progress
          </span>
          <span className="bg-[var(--muted)] text-[var(--muted-foreground)]/80 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tight border border-[var(--border)]/60 font-mono italic">
            Medium
          </span>
          <ChevronDown
            size={14}
            className="text-[var(--muted-foreground)]/40 ml-0.5"
          />
        </div>
      </div>

      {isTable && (
        <div className="px-3 pb-3 bg-[var(--card)]/20">
          <div className="bg-[var(--card)] border border-[var(--border)]/60 rounded-md overflow-hidden">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-[var(--border)]/40 last:border-0 hover:bg-[var(--muted)]/20 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-black bg-[var(--primary)]/10 text-[var(--primary)] px-1.5 py-0.5 border border-[var(--primary)]/20 rounded font-mono">
                    GitHub
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)] font-medium truncate">
                    Feat: Implement custom slack pipeline signature token
                    verification filters
                  </span>
                  <ExternalLink
                    size={13}
                    className="text-[var(--primary)]/60 shrink-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-3 text-[var(--muted-foreground)] font-mono text-xs shrink-0 ml-4">
                  <div className="flex items-center gap-1 bg-[var(--muted)] border border-[var(--border)]/60 px-2 py-0.5 rounded text-xs font-semibold">
                    <GitBranch size={12} className="text-[var(--primary)]" />
                    <span>main</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--muted-foreground)]/40">
                    2026.04.29
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
