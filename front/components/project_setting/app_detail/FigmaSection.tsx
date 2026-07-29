import { useState } from "react";
import ConnectBtn from "./ConnectBtn";
import DetailImageShow from "./DetailImageShow";

const FIGMA_OPTIONS = [
  { value: "file_comments:read", label: "파일 댓글 조회" },
  { value: "file_metadata:read", label: "파일 미리보기 조회" },
  { value: "file_versions:read", label: "파일 히스토리 조회" },
];

interface FigmaSectionProps {
  app: any;
}

export default function FigmaSection({ app }: FigmaSectionProps) {
  const isConnected = app.status === "연동됨";

  const [show, setShow] = useState(false);

  return (
    <div
      className={`px-5 pt-5 border-t bg-[var(--background)]/40 space-y-4 transition-all ${
        isConnected
          ? "border-[var(--border)]/55"
          : "border-[var(--border)]/40 opacity-90"
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
        {!isConnected && <ConnectBtn />}
      </div>

      {show && <DetailImageShow imgUrl="/figma_scopes.png" setShow={setShow} />}

      {/* 바디 설정 */}
      {isConnected ? (
        <div className="space-y-4">
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-[var(--muted-foreground)]">
              필수 API 권한 범위 (Scopes){" "}
              <button
                className="ml-1 bg-[var(--foreground)]/70 hover:bg-[var(--foreground)]
                  text-[var(--background)] px-3 py-1 text-[11px] rounded-xl cursor-pointer transition-colors"
                onClick={() => {
                  setShow(true);
                }}
              >
                권한 설정 위치 보기
              </button>
            </label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FIGMA_OPTIONS.map((option) => {
                return (
                  <label
                    key={option.value}
                    className="flex pl-7 items-center space-x-3 p-3 rounded-lg border border-[var(--border)]/60 bg-[var(--card)] hover:border-[var(--primary)]/50 cursor-pointer transition-colors"
                  >
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
