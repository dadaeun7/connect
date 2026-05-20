import { Search } from "lucide-react";

const AffiliationTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 소속 연동 테이블 명세 */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">
            현재 소속된 정보
          </h3>
          <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors border border-[var(--border)] bg-[var(--card)] p-2 rounded-lg">
            <Search size={14} />
          </button>
        </div>

        <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--muted)]/50 border-b border-[var(--border)] text-[10px] font-black uppercase text-[var(--muted-foreground)] tracking-wider">
                <th className="p-3.5 pl-4">프로젝트</th>
                <th className="p-3.5">회사</th>
                <th className="p-3.5 text-right pr-4">권한</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-[var(--muted-foreground)] bg-[var(--card)]">
              <tr className="border-b border-[var(--border)]/60 hover:bg-[var(--muted)]/10 transition-colors">
                <td className="p-4 pl-4 font-bold text-[var(--foreground)] text-sm">
                  연결된 프로젝트명
                </td>
                <td className="p-4 text-xs font-semibold">회사 이름</td>
                <td className="p-4 text-right pr-4">
                  <span className="text-[var(--primary)] bg-[var(--primary)]/10 text-[10px] font-black border border-[var(--primary)]/20 px-2 py-0.5 rounded uppercase tracking-wide">
                    관리자
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="text-[11px] font-bold text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-wider">
            소속 전체 해제
          </button>
        </div>
      </section>

      {/* 히스토리 피드 로그 목록 */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
            활동 히스토리 이력
          </h3>
          <div className="flex-1 h-[1px] bg-[var(--border)]/60" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group flex justify-between items-center bg-[var(--card)] border border-[var(--border)] p-4 rounded-xl hover:border-[var(--primary)]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--primary)]/30 transition-colors">
                  <span className="text-[var(--primary)] text-xs font-black font-mono">
                    #0{i}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)] transition-colors">
                    프로젝트 이름
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] font-semibold mt-0.5">
                    회사 이름
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
                  현재 상태
                </p>
                <p className="text-xs text-[var(--muted-foreground)]/60 font-mono">
                  April 29, 2026
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AffiliationTab;
