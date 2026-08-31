import { useState, useEffect } from "react";
import {
  fetchInviteHistory,
  fetchCurrentProjectUsers,
  InviteHistoryResponse,
  CurrentProjectRolesResponse,
} from "../api/affiliation";

export function useAffiliationTab(projectId: string | undefined) {
  const [inviteHistory, setInviteHistory] = useState<InviteHistoryResponse[]>(
    [],
  );
  const [projectUsers, setProjectUsers] = useState<
    CurrentProjectRolesResponse[]
  >([]);

  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      try {
        const [history, users] = await Promise.all([
          fetchInviteHistory(projectId),
          fetchCurrentProjectUsers(projectId),
        ]);
        setInviteHistory(history);
        setProjectUsers(users);
      } catch (err) {
        console.error("Affilication error: ", err);
      }
    };

    loadData();
  }, [projectId]);

  return { inviteHistory, projectUsers };
}
