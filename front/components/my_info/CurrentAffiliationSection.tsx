"use client";

import { useEffect, useState } from "react";

export interface InviteProjectListResponse {
  name: string;
  projectRole: string;
}
export default function CurrentAffiliationSection() {
  const [inviteProjectList, setInviteProjectList] = useState<
    InviteProjectListResponse[]
  >([]);

  useEffect(() => {
    const fetchInvitesProjectList = async () => {
      try {
        const result = await fetch(`/invite/project/list`, {
          method: "GET",
          credentials: "include",
        });

        if (!result.ok) throw new Error("invite project error");

        const data = await result.json();
        setInviteProjectList(data);
      } catch (error) {
        console.error("invite project error :", error);
      }
    };

    fetchInvitesProjectList();
  }, [setInviteProjectList]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-[var(--foreground)]">
          프로젝트 리스트
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          현재 소속된 다른 프로젝트 목록을 보여줍니다.
        </p>
      </div>

      {/* 테이블 전체 폰트 크기 text-xs(12px) -> text-sm(14px) 상향 */}
      <div className="border-y border-[var(--border)] overflow-hidden mb-8">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
            <tr className="bg-[var(--background)] border-b border-[var(--border)] text-xs font-black uppercase text-[var(--muted-foreground)] tracking-wider">
              <th className="p-3.5 pl-4">프로젝트</th>
              <th className="p-3.5 text-right pr-11">권한</th>
            </tr>
          </thead>
          <tbody className="font-medium text-[var(--muted-foreground)] bg-[var(--background)]/40">
            {inviteProjectList.length > 0 && inviteProjectList[0].name ? (
              <>
                {inviteProjectList.map((ip, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--border)]/60 hover:bg-[var(--muted)]/10 transition-colors"
                  >
                    <td className="p-4 pl-3 font-bold text-[var(--foreground)] text-sm">
                      {ip.name}
                    </td>
                    <td className="p-4 text-right pr-4">
                      {/* 폰트 크기 text-[10px] -> text-xs(12px) 상향 */}
                      <span className="text-[var(--primary)] bg-[var(--primary)]/10 text-xs font-black border border-[var(--primary)]/20 px-2 py-0.5 rounded uppercase tracking-wide">
                        {ip.projectRole}
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td className="p-4">현재 소속 된 프로젝트가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
