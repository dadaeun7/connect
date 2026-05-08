"use client";

import React, { useState, useMemo, useRef } from 'react';

const COL_WIDTH = 50;

export default function IntegratedFluidTimeline() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1)); // 4월 기준
  const [expandedId, setExpandedId] = useState<string | null>("m2");
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [viewDate]);

  // 내비게이션 로직 (스크롤 + 월 전환)
  const handleNav = (direction: 'prev' | 'next') => {
    if (!scrollRef.current) return;
    const moveDistance = COL_WIDTH * 7;
    if (direction === 'prev') {
      if (scrollRef.current.scrollLeft <= 0) {
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        setViewDate(prev);
        setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollLeft = 9999; }, 10);
      } else {
        scrollRef.current.scrollBy({ left: -moveDistance, behavior: 'smooth' });
      }
    } else {
      const isEnd = scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 5;
      if (isEnd) {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollLeft = 0; }, 10);
      } else {
        scrollRef.current.scrollBy({ left: moveDistance, behavior: 'smooth' });
      }
    }
  };

  const milestones = [
    { id: 'm1', title: "이슈명 #1", start: 5, end: 12, status: "In Progress", type: "enhancement" },
    { 
      id: 'm2', title: "이슈명 #2", start: 10, end: 24, 
      contents: [
        { id: 1, text: "서비스명/등록된 새이슈 내용과 병합", time: "2026-04-29 14:23:01" },
        { id: 2, text: "In Progress -> To do 로 변경", time: "2026-04-29 14:23:05" },
        { id: 3, text: "작업라인에서 새 이슈가 등록", time: "2026-04-29 14:23:10" },
      ] 
    }
  ];

  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-8 text-[#333] font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</h2>
        <div className="flex border rounded-lg bg-white shadow-sm overflow-hidden">
          <button onClick={() => handleNav('prev')} className="px-4 py-2 hover:bg-gray-100 border-r">&lt;</button>
          <button onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))} className="px-6 py-2 text-xs font-bold hover:bg-gray-100">Today</button>
          <button onClick={() => handleNav('next')} className="px-4 py-2 hover:bg-gray-100 border-l">&gt;</button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scroll-smooth" ref={scrollRef}>
          <div style={{ width: `${days.length * COL_WIDTH}px` }} className="relative">
            
            {/* 날짜 헤더 */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 sticky top-0 z-40">
                  {days.map(d => {
                    // 오늘 날짜인지 판별
                    const isToday = 
                      today.getFullYear() === viewDate.getFullYear() &&
                      today.getMonth() === viewDate.getMonth() &&
                      today.getDate() === d;

                    return (
                      <div key={d} 
                          style={{ width: `${COL_WIDTH}px` }} 
                          className={`flex-shrink-0 h-12 flex flex-col items-center justify-center text-[10px] border-r border-gray-100/30 transition-colors
                          ${isToday ? 'bg-blue-600 text-white font-bold relative' : 'text-gray-400'}`}>
                        {d}
                        {/* 오늘일 경우 하단에 작은 점 추가 (선택 사항) */}
                        {isToday && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full animate-pulse" />}
                      </div>
                    );
                  })}
                </div>

            {/* 카드 렌더링 영역 - flex-col로 쌓아서 높이 확장에 대응 */}
            <div className="relative p-6 flex flex-col gap-4 min-h-[600px]">
              {/* 가이드라인 */}
              <div className="absolute inset-0 flex pointer-events-none">
                {days.map(d => <div key={d} style={{ width: `${COL_WIDTH}px` }} className="h-full border-r border-gray-50 opacity-50" />)}
              </div>

              {milestones.map((m) => {
                const left = (m.start - 1) * COL_WIDTH;
                const width = (m.end - m.start + 1) * COL_WIDTH;
                const isExpanded = expandedId === m.id;

                return (
                  <div key={m.id} className="relative w-full transition-all duration-300">
                    {/* 이슈 카드 본체 - 상세 내역을 포함하는 컨테이너 */}
                    <div 
                      className={`relative flex flex-col bg-[#D9D9D9] border border-gray-300 rounded-xl shadow-sm transition-all duration-300 overflow-hidden
                        ${isExpanded ? 'z-20 shadow-lg ring-1 ring-black/5' : 'z-10'}`}
                      style={{ 
                        marginLeft: `${left}px`, 
                        width: isExpanded ? '600px' : `${width}px`,
                        minWidth: `${width}px` // 축소 시 최소 너비 유지
                      }}
                    >
                      {/* 카드 상단 헤더 */}
                      <div 
                        className="h-10 flex items-center px-4 cursor-pointer hover:bg-gray-300/50"
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      >
                        <span className="text-[11px] font-bold truncate flex-1">{m.title}</span>
                        <div className="flex gap-2 items-center opacity-60 scale-90">
                           {m.status && <span className="bg-white/50 px-2 py-0.5 rounded text-[9px]">{m.status}</span>}
                           <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {/* [일체형 디자인] 카드 내부 상세 리스트 */}
                      {isExpanded && m.contents && (
                        <div className="bg-white border-t border-gray-200 animate-fadeIn">
                          {m.contents.map((c) => (
                            <div key={c.id} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-pink-500">🐙</span>
                                <span className="text-gray-700 font-medium">{c.text}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono">{c.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* 카드들 사이 간격 확보용 더미 공간 (isExpanded일 때만) */}
                    {isExpanded && <div className="h-2" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}