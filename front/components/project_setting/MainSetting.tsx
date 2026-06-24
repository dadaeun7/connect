"use client";

import { useState } from "react";
import GeneralTab from "./GeneralTab";
import IntegrationTab from "./IntegrationTab";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"general" | "integration">(
    "general",
  );

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-[var(--foreground)]">
          프로젝트 설정
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">
          외부 플랫폼 API 동기화 파이프라인 정보 및 워크스페이스 권한 설정을
          수정합니다.
        </p>
      </div>

      <div className="flex gap-8 border-b border-[var(--border)] mb-8 px-1">
        {[
          { id: "general", label: "기본 프로젝트 개요" },
          { id: "integration", label: "플랫폼 통합 세팅 (API)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-bold transition-all relative uppercase tracking-wider ${
              activeTab === tab.id
                ? "text-[var(--primary)] font-black"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--primary)] shadow-[0_0_8px_rgba(255,106,0,0.2)]" />
            )}
          </button>
        ))}
      </div>

      <div
        className={
          activeTab === "general" ? "max-w-4xl mx-auto" : "max-w-5xl mx-auto"
        }
      >
        {activeTab === "general" ? <GeneralTab /> : <IntegrationTab />}
      </div>
    </div>
  );
}
