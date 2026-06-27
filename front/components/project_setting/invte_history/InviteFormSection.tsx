import { ChevronDown, Mail } from "lucide-react";

export default function InviteFormSection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-[var(--foreground)]">
          프로젝트 초대 목록
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          협업 프로젝트 공간에 같이 작업할 사용자의 이메일로 초대합니다.
        </p>
      </div>

      {/* 입력 폼 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60" />
          <input
            className="w-full bg-[var(--background)]/40 border border-[var(--border)] rounded-lg pl-11 pr-4 py-3 text-sm text-[var(--foreground)]/50 focus:outline-none focus:border-[var(--primary)]/70 transition-colors"
            placeholder="invite_user_context@gmail.com"
          />
        </div>
        <div className="relative min-w-[140px]">
          <select className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none appearance-none font-bold">
            <option>Editor</option>
            <option>Viewer</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/40 pointer-events-none" />
        </div>
        <button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-6 py-3 rounded-lg text-sm shadow-sm hover:opacity-95 transition-opacity">
          Invite
        </button>
      </div>

      {/* 목록 테이블 */}
      <div className="border-y border-[var(--border)] overflow-hidden shadow-xs mb-8">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--background)] border-b border-[var(--border)] text-xs font-black uppercase text-[var(--muted-foreground)] tracking-wider">
              <th className="p-4 pl-4">이메일</th>
              <th className="p-4">권한</th>
              <th className="p-4 text-right pr-21">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/50 font-medium text-[var(--muted-foreground)] bg-[var(--card)]">
            <tr className="hover:bg-[var(--muted)]/20 transition-colors">
              <td className="p-4 pl-4 font-bold text-[var(--foreground)] text-sm">
                test@gmail.com (나)
              </td>
              <td className="p-4">
                <span className="text-[var(--primary)] bg-[var(--primary)]/10 text-xs font-black border border-[var(--primary)]/20 px-2 py-1 rounded">
                  관리자
                </span>
              </td>
              <td className="p-4 text-right pr-4 text-[var(--muted-foreground)]/80 font-bold">
                프로젝트 소유자
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
