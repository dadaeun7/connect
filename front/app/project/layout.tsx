"use client";

import { useEffect, useState } from "react";
import ProjectLoading from "./[projectId]/loading";
import { ProjectSimpleDto, useProjectStore } from "../store/useProjectStore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/share/SideBar";
import { useAppStore } from "../store/useAppStore";
import { useIssueStore } from "../store/useIssueStore"; // 💡 이슈 전역 스토어 추가 임포트

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

  return (
    <section className="flex h-screen overflow-hidden">
      <Sidebar showMenu={showMenu} />
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {isLoading ? <ProjectLoading /> : children}
      </main>
    </section>
  );
}
