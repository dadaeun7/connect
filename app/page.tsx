"use client";

import MainDashboard from "@/components/history/MainDashboard";
import Sidebar from "@/components/ui/SideBar";

export default function Home() {
  return (
<div className="flex h-screen overflow-hidden">
      {/* 1. 사이드바: 고정된 너비 혹은 확장/축소 상태에 따라 변함 */}
      <Sidebar />

      {/* 2. 메인 대시보드: flex-1을 주어 남은 모든 공간을 차지하게 합니다. */}
      {/* h-full과 overflow-y-auto를 주어 메인 영역만 별도로 스크롤되게 만듭니다. */}
      <main className="flex-1 h-full overflow-y-auto bg-[#F5F5F5]">
        <MainDashboard />
      </main>
    </div>
  );
}
