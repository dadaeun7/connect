"use server";

import * as auth from "@/actions/authheader";
import { RedirectConfig } from "@/components/my_info/app/AppConnectTab";
import { BACKEND } from "@/lib/constant";
import { redirect } from "next/navigation";

export const appConnectHanlder = async (
  clientId: string,
  clientSecret: string,
  activeTab: string,
  config: RedirectConfig,
) => {
  "use server";

  let finalAuthRequestUrl = "";

  try {
    const response = await fetch(
      BACKEND + "/api/oauth/prepare/" + activeTab.toLowerCase(),
      {
        method: "POST",
        credentials: "include",
        headers: await auth.getAuthHeaders(),
        body: JSON.stringify({
          clientId: clientId,
          clientSecret: clientSecret,
        }),
      },
    );

    const data = await response.json();
    const state = data.state;

    const param = new URLSearchParams();

    param.append("client_id", clientId);
    param.append("redirect_uri", config.url);

    console.log("state, encodeURI:", encodeURIComponent(state));

    param.append("state", encodeURIComponent(state));

    if (config.permission) {
      param.append("scope", config.permission);
    }

    Object.entries(config.extraParams).forEach(([key, value]) => {
      param.append(key, value);
    });

    finalAuthRequestUrl = `${config.auth}?${param.toString()}`;
    console.log("앱 연동 요청 url: " + finalAuthRequestUrl);
  } catch (err) {
    console.log(activeTab + "인증 중 에러 발생: " + err);
    return;
  }

  redirect(finalAuthRequestUrl);
};

export const userWithDraw = async (): Promise<boolean> => {
  "use server";
  try {
    const result = await fetch(BACKEND + "/user/withdraw", {
      method: "POST",
      headers: await auth.getAuthHeaders(),
    });

    if (!result.ok) return false;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
