"use client";

import { useActiveTab } from "./hooks/useActiveTab";
import GeneralTab from "./GeneralTab";
import AffiliationTab from "./AffiliationTab";

export default function SettingPage() {
  const { activeTab, setActiveTab } = useActiveTab({ initialTab: "general" });

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-[var(--foreground)]">
          프로젝트 설정
        </h1>
        <p className="text-s text-[var(--muted-foreground)] font-medium leading-relaxed">
          프로젝트에 인원을 초대하고, 앱 세부권한에 대해 확인합니다.
        </p>
      </div>

      <div className="flex gap-8 border-b border-[var(--border)] mb-8 px-1">
        {[
          { id: "general", label: "앱 세부 권한" },
          { id: "integration", label: "초대 · 히스토리" },
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

      <div className="max-w-4xl mx-auto">
        {activeTab === "general" ? <GeneralTab /> : <AffiliationTab />}
      </div>
    </div>
  );
}
