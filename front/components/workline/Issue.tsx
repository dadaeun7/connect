import { ChevronRight } from "lucide-react";
import ActivityLog from "./ActivityLog";
import { PRIORITY_MAP, STATUS_MAP } from "./type";
import GithubIcon from "../share/svg_icon/GithubIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import NotionIcon from "../share/svg_icon/NotionIcon";
import { IssueViewResponse } from "@/app/store/useIssueStore";
import { useProjectStore } from "@/app/store/useProjectStore";

interface IssueCardProps {
  issue: IssueViewResponse;
  onDetailClick?: (id: number) => void;
}

export default function Issue({ issue, onDetailClick }: IssueCardProps) {
  // 1. 상태 및 우선순위 테마 설정 맵 매핑
  const statusConfig = STATUS_MAP[issue.preveiw.statusCode] || {
    label: "Unknown",
    color: "var(--muted-foreground)",
    bg: "var(--muted)",
  };
  const priorityConfig = PRIORITY_MAP[issue.preveiw.priorityCode] || {
    label: "Unknown",
    color: "var(--muted-foreground)",
    bg: "var(--muted)",
  };

  // 2. 마감일 포맷 및 D-Day 계산 기믹 (dueDate가 null이 아닐 때만 작동)
  let formattedDueDate = "미지정";
  let dDayText = "D-? ";

  if (issue.preveiw.dueDate) {
    const targetDate = new Date(issue.preveiw.dueDate);
    formattedDueDate = targetDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) dDayText = "D-DAY";
    else if (diffDays > 0) dDayText = `D-${diffDays}`;
    else dDayText = `만료 (${Math.abs(diffDays)}일 경과)`;
  }

  const { currentProject } = useProjectStore();

  return (
    <div
      className="@container bg-[var(--card)] rounded-xl p-6 relative overflow-hidden transition-all duration-300 shadow-2xl border border-transparent"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--muted-foreground)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-4 mt-1 px-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2.5">
            <h2 className="text-[17px] font-bold text-[var(--foreground)] tracking-tight leading-snug truncate">
              {issue.preveiw.title}
            </h2>
            {issue.preveiw.dueDate && (
              <span
                className="text-[12px] font-black px-2 py-0.5 rounded font-mono bg-[var(--destructive)]/10"
                style={{ color: "var(--destructive)" }}
              >
                {dDayText}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap ml-1">
            <div className="flex items-center gap-3 text-[13px] font-bold text-[var(--muted-foreground)] uppercase">
              <span>
                마감일{" "}
                <span className="text-[var(--destructive)] font-mono">
                  {formattedDueDate}
                </span>
              </span>
              <div className="flex gap-1">
                <span className="mr-1">연동중 </span>
                <div>{issue.preveiw.githubRepoName && <GithubIcon />}</div>
                <div>{issue.preveiw.figmaFileKey && <FigmaIcon />}</div>
                <div>
                  {(issue.preveiw.notionDbId || issue.preveiw.notionPageId) && (
                    <NotionIcon />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💡 피드백 적용: 매핑 칩 동적 변환 */}
        <div className="flex gap-2 items-center shrink-0 ml-3 mt-[1.5px]">
          <span
            className="px-3 py-1 rounded-lg text-[13px] font-bold transition-colors"
            style={{
              color: statusConfig.color,
              backgroundColor: statusConfig.bg,
            }}
          >
            {statusConfig.label}
          </span>
          <span
            className="px-3 py-1 rounded-lg text-[13px] font-bold transition-colors"
            style={{
              color: priorityConfig.color,
              backgroundColor: priorityConfig.bg,
            }}
          >
            {priorityConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4">
          {currentProject?.myRole !== "VIEWER" && (
            <button
              onClick={() => onDetailClick?.(issue.preveiw.id)}
              className="p-[5px] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-colors cursor-pointer"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 💡 하단 실시간 연결 리소스 로그 액션 (선택 데이터만 렌더링) */}
      <div className="space-y-1.5 pt-2 border-t border-[var(--border)]/40">
        <ActivityLog activity={issue.activity} />
        {/* 아무것도 연결 안 된 상태 처리 */}
        {issue.activity.length <= 0 && (
          <div className="text-[11px] font-medium text-[var(--muted-foreground)]/60 px-3 py-1.5">
            연동된 외부 리소스가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
