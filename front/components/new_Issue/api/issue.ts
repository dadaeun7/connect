export async function fetchKeyword(projectId: string): Promise<string> {
  const response = await fetch(`/get/keyword?projectId=${projectId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errDetail = await response.text();
    throw new Error(`키워드 조회 실패: ${errDetail}`);
  }

  return response.text();
}

export const getKeyword = async (projectId: number) => {
  const result = await fetch(`/get/keyword?projectId=${projectId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!result.ok) throw new Error("get keyword error");
  return result.text();
};

export const createKeywordApi = async (keyword: string) => {
  const res = await fetch(`/keyword/create?keyword=${keyword}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("keyword create error");
  return res;
};

export const fetchNewIssues = async (projectId?: number) => {
  const res = await fetch(`/new-issue/get?projectId=${projectId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("get new issue error");
  return res.json();
};

export const deleteNewIssueApi = async (newIssueId: number) => {
  const res = await fetch(`/new-issue/delete?newIssueId=${newIssueId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("new issue delete error");
  return res;
};

export const fetchIssueTitleList = async (projectId?: number) => {
  const res = await fetch(`/issue/title/list?projectId=${projectId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("fetch issue list error");
  return res.json();
};

export const mergeIssueApi = async (
  curIssueId: number,
  curNewIssueId: number,
) => {
  const res = await fetch(
    `/new-issue/merge?issueId=${curIssueId}&newIssueId=${curNewIssueId}`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!res.ok) throw new Error("merge issue error");
  return res;
};
