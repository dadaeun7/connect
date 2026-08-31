"use server";

import { ActivityResponse } from "@/components/workline/types/type";
import { BACKEND } from "@/lib/constant";
import * as auth from "@/actions/authheader";

export const getActivity = async (
  issueId: number | null,
  newPage: number,
): Promise<ActivityResponse[]> => {
  if (newPage < 0 || issueId == null) return [];

  try {
    const res = await fetch(
      BACKEND + `/issue/activity/list?issueId=${issueId}&page=${newPage}`,
      {
        method: "GET",
        headers: await auth.getAuthHeaders(),
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

export const getMonthlyIssue = async (
  projectId: number | undefined,
  startDate: string,
  endDate: string,
) => {
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
        headers: await auth.getAuthHeaders(),
      },
    );
    if (!result.ok) throw new Error("issue activity get error");
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
