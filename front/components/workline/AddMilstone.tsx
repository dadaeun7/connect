// 공통된 세련된 다크 패널 스타일
const ModernPanel = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="bg-[#0E1422] rounded-3xl p-8 border border-slate-700/50 shadow-2xl shadow-slate-950/20 w-full max-w-2xl mx-auto">
    <h2 className="text-3xl font-extrabold text-slate-100 mb-8 tracking-tight">
      {title}
    </h2>
    {children}
  </div>
);

// Floating Label 스타일을 적용한 입력 필드 컴포넌트
const ModernInputField = ({
  label,
  id,
  ...props
}: {
  label: string;
  id: string;
}) => (
  <div className="relative mb-6">
    <input
      type="text"
      id={id}
      className="peer block w-full px-6 py-5 text-lg text-slate-200 bg-[#182035] border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50 caret-indigo-500 placeholder-transparent"
      placeholder=" " // peer-placeholder-shown 작동을 위해 공백 필요
      {...props}
    />
    <label
      htmlFor={id}
      className="absolute text-lg text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#182035] px-2 peer-focus:px-2 peer-focus:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-4"
    >
      {label}
    </label>
  </div>
);

// priority, status, size를 묶은 개요 카드 컴포넌트 (이미지 2의 카드 스타일 모방)
const MilestoneOverviewCard = () => (
  <div className="bg-[#182035] rounded-xl p-6 mb-8 border border-slate-700">
    <h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-widest uppercase">
      마일스톤 개요 (Priority / Status / Size)
    </h3>
    <div className="grid grid-cols-3 gap-6">
      {/* Priority */}
      <div className="flex flex-col items-center justify-center p-5 bg-slate-800/60 rounded-xl hover:bg-slate-700/50 cursor-pointer duration-150">
        <span className="text-4xl">🎯</span>
        <span className="text-sm font-medium text-slate-400 mt-2">
          Priority
        </span>
        <span className="text-2xl font-bold text-slate-100 mt-1">Medium</span>
      </div>
      {/* Status (온라인 그린 강조) */}
      <div className="flex flex-col items-center justify-center p-5 bg-teal-950/70 rounded-xl border border-teal-600/50 hover:border-teal-400 duration-150 cursor-pointer">
        <span className="text-4xl text-teal-400">●</span>
        <span className="text-sm font-medium text-slate-400 mt-2">Status</span>
        <span className="text-2xl font-bold text-teal-400 mt-1">On Track</span>
      </div>
      {/* Size */}
      <div className="flex flex-col items-center justify-center p-5 bg-slate-800/60 rounded-xl hover:bg-slate-700/50 cursor-pointer duration-150">
        <span className="text-4xl">📊</span>
        <span className="text-sm font-medium text-slate-400 mt-2">Size</span>
        <span className="text-2xl font-bold text-slate-100 mt-1">Large</span>
      </div>
    </div>
  </div>
);

const AddMilestone = () => {
  return (
    <div className="min-h-screen p-10 bg-[#080B13]">
      {/* 전체 대시보드 화면 안에 폼 카드 패널 배치 */}
      <ModernPanel title="새로운 마일스톤 생성">
        <form>
          {/* 이슈명 (가장 중요한 필드이므로 크고 명확하게) */}
          <ModernInputField label="마일스톤 / 이슈명" id="issueName" />

          {/* Priority, Status, Size를 하나의 통합 카드로 교체! (구닥다리 개별 입력 필드 탈피) */}
          <MilestoneOverviewCard />

          {/* 연결 (멀티-셀렉트 훅이 적용된 컴포넌트 예시. 이미지 3의 블루 테두리 효과를 Focus 시 적용) */}
          <div className="relative mb-6">
            <label
              htmlFor="connect"
              className="text-lg font-semibold text-slate-200 mb-2 block"
            >
              프로젝트 연결
            </label>
            <div className="flex items-center gap-2 px-6 py-5 bg-[#182035] border border-slate-700 focus-within:border-indigo-500 rounded-xl focus-within:ring-1 focus-within:ring-indigo-500 focus-within:ring-opacity-50 cursor-pointer">
              <span className="px-3 py-1 bg-indigo-900/60 text-indigo-200 rounded-full text-sm">
                연결된 프로젝트 A
              </span>
              <span className="text-slate-500">프로젝트 검색...</span>
              <span className="ml-auto text-indigo-500">🔗</span>
            </div>
          </div>

          {/* 마감일 (최신 브라우저 날짜 선택기 활용) */}
          <div className="relative mb-6">
            <label
              htmlFor="dueDate"
              className="text-lg font-semibold text-slate-200 mb-2 block"
            >
              마감일 설정
            </label>
            <input
              type="date"
              id="dueDate"
              className="block w-full px-6 py-5 text-lg text-slate-200 bg-[#182035] border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 caret-indigo-500"
            />
          </div>

          {/* 이슈 & 작업자 (드롭다운/목록 선택형 컴포넌트) */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <ModernInputField label="관련 이슈 링크" id="issueLink" />
            <div className="relative mb-6">
              <label
                htmlFor="assignee"
                className="text-lg font-semibold text-slate-200 mb-2 block"
              >
                작업자
              </label>
              <div className="px-6 py-5 text-lg text-slate-200 bg-[#182035] border border-slate-700 rounded-xl focus-within:border-indigo-500 cursor-pointer">
                👤 <span className="text-slate-400">작업자 선택...</span>
              </div>
            </div>
          </div>

          {/* 설명 (더 큰 영역을 할당하고 옅은 그리드 배경 사용) */}
          <div className="relative mb-10">
            <label
              htmlFor="description"
              className="text-lg font-semibold text-slate-200 mb-3 block"
            >
              마일스톤 상세 설명
            </label>
            <textarea
              id="description"
              rows={10}
              className="block w-full px-6 py-5 text-lg text-slate-200 bg-[#182035] border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 resize-none font-mono"
              style={{
                backgroundImage:
                  "linear-gradient(#26314c 1px, transparent 1px)",
                backgroundSize: "100% 24px",
              }}
              placeholder="마일스톤에 대한 상세 내용을 입력하세요. (Markdown 지원)"
            ></textarea>
          </div>

          {/* 버튼 그룹 (이미지 0의 칙칙한 버튼 탈피, 이미지 2 스타일의 세련된 다크 버튼) */}
          <div className="flex justify-end gap-5">
            <button
              type="button"
              className="px-10 py-4 text-lg font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full duration-150"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-10 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full duration-150"
            >
              마일스톤 등록
            </button>
          </div>
        </form>
      </ModernPanel>
    </div>
  );
};

export default AddMilestone;
