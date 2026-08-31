"use client";

import { useProjectStore } from "../store/useProjectStore";
import CreatePage from "@/components/create/CreateProject";
import ProjectLoading from "./[projectId]/loading";
import * as project from "@/actions/project";

export default function ProjectMainPage() {
  const { projects, isLoading } = useProjectStore();

  // 3. 백엔드에서 프로젝트 리스트를 아직 받아오는 중이라면 아무것도 하지 않고 대기 (스켈레톤 방어)
  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <div>
      {projects.length <= 0 && (
        <CreatePage onCreateClick={project.handleProjectCreate} />
      )}
    </div>
  );
}
