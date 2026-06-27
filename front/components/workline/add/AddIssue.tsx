"use client";

import React, { useEffect, useState } from "react";
import { useProjectStore } from "@/app/store/useProjectStore";
import { PriorityList, StatusList } from "../type";
import StatusPrioritySelector from "./StatusPrioritySelector";
import ModernInputField from "./ModernInputFiled";
import AppPlatformIntegration from "./AppPlatformIntegration";

const ModernPanel = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="w-full">
    <div className="mb-6 border-b border-[var(--border)] pb-4 pr-8">
      <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight mb-1">
        {title}
      </h2>
      <p className="text-sm text-[var(--muted-foreground)]">
        프로젝트에서 관리할 작업 상황을 이슈로 등록하고 외부 플랫폼과
        연동합니다.
      </p>
    </div>
    {children}
  </div>
);

export default function AddIssue({
  onClose,
  getGithubRepo,
}: Readonly<{ onClose: () => void; getGithubRepo: () => Promise<void> }>) {
  const { projects, currentProject } = useProjectStore();

  // 1. 핵심 메타데이터 상태 관리
  const [issueName, setIssueName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedProject, setSelectedProject] = useState(
    currentProject || null,
  );
  const [currentStatus, setCurrentStatus] = useState(StatusList[0]); // inprogress 등
  const [currentPriority, setCurrentPriority] = useState(PriorityList[1]); // medium 등

  // 2. 외부 연동 플랫폼 주소/ID 상태 관리 (GitHub, Figma, Notion)
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("");
  const [figmaFileUrl, setFigmaFileUrl] = useState("");
  const [notionPageId, setNotionPageId] = useState("");
  const [notionDbId, setNotionDbId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGithubRepo();
      // 이제 브라우저 콘솔에 정상적으로 찍힙니다.
      console.log("클라이언트 데이터 수신:", JSON.stringify(data, null, 2));
    };

    fetchData();
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 최종 DB 전송용 데이터 레이아웃 구조 세팅 완료
    const payload = {
      title: issueName,
      project_id: selectedProject?.id,
      status_code: currentStatus,
      priority_code: currentPriority,
      due_date: dueDate,
      github_repo: githubRepo,
      github_branch: githubBranch,
      figma_file_key: figmaFileUrl, // 백엔드 서브밋 전 혹은 후 정규식 가공 권장
      notion_page_id: notionPageId,
      notion_db_id: notionDbId,
    };

    console.log("이슈 생성 요청 데이터:", payload);
    alert("이슈가 정상적으로 등록되었습니다.");
    onClose();
  };

  return (
    <ModernPanel title="이슈 등록">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이슈명 입력 기본 정보 */}
        <ModernInputField
          label="이슈명"
          id="issueName"
          placeholder="예: 코어 웹훅 동기화 고도화 엔진 빌드"
          value={issueName}
          onChange={(e) => setIssueName(e.target.value)}
        />

        {/* 컬러칩이 유기적으로 반영된 상태 및 우선순위 선택 세그먼트 */}
        <StatusPrioritySelector
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          currentPriority={currentPriority}
          setCurrentPriority={setCurrentPriority}
        />

        {/* 기본 마감일 및 프로젝트 지정 매핑 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernInputField
            label="마감 날짜"
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <ModernInputField
            label="프로젝트 공간"
            id="project"
            type="text"
            placeholder={selectedProject?.name || "프로젝트를 선택하세요"}
            projects={projects}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        </div>

        {/* 요구사항이 반영된 GitHub, Figma, Notion 외부 리소스 적재 섹션 */}
        <AppPlatformIntegration
          githubRepo={githubRepo}
          setGithubRepo={setGithubRepo}
          githubBranch={githubBranch}
          setGithubBranch={setGithubBranch}
          figmaFileUrl={figmaFileUrl}
          setFigmaFileUrl={setFigmaFileUrl}
          notionPageId={notionPageId}
          setNotionPageId={setNotionPageId}
          notionDbId={notionDbId}
          setNotionDbId={setNotionDbId}
        />

        {/* 액션 하단 제어 바 */}
        <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-5 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] rounded-lg transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-black text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            저장하기
          </button>
        </div>
      </form>
    </ModernPanel>
  );
}
