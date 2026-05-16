import { Calendar, ChevronRight, Search } from "lucide-react";
import IssueRow from "./IssueRow";

export default function MilestoneCard() {
  return (
    <div className="bg-[var(--card-foreground)] border border-white/[0.03] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* 상단 제목 영역: 텍스트 가독성 확보 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-black text-white leading-none mb-1">
              TASK 명
            </h2>
            <div className="bg-[#00FFA3] w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#00FFA3]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-[12px] text-gray-500 font-black border border-white/10 px-2.5 py-2 rounded-md uppercase tracking-widest bg-white/[0.02]">
              <Calendar size={14} className="text-[#00FFA3]" /> 마감일
              2026.04.24
            </span>
            <span className="text-[12px] font-black text-gray-600 uppercase ml-2">
              Closed <span className="text-white/80">50/1</span>
            </span>
            <span className="text-[12px] font-black text-gray-600 uppercase">
              Open <span className="text-[#00FFA3]">70/2</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 bg-white/[0.03] hover:bg-[#00FFA3] hover:text-black rounded-lg transition-all border border-white/10 uppercase tracking-widest text-[10px]">
            + connect Issue
          </button>
          <button className="rotate-90 p-2 bg-white/[0.03] hover:bg-[#00FFA3] hover:text-black rounded-lg transition-all border border-white/5">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 진행률 바 섹션: 배경을 더 어둡게 처리하여 대비 감소 */}
      <div className="mb-8 bg-black/40 p-5 rounded-2xl border border-white/[0.02]">
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-[#0D0D0D] bg-[#222]"
                />
              ))}
            </div>
            <span className="text-[13px] font-black text-[#00FFA3]">64%</span>
          </div>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-[#00FFA3] h-full w-[64%] shadow-[0_0_10px_rgba(0,255,163,0.3)]" />
        </div>
      </div>
      {/* 하위 이슈 목록: 카드 내부의 카드 느낌 */}
      <div className="space-y-3 bg-white/2 p-3 rounded-lg">
        {/* 이슈 추가 및 검색 */}
        <div className="flex items-center gap-2 mb-4">
          <button className="rotate-90 p-2 bg-white/[0.03] hover:bg-[#00FFA3] hover:text-black rounded-lg transition-all border border-white/5">
            <Search size={18} />
          </button>
        </div>
        <IssueRow title="이슈명 #1" />
        <IssueRow title="이슈명 #2" isTable />
      </div>
    </div>
  );
}
