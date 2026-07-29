"use client";

import { useProjectStore } from "../store/useProjectStore";
import CreatePage from "@/components/create/CreateProject";
import ProjectLoading from "./[projectId]/loading";

export default function ProjectMainPage() {
  const { projects, isLoading } = useProjectStore();

  // 1. 프로젝트 생성 API 요청 핸들러
  const handleProjectCreate = async (name: string) => {
    try {
      const res = await fetch(`/project/save`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        // 성공 시 윈도우 주소를 새로고침하여 상위 레이아웃이 데이터를 다시 긁어오도록 처리
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. 백엔드에서 프로젝트 리스트를 아직 받아오는 중이라면 아무것도 하지 않고 대기 (스켈레톤 방어)
  if (isLoading) {
    return <ProjectLoading />;
  }

  // 4. 💡 [핵심] 프로젝트가 0개인 상태로 로딩이 끝났다면, 주소를 이동시키지 말고
  // 그 자리에서 입력 폼 컴포넌트를 렌더링합니다
  return (
    <div>
      {projects.length <= 0 && (
        <CreatePage onCreateClick={handleProjectCreate} />
      )}
    </div>
  );
}
