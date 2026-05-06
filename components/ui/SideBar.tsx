"use client";

import React, { useState } from 'react';

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [projects, setProjects] = useState(['프로젝트 A', '프로젝트 B', '프로젝트 C']);
    const [showProjects, setShowProjects] = useState(false);

  return (
    <aside 
      className={`h-screen border-r border-gray-200 bg-[#fff] transition-all duration-300 flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
    {/*로고 영역 */}
    <div className={`flex items-center ${isExpanded ? 'justify-start px-4' : 'justify-center'} py-4`}>
        <img 
            src="/logo.png" 
            alt="Logo" 
            className={`w-8 h-8 transition-all ${isExpanded ? 'ml-0' : ''}`} 
        />
    </div>
    {/* 프로젝트 리스트 */}
    <nav className="mt-2 pb-5 space-y-2 px-2 cursor-pointer">
        <div 
            key={projects[0]} 
            className="flex h-12 items-center p-2 rounded-md border border-gray-300 cursor-pointer group whitespace-nowrap overflow-hidden"
          >
            {/* 아이콘 대용 박스 */}
            <div className={`min-w-[38px] h-8 flex items-center justify-center text-[10px]
                ${isExpanded ? 'hidden' : 'flex'}`}>
              {projects[0][0]}
            </div>
            {/* 텍스트: 확장 상태일 때만 노출 */}
            <div className={`text-[13px] ml-4 text-sm font-medium transition-opacity duration-200 flex-1`}>
                {projects[0]}
            </div>
            <div
            className="flex items-center justify-end"
            onClick={(e) => {
                e.stopPropagation(); // 부모 div의 클릭 이벤트와 겹치지 않도록 방지
                setShowProjects(!showProjects);
            }}>
                <img 
                className={`w-5 h-5 transition-transform duration-300 ${showProjects ? 'rotate-180' : 'rotate-0'}`}
                src="/Chevron down.png" 
                alt="nav-toggle"
                />
            </div>
        </div>
      </nav>
      {/* 협업 */}
      <nav className="mt-4 pb-10 space-y-2 px-4 border-b border-gray-200 cursor-pointer">
        <div className='mb-4 text-[15px]'>협업</div>
        {['작업라인', '타임라인', '새이슈'].map((item, idx) => (
          <div 
            key={item} 
            className="text-[#363636] flex items-center p-2 rounded-md hover:bg-[#A7A7A7] cursor-pointer group whitespace-nowrap overflow-hidden"
          >
            {/* 아이콘 대용 박스 */}
            <div className="min-w-[32px] h-8 bg-gray-200 rounded flex items-center justify-center text-[10px]">
              {item[0]}
            </div>
            {/* 텍스트: 확장 상태일 때만 노출 */}
            <span className={`text-[13px] ml-4 text-sm font-medium transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              {item}
            </span>
          </div>
        ))}
      </nav>
    {/* 카테고리 */}
      <nav className="mt-4 pb-10 space-y-2 px-4 border-b border-gray-200 cursor-pointer">
        <div className='mt-4 mb-4 text-[15px]'>설정</div>
        {['일반', '통합', '사용자 및 권한'].map((item, idx) => (
          <div 
            key={item} 
            className="text-[#363636] flex items-center p-2 rounded-md hover:bg-[#A7A7A7] cursor-pointer group whitespace-nowrap overflow-hidden"
          >
            {/* 아이콘 대용 박스 */}
            <div className="min-w-[32px] h-8 bg-gray-200 rounded flex items-center justify-center text-[10px]">
              {item[0]}
            </div>
            {/* 텍스트: 확장 상태일 때만 노출 */}
            <span className={`text-[13px] ml-4 text-sm font-medium transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              {item}
            </span>
          </div>
        ))}
      </nav>
      {/* 확장/축소 토글 버튼 */}
      <div 
        className={`h-12 flex items-center border-b border-gray-200 cursor-pointer hover:bg-[#A7A7A7] transition-all ${
          isExpanded ? 'px-5 justify-end' : 'justify-center'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          className={`w-5 h-5 transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : 'rotate-270'
          }`}
          src="/Chevron down.png" 
          alt="nav-toggle"
        />
      </div>
    </aside>
  );
}