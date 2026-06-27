export default function InvitationHistorySection() {
  return (
    <div className="space-y-4">
      <div>
        <div className="px-1 flex items-center">
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            초대 메일 발송 이력
          </h3>
          <div className="flex-1 h-[1px] bg-[var(--border)]/60" />
        </div>
      </div>

      <div className="border-b border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]/50">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 bg-[var(--card)] hover:bg-[var(--foreground)]/10 transition-colors text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]" />
              <div>
                <p className="font-bold text-[var(--foreground)] text-sm">
                  collaborator_dev_node_{i}@daum.net
                </p>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
              <span className="text-xs font-bold px-2 py-1 bg-[var(--muted)] border border-[var(--border)] rounded text-[var(--muted-foreground)]/80">
                대기중
              </span>
              <span className="font-mono text-xs text-[var(--muted-foreground)]/50 font-bold">
                2026.04.29
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
