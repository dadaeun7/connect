import { useState, useMemo, useCallback } from "react";
import { IssueViewResponse } from "../types/type";

type FilterCode = "ALL" | number;
type SortOrder = "DESC" | "ASC";

interface UseWorklineProps {
  getIssueNextPage: (
    projectId: number | undefined,
    nextPage: number,
  ) => Promise<IssueViewResponse[]>;
  getIssueTotal: (projectId: number | undefined) => Promise<number>;
  projectId: number | undefined;
}

export function useWorkline({
  getIssueNextPage,
  getIssueTotal,
  projectId,
}: UseWorklineProps) {
  const [worklineIssue, setWorklineIssue] = useState<IssueViewResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<FilterCode>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<FilterCode>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const fetchInitialIssues = useCallback(async () => {
    setIsFetching(true);
    try {
      const totalCount = await getIssueTotal(projectId);
      setTotal(totalCount);

      const firstPage = await getIssueNextPage(projectId, 0);
      setWorklineIssue(firstPage);
      setHasNextPage(firstPage.length > 0 && firstPage.length < totalCount);
      setPage(0);
    } catch (error) {
      console.error("Failed to fetch initial issues:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, [projectId, getIssueNextPage, getIssueTotal]);

  const fetchNextPage = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const nextIssues = await getIssueNextPage(projectId, nextPage);
      setWorklineIssue((prev) => [...prev, ...nextIssues]);
      setPage(nextPage);
      setHasNextPage(
        nextIssues.length > 0 &&
          worklineIssue.length + nextIssues.length < total,
      );
    } catch (error) {
      console.error("Failed to fetch next page:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, [
    page,
    isFetching,
    projectId,
    getIssueNextPage,
    worklineIssue.length,
    total,
  ]);

  const filterKeywordIssue = useMemo(() => {
    const trimmedKeyword = searchKeyword.trim().toLowerCase();

    let result = worklineIssue.filter((item) => {
      if (!trimmedKeyword) return true;

      const isTitleMatched = item.preveiw.title
        .toLowerCase()
        .includes(trimmedKeyword);
      const isActivityMatched = item.activity.some((a) =>
        a.activityTitle.toLowerCase().includes(trimmedKeyword),
      );

      return Boolean(isTitleMatched || isActivityMatched);
    });

    if (selectedStatus !== "ALL") {
      result = result.filter(
        (item) => Number(item.preveiw.statusCode) === Number(selectedStatus),
      );
    }

    if (selectedPriority !== "ALL") {
      result = result.filter(
        (item) =>
          Number(item.preveiw.priorityCode) === Number(selectedPriority),
      );
    }

    // 정렬 로직 (간단히 구현)
    return result.sort((a, b) => {
      const dateA = a.preveiw.createdAt
        ? new Date(a.preveiw.createdAt).getTime()
        : 0;
      const dateB = b.preveiw.createdAt
        ? new Date(b.preveiw.createdAt).getTime()
        : 0;
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });
  }, [
    worklineIssue,
    searchKeyword,
    selectedStatus,
    selectedPriority,
    sortOrder,
  ]);

  return {
    worklineIssue,
    filterKeywordIssue,
    page,
    isFetching,
    hasNextPage,
    total,
    searchKeyword,
    setSearchKeyword,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    sortOrder,
    setSortOrder,
    fetchInitialIssues,
    fetchNextPage,
  };
}
