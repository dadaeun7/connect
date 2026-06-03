"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Layers,
  Calendar,
  PlusSquare,
  Settings,
  User,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import ThemeBtn from "./ThemeBtn";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true); // 💡 누락되었던 핵심 확장/축소 상태 복구
  const [projects] = useState(["프로젝트 A", "프로젝트 B"]);
  const [showProjects, setShowProjects] = useState(false);

  const menuSections = [
    {
      title: "협업 관리",
      items: [
        {
          name: "작업라인",
          path: "/project/workline",
          icon: <Layers size={15} />,
        },
        {
          name: "타임라인",
          path: "/project/timeline",
          icon: <Calendar size={15} />,
        },
        {
          name: "새이슈",
          path: "/project/new-issue",
          icon: <PlusSquare size={15} />,
        },
        {
          name: "프로젝트 설정",
          path: "/project/project-setting",
          icon: <Settings size={15} />,
        },
      ],
    },
    {
      title: "계정 관리",
      items: [
        { name: "내 정보", path: "/project/my-info", icon: <User size={15} /> },
        {
          name: "결제",
          path: "/project/payment",
          icon: <CreditCard size={15} />,
        },
      ],
    },
  ];

  return (
    <aside
      // 💡 isExpanded 상태에 따라 가로 폭이 w-60(240px)과 w-16(64px)으로 유연하게 스위칭되도록 교정
      className={`min-h-screen border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col shrink-0 transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      }`}
    >
      {/* 테마 스위처 바: 사이드바가 활성화되어 열려있을 때만 우측 정렬 매핑 */}
      {isExpanded && (
        <div className="flex ml-5 justify-between items-center w-full mt-2 ">
          <Link href={"/"}>
            <img
              src="/logo.png"
              alt="logo"
              className="w-7 h-7 object-contain"
            />
          </Link>
          <ThemeBtn />
        </div>
      )}

      {/* 프로젝트 셀렉터 탭 */}
      <div className="p-3 mt-2 border-b border-[var(--sidebar-border)]/60">
        <div
          onClick={() => setShowProjects(!showProjects)}
          className={`flex items-center bg-[var(--muted)]/80 border border-[var(--sidebar-border)] rounded-xl py-2.5 cursor-pointer hover:border-[var(--primary)]/40 transition-colors ${
            isExpanded
              ? "px-3 justify-between"
              : "justify-center px-0 w-10 h-10 mx-auto"
          }`}
        >
          <div className="w-6 h-6 bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] text-[10px] font-black rounded flex items-center justify-center shrink-0">
            {projects[0][0]}
          </div>
          {isExpanded && (
            <>
              <span className="text-sm font-bold text-[var(--foreground)] truncate flex-1 ml-3">
                {projects[0]}
              </span>
              <span className="text-[10px] text-[var(--sidebar-foreground)]/50 font-mono">
                ▼
              </span>
            </>
          )}
        </div>
      </div>

      {/* 메인 트리 네비게이션 메뉴 리스트 */}
      <div className="flex-1 py-4 mt-2 space-y-10 overflow-y-auto overflow-x-hidden discrete-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="px-3">
            {isExpanded && (
              <div className="text-[13px] font-bold text-[var(--sidebar-foreground)]/40 mb-3 px-2 tracking-wider uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    href={item.path}
                    key={item.name}
                    className={`flex items-center py-2.5 rounded-xl text-sm font-semibold group transition-all ${
                      isExpanded
                        ? "px-3 gap-3.5"
                        : "justify-center px-0 w-10 h-10 mx-auto"
                    } ${
                      isActive
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-black shadow-sm"
                        : "text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)]/40"
                    }`}
                  >
                    <div
                      className={
                        isActive
                          ? "text-[var(--sidebar-primary)]"
                          : "text-[var(--sidebar-foreground)]/40 group-hover:text-[var(--sidebar-foreground)] transition-colors"
                      }
                    >
                      {item.icon}
                    </div>
                    {isExpanded && (
                      <span className="tracking-wide text-sm transition-opacity duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 통합 제어 영역 (테마 토글러 내장 + 오리지널 화살표 이미지 접기 단추) */}
      <div className="mt-auto flex flex-col w-full border-t border-[var(--sidebar-border)]/80 bg-[var(--sidebar)]">
        {/* 오리지널 하단 확장/축소 화살표 이미지 버튼 완전 결합 */}
        <div
          className={`h-16 flex items-center cursor-pointer hover:bg-[var(--sidebar-accent)]/40 transition-all ${
            isExpanded ? "px-5 justify-end" : "justify-center"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronLeft size={15} />
        </div>
      </div>
    </aside>
  );
}
