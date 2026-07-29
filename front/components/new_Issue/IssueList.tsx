"use client";

import { CopyMinus, GitPullRequestArrow, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { offsetTimePlusNine } from "../share/UtilFun";
import { Tooltip } from "../share/ToolTip";
import CstAlert from "../share/CstAlert";
import { useProjectStore } from "@/app/store/useProjectStore";
import { MenuKey } from "./MainNewIssue";

interface NewIssue {
  id: number;
  matchKeyword: string;
  status: string;
  createdAt: string;
  originalMessage: string;
  slackUrl: string;
  detectedMessage: string;
}

interface IssueAllList {
  id: number;
  title: string;
}

const STATE_COLOR_MAP: Record<string, string> = {
  OPEN: "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-[var(--status-done)]/10 text-[var(--status-done)] border-[var(--status-done)]/10",
  MERGE:
    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-[var(--status-inprogress)]/10 text-[var(--status-inprogress)] border-[var(--status-inprogress)]/10",
  CLOSE:
    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-[var(--status-blocked)]/10 text-[var(--status-blocked)] border-[var(--status-blocked)]/10",
};

export default function IssueList({
  keyword,
  curStateMenu,
  searchKeyword,
}: Readonly<{
  keyword: string;
  curStateMenu: MenuKey;
  searchKeyword: string;
}>) {
  const { currentProject } = useProjectStore();

  const [newIssue, setNewIssue] = useState<NewIssue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueAllList, setIssueAllList] = useState<IssueAllList[]>([]);

  const [curIssueId, setCurIssueId] = useState(0);
  const [curNewIssueId, setCurNewIssueId] = useState(0);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "에러가 발생했습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const filterNewIssue = useMemo(() => {
    const trimmedKeyword = searchKeyword.trim().toLowerCase();

    let result = newIssue.filter((ni) => {
      if (!trimmedKeyword) return true;
      const isOriginMessage = ni.originalMessage
        .toLowerCase()
        .includes(trimmedKeyword);
      const isDetectedMessage = ni.detectedMessage
        .toLowerCase()
        .includes(trimmedKeyword);

      return Boolean(isOriginMessage || isDetectedMessage);
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
    const getNewIssue = async () => {
      try {
        const result = await fetch(
          `/new-issue/get?projectId=${currentProject?.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!result.ok) throw new Error("get new issue error");

        const data = await result.json();
        setNewIssue(data);

        console.log(keyword);
      } catch (error) {
        console.error(error);
      }
    };

    getNewIssue();
  }, []);

  const deleteKeyword = async (newIssueId: number) => {
    try {
      const result = await fetch(`/new-issue/delete?newIssueId=${newIssueId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) throw new Error("new issue delete error");

      setAlertConfig((props) => ({
        ...props,
        message: "이슈를 성공적으로 삭제했습니다.",
        type: "info",
        isOpen: true,
      }));

      setIsModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
      }));
    }
  };

  const getIssueList = async () => {
    try {
      const result = await fetch(
        `/issue/title/list?projectId=${currentProject?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!result.ok) throw new Error("new issue delete error");

      const data = await result.json();
      setIssueAllList(data);
    } catch (error) {
      console.error(error);
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
      }));
    }
  };

  const mergetIssue = async () => {
    try {
      const result = await fetch(
        `/new-issue/merge?issueId=${curIssueId}&newIssueId=${curNewIssueId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!result.ok) throw new Error("new issue delete error");

      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
      }));
    }
  };

  return (
    <div className="space-y-1">
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
      {filterNewIssue.map((issue, index) => (
        <div
          key={index}
          className="bg-[var(--card)] border border-[var(--border)]/50 rounded-lg overflow-hidden shadow-xs"
        >
          <div className="flex flex-col md:flex-row justify-between p-6 gap-2">
            <div className="flex items-start gap-4">
              <div>
                {/** */}
                <div
                  className={
                    issue.detectedMessage !== issue.originalMessage
                      ? "flex flex-col gap-1"
                      : "flex items-center gap-2"
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className={STATE_COLOR_MAP[issue.status]}>
                      {issue.status}
                    </span>
                    <span className="font-bold text-[14px] text-[var(--sidebar-foreground)]">
                      {issue.detectedMessage !== issue.originalMessage
                        ? `[대표 메세지] ${issue.originalMessage.split(keyword)[1]}`
                        : issue.detectedMessage.split(keyword)[1]}
                    </span>
                  </div>

                  {/* 하위 메시지가 있을 때만 span 렌더링 */}
                  {issue.detectedMessage !== issue.originalMessage && (
                    <span className="text-[13px] text-gray-500 ml-5 pl-3 border-l-2 border-gray-200">
                      {issue.detectedMessage.split(keyword)[1]}
                    </span>
                  )}
                </div>
                {/** */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="ml-1 text-sm block font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                    {offsetTimePlusNine(issue.createdAt)}
                  </span>
                  <span className="text-[11px] bg-[var(--sidebar-border)]/80 text-[var(--sidebar-ring)]/70 rounded-xl px-2 py-[1.5px]">
                    설정 키워드👉{keyword}
                  </span>
                </div>
              </div>
            </div>
            {currentProject?.myRole !== "VIEWER" &&
              issue.status !== "MERGE" && (
                <div className="flex items-center gap-2">
                  <Tooltip content="이슈에서 제외합니다.">
                    <button
                      onClick={() => {
                        deleteKeyword(issue.id);
                      }}
                      className="bg-[var(--muted)]/50 hover:bg-red-500/10 hover:border-red-300 hover:text-red-500 border border-[var(--border)]/70 px-3 py-2 rounded-lg text-xs font-bold text-[var(--muted-foreground)] transition-colors"
                    >
                      <CopyMinus size={14} />
                    </button>
                  </Tooltip>

                  <Tooltip content="기존 이슈와 병합합니다.">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setCurNewIssueId(issue.id);
                        getIssueList();
                      }}
                      className="bg-[var(--muted)]/50 hover:bg-[var(--foreground)] hover:text-[var(--background)] border border-[var(--border)]/70 px-3 py-2 rounded-lg text-xs font-bold text-[var(--muted-foreground)] transition-colors"
                    >
                      <GitPullRequestArrow size={14} />
                    </button>
                  </Tooltip>
                </div>
              )}
          </div>
        </div>
      ))}

      {/* 2. 키워드 등록 팝업 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
            {/* 상단 헤더 & 닫기 버튼 */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                기존이슈 선택하기
              </h3>
              <button
                onClick={handleClose}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* 본문 입력란 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted-foreground)]">
                하나의 이슈로 합칠 현재 관리하는 이슈를 선택합니다.
              </label>
              {issueAllList.length > 0 && (
                <select
                  value={curIssueId}
                  onChange={(e) => setCurIssueId(Number(e.target.value))}
                  name="items"
                  id="items"
                  className="w-full mt-2 px-3 py-2 pr-3 text-sm font-medium rounded-lg bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] focus:outline-none shadow-sm cursor-pointer"
                >
                  <option
                    value=""
                    className="bg-[var(--card)] text-[var(--muted-foreground)]"
                  >
                    이슈를 선택하세요
                  </option>

                  {issueAllList.map((issue) => (
                    <option
                      key={issue.id}
                      value={issue.id}
                      className="bg-[var(--card)] text-[var(--foreground)] py-1"
                    >
                      {issue.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-s font-semibold text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                아니오
              </button>
              <button
                type="button"
                disabled={!keyword.trim()}
                onClick={() => {
                  mergetIssue();
                }}
                className="px-4 py-2 rounded-lg text-s font-semibold bg-[var(--foreground)] text-[var(--card)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
