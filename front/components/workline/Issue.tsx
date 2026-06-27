import { ChevronDown } from "lucide-react";
import ActivityLog from "./ActivityLog";

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
}

export default function Issue({
  title = "코어 데이터 동기화 파이프라인 엔진 빌드 및 예외 세부 스키마 파싱 검증",
  dueDate = "2026.06.24",
  closed = "50",
  open = "2",
  dDay = 13,
}: MilestoneCardProps) {
  return (
    <div
      className="@container bg-[var(--card)] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-2xl"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--foreground)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 0 0 1px 60, 0 4px 20px rgba(0,0,0,0.06)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-5 mt-1 px-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] font-bold text-[var(--foreground)] tracking-tight leading-snug truncate">
              {title}
            </h2>
            <span
              className="text-[12px] font-black px-2 py-0.5 rounded font-mono bg-[var(--destructive)]/10"
              style={{
                color: "var(--destructive)",
              }}
            >
              D-{dDay}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap ml-1">
            <div className="flex items-center gap-3 text-[12px] font-bold text-[var(--muted-foreground)] uppercase">
              <span>
                마감일{" "}
                <span className="text-[var(--destructive)] font-mono">
                  {dueDate}
                </span>
              </span>

              <span>
                Closed{" "}
                <span className="text-[var(--destructive)] font-mono">
                  {closed}
                </span>
              </span>
              <span>
                Open <span className="font-mono">{open}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center shrink-0 ml-3">
          <span
            className="px-4 py-1 rounded-xl text-[12px] font-mono font-semibold"
            style={{
              color: "",
              background: "",
              borderColor: "" + "30",
            }}
          >
            status
          </span>
          <span
            className="px-4 py-1 rounded-xl text-[12px] font-mono font-semibold"
            style={{
              color: "",
              background: "",
            }}
          >
            priority
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4">
          <button className="p-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors">
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* 이슈 목록 */}
      <div>
        <ActivityLog title="Webhook 실시간 알림 연동 및 스케줄러 배치 패치" />
        <ActivityLog
          title="웹훅 엔드포인트 유효성 검증 및 변경 스키마 예외 처리"
          isTable
        />
      </div>
    </div>
  );
}
