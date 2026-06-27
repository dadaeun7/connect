import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Layers,
  Calendar,
  PlusSquare,
  Settings,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  ChevronDown,
  AlignStartVertical,
} from "lucide-react";
import ThemeBtn from "./ThemeBtn";
import { useProjectStore } from "@/app/store/useProjectStore";
import { Tooltip } from "./ToolTip";

export default function Sidebar({ showMenu }: { showMenu: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    projects,
    setProjects,
    currentProject,
    setCurrentProjectById: setCurrentProject,
  } = useProjectStore();

  const [showProjects, setShowProjects] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreateProject = async () => {
    try {
      const result = await fetch("/project/save", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName,
        }),
      });

      if (!result.ok) {
        alert("프로젝트 생성에 실패했습니다.");
        return;
      }

      const newProjectData = await result.json();

      setProjects([newProjectData, ...projects]);
      setCurrentProject(newProjectData?.id);
      setNewProjectName("");
      setIsAdding(false);
    } catch (err) {
      console.error("네트워크 에러 또는 파싱 에러: " + err);
      alert("서버 통신 중 오류가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  const menuSections = React.useMemo(
    () => [
      {
        title: "협업 관리",
        show: true,
        items: [
          {
            name: "작업라인",
            path: `/project/${currentProject?.id}/workline`,
            icon: <Layers size={16} />,
            show: true,
          },
          {
            name: "타임라인",
            path: `/project/${currentProject?.id}/timeline`,
            icon: <AlignStartVertical size={16} />,
            show: true,
          },
          {
            name: "새 이슈",
            path: `/project/${currentProject?.id}/new-issue`,
            icon: <PlusSquare size={16} />,
            show: true,
          },
          {
            name: "프로젝트 설정",
            path: `/project/${currentProject?.id}/project-setting`,
            icon: <Settings size={16} />,
            show: showMenu,
          },
        ],
      },
      {
        title: "계정",
        show: showMenu,
        items: [
          {
            name: "내 정보",
            path: `/project/${currentProject?.id}/my-info`,
            icon: <User size={16} />,
            show: showMenu,
          },
          {
            name: "결제",
            path: `/project/${currentProject?.id}/payment`,
            icon: <CreditCard size={16} />,
            show: showMenu,
          },
        ],
      },
    ],
    [currentProject?.id, showMenu],
  );

  return (
    <aside
      className={`scrollbar-gutter-stable min-h-screen border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col shrink-0 transition-all duration-300 ${
        isExpanded ? "w-[220px]" : "w-[58px]"
      }`}
    >
      {/* 로고 + 테마 */}
      <div
        className={`flex items-center border-b border-[var(--sidebar-border)] ${isExpanded ? "justify-between" : "justify-center"}`}
      >
        <Link href="/" className="shrink-0 ">
          <img
            src="/logo.png"
            alt="logo"
            className={isExpanded ? "ml-5 w-7 h-7" : "w-7 h-7 my-2"}
          />
        </Link>
        {isExpanded && <ThemeBtn />}
      </div>

      {/* 프로젝트 셀렉터 */}
      <div className="px-3 py-2.5 border-b border-[var(--sidebar-border)]/50">
        {/**프로젝트 추가 */}
        <div className="relative w-full">
          {/* 토글 트리거 버튼 */}
          <button
            onClick={() => setShowProjects(!showProjects)}
            className={`w-full flex items-center bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)] rounded-xl py-3 cursor-pointer hover:border-[var(--sidebar-primary)]/30 transition-all ${
              isExpanded ? "px-3 justify-between gap-2" : "justify-center px-0"
            }`}
          >
            <div
              className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0"
              style={{
                background: "var(--sidebar-primary)",
                color: "var(--sidebar-primary-foreground)",
              }}
            >
              {currentProject?.name ? currentProject.name[0] : ""}
            </div>
            {isExpanded && (
              <>
                <span className="text-[14px] font-bold text-[var(--foreground)] truncate flex-1 text-left">
                  {currentProject?.name}
                </span>
                {/* 토글 상태에 따라 화살표 회전 애니메이션 추가 */}
                <span
                  className={`text-[8px] text-[var(--sidebar-foreground)]/40 font-mono shrink-0 transition-transform duration-200 ${showProjects ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>

          {/* 토글 드롭다운 목록 */}
          {showProjects && (
            <div className="absolute left-0 right-0 mt-1 bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)] rounded-xl overflow-hidden z-50 shadow-lg">
              <div className="flex flex-col max-h-60 overflow-y-auto p-1">
                {projects
                  .filter((p) => p.id !== currentProject?.id)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentProject(p.id);
                        setShowProjects(false);
                        router.push(`/project/${p.id}/workline`);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[14px] hover:bg-[var(--sidebar-primary)]/10 text-[var(--foreground)] transition-colors ${
                        p.id === currentProject?.id
                          ? "bg-[var(--sidebar-primary)]/5 font-semibold"
                          : ""
                      }`}
                    >
                      {/* 리스트 내 프로젝트 이니셜 아이콘 */}
                      <div
                        className="w-5 h-5 rounded-md text-[9px] font-black flex items-center justify-center shrink-0"
                        style={{
                          background: "var(--sidebar-primary)",
                          color: "var(--sidebar-primary-foreground)",
                        }}
                      >
                        {p.name[0]}
                      </div>
                      {isExpanded && (
                        <span className="truncate flex-1">{p.name}</span>
                      )}
                    </button>
                  ))}
                {/**프로젝트 추가 */}
                {isAdding ? (
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2 mt-1">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="프로젝트 이름 입력"
                      className="bg-transparent text-[14px] text-[var(--foreground)] outline-none flex-1 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateProject();
                        if (e.key === "Escape") setIsAdding(false);
                      }}
                    />
                    <Tooltip content="프로젝트 추가" placement="top">
                      <button
                        onClick={handleCreateProject}
                        className="text-s text-[var(--secondary-foreground)] font-bold cursor-pointer mt-2"
                      >
                        <Plus size={14} />
                      </button>
                    </Tooltip>
                    <Tooltip content="나가기" placement="top">
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-s text-[var(--secondary-foreground)] cursor-pointer mt-2"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-1 mt-1 hover:bg-[var(--sidebar-primary)]/10 transition-all"
                  >
                    <span className="text-s text-[var(--sidebar-foreground)]/60">
                      + 프로젝트 추가
                    </span>
                  </button>
                )}
                {/** */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 */}
      <div className="flex-1 py-4 space-y-10 overflow-y-auto overflow-x-hidden">
        {menuSections.map((section, idx) => (
          <div
            key={idx}
            className={`px-3 ${section.show ? "block" : "hidden"}`}
          >
            {isExpanded && (
              <div className="text-[13px] font-black text-[var(--sidebar-foreground)]/30 mb-4 px-2 tracking-widest uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    href={item.path}
                    key={item.name}
                    className={`flex items-center rounded-xl text-[13px] font-semibold group transition-all duration-150 ${
                      isExpanded
                        ? "px-3 py-2.5 gap-3"
                        : "justify-center p-3 mx-auto w-10"
                    } ${
                      isActive
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-black"
                        : "text-[var(--sidebar-foreground)]/60 hover:bg-[var(--sidebar-accent)]/50 hover:text-[var(--sidebar-foreground)]"
                    } ${item.show ? "block" : "hidden"}`}
                  >
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[var(--sidebar-primary)]"
                          : "text-[var(--sidebar-foreground)]/35 group-hover:text-[var(--sidebar-foreground)]/70"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isExpanded && (
                      <span className="tracking-wide truncate">
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

      {/* 접기/펼치기 */}
      <div className="border-t border-[var(--sidebar-border)]/60 bg-[var(--sidebar)]">
        <button
          className={`h-12 w-full flex items-center text-[var(--sidebar-foreground)]/30 hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/40 transition-all ${
            isExpanded ? "px-5 justify-end" : "justify-center"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "사이드바 닫기" : "사이드바 열기"}
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
    </aside>
  );
}
