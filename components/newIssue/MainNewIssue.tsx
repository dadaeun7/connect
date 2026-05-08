"use client";

import React, { useState } from 'react';

export default function IssueListView() {
  const [activeTab, setActiveTab] = useState('전체');
  const [expandedId, setExpandedId] = useState<number | null>(3); // 3번 이슈가 펼쳐진 예시

  const issues = [
    { id: 1, title: "서비스명/등록된 내용", status: "검토전", date: "2026-04-30 10:30:21" },
    { id: 2, title: "서비스명/등록된 내용", status: "논의중", date: "2026-04-30 10:30:21" , contents: []},
    { id: 3, title: "서비스명/등록된 내용", status: "논의중", date: "2026-04-30 10:30:21", contents: [
      "해당 이슈를 논의중으로 변경했습니다.",
      "@테스트1 @테스트2 님 00 내용에 대한 확인 부탁드립니다.",
      "@테스트3 본 이슈건은 다른 이슈건과 유사하여 이슈 병합해주시면 감사하겠습니다."
    ]},
  ];

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-8 font-sans text-[#333]">
      {/* 1. 상단 탭 메뉴 */}
      <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
        {['전체', '검토전', '논의중', '완료'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? 'border-b-2 border-[#3B82F6] text-[#333]' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. 검색 및 필터바 */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <input 
            className="w-full bg-[#E0E0E0] rounded-full py-2 px-10 outline-none text-sm" 
            placeholder="Search..." 
          />
          <img src="/search.png" alt="Search" className="absolute left-4 top-3 h-4 w-4" />
        </div>
        <button className="bg-[#E0E0E0] px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap">키워드</button>
      </div>

      {/* 3. 이슈 리스트 */}
      <div className="space-y-3 mb-24">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm">
            {/* 이슈 헤더 */}
            <div className="flex flex-col md:flex-row justify-between p-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{issue.title}</span>
                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-gray-500">{issue.status}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">{issue.date}</span>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button className="bg-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">삭제하기</button>
                <button className="bg-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">이슈병합</button>
                <button className="bg-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">이슈등록</button>
                {issue.status === '검토전' ? (
                  <button className="bg-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm text-gray-400 italic">논의하기</button>
                ) : (
                  <button 
                    onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                    className="bg-white p-1.5 rounded shadow-sm"
                  >
                    <span className={`block transition-transform text-[10px] ${expandedId === issue.id ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                )}
              </div>
            </div>

            {/* 아코디언 내용 */}
            {expandedId === issue.id && issue.contents && (
              <div className="px-4 pb-4 space-y-2 animate-fadeIn">
                {issue.contents.map((content, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-sm flex justify-between items-center shadow-inner">
                    <span className="text-[11px] text-gray-700 leading-relaxed">{content}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-[10px] text-gray-400">👤</span>
                      <span className="text-[9px] text-gray-400 font-mono">2026-04-30 10:30:21</span>
                    </div>
                  </div>
                ))}
                {/* 4. 하단 고정 등록바 (Floating Input) */}
                <div className="mx-auto">
                    <div className="bg-[#BDBDBD] rounded-2xl p-4 shadow-lg border border-gray-400">
                        <input placeholder="댓글 추가..." className="text-[12px] w-full bg-[#D9D9D9] h-10 rounded-md py-2 px-2 mb-2 outline-none" />
                        <div className="flex justify-between px-1 text-sm text-gray-500 font-bold">
                            <button className="text-xl text-gray-600 px-2 font-light">+</button>
                            <button className="flex items-center gap-2 text-[11px] font-bold text-gray-700 hover:text-black transition-colors">
                            등록하기 <span className="text-xs">&gt;</span>
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


    </div>
  );
}