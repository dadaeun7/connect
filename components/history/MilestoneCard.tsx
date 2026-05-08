"use client";
import IssueRow from "./IssueRow";

export default function MilestoneCard() {
  return (
    <div className="bg-[var(--card)] border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* 제목 및 상태 뱃지 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">마일스톤명, 이슈의 대표명을 적습니다.</h2>
          <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-500">
            마감일 2026-04-24
          </span>
          <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-bold">close 50/1</span>
          <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-bold">open 70/2</span>
        </div>
        <button className="p-2 bg-gray-100 p-1 rounded"><img className="h-2" src="/arrow.png" alt="Toggle" /></button>
      </div>

      {/* 진행률 바 */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium mb-1">
          <span>진행상황 0%</span>
          {/* 아바타 스택 */}
          <div className="flex -space-x-2">
             {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 overflow-hidden" />)}
             <span className="pl-3 text-gray-400">+1</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-gray-400 h-full w-[10%]" />
        </div>
      </div>

      {/* 내부 이슈 목록 (중첩된 연회색 박스) */}
      <div className="bg-[#F0F0F0] rounded-xl p-4 space-y-3 font-sans">
         <IssueRow title="이슈명 #1" />
         <IssueRow title="이슈명 #2" isTable />
      </div>
    </div>
  );
}