"use client";

import { BadgeAlert } from "lucide-react";
import { RedirectConfig } from "./AppConnectTab";
import { useState } from "react";
import { ImageModal } from "@/components/share/ImageModal";

export default function AppIntegrationSet({
  redirectUrl,
  activeTab,
  app,
}: Readonly<{
  redirectUrl: string;
  activeTab: string;
  app: RedirectConfig;
}>) {
  const RedirectDescription: Record<string, string> = {
    GITHUB: "/github_redirect.png",
    FIGMA: "/figma_redirect.png",
    NOTION: "/notion_redirect.png",
    SLACK: "/slack_redirect.png",
  };

  const [showImage, setShowImage] = useState(false);

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-[var(--status-blocked)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
          필수
        </span>
        <span className="text-[13px] font-bold text-[var(--primary)] uppercase">
          연동 전 꼭 확인해주세요!
        </span>
      </div>
      <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed font-medium">
        정상적으로 연동을 위해 애플리케이션 설정 👉 redirect Url 란 아래 주소를
        추가해주세요.
      </p>
      <div className="border border-[var(--border)] rounded-xl overflow-hidden mt-4 bg-[var(--muted)]/40">
        <div className="p-4 bg-[var(--card)] flex items-center justify-between text-sm font-bold border-t border-[var(--border)]/40">
          <div className="flex items-center gap-1">
            <span className="text-[var(--muted-foreground)] text-sm font-bold tracking-wide">
              {redirectUrl}
            </span>
          </div>

          <button
            onClick={() => setShowImage(true)}
            className="px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-black rounded-lg text-[11px] shadow-sm hover:opacity-90 transition-opacity uppercase cursor-pointer"
          >
            위치 확인
          </button>
        </div>
      </div>
      {/** */}
      <div className="p-1 flex flex-col justify-between mt-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span>
              <BadgeAlert size={16} />
            </span>
            <h3 className="font-bold text-[var(--foreground)] text-[13px]">
              {activeTab} 접근 요구 범위
            </h3>
          </div>

          <div className="space-y-4">
            {app.scopes.map((scope, index) => (
              <div
                key={index}
                className="flex gap-3 items-start bg-[var(--sidebar-primary)]/5 border border-[var(--sidebar-border)]/40 p-3 rounded-xl"
              >
                <div className="text-green-500 font-bold mt-0.5 text-sm">✓</div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    {scope.title}
                  </h4>
                  <p className="text-sm text-[var(--sidebar-foreground)]/70 mt-0.5 leading-relaxed">
                    {scope.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[12px] text-gray-400 mt-6 leading-relaxed">
            * 본 서비스는 읽기 권한만 요구하며 명시적인 동의 없이 데이터를
            임의로 수정하거나 변조하지 않습니다.
          </p>
        </div>
      </div>

      {showImage && (
        <ImageModal
          src={RedirectDescription[activeTab.toUpperCase()]}
          alt={RedirectDescription[activeTab.toUpperCase()]}
          onClose={() => setShowImage(false)}
        />
      )}
    </div>
  );
}
