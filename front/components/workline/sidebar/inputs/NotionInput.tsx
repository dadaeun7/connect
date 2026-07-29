"use client";

import { NotionList } from "@/app/project/[projectId]/workline/page";
import { IssueViewResponse } from "@/app/store/useIssueStore";
import NotionIcon from "@/components/share/svg_icon/NotionIcon";
import { ChevronDown, ChevronUp, SquareArrowOutUpRight } from "lucide-react";

export default function NotionInput({
  activeIssue,
  notionDbs = [], // undefined 방어를 위한 디폴트 빈 배열 지정
  notionDbShow,
  setNotionDbShow,
  curNotionDb,
  setCurNotionDb,
  notionLoading,
}: Readonly<{
  activeIssue?: IssueViewResponse;
  notionDbs: NotionList[];
  notionDbShow: boolean;
  setNotionDbShow: React.Dispatch<React.SetStateAction<boolean>>;
  curNotionDb: NotionList | null;
  setCurNotionDb: React.Dispatch<React.SetStateAction<NotionList | null>>;
  notionLoading: boolean | undefined;
}>) {
  return (
    <div className="bg-[var(--card)] space-y-3">
      <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)] pb-2 border-b border-[var(--sidebar-border)]">
        <NotionIcon /> Notion 리소스 매핑
      </div>
      {/* 데이터베이스 섹션 */}
      <div>
        <span className="flex gap-1 text-xs font-black text-[var(--sidebar-foreground)] tracking-wider ml-1 mb-1">
          데이터베이스
        </span>

        {activeIssue?.preveiw.notionDbId ? (
          <>
            <div className="relative w-full border border-[var(--border)] rounded-lg px-3 py-2 text-[12px] bg-[var(--muted)]/40 text-[var(--muted-foreground)] font-bold flex justify-between items-center">
              <span className="truncate max-w-[80%]">
                {notionLoading ? "로딩중.." : curNotionDb?.title}{" "}
              </span>
              <div className="flex gap-2 items-center">
                {curNotionDb?.id && (
                  <a
                    href={curNotionDb.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 border rounded bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    <SquareArrowOutUpRight size={11} />
                  </a>
                )}
                <div
                  className="relative w-full flex items-center justify-between p-2 text-[12px] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium cursor-pointer"
                  onClick={() => setNotionDbShow(!notionDbShow)}
                >
                  <div className="text-[var(--muted-foreground)] shrink-0">
                    {notionDbShow ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </div>
                </div>
              </div>
              {notionDbShow && (
                <div className="absolute top-14 left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div
                    className="py-2 px-2.5 text-[12px] font-bold text-[var(--task-rose)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors border-b border-[var(--border)] mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurNotionDb(null);
                      setNotionDbShow(false);
                    }}
                  >
                    🚫 DB 연결 해제
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="relative w-full flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-[12px] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium cursor-pointer"
            onClick={() => setNotionDbShow(!notionDbShow)}
          >
            <div className="truncate pr-2">
              {curNotionDb ? (
                curNotionDb.title
              ) : (
                <span className="text-[var(--muted-foreground)]">
                  선택되지 않음
                </span>
              )}
            </div>
            <div className="text-[var(--muted-foreground)] shrink-0">
              {notionDbShow ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {notionDbShow && (
              <div className="absolute top-14 left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div
                  className="py-2 px-2.5 text-[12px] font-bold text-[var(--task-rose)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors border-b border-[var(--border)] mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurNotionDb(null);
                    setNotionDbShow(false);
                  }}
                >
                  🚫 DB 연결 해제
                </div>
                {notionDbs.length > 0 &&
                  notionDbs.map((nd, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 px-2.5 text-[12px] font-bold text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurNotionDb(nd);
                        setNotionDbShow(false);
                      }}
                    >
                      <div className="truncate max-w-[75%]">{nd.title}</div>
                      <a
                        href={nd.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-1 inline-flex items-center justify-center p-1.5 text-xs font-semibold border rounded bg-[var(--background)] hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-sm text-[var(--muted-foreground)]"
                      >
                        <SquareArrowOutUpRight size={12} />
                      </a>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
