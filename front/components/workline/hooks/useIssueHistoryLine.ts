import { useEffect, useState } from "react";
import { IssueHistoryResponse, IssueHistoryTimelineProps } from "../types/type";
import { getHistoryApi } from "../api/workline";

export const useIssueHistoryLine = ({
  showHistory,
  issueId,
}: Partial<IssueHistoryTimelineProps>) => {
  if (!showHistory) return null;

  const [loading, setLoading] = useState(false);
  const [historys, setHistorys] = useState<IssueHistoryResponse[]>([]);

  useEffect(() => {
    if (issueId === undefined) return;

    const getHistory = async () => {
      try {
        setLoading(true);

        const response = await getHistoryApi(issueId);
        if (response.ok) {
          const data = await response.json();
          setHistorys(data);
        }
      } catch (error) {
        console.error("히스토리 내역 불러오는 중 에러: ", error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [showHistory]);

  return {
    historys,
  };
};
