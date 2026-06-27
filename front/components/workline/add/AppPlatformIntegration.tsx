import FigmaIcon from "@/components/share/svg_icon/FigmaIcon";
import GithubIcon from "@/components/share/svg_icon/GithubIcon";
import NotionIcon from "@/components/share/svg_icon/NotionIcon";
import React from "react";

interface PlatformProps {
  githubRepo: string;
  setGithubRepo: (v: string) => void;
  githubBranch: string;
  setGithubBranch: (v: string) => void;
  figmaFileUrl: string;
  setFigmaFileUrl: (v: string) => void;
  notionPageId: string;
  setNotionPageId: (v: string) => void;
  notionDbId: string;
  setNotionDbId: (v: string) => void;
}

export default function AppPlatformIntegration({
  githubRepo,
  setGithubRepo,
  githubBranch,
  setGithubBranch,
  figmaFileUrl,
  setFigmaFileUrl,
  notionPageId,
  setNotionPageId,
  notionDbId,
  setNotionDbId,
}: PlatformProps) {
  return (
    <div>
      <div className="space-y-6 text-sm">
        {/* GitHub 연동 라인 */}
        <div className="bg-[var(--card)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-[var(--foreground)]">
            <GithubIcon /> GitHub 저장소 추적
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="레포지토리 명 (예: owner/repo)"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-xs bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
            />
            <input
              type="text"
              placeholder="브랜치 명 (예: feature/login)"
              value={githubBranch}
              onChange={(e) => setGithubBranch(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-xs bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
            />
          </div>
        </div>

        {/* Figma 연동 라인 */}
        <div className="bg-[var(--card)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-[var(--foreground)]">
            <FigmaIcon /> Figma 파일 타겟팅
          </div>
          <input
            type="text"
            placeholder="동기화할 피그마 파일 공유 URL 주소 입력"
            value={figmaFileUrl}
            onChange={(e) => setFigmaFileUrl(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-xs bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
          />
        </div>

        {/* Notion 연동 라인 */}
        <div className="bg-[var(--card)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-[var(--foreground)]">
            <NotionIcon /> Notion 리소스 매핑
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="연동할 특정 페이지 UUID ID"
              value={notionPageId}
              onChange={(e) => setNotionPageId(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-xs bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
            />
            <input
              type="text"
              placeholder="연동할 특정 데이터베이스 UUID ID"
              value={notionDbId}
              onChange={(e) => setNotionDbId(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-xs bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
