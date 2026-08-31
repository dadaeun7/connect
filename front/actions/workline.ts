"use server";

import { BACKEND } from "@/lib/constant";
import * as auth from "@/actions/authheader";

export const getGithubRepo = async () => {
  try {
    const result = await fetch(BACKEND + "/repos", {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok)
      throw new Error("Gtihub Repository error : " + result.status);

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("repo server error: " + error);
    return null;
  }
};

export const getGitBrach = async (repo: string) => {
  try {
    const result = await fetch(BACKEND + "/branches?repoFullName=" + repo, {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok) throw new Error("branch get error");

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("branch get server error: " + error);
  }
};

export const getFigmaState = async (url: string) => {
  if (url == null || url === "") return;

  try {
    const result = await fetch(BACKEND + "/get/figma-state?fileUrl=" + url, {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok) {
      const errText = await result.text();
      console.error("백엔드 HTTP 에러 발생:", result.status, errText);
      return {
        success: false,
        message: "백엔드 통신 실패 (" + result.status + ")",
      };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("figma get state server error: " + error);
  }
};

export const getNotionList = async () => {
  try {
    const result = await fetch(BACKEND + "/notion/lists", {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok) throw new Error("Notion get api error");

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("Notion api get error: " + error);
  }
};

export const getIssueNextPage = async (
  projectId: number | undefined,
  nextPage: number,
) => {
  "use server";
  try {
    const res = await fetch(
      BACKEND + `/issue/view/list?projectId=${projectId}&page=${nextPage}`,
      {
        method: "GET",
        headers: await auth.getAuthHeaders(),
      },
    );

    if (!res.ok) throw new Error("issue view paging fetch error");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getIssueDetail = async (issueId: number | null) => {
  if (issueId === null) return;

  try {
    const res = await fetch(BACKEND + `/issue/detail?issueId=${issueId}`, {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!res.ok) throw new Error("issue detail fetch error");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserInfo = async () => {
  try {
    const result = await fetch(BACKEND + "/info", {
      method: "GET",
      credentials: "include",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok) throw new Error("get info error");

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("get info error :", error);
  }
};
