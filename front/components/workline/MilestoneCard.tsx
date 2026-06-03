import { Calendar, ChevronRight, Plus, Activity, ChartPie } from "lucide-react";
import IssueRow from "./IssueRow";

export default function MilestoneCard() {
  return (
    <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm relative">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              코어 데이터 동기화 파이프라인 엔진 빌드 및 예외 세부 스키마 파싱
              검증
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-bold bg-[var(--muted)] px-2.5 py-2 rounded-lg">
              <Calendar size={13} className="text-[var(--primary)]" /> 마감일
              2026.04.24
            </span>
            <div className="flex items-center gap-3 text-xs font-bold text-[var(--muted-foreground)] uppercase">
              <span>
                Closed{" "}
                <span className="text-[var(--foreground)] font-mono">50/1</span>
              </span>
              <span>
                Open{" "}
                <span className="text-[var(--primary)] font-mono">70/2</span>
              </span>
            </div>
            <span className="text-xs font-black text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2 py-0.5 rounded font-mono">
              D-4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button className="flex items-center gap-1 py-2 px-3 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] font-bold rounded-lg text-xs uppercase tracking-wider transition-colors">
            <Plus size={13} /> Connect Issue
          </button>
          <button className="p-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mb-6 bg-[var(--muted)]/40 p-4 rounded-lg border border-[var(--border)]/40 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-[var(--card)] bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)] flex items-center justify-center uppercase font-mono"
              >
                U{i}
              </div>
            ))}
          </div>
          <span className="text-sm font-bold text-[var(--primary)] flex items-center gap-1 font-mono">
            <ChartPie size={14} /> 64%
          </span>
        </div>
        <div className="flex-1 max-w-sm bg-[var(--secondary)] h-2 rounded-full overflow-hidden border border-[var(--border)]/40">
          <div className="bg-[var(--primary)] h-full w-[64%]" />
        </div>
      </div>

      <div className="space-y-3 bg-[var(--muted)]/10 p-3 rounded-lg border border-[var(--border)]/30">
        <IssueRow title="Slack Webhook 실시간 알림 연동 및 스케줄러 배치 패치" />
        <IssueRow
          title="Figma 웹훅 엔드포인트 유효성 검증 및 변경 스키마 예외 처리"
          isTable={true}
        />
      </div>
    </div>
  );
}
