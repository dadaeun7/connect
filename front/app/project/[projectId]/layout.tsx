// app/project/[projectId]/layout.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useIssueStore } from "@/app/store/useIssueStore";
import { ConfirmationProvider } from "@/components/share/ConfirmationContext";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const projectId = Number(params.projectId);

  // Zustand 스토어에서 fetch 액션 가져오기
  const fetchIssues = useIssueStore((state) => state.fetchIssues);

  useEffect(() => {
    if (projectId) {
      // 하위의 page.tsx로 1회만 백엔드 데이터 패칭 실행
      fetchIssues(projectId);
    }
  }, [projectId, fetchIssues]);

  return (
    <ConfirmationProvider>
      <div className="project-container">
        <main>{children}</main>
      </div>
    </ConfirmationProvider>
  );
}
