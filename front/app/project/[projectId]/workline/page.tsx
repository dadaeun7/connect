import MainWorkline from "@/components/workline/MainWorkline";
import { BACKEND } from "@/lib/constant";
import { headers } from "next/headers";

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

      if (!result.ok) {
        throw new Error("Gtihub Repository error : " + result.status);
      }
      return await result.json();
    } catch (error) {
      console.error("repo server error: " + error);
      return null;
    }
  };

  return <MainWorkline getGithubRepo={getGithubRepo} />;
}
