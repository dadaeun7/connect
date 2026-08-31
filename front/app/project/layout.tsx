"use client";

import ProjectLoading from "./[projectId]/loading";
import Sidebar from "@/components/share/SideBar";
import { useProjectLayout } from "./_hooks/useProjectLayout";
import MobileHeader from "./_components/MobileHeader";

export default function SuperProjectLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { isLoading, showMenu } = useProjectLayout();
  return (
    <section className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* 모바일 헤더 및 오버레이 */}
      <MobileHeader showMenu={showMenu} />

      {/* 데스크톱 사이드바 */}
      <div className="hidden md:block">
        <Sidebar showMenu={showMenu} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {isLoading ? <ProjectLoading /> : children}
      </main>
    </section>
  );
}
