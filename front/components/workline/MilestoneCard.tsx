import { Calendar, ChevronRight, Plus } from "lucide-react";
import IssueRow from "./IssueRow";

const SERVICE_COLORS = {
  github: {
    color: "var(--github-text)",
    bg: "var(--github-bg)",
    border: "var(--github-border)",
  },
  figma: {
    color: "var(--figma-text)",
    bg: "var(--figma-bg)",
    border: "var(--figma-border)",
  },
  notion: {
    color: "var(--notion-text)",
    bg: "var(--notion-bg)",
    border: "var(--notion-border)",
  },
  slack: {
    color: "var(--slack-text)",
    bg: "var(--slack-bg)",
    border: "var(--slack-border)",
  },
  milestone: {
    color: "var(--mile-point)",
    bg: "var(--mile-bg)",
    border: "var(--mile-border)",
  },
};

type ServiceKey = keyof typeof SERVICE_COLORS;

interface MilestoneCardProps {
  title?: string;
  dueDate?: string;
  closed?: string;
  open?: string;
  dDay?: number;
  progress?: number;
  service?: ServiceKey;
}

export default function MilestoneCard({
  title = "코어 데이터 동기화 파이프라인 엔진 빌드 및 예외 세부 스키마 파싱 검증",
  dueDate = "2026.06.24",
  closed = "50",
  open = "2",
  dDay = 13,
  progress = 64,
  service = "milestone",
}: MilestoneCardProps) {
  const svc = SERVICE_COLORS[service];

  return (
    <div
      className="bg-[var(--card)] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-2xl"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = svc.border;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 0 1px ${svc.border}60, 0 4px 20px rgba(0,0,0,0.06)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-5 mt-1">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full shrink-0 ring-4 ring-offset-1"
              style={{
                background: svc.color,
                boxShadow: `0 0 8px ${svc.color}60`,
              }}
            />
            <h2 className="text-[17px] font-bold text-[var(--foreground)] tracking-tight leading-snug truncate">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex text-[var(--secondary-foreground)] bg-[var(--background)] items-center gap-1.5 text-[12px] font-bold px-2.5 py-1.5 rounded-lg">
              <Calendar size={11} /> 마감일 {dueDate}
            </span>
            <div className="flex items-center gap-3 text-[12px] font-bold text-[var(--muted-foreground)] uppercase">
              <span>
                Closed{" "}
                <span className="text-[var(--destructive)] font-mono">
                  {closed}
                </span>
              </span>
              <span>
                Open{" "}
                <span className="font-mono" style={{ color: svc.color }}>
                  {open}
                </span>
              </span>
            </div>
            <span
              className="text-[12px] font-black px-2 py-0.5 rounded font-mono bg-[var(--destructive)]/10"
              style={{
                color: "var(--destructive)",
              }}
            >
              D-{dDay}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button className="flex items-center gap-1.5 py-2 px-3 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors">
            <Plus size={12} /> Connect Issue
          </button>
          <button className="p-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] rounded-xl text-[var(--muted-foreground)] transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 프로그레스 */}
      <div
        className="mb-5 p-4 rounded-xl flex items-center justify-between gap-5"
        style={{ background: "var(--background)" }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-[var(--muted)] text-[9px] font-black text-[var(--muted-foreground)] flex items-center justify-center font-mono"
              >
                U{i}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span
              className="text-[13px] font-black"
              style={{ color: svc.color }}
            >
              {progress}% 완료
            </span>
            <span className="text-[12px] text-[var(--muted-foreground)]/60 font-medium">
              {open.split("/")[0]} 이슈 진행 중
            </span>
          </div>
        </div>
        <div className="flex-1 max-w-sm">
          <div className="w-full bg-[var(--card)]/60 h-1.5 rounded-full overflow-hidden border border-[var(--border)]/30">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: svc.color }}
            />
          </div>
        </div>
      </div>

      {/* 이슈 목록 */}
      <div className="space-y-2 rounded-xl border border-[var(--border)]/40 p-3 bg-[var(--muted)]/10">
        <IssueRow
          title="Webhook 실시간 알림 연동 및 스케줄러 배치 패치"
          service="slack"
        />
        <IssueRow
          title="웹훅 엔드포인트 유효성 검증 및 변경 스키마 예외 처리"
          service="figma"
          isTable
        />
      </div>
    </div>
  );
}
