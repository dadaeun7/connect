import { offsetTimePlusNine } from "@/components/share/UtilFun";
import { InviteHistoryResponse } from "../api/affiliation";

export default function InvitationHistorySection({
  inviteHistory,
}: Readonly<{
  inviteHistory: InviteHistoryResponse[];
}>) {
  const statusColor: Record<string, string> = {
    PENDING: "var(--status-inprogress)",
    ACCEPTED: "var(--status-done)",
    EXPIRED: "var(--status-review)",
    EXIT: "var(--status-todo)",
  };
  return (
    <div className="space-y-3">
      <div>
        <div className="px-1 flex items-center">
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            초대 메일 발송 이력
          </h3>
          <div className="flex-1 h-[1px] bg-[var(--border)]/60" />
        </div>
      </div>

      <div className="border-b border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]/50">
        {inviteHistory[0]?.email ? (
          <>
            {inviteHistory.map((ih, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-[var(--card)] hover:bg-[var(--foreground)]/10 transition-colors text-sm"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-[var(--foreground)] text-[13px]">
                      {ih.email}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-xl"
                    style={{
                      color: `${statusColor[ih.state]}`,
                      backgroundColor: `color-mix(in srgb, ${statusColor[ih.state]} 30%, transparent)`,
                    }}
                  >
                    {ih.state}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--muted-foreground)]/80">
                    {offsetTimePlusNine(ih.invitedAt)}
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-2 text-sm font-medium text-[var(--muted-foreground)]">
            초대를 보낸 이력이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
