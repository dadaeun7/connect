import { useState } from "react";
import AppIntegrationSet from "@/components/project_setting/AppIntegrationSet";

const TITLE: { [key: string]: string } = {
  Github: "Repository URL / Target Path",
  Figma: "Figma File URL Token",
  Notion: "Notion Database ID",
  Slack: "Slack Incoming Webhook URL",
};

export default function IntegrationTab() {
  const [activeTab, setActiveTab] = useState("Github");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-2">
        {["Github", "Figma", "Slack", "Notion"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full flex items-center justify-between py-4 px-5 rounded-xl border text-left text-sm transition-all ${
              activeTab === tab
                ? "bg-[var(--secondary)] border-[var(--primary)] text-[var(--primary)] font-black shadow-sm"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/40"
            }`}
          >
            <span className="font-bold tracking-wider uppercase">
              {tab} Pipeline
            </span>
            {activeTab === tab && (
              <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wide mb-1">
            {activeTab} Pipeline Setup
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] font-medium">
            실시간 플랫폼 통신을 위한 클라이언트 연동 보안 자격 정보를
            동기화합니다.
          </p>
        </div>

        <div className="space-y-4 border-b border-[var(--border)] pb-5">
          {[
            "ClientID Token",
            "ClientSecret Key",
            TITLE[activeTab] || "Target",
          ].map((label) => (
            <div key={label} className="flex flex-col space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                {label}
              </label>
              <input
                type="password"
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder={`Enter your secure ${label}`}
              />
            </div>
          ))}
          <button className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-md hover:opacity-95 transition-opacity">
            Save Configuration
          </button>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              자동 관리 마켓플레이스 연동
            </span>
            <span className="bg-[var(--primary)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
              BETA
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-medium">
            OAuth 클라이언트 자격 증명을 직접 발급 및 매핑할 필요 없이, 본
            어플리케이션 매니지드 코어 모듈을 경유하여 통합 파이프라인을 즉시
            실시간 가동합니다.
          </p>
          <div className="border border-[var(--border)] rounded-xl overflow-hidden mt-4 bg-[var(--muted)]/40">
            <AppIntegrationSet app={activeTab.toLowerCase()} />
          </div>
        </div>
      </div>
    </div>
  );
}
