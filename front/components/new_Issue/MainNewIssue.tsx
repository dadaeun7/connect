"use client";

import { useEffect, useState } from "react";
import IssueList from "./IssueList";
import IssueSearch from "./IssueSearch";
import IssueTap from "./IssueTap";
import { useProjectStore } from "@/app/store/useProjectStore";

const filteredIssues = ["전체", "OPEN", "MERGE"];
export type MenuKey = "전체" | "OPEN" | "MERGE";

export default function IssueListView() {
  const [keyword, setKeyword] = useState("");
  const [already, setAlready] = useState(false);
  const { currentProject } = useProjectStore();
  const [curStateMenu, setCurStateMenu] = useState<MenuKey>("전체");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const getKeyword = async () => {
      try {
        const result = await fetch(
          `/get/keyword?projectId=${currentProject?.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!result.ok) throw new Error("get keyword error");

        const data = await result.text();
        setKeyword(data);
        setAlready(true);
      } catch (error) {
        console.error(error);
      }
    };
    getKeyword();
  }, []);

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
