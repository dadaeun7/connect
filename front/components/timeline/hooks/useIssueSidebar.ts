import { useCallback, useEffect, useMemo, useState } from "react";
import { IssueSidebarProps, TASK_COLORS } from "../types/timeline";
import { ActivityResponse } from "@/app/store/useIssueStore";

export const useIssueSidebar = ({
  getActivity,
  expandedId,
  activeIssue,
}: Omit<IssueSidebarProps, "onClose">) => {
  const activeTaskColor = useMemo(() => {
    if (!activeIssue) return null;
    return TASK_COLORS[activeIssue.id % TASK_COLORS.length];
  }, [activeIssue]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityResponse[]>(
    [],
  );
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchActivityPage = useCallback(
    async (newPage: number) => {
      if (!expandedId) return;
      setIsLoading(true);

      try {
        const data = await getActivity(expandedId, newPage);

        if (data && data.length > 0) {
          console.log(data.length);
          setCurrentActivity(data);
          setCurrentPage(newPage);

          setHasNextPage(data.length === 10);
        }
      } catch (error) {
        console.error(`issue activity get page error: `, error);
      } finally {
        setIsLoading(false);
      }
    },
    [expandedId],
  );

  useEffect(() => {
    if (expandedId) {
      fetchActivityPage(0);
    }
  }, [expandedId, fetchActivityPage]);

  const handlePrevPage = () => {
    if (currentPage > 0 && !isLoading) {
      fetchActivityPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !isLoading) {
      fetchActivityPage(currentPage + 1);
    }
  };

  return {
    activeTaskColor,
    currentPage,
    isLoading,
    currentActivity,
    hasNextPage,
    handlePrevPage,
    handleNextPage,
  };
};
