import { useState } from 'react';
import AppIntegrationSet from '@/app/api/offer/AppIntegrationSet';

const TITLE: { [key: string] : string} = {
  "Github": "Repository",
  "Figma" : "Project",
  "Notion": "Space",
  "Slack" : "Workspace"
}

export default function IntegrationTab() {
  const [activeTab, setActiveTab] = useState('Github');

  return (
<div className="flex-1 bg-black min-h-screen p-10 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-black mb-2 uppercase">통합</h1>
            <div className="h-1 w-20 bg-[#00FFA3]" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 사이드 탭 */}
          <div className="space-y-2">
            {['Github', 'Figma', 'Slack', 'Notion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  activeTab === tab 
                  ? 'bg-[#111111] border-[#00FFA3] text-[#00FFA3] shadow-[0_0_20px_rgba(0,255,163,0.1)]' 
                  : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'
                }`}
              >
                <span className="font-bold uppercase tracking-widest text-xs">{tab}</span>
                {activeTab === tab && <div className="w-1.5 h-1.5 bg-[#00FFA3] rounded-full animate-pulse" />}
              </button>
            ))}
          </div>

          {/* 폼 영역 */}
          <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-xl font-bold">{activeTab} Setup</h2>
                    <span className="bg-[#00FFA3] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">Connected</span>
                </div>

                <div className="space-y-6">
                    {['ClientID', 'ClientSecret'].map((label) => (
                        <div key={label}>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</label>
                            <input 
                                className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#00FFA3] outline-none transition-all"
                                placeholder={`Enter your ${label}`}
                            />
                        </div>
                    ))}
                    <button className="mb-4 w-full bg-[#00FFA3] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
                        Save Configuration
                    </button>
                </div>
                {/* 자사 developer 연동*/}
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mt-5">MarketPlace
                  <span className="ml-3 bg-[#00FFA3] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">beta</span>
                </label>
                <div className="text-[12px] text-gray-500 mt-1 mb-2">
                    직접 ID, Secret 발급없이 연동이 가능합니다. 사용량에 따라 요금이 과금됩니다.
                </div>
                <div className="hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <AppIntegrationSet app={activeTab.toLowerCase()} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}