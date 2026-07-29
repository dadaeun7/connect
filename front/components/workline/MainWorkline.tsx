"use client";

import { Search, ArrowUpDown, X, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Issue from "./Issue";
import {
  FigmaState,
  GithubBranch,
  GithubRepo,
  NotionList,
} from "@/app/project/[projectId]/workline/page";
import { IssueViewResponse } from "@/app/store/useIssueStore";
import AddIssue from "./add/AddIssue";
import IssueSideBar from "./modify/detail/IssueSideBar";
import { useProjectStore } from "@/app/store/useProjectStore";
import { UserInfo, useUserInfoStore } from "@/app/store/useUserInfoStore";

const menu = ["전체", "긴급", "새작업", "완료"];

type MenuKey = "전체" | "긴급" | "새작업" | "완료";
type FilterCode = "ALL" | number;
type SortOrder = "DESC" | "ASC";

export default function MainDashboard({
  getGithubRepo,
  getGitBrach,
  getFigmaState,
  getNotionList,
  getIssueNextPage,
  getIssueDetail,
  getUserInfo,
  getIssueTotal,
}: Readonly<{
  getGithubRepo: () => Promise<GithubRepo[]>;
  getGitBrach: (repo: string) => Promise<GithubBranch[]>;
  getFigmaState: (url: string) => Promise<FigmaState>;
  getNotionList: () => Promise<NotionList[]>;
  getIssueNextPage: (
    projectId: number | undefined,
    nextPage: number,
  ) => Promise<IssueViewResponse[]>;
  getIssueDetail: (issueId: number | null) => Promise<any>;
  getUserInfo: () => Promise<UserInfo>;
  getIssueTotal: (projectId: number | undefined) => Promise<number>;
}>) {
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

  const { setUserInfo } = useUserInfoStore();

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data: UserInfo = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyInfo();
  }, []);

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

  return (
    <div className="@container flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)] animate-in fade-in duration-300">
      {/* 상단 헤더 섹션 */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] uppercase">
              작업라인
            </h1>
            <span className="text-xs font-bold bg-[var(--card)] text-[var(--muted-foreground)] px-2.5 py-1 rounded-md border border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-mono">
              {total}
            </span>
          </div>
          <p className="text-s font-semibold text-[var(--muted-foreground)] tracking-wide mt-1">
            이슈를 수정하고 최근 활동 내역을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. 우측 슬라이드 인 사이드바 - 이슈 등록 */}
      {/* ========================================================= */}
      {/* 겉면 프레임은 그대로 유지 (사이드바 스타일 유지를 위해 필수) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isModalOpen || selectedIssueId !== null ? "visible" : "invisible pointer-events-none"}`}
      >
        {/* 배경 딤드 처리 */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${isModalOpen || selectedIssueId !== null ? "opacity-100" : "opacity-0"}`}
          onClick={isModalOpen ? closeModal : closeModifySidebar}
        />

        {/* 사이드바 본체 */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xl bg-[var(--card)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out ${isModalOpen || selectedIssueId !== null ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            type="button"
            onClick={isModalOpen ? closeModal : closeModifySidebar}
            className="absolute top-5 right-5 z-10 p-2 hover:bg-[var(--muted)] text-[var(--muted-foreground)] rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="h-full overflow-y-auto p-6">
            {/* 💡 핵심: 겹치지 않게 둘 중 하나만 렌더링 (if-else 구조) */}
            {isModalOpen ? (
              <AddIssue
                onClose={closeModal}
                getGithubRepo={getGithubRepo}
                getGitBrach={getGitBrach}
                getFigmaState={getFigmaState}
                getNotionList={getNotionList}
              />
            ) : selectedIssueId !== null ? (
              <IssueSideBar
                getIssueDetail={getIssueDetail}
                expandedId={selectedIssueId}
                activeIssue={
                  worklineIssue.find((t) => t.preveiw.id === selectedIssueId) ||
                  worklineIssue[0]
                }
                onClose={closeModifySidebar}
                getGithubRepo={getGithubRepo}
                getGitBrach={getGitBrach}
                getFigmaState={getFigmaState}
                getNotionList={getNotionList}
              />
            ) : null}
          </div>
        </div>
      </div>
      {/* 콘트롤 툴바 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-8 border-b border-[var(--border)] px-1 w-full">
          {menu.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                menuFilterFun[tab as MenuKey]();
              }}
              className={`pb-3 text-sm font-bold tracking-wider transition-all relative uppercase ${
                activeTab === tab
                  ? "text-[var(--primary)] font-black"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="@container flex items-center gap-1 justify-end mb-3">
        <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs w-48 transition-all duration-300 ease-in-out focus-within:w-120 focus-within:border-[var(--muted-foreground)]">
          <Search
            size={14}
            className="text-[var(--muted-foreground)] shrink-0"
          />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
            placeholder="Search tasks..."
            className="bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none w-full text-sm font-medium"
          />
        </div>
        <button
          onClick={() => {
            sortOrder === "DESC" ? setSortOrder("ASC") : setSortOrder("DESC");
          }}
          className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] px-3.5 py-2.5 rounded-lg text-sm font-bold hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowUpDown size={13} />{" "}
          <span className="hidden @min-[700px]:inline">
            {sortOrder === "DESC" ? "과거순" : "최신순"}
          </span>
        </button>
        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
        {currentProject?.myRole !== "VIEWER" && (
          <button
            className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-4 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            onClick={openModal}
          >
            +Add <span className="hidden @min-[900px]:inline"> Issue</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterKeywordIssue.length > 0 ? (
          filterKeywordIssue.map((issue) => (
            <Issue
              key={issue.preveiw.id}
              issue={issue}
              onDetailClick={() => {
                openModifySidebar(issue.preveiw.id);
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-sm font-medium text-[var(--muted-foreground)] border border-dashed rounded-2xl border-[var(--border)]">
            등록된 이슈가 존재하지 않습니다. +Add Issue 로 등록해보세요!
          </div>
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              if (isFetching) return;
              getNextIssue(page + 1);
            }}
            type="button"
            className="flex items-center justify-center gap-1 w-full max-w-sm py-3 px-6 text-sm font-semibold text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xs hover:bg-[var(--muted)] hover:border-[var(--muted-foreground)]/30 active:scale-[0.99] transition-all cursor-pointer"
          >
            {isFetching ? (
              <span>불러오는 중...</span>
            ) : (
              <>
                <span>더 불러오기</span>
                <ChevronRight
                  size={16}
                  className="text-[var(--muted-foreground)]"
                />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
