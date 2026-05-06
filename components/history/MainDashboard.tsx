"use client";

import MilestoneCard from "./MilestoneCard";

export default function MainDashboard() {
  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 text-[#333]">
      {/* 상단 탭 메뉴 */}
      <div className="flex gap-6 border-b border-gray-300 mb-6 text-sm font-medium">
        {['전체', 'open', 'close'].map((tab, i) => (
          <button key={tab} className={`pb-2 ${i === 0 ? 'border-b-2 border-black' : 'text-gray-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input className="w-full bg-[#E0E0E0] rounded-full py-2 px-10 outline-none" placeholder="Search..." />
          <span className="absolute left-4 top-2.5 text-gray-500">🔍</span>
        </div>
        <button className="bg-[#E0E0E0] p-2 rounded-lg">F</button>
        <button className="bg-[#E0E0E0] px-4 py-2 rounded-lg font-bold text-sm">Add +</button>
      </div>

      {/* 마일스톤 카드 (이미지의 큰 흰색 박스) */}
      <MilestoneCard />
    </div>
  );
}