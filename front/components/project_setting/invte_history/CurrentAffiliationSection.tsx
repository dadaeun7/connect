import { Search } from "lucide-react";

export default function CurrentAffiliationSection() {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-[var(--foreground)]">
          현재 소속된 정보
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          관리하고 있는 현재 프로젝트 목록을 보여줍니다.
        </p>
      </div>

      {/* 테이블 전체 폰트 크기 text-xs(12px) -> text-sm(14px) 상향 */}
      <div className="border-y border-[var(--border)] overflow-hidden mb-8">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
            <tr className="bg-[var(--background)] border-b border-[var(--border)] text-xs font-black uppercase text-[var(--muted-foreground)] tracking-wider">
              <th className="p-3.5 pl-4">프로젝트</th>
              <th className="p-3.5">회사</th>
              <th className="p-3.5 text-right pr-11">권한</th>
            </tr>
          </thead>
          <tbody className="font-medium text-[var(--muted-foreground)] bg-[var(--background)]/40">
            <tr className="border-b border-[var(--border)]/60 hover:bg-[var(--muted)]/10 transition-colors">
              <td className="p-4 pl-4 font-bold text-[var(--foreground)] text-sm">
                연결된 프로젝트명
              </td>
              <td className="p-4 text-xs font-semibold">회사 이름</td>
              <td className="p-4 text-right pr-4">
                {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
                <span className="text-[var(--primary)] bg-[var(--primary)]/10 text-xs font-black border border-[var(--primary)]/20 px-2 py-0.5 rounded uppercase tracking-wide">
                  관리자
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
