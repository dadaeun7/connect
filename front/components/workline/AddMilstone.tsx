"use client";

import React, { useState } from "react";
import { PriorityList, StatusList } from "./type";

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
        워크스페이스 노드 파이프라인 자격 증명 스케줄러 그룹을 매핑합니다.
      </p>
    </div>
    {children}
  </div>
);

const ModernInputField = ({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col space-y-1 mb-4">
    <label
      htmlFor={id}
      className="text-[12px] font-black uppercase tracking-wider text-[var(--muted-foreground)]"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/30 focus:outline-none focus:border-[var(--primary)] font-medium"
    />
  </div>
);

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function AddMilestone({ onClose }: { onClose: () => void }) {
  // 상수의 인덱스나 값 자체를 상태(State)로 관리합니다.
  const [currentStatus, setCurrentStatus] = useState(StatusList[0]); // 기본값: "inprogress"
  const [currentPriority, setCurrentPriority] = useState(PriorityList[1]); // 기본값: "medium"

  return (
    <ModernPanel title="마일스톤 등록">
      <form onSubmit={(e) => e.preventDefault()}>
        <ModernInputField
          label="마일스톤 / 이슈 명칭"
          id="issueName"
          placeholder="예: 코어 웹훅 동기화 고도화 엔진 빌드"
        />

        <span className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-3">
          마일스톤 구조 세부 속성
        </span>
        <div className="bg-[var(--muted)]/40 border border-[var(--border)] rounded-xl p-5 mb-5">
          {/* Status와 Prioirty 설정*/}
          <div className="space-y-5">
            {/* 1. Status 토글 세그먼트 */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider">
                현재 상태
              </label>
              <div className="flex bg-[var(--muted)]/50 p-1 rounded-xl border border-[var(--border)] w-full">
                {StatusList.map((status) => {
                  const isActive = currentStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setCurrentStatus(status)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 select-none cursor-pointer text-center
                  ${
                    isActive
                      ? "bg-[var(--card)] text-[var(--primary)] shadow-xs font-black border border-[var(--border)]"
                      : "text-[var(--muted-foreground)]/70 hover:text-[var(--foreground)]"
                  }`}
                    >
                      {status === "inprogress"
                        ? "In Progress"
                        : capitalize(status)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Priority 토글 세그먼트 */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider ">
                우선순위
              </label>
              <div className="flex bg-[var(--muted)]/50 p-1 rounded-xl border border-[var(--border)] w-full">
                {PriorityList.map((priority) => {
                  const isActive = currentPriority === priority;
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setCurrentPriority(priority)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 select-none cursor-pointer text-center
                  ${
                    isActive
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-black border border-[var(--border)]"
                      : "text-[var(--muted-foreground)]/70 hover:text-[var(--foreground)]"
                  }`}
                    >
                      {capitalize(priority)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 mb-5">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            프로젝트 연결 컨텍스트
          </label>
          <div className="flex items-center justify-between w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm text-[var(--muted-foreground)] cursor-pointer hover:border-[var(--border)]/100 transition-colors">
            <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2.5 py-0.5 rounded text-xs font-bold font-mono">
              연결된 프로젝트 A
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModernInputField label="마감 날짜" id="dueDate" type="date" />
          <ModernInputField
            label="관련 이슈 태그 링크"
            id="issueLink"
            placeholder="#이슈 ID 주입"
          />
        </div>

        <div className="flex flex-col space-y-2 mb-6">
          <label
            htmlFor="description"
            className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            마일스톤 설명
          </label>
          <textarea
            id="description"
            rows={5}
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[var(--primary)] resize-none font-medium leading-relaxed transition-colors"
            placeholder="마일스톤 설명을 입력하고 기록하세요."
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-black text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Save Milestone
          </button>
        </div>
      </form>
    </ModernPanel>
  );
}
