"use client";

import React, { useState } from 'react';

export default function Sidebar({setShowMain}:{ setShowMain: React.Dispatch<React.SetStateAction<string>> }) {
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [projects, setProjects] = useState(['프로젝트 A', '프로젝트 B', '프로젝트 C']);
    const [showProjects, setShowProjects] = useState(false);

  return (
    <aside 
      className={`custom-scrollbar overflow-y-auto min-h-screen border-r border-white/5 bg-[#000] transition-all duration-300 flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
    {/* 로고 영역: 이미지 상단 로고 스타일 */}
    <div className={`flex items-center ${isExpanded ? 'justify-start px-6' : 'justify-center'} py-8`}>
        <div className="w-8 h-8 bg-[#00FFA3] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-black rounded-sm rotate-45" />
        </div>
        {isExpanded && <span className="ml-3 text-white font-black italic tracking-tighter text-xl">Connect</span>}
    </div>

    {/* 프로젝트 리스트: 레퍼런스의 드롭다운 스타일 적용 */}
    <nav className="px-4 pb-6 space-y-2">
        <div 
            onClick={() => setShowProjects(!showProjects)}
            className="flex w-full h-12 items-center p-[6] rounded-xl border border-white/10 bg-[#111] cursor-pointer group hover:border-[#00FFA3]/50 transition-all"
          >
            <div className="min-w-[32px] h-8 bg-[#00FFA3]/10 text-[#00FFA3] rounded flex items-center justify-center text-xs font-bold">
              {projects[0][0]}
            </div>
            {isExpanded && (
                <>
                <div className="text-[13px] ml-3 text-white font-bold flex-1 truncate">{projects[0]}</div>
                <span className={`text-[10px] text-gray-500 transition-transform ${showProjects ? 'rotate-180' : ''}`}>▼</span>
                </>
            )}
        </div>
    </nav>

    {/* 메뉴 섹션: 협업 & 설정 */}
    {[
        { title: '협업', items: ['작업라인', '타임라인', '새이슈'] },
        { title: '설정', items: ['일반', '통합', '사용자 및 권한'] }
    ].map((section) => (
        <nav key={section.title} className="pb-10 space-y-[1] px-4 cursor-pointer">
            {isExpanded && <div className="px-2 mb-4 text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">{section.title}</div>}
            <div className="space-y-1">
                {section.items.map((item) => (
                    <div 
                        key={item} 
                        className="flex items-center p-2 rounded-md hover:bg-white/5 cursor-pointer group transition-colors"
                        onClick={() => setShowMain(item)}
                    >
                        <div className="min-w-[32px] h-8 bg-[#1A1A1A] group-hover:bg-[#00FFA3]/20 rounded-lg flex items-center justify-center text-[10px] text-gray-400 group-hover:text-[#00FFA3] transition-colors">
                            {item[0]}
                        </div>
                        {isExpanded && (
                            <span className="text-[13px] ml-4 text-gray-400 group-hover:text-white font-medium">
                                {item}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    ))}

    {/* 하단 확장/축소 토글 */}
    <div 
        className={`mt-auto h-16 flex items-center border-t border-white/5 cursor-pointer hover:bg-white/5 transition-all 
            ${isExpanded ? 'px-5 justify-end' : 'justify-center'}
            `}
        onClick={() => setIsExpanded(!isExpanded)}
    >
                <img 
          className={`h-2 transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : 'rotate-270'
          }`}
          src="/arrow.png" 
          alt="nav-toggle"
        />
    </div>
    </aside>
  );
}