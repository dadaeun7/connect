// front/components/new_Issue/hooks/useIssueList.ts

import { useState, useEffect, useMemo } from "react";
import { useProjectStore } from "@/app/store/useProjectStore"; // 프로젝트 스토어 경로
import {
  fetchNewIssues,
  deleteNewIssueApi,
  fetchIssueTitleList,
  mergeIssueApi,
} from "../api/issue";

export const useIssueList = (searchKeyword: string, curStateMenu: string) => {
  const { currentProject } = useProjectStore();
  const [newIssue, setNewIssue] = useState<any[]>([]);
  const [issueAllList, setIssueAllList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curIssueId, setCurIssueId] = useState(0);
  const [curNewIssueId, setCurNewIssueId] = useState(0);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "에러가 발생했습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
  });

  const filterNewIssue = useMemo(() => {
    const trimmedKeyword = searchKeyword.trim().toLowerCase();
    let result = newIssue.filter((ni) => {
      if (!trimmedKeyword) return true;
      return (
        ni.originalMessage?.toLowerCase().includes(trimmedKeyword) ||
        ni.detectedMessage?.toLowerCase().includes(trimmedKeyword)
      );
    });

    if (curStateMenu !== "전체") {
      result = result.filter((ni) => ni.status === curStateMenu);
    }

    return [...result].sort((a, b) => {
      const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dataB - dataA;
    });
  }, [curStateMenu, searchKeyword, newIssue]);

  useEffect(() => {
    if (!currentProject?.id) return;
    fetchNewIssues(currentProject.id).then(setNewIssue).catch(console.error);
  }, [currentProject?.id]);

  const deleteKeyword = async (newIssueId: number) => {
    try {
      await deleteNewIssueApi(newIssueId);
      setAlertConfig({
        isOpen: true,
        message: "이슈를 성공적으로 삭제했습니다.",
        type: "info",
        onClose: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
      });
      setIsModalOpen(false);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error(error);
      setAlertConfig((prev) => ({ ...prev, isOpen: true }));
    }
  };

  const getIssueList = async () => {
    try {
      const data = await fetchIssueTitleList(currentProject?.id);
      setIssueAllList(data);
    } catch (error) {
      console.error(error);
      setAlertConfig((prev) => ({ ...prev, isOpen: true }));
    }
  };

  const mergeIssue = async () => {
    try {
      await mergeIssueApi(curIssueId, curNewIssueId);
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setAlertConfig((prev) => ({ ...prev, isOpen: true }));
    }
  };

  return {
    currentProject,
    filterNewIssue,
    issueAllList,
    isModalOpen,
    setIsModalOpen,
    alertConfig,
    curIssueId,
    setCurIssueId,
    setCurNewIssueId,
    deleteKeyword,
    getIssueList,
    mergeIssue,
  };
};
