import { ActivityResponse } from "@/app/store/useIssueStore";
import MainTimeLine from "@/components/timeline/MainTimeLine";
import { BACKEND } from "@/lib/constant";
import { headers } from "next/headers";

export default function Page() {
  const getActivity = async (
    issueId: number | null,
    newPage: number,
  ): Promise<ActivityResponse[]> => {
    "use server";

    if (newPage < 0 || issueId == null) return [];

    try {
      const res = await fetch(
        BACKEND + `/issue/activity/list?issueId=${issueId}&page=${newPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: (await headers()).get("cookie") || "",
          },
        },
      );

      if (!res.ok) throw new Error("issue activity get error");
      const data: ActivityResponse[] = await res.json();
      return data ?? [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getMonthlyIssue = async (
    projectId: number | undefined,
    startDate: string,
    endDate: string,
  ) => {
    "use server";
    try {
      if (projectId === undefined) return;

      const startIso = new Date(startDate).toISOString();
      const endIso = new Date(endDate).toISOString();

      const result = await fetch(
        BACKEND +
          `/issue/month/list?` +
          `projectId=${projectId}&startDate=${startIso}&endDate=${endIso}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: (await headers()).get("cookie") || "",
          },
        },
      );
      if (!result.ok) throw new Error("issue activity get error");
      const data = await result.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <MainTimeLine getActivity={getActivity} getMonthlyIssue={getMonthlyIssue} />
  );
}
