"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="flex-1 bg-black min-h-screen p-8 text-white font-sans">
      {/* 상단 헤더: 날짜 컨트롤러 */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
            {viewDate.getFullYear()}. {viewDate.getMonth() + 1}
          </h2>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest mt-1 uppercase">Fluid_Project_Timeline_v1</p>
        </div>
        
        <div className="flex items-center bg-[#111] border border-white/5 rounded-2xl p-1 shadow-xl">
          <button onClick={() => handleNav('prev')} className="p-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))} 
            className="px-6 text-[10px] font-black uppercase tracking-widest hover:text-[#00FFA3] transition-colors border-x border-white/5"
          >
            Today
          </button>
          <button onClick={() => handleNav('next')} className="p-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 타임라인 메인 컨테이너 */}
      <div className="border border-white/[0.03] rounded-3xl bg-[#0D0D0D] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scroll-smooth" ref={scrollRef}>
          <div style={{ width: `${days.length * COL_WIDTH}px` }} className="relative">
            
            {/* 날짜 헤더 (상단 고정) */}
            <div className="flex border-b border-white/[0.03] bg-black/40 sticky top-0 z-40 backdrop-blur-md">
              {days.map(d => {
                const isToday = 
                  today.getFullYear() === viewDate.getFullYear() &&
                  today.getMonth() === viewDate.getMonth() &&
                  today.getDate() === d;

                return (
                  <div key={d} 
                      style={{ width: `${COL_WIDTH}px` }} 
                      className={`flex-shrink-0 h-14 flex flex-col items-center justify-center text-[10px] border-r border-white/[0.02] transition-colors
                      ${isToday ? 'bg-[#00FFA3] text-black font-black' : 'text-gray-600'}`}>
                    <span>{d}</span>
                    <span className="text-[8px] opacity-60 uppercase font-mono">{viewDate.toLocaleString('en-US', { month: 'short' })}</span>
                  </div>
                );
              })}
            </div>

            {/* 카드 및 그리드 영역 */}
            <div className="relative p-10 flex flex-col gap-6 min-h-[650px]">
              {/* 그리드 가이드라인 (세로선) */}
              <div className="absolute inset-0 flex pointer-events-none opacity-[0.02]">
                {days.map(d => <div key={d} style={{ width: `${COL_WIDTH}px` }} className="h-full border-r border-white" />)}
              </div>

              {milestones.map((m) => {
                const left = (m.start - 1) * COL_WIDTH;
                const width = (m.end - m.start + 1) * COL_WIDTH;
                const isExpanded = expandedId === m.id;

                return (
                  <div key={m.id} className="relative w-full transition-all duration-300">
                    <div 
                      className={`relative flex flex-col border transition-all duration-500 overflow-hidden rounded-2xl
                        ${isExpanded 
                          ? 'bg-[#111] border-[#00FFA3]/30 z-20 shadow-[0_0_30px_rgba(0,255,163,0.05)]' 
                          : 'bg-[#1A1A1A]/40 border-white/[0.05] z-10'}`}
                      style={{ 
                        marginLeft: `${left}px`, 
                        width: isExpanded ? '600px' : `${width}px`,
                        minWidth: `${width}px`
                      }}
                    >
                      {/* 타임라인 바 헤더 */}
                      <div 
                        className={`h-12 flex items-center px-4 cursor-pointer transition-colors relative
                          ${isExpanded ? 'bg-[#1A1A1A]' : 'hover:bg-white/[0.02]'}`}
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      >
                        {/* 이미지 컨셉의 네온 도트 */}
                        <div className={`w-1.5 h-1.5 rounded-full mr-3 shadow-lg ${isExpanded ? 'bg-[#00FFA3] shadow-[#00FFA3]' : 'bg-gray-600'}`} />
                        
                        <span className={`text-[11px] font-black uppercase tracking-tight truncate flex-1 
                          ${isExpanded ? 'text-[#00FFA3]' : 'text-gray-400'}`}>
                          {m.title}
                        </span>

                        <div className="flex gap-2 items-center">
                           {m.status && (
                             <span className="bg-white/5 text-gray-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                               {m.status}
                             </span>
                           )}
                           <span className={`text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#00FFA3]' : 'text-gray-600'}`}>
                             ▼
                           </span>
                        </div>
                        
                        {/* 확장 시 배경에 은은한 그라데이션 추가 */}
                        {isExpanded && <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/5 to-transparent pointer-events-none" />}
                      </div>

                      {/* 확장 상세 리스트 (일체형 다크 디자인) */}
                      {isExpanded && m.contents && (
                        <div className="bg-black/40 animate-fadeIn border-t border-white/[0.03]">
                          {m.contents.map((c) => (
                            <div key={c.id} className="flex justify-between items-center p-4 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors">
                              <div className="flex items-center gap-3 text-[11px]">
                                <span className="text-[#00FFA3] opacity-60">🐙</span>
                                <span className="text-gray-400 font-medium tracking-tight">{c.text}</span>
                              </div>
                              <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">{c.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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