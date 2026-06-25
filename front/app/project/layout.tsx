"use client";

import { useEffect, useState } from "react";
import ProjectLoading from "./[projectId]/loading";
import { ProjectSimpleDto, useProjectStore } from "../store/useProjectStore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/share/SideBar";

export default function SuperProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setProjects = useProjectStore((state) => state.setProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const setIsLoading = useProjectStore((state) => state.setIsLoading);
  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore(
    (state) => state.setCurrentProjectById,
  );

  const [showMenu, setShowMenu] = useState(currentProject?.myRole === "ADMIN");

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    fetch("/project/list", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        // 💡 1. HTTP 상태 코드가 2xx가 아니라면 에러 처리 (HTML이나 401 방어)
        if (!res.ok) {
          throw new Error(`서버 응답 오류: ${res.status}`);
        }
        // 💡 2. 응답 본문이 완전히 비어있는지 텍스트로 먼저 확인
        return res.text().then((text) => {
          return text ? JSON.parse(text) : []; // 비어있으면 빈 배열([]) 반환하여 크래시 방지
        });
      })
      .then((data: ProjectSimpleDto[]) => {
        setProjects(data);
        setIsLoading(false);

        if (!currentProject && data.length > 0) {
          setCurrentProject(data[0].id);
          router.push(`/project/${data[0].id}/workline`);
        }

        if (currentProject) {
          router.push(`/project/${currentProject.id}/workline`);
        }
      })
      .catch((err) => {
        console.error("프로젝트 로드 에러:", err);
        setProjects([]);
      });

    setShowMenu(currentProject?.myRole === "ADMIN");
  }, [setProjects, setIsLoading, currentProject]);

  // 💡 데이터를 받아오기 전까지는 사이드바+본문 통합 스켈레톤을 노출하여 방어

  return (
    <section className="flex h-screen overflow-hidden">
      <Sidebar showMenu={showMenu} />
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {isLoading ? <ProjectLoading /> : children}
      </main>
    </section>
  );
}
