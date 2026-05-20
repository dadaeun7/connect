import React from "react";

const ModernPanel = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] shadow-xl w-full max-w-2xl mx-auto">
    <div className="mb-5 border-b border-[var(--border)] pb-3">
      <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-0.5">
        {title}
      </h2>
      <p className="text-xs text-[var(--muted-foreground)]">
        워크스페이스 노드 파이프라인 자격 증명 스케줄러 그룹을 매핑합니다.
      </p>
    </div>
    {children}
  </div>
);

const ModernInputField = ({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col space-y-1 mb-4">
    <label
      htmlFor={id}
      className="text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/30 focus:outline-none focus:border-[var(--primary)] font-medium"
    />
  </div>
);

export default function AddMilestone() {
  return (
    <ModernPanel title="Create New Milestone">
      <form onSubmit={(e) => e.preventDefault()}>
        <ModernInputField
          label="마일스톤 / 이슈 명칭"
          id="issueName"
          placeholder="예: 코어 웹훅 동기화 고도화 엔진 빌드"
        />

        <div className="bg-[var(--muted)]/40 border border-[var(--border)] rounded-xl p-5 mb-5">
          <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-3">
            마일스톤 구조 설정 세부 속성 (Overview)
          </span>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm font-bold text-[var(--foreground)] hover:border-[var(--primary)]/30 cursor-pointer transition-colors">
              <span className="text-xl mb-1">🎯</span>
              <span>Medium Priority</span>
            </div>
            <div className="flex flex-col items-center justify-center p-5 bg-[var(--primary)]/5 border border-[var(--primary)] rounded-lg text-sm font-black text-[var(--primary)] shadow-sm">
              <span className="mb-1">●</span>
              <span>ON TRACK</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm font-bold text-[var(--foreground)] hover:border-[var(--primary)]/30 cursor-pointer transition-colors">
              <span className="text-xl mb-1">📊</span>
              <span>Large Size</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            프로젝트 연결 컨텍스트
          </label>
          <div className="flex items-center justify-between w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm text-[var(--muted-foreground)] cursor-pointer hover:border-[var(--border)]/100 transition-colors">
            <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2.5 py-0.5 rounded text-xs font-bold font-mono">
              연결된 프로젝트 A
            </span>
            <span className="font-bold text-[var(--primary)] text-xs">
              검색 매핑 트리 🔗
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModernInputField
            label="마감 타임라인 날짜"
            id="dueDate"
            type="date"
          />
          <ModernInputField
            label="관련 이슈 태그 링크"
            id="issueLink"
            placeholder="#이슈 ID 주입"
          />
        </div>

        <div className="flex flex-col space-y-2 mb-6">
          <label
            htmlFor="description"
            className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            마일스톤 스펙 상세 기술문서
          </label>
          <textarea
            id="description"
            rows={5}
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[var(--primary)] resize-none font-medium leading-relaxed transition-colors"
            placeholder="마일스톤 세부 요구사항을 기록하세요. (Markdown 지원)"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-bold text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-black text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Save Milestone
          </button>
        </div>
      </form>
    </ModernPanel>
  );
}
