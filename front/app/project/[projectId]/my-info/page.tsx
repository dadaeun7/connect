import { RedirectConfig } from "@/components/my_info/app/AppConnectTab";
import InfoPage from "@/components/my_info/InfoPage";
import { BACKEND } from "@/lib/constant";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  // 앱 연동 함수
  const appConnectHanlder = async (
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
          headers: {
            "Content-Type": "application/json",
            Cookie: (await headers()).get("cookie") || "",
          },
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

  return <InfoPage appConnectHanlder={appConnectHanlder} />;
}
