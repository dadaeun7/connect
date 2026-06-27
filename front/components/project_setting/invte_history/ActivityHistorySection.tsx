export default function ActivityHistorySection() {
  return (
    <div className="space-y-4">
      <div className="px-1 flex items-center gap-4">
        <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
          활동 히스토리 이력
        </h3>
        <div className="flex-1 h-[1px] bg-[var(--border)]/60" />
      </div>

      <div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group flex justify-between items-center bg-[var(--card)] border-b border-[var(--border)] p-4 hover:bg-[var(--primary)]/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--foreground)] transition-colors">
                  프로젝트 이름
                </p>
                <p className="text-xs text-[var(--muted-foreground)] font-semibold mt-0.5">
                  회사 이름
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
                현재 상태
              </p>
              <p className="text-xs text-[var(--muted-foreground)]/60 font-mono">
                April 29, 2026
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
