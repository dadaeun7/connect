"use client";

import { useEffect } from "react";
import ProjectLoading from "./[projectId]/loading";
import { ProjectSimpleDto, useProjectStore } from "../store/useProjectStore";
import { useRouter } from "next/navigation";

export default function SuperProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setProjects = useProjectStore((state) => state.setProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const setIsLoading = useProjectStore((state) => state.setIsLoading);

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
        console.log("수신된 프로젝트 리스트:", data);
        setProjects(data);
        setIsLoading(false);

        if (data && data.length > 0 && data[0].id) {
          router.push(`/project/${data[0].id}/workline`);
        }
      })
      .catch((err) => {
        console.error("프로젝트 로드 에러:", err);
        setProjects([]);
      });
  }, [setProjects, setIsLoading]);

  // 💡 데이터를 받아오기 전까지는 사이드바+본문 통합 스켈레톤을 노출하여 방어
  if (isLoading) {
    return <ProjectLoading />;
  }

  return <>{children}</>;
}
