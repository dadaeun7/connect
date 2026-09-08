import { useProjectStore } from "@/app/store/useProjectStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FilterCode,
  IssueViewResponse,
  MenuKey,
  SortOrder,
} from "../types/type";
import { getIssueTotal } from "../api/workline";

export const useMainWorkline = (
  getIssueNextPage: (
    projectId: number | undefined,
    nextPage: number,
  ) => Promise<IssueViewResponse[]>,
) => {
  const { currentProject } = useProjectStore();
  const [worklineIssue, setWorklineIssue] = useState<IssueViewResponse[]>([]);

  const [page, setPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<FilterCode>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<FilterCode>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const menuFilterFun: Record<MenuKey, () => void> = {
    전체: () => {
      setSelectedStatus("ALL");
      setSelectedPriority("ALL");
    },
    새작업: () => {
      setSelectedStatus(1);
      setSelectedPriority("ALL");
    },
    완료: () => {
      setSelectedStatus(4);
      setSelectedPriority("ALL");
    },
    긴급: () => {
      setSelectedStatus("ALL");
      setSelectedPriority(6);
    },
  };

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

    // [3단계] 우선순위(priorityCode) 필터링 (ALL이면 패스, 값이 있으면 비교해서 return)
    if (selectedPriority !== "ALL") {
      result = result.filter(
        (item) =>
          Number(item.preveiw.priorityCode) === Number(selectedPriority),
      );
    }

    return [...result].sort((a, b) => {
      const dataA = a.preveiw.createdAt
        ? new Date(a.preveiw.createdAt).getTime()
        : 0;
      const dataB = b.preveiw.createdAt
        ? new Date(b.preveiw.createdAt).getTime()
        : 0;

      if (sortOrder === "ASC") {
        return dataA - dataB;
      } else {
        return dataB - dataA;
      }
    });
  }, [
    worklineIssue,
    searchKeyword,
    selectedStatus,
    selectedPriority,
    sortOrder,
  ]);

  const getNextIssue = useCallback(
    async (newPage: number) => {
      setIsFetching(true);
      try {
        const data = await getIssueNextPage(currentProject?.id, newPage);

        if (data && data.length > 0) {
          setWorklineIssue((prev) => {
            const existingIds = new Set(prev.map((item) => item.preveiw.id));
            const uniqueNewData = data.filter(
              (item) => !existingIds.has(item.preveiw.id),
            );
            return [...prev, ...uniqueNewData];
          });

          setPage(newPage);
          setHasNextPage(data.length === 10);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    },
    [currentProject?.id, getIssueNextPage],
  );

  useEffect(() => {
    console.log("currentProjectId:", currentProject?.id);
    console.log("worklineIssue.length:", worklineIssue.length);

    if (currentProject?.id && worklineIssue.length === 0) {
      getNextIssue(0);
    }

    const fetchTotal = async () => {
      if (currentProject?.id === undefined) return;
      try {
        const data = await getIssueTotal(currentProject.id);
        setTotal(data);
      } catch (error) {
        console.error("이슈 총 개수 로드 실패:", error);
      }
    };

    fetchTotal();
  }, [currentProject?.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //  수정용 사이드바 제어를 위한 상태 추가
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  //  특정 이슈 클릭 시 수정을 위해 사이드바를 여는 함수
  const openModifySidebar = (issueId: number) => {
    setSelectedIssueId(issueId);
  };

  //  기존 closeModal을 보강하거나 별도 수정 클로즈 함수 정의
  const closeModifySidebar = () => {
    setSelectedIssueId(null);
  };

  return {
    total,
    isModalOpen,
    closeModal,
    closeModifySidebar,
    selectedIssueId,
    worklineIssue,
    activeTab,
    setActiveTab,
    menuFilterFun,
    searchKeyword,
    setSearchKeyword,
    sortOrder,
    setSortOrder,
    currentProject,
    openModal,
    filterKeywordIssue,
    openModifySidebar,
    hasNextPage,
    isFetching,
    getNextIssue,
    page,
  };
};
