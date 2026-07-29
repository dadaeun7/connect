import { useEffect, useState } from "react";
import InvitationHistorySection from "./invte_history/InvitationHistorySection";
import InviteFormSection from "./invte_history/InviteFormSection";
import { useProjectStore } from "@/app/store/useProjectStore";

export interface InviteHistoryResponse {
  email: string;
  state: string;
  invitedAt: string;
}

export interface CurrentProjectRolesResponse {
  email: string;
  role: string;
}

const AffiliationTab = () => {
  const { currentProject } = useProjectStore();
  const [inviteHistory, setInviteHistory] = useState<InviteHistoryResponse[]>(
    [],
  );

  const [projectUsers, setProjectUsers] = useState<
    CurrentProjectRolesResponse[]
  >([]);

  useEffect(() => {
    const getInviteHistory = async () => {
      try {
        const result = await fetch(
          `/project/invite/history/list?projectId=${currentProject?.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!result.ok) {
          throw new Error("invite history error");
        }

        const data = await result.json();
        setInviteHistory(data);
      } catch (error) {
        console.error("invite history error :", error);
      }
    };
    const getCurrentUsers = async () => {
      try {
        const result = await fetch(
          `/project/invite/current/users?projectId=${currentProject?.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!result.ok) {
          throw new Error("project current users error");
        }

        const data = await result.json();
        setProjectUsers(data);
      } catch (error) {
        console.error("project current users error :", error);
      }
    };

    getInviteHistory();
    getCurrentUsers();
  }, []);

  return (
    <div className="space-y-20 animate-in fade-in duration-300 bg-[var(--card)] rounded-xl p-6 shadow-sm">
      {/* 1. 프로젝트 초대 및 목록 */}
      <InviteFormSection projectUsers={projectUsers} />
      {/* 2. 초대 메일 발송 이력 */}
      <InvitationHistorySection inviteHistory={inviteHistory} />
    </div>
  );
};

export default AffiliationTab;
