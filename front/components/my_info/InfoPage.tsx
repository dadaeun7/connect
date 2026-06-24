"use client";

import React, { useState } from "react";
import MyInfoTab from "./MyInfoTab";
import AffiliationTab from "./AffiliationTab";

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<"info" | "affiliation">("info");

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
          내 정보
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          개인 프로필 양식 정보 및 워크스페이스 소속 히스토리를 관리하세요.
        </p>
      </div>

      <div className="flex gap-8 border-b border-[var(--border)] mb-8 px-1">
        {[
          { id: "info", label: "일반" },
          { id: "affiliation", label: "소속" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === tab.id
                ? "text-[var(--primary)] font-black"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--primary)]" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {activeTab === "info" ? <MyInfoTab /> : <AffiliationTab />}
      </div>
    </div>
  );
}
