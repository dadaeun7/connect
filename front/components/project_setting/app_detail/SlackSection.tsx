import { useState } from "react";
import ConnectBtn from "./ConnectBtn";
import DetailImageShow from "./DetailImageShow";

const SLACK_OPTIONS = [
  { value: "등록 방법❓", label: "⚠️ [필수] 채널 봇 등록하기" },
];

interface SlackSectionProps {
  app: any;
}

export default function SlackSection({ app }: SlackSectionProps) {
  const isConnected = app.status === "연동됨";
  const [show, setShow] = useState(false);
  return (
    <div
      className={`px-5 pt-5 border-t bg-[var(--background)]/40 space-y-4 transition-all ${
        isConnected
          ? "border-[var(--border)]/55"
          : "border-[var(--border)]/40 opacity-75"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between border-b border-[var(--border)]/30 pb-3 w-full gap-4">
        {/* 좌측 그룹: 아이콘 + 앱 정보 + 옵션 버튼들 */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* 앱 아이콘 */}
          <div className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm shrink-0 mt-0.5">
            {app.icon}
          </div>

          {/* 앱 정보 + 옵션 버튼을 양끝으로 벌려주는 메인 래퍼 */}
          <div className="flex items-start justify-between flex-1 min-w-0 gap-6">
            {/* 왼쪽: 앱 이름, 상태, 설명 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[var(--foreground)] truncate">
                  {app.name}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
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

            {/* 오른쪽: 옵션 버튼 리스트 */}
            <div className="shrink-0">
              <div className="grid grid-cols-1 gap-2">
                {SLACK_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setShow(true)}
                    className="flex items-center justify-between w-80 p-3 px-5 rounded-lg border border-[var(--border)]/60 bg-[var(--card)] hover:border-[var(--primary)]/50 transition-colors text-left"
                  >
                    <span className="text-[13px] font-bold text-[var(--foreground)]">
                      {option.label}
                    </span>
                    <span className="text-[12px] font-mono text-[var(--muted-foreground)]">
                      {option.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 최상위 연동 버튼 (연동 안되어 있을 때 표시) */}
        {!isConnected && (
          <div className="shrink-0">
            <ConnectBtn />
          </div>
        )}
      </div>

      {show && (
        <DetailImageShow imgUrl="/slack_webhook.png" setShow={setShow} />
      )}

      {/* 바디 설정 */}
      {isConnected ? (
        <div className="space-y-4">
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-[var(--muted-foreground)]">
              메세지를 구독하려면 채널봇은 필수로 등록해야합니다.
            </label>
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
