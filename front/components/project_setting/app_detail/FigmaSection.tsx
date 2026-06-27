import { ArrowRight, Link2, RefreshCw } from "lucide-react";

const FIGMA_OPTIONS = [
  { value: "file_comments:read", label: "파일 댓글 조회" },
  { value: "file_metadata:read", label: "파일 미리보기 조회" },
  { value: "file_versions:read", label: "파일 히스토리 조회" },
  { value: "projects:read", label: "프로젝트 조회" },
];

interface FigmaSectionProps {
  app: any;
  figmaUrl: string;
  setFigmaUrl: (url: string) => void;
  selectedScopes: string[];
  onScopeChange: (value: string) => void;
  onSave: () => void;
}

export default function FigmaSection({
  app,
  figmaUrl,
  setFigmaUrl,
  selectedScopes,
  onScopeChange,
  onSave,
}: FigmaSectionProps) {
  const isConnected = app.status === "연동됨";

  return (
    <div
      className={`px-5 pt-5 border-t bg-[var(--background)]/40 space-y-4 transition-all ${
        isConnected
          ? "border-[var(--border)]/55"
          : "border-[var(--border)]/40 opacity-75"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-[var(--border)]/30 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm">
            {app.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[var(--foreground)]">
                {app.name}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isConnected
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-[var(--border)] text-[var(--muted-foreground)]"
                }`}
              >
                {app.status}
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] font-medium mt-0.5">
              {app.description}
            </p>
          </div>
        </div>
        {!isConnected && (
          <button className="flex items-center space-x-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-4 py-2 rounded-lg text-xs shadow-sm hover:opacity-90 transition-opacity">
            <span>연동하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 바디 설정 */}
      {isConnected ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase text-[var(--muted-foreground)] tracking-wider flex flex-col gap-1">
              <div className="flex items-center">
                <Link2 className="w-4 h-4 mr-2" /> 동기화할 피그마 팀 페이지 URL
              </div>
              <div className="font-normal text-black/80">
                서비스 이용을 위해{" "}
                <strong className="text-black/80">팀 아이디</strong>가
                필요합니다. 아래 형식의 URL을 붙여 넣어주세요.
              </div>
            </label>
            <input
              type="text"
              className="w-full max-w-xl border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] bg-[var(--card)] focus:outline-none focus:border-[var(--primary)] font-semibold"
              placeholder="https://www.figma.com/team/..."
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-bold text-[var(--muted-foreground)]">
              요청할 API 권한 범위 (Scopes)
            </label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FIGMA_OPTIONS.map((option) => {
                const isChecked = selectedScopes.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-[var(--border)]/60 bg-[var(--card)] hover:border-[var(--primary)]/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] bg-[var(--background)]"
                      checked={isChecked}
                      onChange={() => onScopeChange(option.value)}
                    />
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-bold text-[var(--foreground)]">
                        {option.label}
                      </span>
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        {option.value}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={onSave}
              className="flex items-center space-x-1.5 bg-[var(--foreground)] text-[var(--background)] font-bold px-4 py-2.5 rounded-lg text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>변경된 설정으로 권한 갱신 요청</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[var(--muted-foreground)] font-medium pt-1">
          * 이 플랫폼은 아직 연동되지 않았습니다. 세부 권한을 설정하려면 우측
          상단의 연동하기 버튼을 먼저 진행해 주세요.
        </div>
      )}
    </div>
  );
}
