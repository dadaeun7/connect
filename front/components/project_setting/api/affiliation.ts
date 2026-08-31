export interface InviteHistoryResponse {
  email: string;
  state: string;
  invitedAt: string;
}

export interface CurrentProjectRolesResponse {
  email: string;
  role: string;
}

export async function inviteUserApi(
  currentProjectId: number,
  email: string,
  role: any,
) {
  const result = await fetch("/project/invite/user", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: currentProjectId,
      toEmail: email,
      role: role.toUpperCase(),
    }),
  });

  return result;
}

export async function fetchInviteHistory(
  projectId: string,
): Promise<InviteHistoryResponse[]> {
  const result = await fetch(
    `/project/invite/history/list?projectId=${projectId}`,
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

  return result.json();
}

export async function fetchCurrentProjectUsers(
  projectId: string,
): Promise<CurrentProjectRolesResponse[]> {
  const result = await fetch(
    `/project/invite/current/users?projectId=${projectId}`,
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

  return result.json();
}
