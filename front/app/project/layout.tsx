"use client";

import { useEffect, useState } from "react";
import ProjectLoading from "./[projectId]/loading";
import { ProjectSimpleDto, useProjectStore } from "../store/useProjectStore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/share/SideBar";
import { useAppStore } from "../store/useAppStore";
import { useIssueStore } from "../store/useIssueStore"; // 💡 이슈 전역 스토어 추가 임포트
import { ArrowLeft, Menu, X } from "lucide-react";

export default function SuperProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setProjects,
    isLoading,
    setIsLoading,
    currentProject,
    setCurrentProjectById,
  } = useProjectStore();

  const { setConnectedApps } = useAppStore();
  // 💡 이슈 패칭 액션 호출
  const fetchIssues = useIssueStore((state) => state.fetchIssues);

  const [showMenu, setShowMenu] = useState(currentProject?.myRole === "ADMIN");
  const router = useRouter();

  // 1. 기존 프로젝트 리스트 및 글로벌 연동 앱 패칭 (최초 1회 실행)
  useEffect(() => {
    setIsLoading(true);

    fetch("/project/list", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `프로젝트 정보 불러오던 중 서버 응답 오류: ${res.status}`,
          );
        }
        return res.text().then((text) => {
          return text ? JSON.parse(text) : [];
        });
      })
      .then((data: ProjectSimpleDto[]) => {
        setProjects(data);
        setIsLoading(false);

        if (!currentProject && data.length > 0) {
          setCurrentProjectById(data[0].id);
          router.push(`/project/${data[0].id}/workline`);
        }

        if (currentProject) {
          router.push(`/project/${currentProject.id}/workline`);
        }
      })
      .catch((err) => {
        console.error("프로젝트 로드 에러:", err);
        setProjects([]);
        setIsLoading(false); // 에러 발생 시에도 로딩 해제 방어 추가
      });

    fetch("/api/app/list", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `연동앱 정보 불러오던 중 서버 응답 오류: ${res.status}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        setConnectedApps(data);
      })
      .catch((err) => {
        console.error("앱연동 데이터 fetch 실패: " + err);
      });
  }, [setProjects, setIsLoading, setConnectedApps]);

  // 2. 💡 [추가] 현재 활성화된 프로젝트 ID가 결정되거나 변경될 때마다 이슈 목록 실시간 동기화
  useEffect(() => {
    if (currentProject?.id) {
      fetchIssues(currentProject.id);
    }
    setShowMenu(currentProject?.myRole === "ADMIN");
  }, [currentProject?.id, currentProject?.myRole, fetchIssues]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* 1. 모바일 전용 헤더 바 (md 미만에서만 표시) */}
      <header className="flex md:hidden items-center justify-between px-4 py-2 bg-[var(--sidebar)] border-b border-[var(--sidebar-border)] shrink-0 z-30">
        <div className="flex items-center gap-2">
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 햄버거 메뉴 아이콘 */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors"
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 2. 데스크톱 전용 사이드바 (md 이상에서만 표시) */}
      <div className="hidden md:block">
        <Sidebar showMenu={showMenu} />
      </div>

      {/* 3. 모바일 전용 전체 화면 사이드바 오버레이 (isMobileMenuOpen true일 때 전면 노출) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--sidebar)] flex flex-col md:hidden animate-in fade-in duration-200">
          {/* 모바일 닫기 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--sidebar-border)]">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]"
              aria-label="메뉴 닫기"
            >
              <X size={20} />
            </button>
          </div>

          {/* 화면 전체를 채우는 사이드바 내용 */}
          <div
            className="flex-1 overflow-y-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Sidebar showMenu={showMenu} />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {isLoading ? <ProjectLoading /> : children}
      </main>
    </section>
  );
}
