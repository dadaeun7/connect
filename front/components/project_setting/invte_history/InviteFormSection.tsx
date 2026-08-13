"use client";

import { useProjectStore } from "@/app/store/useProjectStore";
import CstAlert from "@/components/share/CstAlert";
import PopupLoading from "@/components/share/PopupLoading";
import { ChevronDown, Mail } from "lucide-react";
import { useState } from "react";
import { CurrentProjectRolesResponse } from "../AffiliationTab";

interface RoleInfo {
  desc: string;
}

const roleInfo: Record<string, RoleInfo> = {
  ADMIN: {
    desc: "프로젝트 소유자",
  },
  EDITOR: {
    desc: "수정 권한",
  },
  VIEWER: {
    desc: "보기 권한",
  },
};

export default function InviteFormSection({
  projectUsers,
}: Readonly<{
  projectUsers: CurrentProjectRolesResponse[];
}>) {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const { currentProject } = useProjectStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const inviteSubmit = async () => {
    const trimmedEmail = email.trim();

    // 1. 빈 값 및 공백 검증
    if (!trimmedEmail) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    // 2. 이메일 형식 유효성 검증
    if (!emailRegex.test(trimmedEmail)) {
      alert("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
      return;
    }

    try {
      setLoading(true);
      const result = await fetch("/project/invite/user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        // 💡 백엔드 InvtieUserReq DTO 스펙에 정확히 필드명을 매핑합니다.
        body: JSON.stringify({
          projectId: currentProject?.id,
          toEmail: email,
          role: role.toUpperCase(),
        }),
      });

      if (!result.ok) {
        const errorData = await result.json().catch(() => null);
        const errorMessage =
          errorData?.body?.detail || "요청 처리에 실패했습니다.";

        setAlertConfig((props) => ({
          ...props,
          isOpen: true,
          type: "error",
          message: errorMessage,
        }));
        return;
      }

      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
        type: "success",
        message: "초대 메일 발송완료!",
      }));
      setEmail("");
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PopupLoading description="초대 메일 전송중입니다..." />}
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
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
        <div className="flex gap-2">
          {" "}
          {/* 부모 컨테이너 레이아웃 유지용 임시 wrap */}
          {/* 이메일 입력 필드 */}
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--background)]/40 border border-[var(--border)] rounded-lg pl-11 pr-4 py-3 text-sm text-[var(--foreground)]/50 focus:outline-none focus:text-[var(--foreground)] focus:border-[var(--primary)]/70 transition-colors"
              placeholder="invite_user_context@gmail.com"
            />
          </div>
          {/* 권한 선택 필드 */}
          <div className="relative min-w-[140px]">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none appearance-none font-bold"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/40 pointer-events-none" />
          </div>
          {/* 초대 버튼 */}
          <button
            onClick={inviteSubmit}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-6 py-3 rounded-lg text-sm shadow-sm hover:opacity-95 transition-opacity"
          >
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
              {projectUsers.map((pu, index) => (
                <tr
                  key={index}
                  className="hover:bg-[var(--muted)]/20 transition-colors"
                >
                  <td className="px-6 py-2 pl-4 font-bold text-[var(--foreground)] text-[13px]">
                    {pu.email}
                  </td>
                  <td className="px-6 py-[11px] pl-4">
                    <span className="text-[var(--primary)]/80 text-[11px] font-bold rounded">
                      {pu.role}
                    </span>
                  </td>
                  <td className="px-6 py-2 pl-4 text-right pr-4 text-[var(--muted-foreground)]/80 font-bold">
                    {roleInfo[pu.role].desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
