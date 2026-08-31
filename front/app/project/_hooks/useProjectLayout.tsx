"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "@/app/store/useProjectStore";
import { useAppStore } from "@/app/store/useAppStore";
import { getProjectListAction, getAppListAction } from "@/actions/project";
import { useUserInfoStore } from "@/app/store/useUserInfoStore";

export function useProjectLayout() {
  const router = useRouter();
  const param = usePathname();

  const {
    setProjects,
    isLoading,
    setIsLoading,
    currentProject,
    setCurrentProjectById,
  } = useProjectStore();
  const { setConnectedApps } = useAppStore();
  const { fetchUserInfo } = useUserInfoStore();

  const [showMenu, setShowMenu] = useState(currentProject?.myRole === "ADMIN");

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getProjectListAction(), getAppListAction(), fetchUserInfo()])
      .then(([projects, apps]) => {
        setProjects(projects);
        setConnectedApps(apps);
        setIsLoading(false);

        if (projects.length === 0) return;

        const match = param.match(/\/project\/(\d+)/);
        const urlProjectId = match ? Number(match[1]) : null;

        if (urlProjectId) {
          setCurrentProjectById(urlProjectId);
        } else {
          const targetId = currentProject?.id || projects[0].id;
          setCurrentProjectById(targetId);
          router.push(`/project/${targetId}/workline`);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setShowMenu(currentProject?.myRole === "ADMIN");
  }, [currentProject?.id, currentProject?.myRole]);

  return { isLoading, showMenu };
}
