"use client";

import { useMAinIssue } from "./hooks/useMainIssue";
import IssueList from "./IssueList";
import IssueSearch from "./IssueSearch";
import IssueTap from "./IssueTap";

export default function IssueListView() {
  const {
    filteredIssues,
    keyword,
    setKeyword,
    already,
    setAlready,
    curStateMenu,
    setCurStateMenu,
    searchKeyword,
    setSearchKeyword,
  } = useMAinIssue();

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-[var(--foreground)]">
          새이슈{" "}
        </h1>
        <p className="text-s text-[var(--muted-foreground)] font-medium">
          슬랙봇이 등록된 채널에서 키워드가 포함된 메세지를 불러옵니다.
        </p>
      </div>
      <div>
        <IssueTap menu={filteredIssues} setCurStateMenu={setCurStateMenu} />
        <IssueSearch
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          keyword={keyword}
          setKeyword={setKeyword}
          already={already}
          setAlready={setAlready}
        />
        <IssueList
          keyword={keyword}
          curStateMenu={curStateMenu}
          searchKeyword={searchKeyword}
        />
      </div>
    </div>
  );
}
