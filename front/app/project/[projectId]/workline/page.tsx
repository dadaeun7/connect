import MainWorkline from "@/components/workline/MainWorkline";
import { BACKEND } from "@/lib/constant";
import { headers } from "next/headers";

export interface GithubRepo {
  id: number;
  full_name: string;
}

export interface GithubBranch {
  name: string;
}

export interface NotionList {
  id: string;
  type: string;
  title: string;
  url: string;
}

export interface FigmaState {
  success: boolean;
  fileKey: string;
  name: string;
  url: string;
  message: string;
}

export default function Page() {
  const getGithubRepo = async () => {
    "use server";

    try {
      const result = await fetch(BACKEND + "/repos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
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

  const getGitBrach = async (repo: string) => {
    "use server";

    try {
      const result = await fetch(BACKEND + "/branches?repoFullName=" + repo, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
      });

      if (!result.ok) throw new Error("branch get error");

      const data = await result.json();
      return data;
    } catch (error) {
      console.error("branch get server error: " + error);
    }
  };

  const getFigmaState = async (url: string) => {
    "use server";

    if (url == null || url === "") return;

    try {
      const result = await fetch(BACKEND + "/get/figma-state?fileUrl=" + url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
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

  const getNotionList = async () => {
    "use server";
    try {
      const result = await fetch(BACKEND + "/notion/lists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
      });

      if (!result.ok) throw new Error("Notion get api error");

      const data = await result.json();
      return data;
    } catch (error) {
      console.error("Notion api get error: " + error);
    }
  };

  const getIssueNextPage = async (
    projectId: number | undefined,
    nextPage: number,
  ) => {
    "use server";
    try {
      const res = await fetch(
        BACKEND + `/issue/view/list?projectId=${projectId}&page=${nextPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: (await headers()).get("cookie") || "",
          },
        },
      );

      if (!res.ok) throw new Error("issue view paging fetch error");

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getIssueDetail = async (issueId: number | null) => {
    "use server";
    if (issueId === null) return;

    try {
      const res = await fetch(BACKEND + `/issue/detail?issueId=${issueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
      });

      if (!res.ok) throw new Error("issue detail fetch error");

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    "use server";
    try {
      const result = await fetch(BACKEND + "/info", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
      });

      if (!result.ok) throw new Error("get info error");

      const data = await result.json();
      return data;
    } catch (error) {
      console.error("get info error :", error);
    }
  };

  const getIssueTotal = async (projectId: number | undefined) => {
    "use server";

    if (projectId === undefined) return;
    try {
      const result = await fetch(
        BACKEND + `/issue/count?projectId=${projectId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: (await headers()).get("cookie") || "",
          },
        },
      );

      if (!result.ok) throw new Error("get issue total count error...");

      const data = await result.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainWorkline
      getGithubRepo={getGithubRepo}
      getGitBrach={getGitBrach}
      getFigmaState={getFigmaState}
      getNotionList={getNotionList}
      getIssueNextPage={getIssueNextPage}
      getIssueDetail={getIssueDetail}
      getUserInfo={getUserInfo}
      getIssueTotal={getIssueTotal}
    />
  );
}
