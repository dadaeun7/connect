"use server";

import { headers } from "next/headers";

export async function getAuthHeaders() {
  const cookieHeader = (await headers()).get("cookie") || "";
  return {
    "Content-Type": "application/json",
    Cookie: cookieHeader,
  };
}
