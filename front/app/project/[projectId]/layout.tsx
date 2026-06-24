"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/share/SideBar";
import { useProjectStore } from "@/app/store/useProjectStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = Number(params.projectId);

  const projects = useProjectStore((state) => state.projects);
  const setCurrentProjectById = useProjectStore(
    (state) => state.setCurrentProjectById,
  );

  useEffect(() => {
    if (projects.length > 0 && projectId) {
      setCurrentProjectById(projectId);
    }
  }, [projectId, projects, setCurrentProjectById]);

  return (
    <section className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </section>
  );
}
