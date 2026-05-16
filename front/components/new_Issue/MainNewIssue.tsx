import IssueList from "./IssueList";
import IssueSearch from "./IssueSearch";
import IssueTap from "./IssueTap";

export default function IssueListView() {
  const issues = [
    {
      id: 1,
      title: "서비스명/등록된 내용",
      status: "검토전",
      date: "2026-04-30 10:30:21",
    },
    {
      id: 2,
      title: "서비스명/등록된 내용",
      status: "논의중",
      date: "2026-04-30 10:30:21",
      contents: [],
    },
    {
      id: 3,
      title: "서비스명/등록된 내용",
      status: "논의중",
      date: "2026-04-30 10:30:21",
      contents: [
        "해당 이슈를 논의중으로 변경했습니다.",
        "@테스트1 @테스트2 님 00 내용에 대한 확인 부탁드립니다.",
        "@테스트3 본 이슈건은 다른 이슈건과 유사하여 이슈 병합해주시면 감사하겠습니다.",
      ],
    },
  ];

  const filteredIssues = ["전체", "검토전", "논의중", "완료"];

  return (
    <div className="flex-1 bg-black min-h-screen p-10 text-white selection:bg-[#00FFA3] selection:text-black">
      <div className="mb-12">
        <h1 className="text-4xl font-[700] tracking-tighter mb-2 text-white uppercase">
          새이슈
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-widest">
          새로 감지된 이슈를 확인하여 논의해보세요.
        </p>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* 상단 탭: 형광색 언더라인 스타일 */}
        <IssueTap menu={filteredIssues} />
        {/* 검색 바: 다크 모드 캡슐형 */}
        <IssueSearch />
        {/* 이슈 리스트: 레퍼런스 이미지의 카드 스타일 */}
        <IssueList list={issues} />
      </div>
    </div>
  );
}
