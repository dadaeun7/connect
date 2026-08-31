"use client";

import { Dispatch, SetStateAction } from "react";
import { Plus, Search, X } from "lucide-react";
import CstAlert from "../share/CstAlert";
import { ImageModal } from "../share/ImageModal";
import { useIssueSearch } from "./hooks/useIssueSearch";

interface SearchProps {
  keyword: string;
  searchKeyword: string;
  setSearchKeyword: Dispatch<SetStateAction<string>>;
  setKeyword: Dispatch<SetStateAction<string>>;
  already: boolean;
  setAlready: Dispatch<SetStateAction<boolean>>;
}

export default function IssueSearch({
  keyword,
  searchKeyword,
  setSearchKeyword,
  setKeyword,
  already,
  setAlready,
}: Readonly<SearchProps>) {
  const {
    currentProject,
    showImage,
    setShowImage,
    isModalOpen,
    alertConfig,
    handleClose,
    handleSubmit,
    registryKeyword,
    updateKeyword,
  } = useIssueSearch({
    keyword,
    setKeyword,
    already,
    setAlready,
  });

  return (
    <>
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
      <div className="flex justify-end gap-1 mb-3">
        {/* 검색창 */}
        <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs w-48 transition-all duration-300 ease-in-out focus-within:w-120 focus-within:border-[var(--muted-foreground)]">
          <Search
            size={14}
            className="text-[var(--muted-foreground)] shrink-0"
          />
          <input
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none w-full text-sm font-medium"
          />
        </div>
        {currentProject?.myRole !== "VIEWER" && (
          <>
            <button
              type="button"
              onClick={registryKeyword}
              className="flex items-center gap-1
            bg-[var(--card)] border border-[var(--border)] px-5 py-2 rounded-lg text-sm font-bold text-[var(--muted-foreground)] 
            hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors tracking-wider cursor-pointer"
            >
              <Plus size={13} />{" "}
              <span>키워드 {keyword !== "" ? "수정하기" : "등록하기"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImage(true);
              }}
              className="flex font-bold text-[12px] bg-[var(--foreground)] rounded-lg
                  border border-[var(--foreground)]
                  text-[var(--background)] px-4 text-center items-center cursor-pointer
                  hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] hover:border
                  transition-all"
            >
              [필수] ⚠️슬랙 봇 등록 방법
            </button>
          </>
        )}
      </div>

      {/* 2. 키워드 등록 팝업 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
            {/* 상단 헤더 & 닫기 버튼 */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                키워드 등록하기
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* 본문 입력란 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted-foreground)]">
                ⚠️ 슬랙봇을 등록한 채널에서만 해당 키워드가 포함된 메세지를{" "}
                <br />
                불러올 수 있습니다.
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="감지할 키워드를 입력하세요"
                autoFocus
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg mt-3 px-3 py-2 text-s text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[var(--muted-foreground)] transition-colors"
              />
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
                onClick={updateKeyword}
                disabled={!keyword.trim()}
                className="px-4 py-2 rounded-lg text-s font-semibold bg-[var(--foreground)] text-[var(--card)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
      {showImage && (
        <ImageModal
          src="/slack_webhook.png"
          alt="slack_webhook"
          onClose={() => setShowImage(false)}
        />
      )}
    </>
  );
}
