"use client";

import React, { useState } from "react";
import MyInfoTab from "./MyInfoTab";
import AffiliationTab from "./AffiliationTab";

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<"info" | "affiliation">("info");

  return (
    <div className="flex-1 bg-black min-h-screen p-10 text-white selection:bg-[#00FFA3] selection:text-black">
      {/* Header 영역 */}
      <div className="mb-12">
        <h1 className="text-4xl font-[700] tracking-tighter mb-2 text-white uppercase">
          내 정보
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-tight">
          개인 정보 및 프로젝트 소속을 관리하세요.
        </p>
      </div>

      {/* Tabs - 네온 스타일 적용 */}
      <div className="flex gap-10 border-b border-white/5 mb-10 px-2">
        {[
          { id: "info", label: "일반" },
          { id: "affiliation", label: "소속" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id
                ? "text-[#00FFA3]"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content 영역 */}
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "info" ? <MyInfoTab /> : <AffiliationTab />}
      </div>
    </div>
  );
}
