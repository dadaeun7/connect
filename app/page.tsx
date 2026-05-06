"use client";

import MainDashboard from "@/components/history/MainDashboard";
import Sidebar from "@/components/ui/SideBar";
import IntegrationSettings from "@/components/integration/IntegrationSettings";
import { useState } from "react";

const MAIN:{ [key: string]: React.ReactNode } = {
    "작업라인": <MainDashboard />,
    "통합": <IntegrationSettings />
}

export default function Home(){

    const [showMain, setShowMain] = useState("작업라인");

    return (
    // 최상위 컨테이너에 flex를 주고, 화면 높이를 전체(h-screen)로 고정합니다.
    <div className="flex h-screen overflow-hidden">
      {/* 1. 사이드바: 고정된 너비 혹은 확장/축소 상태에 따라 변함 */}
      <Sidebar setShowMain={setShowMain}/>

      {/* 2. 메인 대시보드: flex-1을 주어 남은 모든 공간을 차지하게 합니다. */}
      {/* h-full과 overflow-y-auto를 주어 메인 영역만 별도로 스크롤되게 만듭니다. */}
      <main className="flex-1 h-full overflow-y-auto bg-[#F5F5F5]">
        {MAIN[showMain] || <div className="flex items-center justify-center h-full text-gray-500">메뉴를 선택해주세요.</div>}
      </main>
    </div>
  );
}