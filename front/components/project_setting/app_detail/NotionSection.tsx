import { ArrowRight, RefreshCw } from "lucide-react";

interface NotionSectionProps {
  app: any;
  onSave: () => void;
}

export default function NotionSection({ app, onSave }: NotionSectionProps) {
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
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg text-sm text-[var(--muted-foreground)] font-medium leading-relaxed space-y-3">
            <p className="leading-relaxed">
              노션 보안 정책상, 외부 서비스에서 노션의 전체 페이지 목록을 임의로
              조회하거나 제어할 수 없습니다. <br />
              동기화할 페이지를 추가하거나 제외하려면 아래{" "}
              <strong>[노션 권한 및 페이지 재설정]</strong> 버튼을 통해 노션
              권한 창에서 직접 제어해 주셔야 합니다.
            </p>
            <div className="p-3 text-[var(--foreground)]/80 bg-[var(--card)] rounded-lg border border-[var(--border)]/60 space-y-1">
              <div className="flex items-center text-[var(--foreground)] font-bold mb-1">
                📌 권한 변경 방법
              </div>
              <div>1. 아래 버튼을 눌러 노션 권한 설정 팝업을 호출합니다.</div>
              <div>
                2. 팝업 창 내 <strong>[페이지 선택]</strong> 메뉴를 클릭합니다.
              </div>
              <div>
                3. 연결하고 싶은 페이지를 체크하거나, 제외할 페이지를 언체크한
                뒤 승인합니다.
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={onSave}
              className="flex items-center space-x-1.5 bg-[var(--foreground)] text-[var(--background)] font-bold px-4 py-2.5 rounded-lg text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>노션 권한 및 페이지 재설정</span>
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
