import { useState } from "react";
import GeneralTab from "./GeneralTab";
import IntegrationTab from "./IntegrationTab";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"general" | "integration">(
    "general",
  );

  return (
    <div className="flex-1 bg-black min-h-screen p-10 text-white selection:bg-[#00FFA3] selection:text-black">
      {/* Header 영역 */}
      <div className="mb-12">
        <h1 className="text-4xl font-[700] tracking-tighter mb-2 text-white uppercase">
          프로젝트 설정
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-widest">
          프로젝트 기본 정보와 연동 앱을 관리하세요.
        </p>
      </div>

      <div className="flex gap-10 border-b border-white/5 mb-10 px-2">
        {[
          { id: "general", label: "프로젝트 정보" },
          { id: "integration", label: "외부 연동" },
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
        {activeTab === "general" ? <GeneralTab /> : <IntegrationTab />}
      </div>
    </div>
  );
}
