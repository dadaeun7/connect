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
      contents: [],
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
        {
          user: "myTest",
          message: "해당 이슈를 논의중으로 변경했습니다.",
          writeAt: "2026-04-30",
        },
        {
          user: "myTest1",
          message: "@테스트2 님 00 내용에 대한 확인 부탁드립니다.",
          writeAt: "2026-04-30",
        },
        {
          user: "myTest2",
          message:
            "본 이슈건은 다른 이슈건과 유사하여 이슈 병합해주시면 감사하겠습니다.",
          writeAt: "2026-04-30",
        },
      ],
    },
  ];

  const filteredIssues = ["전체", "검토전", "논의중", "완료"];

  return (
    <div className="flex-1 bg-[var(--background)] min-h-screen p-8 text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-[var(--foreground)]">
          새이슈
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          새로 감지된 이슈 채널 활동을 실시간 확인하여 검토 리포팅을 생성합니다.
        </p>
      </div>
      <div>
        <IssueTap menu={filteredIssues} />
        <IssueSearch />
        <IssueList list={issues} />
      </div>
    </div>
  );
}
