"use client";

import React, { useState } from 'react';

const TITLE: { [key: string] : string} = {
  "Github": "Repository",
  "Figma" : "Project",
  "Notion": "Space",
  "Slack" : "Workspace"
}

export default function IntegrationSettings() {
  const [activeTab, setActiveTab] = useState('Github');

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen font-sans text-[#333]">
      {/* 상단 탭 메뉴 */}
      <div className="flex gap-10 border-b border-gray-200 mb-12">
        {['Github', 'Figma', 'Slack', 'Notion'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all ${
              activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Github Developer 연동 섹션 */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold">{activeTab} Developer</h2>
          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">연동중</span>
        </div>
        <p className="text-xs text-gray-500 mb-6 border-b border-gray-100 pb-2">
          {activeTab} 문서를 참조하여 연동에 필요한 정보를 입력하고 직접 연결하여 사용할 수 있어요.
        </p>

        {/* 입력 폼 */}
        <div className="space-y-6 max-w-2xl">
          <div className="bg-[#D9D9D9] p-4 rounded-md text-sm font-bold text-gray-600">
            {TITLE[activeTab]} 명
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">ClientID</label>
            <input className="text-[12px] w-full bg-[#D9D9D9] h-10 rounded-md py-2 px-2 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">ClientSecret</label>
            <input className="text-[12px] w-full bg-[#D9D9D9] h-10 rounded-md py-2 px-2 outline-none" />
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-[#D9D9D9] px-6 py-2 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-300">
              확인 및 저장
            </button>
          </div>
        </div>
      </section>

      {/* MarketPlace 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold">MarketPlace</h2>
          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">베타</span>
        </div>
        <p className="text-xs text-gray-500 mb-6 border-b border-gray-100 pb-2">
          직접 ID, Secret 발급없이 연동이 가능합니다. 사용량에 따라 요금이 과금됩니다.
        </p>

        <div className="max-w-2xl bg-[#D9D9D9] p-4 rounded-md text-center text-xs font-bold text-gray-500"
              onClick={()=>{
                
              }}>
          연동하기
        </div>
      </section>
    </div>
  );
}