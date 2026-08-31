import { PAYLOAD, UpdatedPayload } from "../types/type";

export const getIssueTotal = async (projectId: number | undefined) => {
  if (projectId === undefined) return;
  try {
    const result = await fetch(`/issue/count?projectId=${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!result.ok) throw new Error("get issue total count error...");

    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateIssueApi = async (
  issueId: number,
  updateReq: UpdatedPayload,
) => {
  const response = await fetch(`/issue/modify?issueId=${issueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updateReq),
  });
  if (!response.ok) throw new Error("이슈 수정 실패");
};

export const deleteIssueApi = async (issueId: number) => {
  const response = await fetch(`/issue/delete?issueId=${issueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("이슈 삭제 실패");
};

export const issueCreate = async (payload: PAYLOAD) => {
  const response = await fetch("/issue/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("이슈 저장에 실패했습니다.");
};

export const getHistoryApi = async (issueId: number) => {
  const response = await fetch(`/issue/history/list?issueId=${issueId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
};
