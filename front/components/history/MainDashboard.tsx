import { Funnel } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import AddMilestone from "./AddMilstone";
import { useState } from "react";

export default function MainDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const oepnModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex-1 bg-black min-h-screen p-10 text-white selection:bg-[#00FFA3] selection:text-black">
      {/* 상단 헤더: 이미지 좌상단 Welcome back 스타일 */}
      <div className="flex justify-between items-start">
        <div className="mb-12">
          <h1 className="text-4xl font-[700] tracking-tighter mb-2 text-white uppercase">
            작업 라인
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-widest">
            최근 프로젝트 활동을 확인하세요.
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 3. 배경 어둡게 처리 (Backdrop) */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal} // 배경 클릭 시 닫기
          ></div>

          {/* 4. 폼 컨텐츠 (정중앙 배치) */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide transform transition-all animate-in fade-in zoom-in duration-300">
            {/* 폼 컴포넌트 내부에 '닫기' 기능을 넣고 싶다면 props로 전달 가능 */}
            <div className="relative">
              {/* 우측 상단 닫기 아이콘 버튼 (선택 사항) */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-6 text-slate-400 hover:text-white text-2xl z-20"
              >
                &times;
              </button>

              <AddMilestone />
            </div>
          </div>
        </div>
      )}

      {/* 요약 카드 섹션 (기존 유지) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Tasks", value: "248", trend: "+3.4%", up: true },
          { label: "In Progress", value: "24", trend: "-1.2%", up: false },
          { label: "Completed", value: "236", trend: "+2.4%", up: true },
          { label: "High Priority", value: "12", trend: "+4.5%", up: true },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#111] border border-white/5 px-6 py-4 rounded-xl relative overflow-hidden group hover:border-[#00FFA3]/20 transition-all"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00FFA3] opacity-0 group-hover:opacity-100 transition-all" />
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />{" "}
              {stat.label}
            </p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black c tracking-tighter">
                {stat.value}
              </span>
              <span
                className={`text-[11px] font-black ${stat.up ? "text-[#00FFA3]" : "text-red-500"} tracking-tighter`}
              >
                {stat.trend}{" "}
                <span className="text-gray-600 ml-1 opacity-50 uppercase">
                  vs last month
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 mb-3">
        <button className="bg-[#111] border border-white/10 text-white font-bold px-5 py-3 rounded-md hover:bg-[#1A1A1A] transition-all text-sm uppercase tracking-widest">
          <Funnel size={15} />
        </button>
        <button
          className="bg-[#00FFA3] text-black font-black px-5 py-3 rounded-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,163,0.2)] text-sm uppercase"
          onClick={oepnModal}
        >
          + Create Task
        </button>
      </div>
      {/* 메인 리스트 카드: MilestoneCard가 배치되는 핵심 영역 */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-4 mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">
            Active Milestones
          </h3>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* MilestoneCard 렌더링 */}
        <MilestoneCard />

        {/* 추가 마일스톤 예시 (반복 시) */}
        <div className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <MilestoneCard />
        </div>
      </div>
    </div>
  );
}
