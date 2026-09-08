"use server";

import * as auth from "@/actions/authheader";
import { BACKEND } from "@/lib/constant";

export const handleProjectCreate = async (name: string) => {
  try {
    const res = await fetch(`/project/save`, {
      method: "POST",
      headers: await auth.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      window.location.reload();
    }
  } catch (err) {
    console.error(err);
  }
};

export async function getProjectListAction() {
  try {
    const res = await fetch(BACKEND + "/project/list", {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("프로젝트 로드 에러:", error);
    return [];
  }
}

export async function getAppListAction() {
  try {
    const res = await fetch(BACKEND + "/app/list", {
      method: "GET",
      headers: await auth.getAuthHeaders(),
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("앱 연동 로드 에러:", error);
    return [];
  }
}
