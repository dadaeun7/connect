import { ArrowRight, RefreshCw } from "lucide-react";

const SLACK_OPTIONS = [
  { value: "channels:history", label: "공개 채널 메시지 읽기" },
  { value: "channels:read", label: "공개 채널 정보 보기" },
];

interface SlackSectionProps {
  app: any;
  selectedScopes: string[];
  onScopeChange: (value: string) => void;
  onSave: () => void;
}

export default function SlackSection({
  app,
  selectedScopes,
  onScopeChange,
  onSave,
}: SlackSectionProps) {
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
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-[var(--muted-foreground)]">
              요청할 API 권한 범위 (Scopes)
            </label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SLACK_OPTIONS.map((option) => {
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
