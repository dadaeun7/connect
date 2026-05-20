import { ChevronDown, Mail } from "lucide-react";

export default function GeneralTab() {
  return (
    <div className="space-y-8">
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-s font-bold text-[var(--foreground)]">
            워크스페이스 기본 정보 관리
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            현재 프로젝트의 이름을 지정합니다.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--muted-foreground)] tracking-wider">
              프로젝트 이름
            </label>
            <input
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-semibold transition-colors"
              defaultValue="차후 정보를 받아서 동기화할 예정"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-[var(--secondary)] border border-[var(--border)] text-[var(--secondary-foreground)] font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-[var(--muted)] transition-colors">
              프로젝트 이름 저장
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-s font-bold text-[var(--foreground)]">
            사용자 프로젝트 초대
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            협업 프로젝트 공간에 동참할 사용자의 이메일을 통해 초대합니다.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60" />
            <input
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg pl-11 pr-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="invite_user_context@gmail.com"
            />
          </div>
          <div className="relative min-w-[140px]">
            <select className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none appearance-none font-bold">
              <option>Editor 권한</option>
              <option>Admin 마스터</option>
              <option>Viewer 참관</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/40 pointer-events-none" />
          </div>
          <button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-6 py-3 rounded-lg text-xs shadow-sm hover:opacity-95 transition-opacity">
            Invite
          </button>
        </div>

        <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--muted)]/50 border-b border-[var(--border)] text-[11px] font-black uppercase text-[var(--muted-foreground)] tracking-wider">
                <th className="p-4 pl-4">Account User Mail</th>
                <th className="p-4">Role Group</th>
                <th className="p-4 text-right pr-4">Identity Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50 font-medium text-[var(--muted-foreground)] bg-[var(--card)]">
              <tr className="hover:bg-[var(--muted)]/20 transition-colors">
                <td className="p-4 pl-4 font-bold text-[var(--foreground)] text-sm">
                  박다은 (나)
                </td>
                <td className="p-4">
                  <span className="text-[var(--primary)] bg-[var(--primary)]/10 text-[10px] font-black border border-[var(--primary)]/20 px-2 py-0.5 rounded">
                    ADMIN MASTER
                  </span>
                </td>
                <td className="p-4 text-right pr-4 text-[var(--muted-foreground)]/80 font-bold">
                  Workspace Owner
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[var(--foreground)]">
            초대 메일 발송 이력
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] font-medium">
            송신 완료된 초대 명단의 실시간 인증 대기 상태 타임라인 내역입니다.
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]/50">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-[var(--card)] hover:bg-[var(--muted)]/10 transition-colors text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]" />
                <div>
                  <p className="font-bold text-[var(--foreground)] text-sm">
                    collaborator_dev_node_{i}@daum.net
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                    Invitation Dispatched
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <span className="text-[10px] font-black px-2 py-0.5 bg-[var(--muted)] border border-[var(--border)] rounded text-[var(--muted-foreground)]/70">
                  Pending
                </span>
                <span className="font-mono text-xs text-[var(--muted-foreground)]/40 font-bold">
                  2026.04.29
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
