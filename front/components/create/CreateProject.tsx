"use client";

import { useCreateProject } from "./hooks/useCreateProject";

interface ProjectEmptyStateProps {
  onCreateClick?: (projectName: string) => void;
}

export default function CreatePage({
  onCreateClick,
}: Readonly<ProjectEmptyStateProps>) {
  const { isFormOpen, projectName, setProjectName, handleButtonClick } =
    useCreateProject({ onCreateClick });

  // 기존에 파일 최상단에 선언된 createCard 상수 유지
  const createCard = [
    {
      icon: "🔌",
      title: "프로젝트 생성",
      description:
        "하나의 작업 라인을 만들기 위한 프로젝트 이름을 먼저 정해보세요.",
    },
    {
      icon: "🧩",
      title: "외부 플랫폼 연동",
      description:
        "Github, Slack, Figma, Notion 을 연동 후 하위 작업들을 분리하고 관리해보세요",
    },
    {
      icon: "👥",
      title: "팀원 초대 관리",
      description:
        "작업에 필요한 인원을 이메일 초대를 통해 권한을 각각 다르게 부여하여 협업 합니다.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-5xl mx-auto px-6 py-12">
      {/* 1. 은은한 중앙 그래픽 아이콘 */}
      <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <svg
          className="w-10 h-10 text-gray-400 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      {/* 2. 메인 카피 및 설명 */}
      <div className="text-center space-y-2 max-w-l mb-10">
        <p className="text-gray-500 text-m leading-relaxed">
          아직 본인 소유 프로젝트가 없네요.
        </p>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          첫 번째 프로젝트를 생성해 주세요!
        </h1>
      </div>

      {/* 3. 유저의 이해를 돕는 간결한 기능 프리뷰 가이드 (3열 구성) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
        {/* 카드 1*/}
        {createCard.map((card, index) => (
          <div
            key={index}
            className="p-5 border border-[var(--muted-foreground)]/40 rounded-2xl bg-[var(--background)] space-y-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-gray-300 hover:bg-[var(--card)] hover:shadow-md cursor-default"
          >
            <div className="text-xl">{card.icon}</div>
            <h3 className="font-semibold text-lg text-[var(--foreground)]">
              {card.title}
            </h3>
            <p className="text-s text-[var(--muted-foreground)] leading-normal">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* 폼 및 버튼 제어 영역 */}
      <div className="w-full max-w-sm flex flex-col items-center space-y-4">
        {/*  3. 버튼 위에 등장하는 프로젝트 이름 입력란 (애니메이션 적용) */}
        <div
          className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${
            isFormOpen
              ? "max-h-20 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="프로젝트 이름을 입력해 주세요 (예: Connect)"
            maxLength={20}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-gray-900 transition-all bg-white"
          />
        </div>

        {/*  4. 동적으로 텍스트와 이벤트를 전환하는 메인 버튼 */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex items-center justify-center space-x-2 w-full max-w-[220px] px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-xl shadow-sm transition-all duration-200 group transform active:scale-95"
        >
          {/* 폼이 열리기 전(+) 상태일 때만 아이콘 회전 효과 부여 */}
          <svg
            className={`w-4 h-4 text-white transition-transform duration-200 ${
              !isFormOpen ? "group-hover:rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isFormOpen ? (
              //  폼이 열렸을 때는 체크 아이콘(V)으로 스위칭
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            ) : (
              //  기본 상태일 때는 플러스 아이콘(+)
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            )}
          </svg>

          {/*  상태에 따라 버튼 명칭 변경 */}
          <span>
            {isFormOpen ? "등록 후 시작하기" : "새 프로젝트 생성하기"}
          </span>
        </button>
      </div>
    </div>
  );
}
