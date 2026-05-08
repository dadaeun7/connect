"use client";

import MainDashboard from "@/components/history/MainDashboard";
import Sidebar from "@/components/ui/SideBar";
import IntegrationSettings from "@/components/integration/IntegrationSettings";
import MainTimeLine from "@/components/timeline/MainTimeLine";
import MainNewIssue from "@/components/newIssue/MainNewIssue";
import { useState } from "react";

const MAIN:{ [key: string]: React.ReactNode } = {
    "작업라인": <MainDashboard />,
    "타임라인": <MainTimeLine />,
    "새이슈": <MainNewIssue />,
    "통합": <IntegrationSettings />
    
}

export default function Home(){

    const [showMain, setShowMain] = useState("작업라인");

    return (
    // 최상위 컨테이너에 flex를 주고, 화면 높이를 전체(h-screen)로 고정합니다.
    <div className="flex h-screen overflow-hidden">
      <Sidebar setShowMain={setShowMain}/>
      {/* 2. 메인 대시보드: flex-1을 주어 남은 모든 공간을 차지하게 합니다. */}
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {MAIN[showMain] || <div className="flex items-center justify-center h-full text-gray-500">메뉴를 선택해주세요.</div>}
      </main>
    </div>
  );
}