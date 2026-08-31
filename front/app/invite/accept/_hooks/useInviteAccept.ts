"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserInfoStore } from "@/app/store/useUserInfoStore";

export function useInviteAccept() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("이동중...");
  const { userInfo } = useUserInfoStore();

  const token = searchParams.get("token");
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    // 1. 유저 검증 및 LocalStorage 임시 저장
    if (token) {
      const result = token.split(":");
      if (result[1] !== userInfo.email) {
        router.push("/project");
        return;
      }
      localStorage.setItem("pending_invite_token", result[0]);
    }

    if (projectId) {
      const result = projectId.split(":");
      if (result[1] !== userInfo.email) {
        router.push("/project");
        return;
      }
      localStorage.setItem("pending_invite_projectId", result[0]);
    }

    setStatusMessage("초대 내용을 확인중에 있습니다...");

    const acceptPayload = {
      token:
        token?.split(":")[0] || localStorage.getItem("pending_invite_token"),
      projectId:
        projectId?.split(":")[0] ||
        localStorage.getItem("pending_invite_projectId"),
    };

    // 2. 초대 수락 API 요청
    const submitAccept = async () => {
      try {
        const result = await fetch("/project/invite/accept", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(acceptPayload),
        });

        if (!result.ok) {
          throw new Error("초대 수락 요청이 실패했습니다.");
        }

        setStatusMessage(
          "🎉 초대가 정상적으로 수락되었습니다! 잠시 후 대시보드로 이동합니다.",
        );
        setTimeout(() => {
          router.push("/project");
        }, 3000);
      } catch (error) {
        setStatusMessage("❌ 오류 발생: 초대 처리 중 문제가 발생했습니다.");
        console.error(error);
      } finally {
        localStorage.removeItem("pending_invite_token");
        localStorage.removeItem("pending_invite_projectId");
      }
    };

    submitAccept();
  }, [token, projectId, router, userInfo.email]);

  return { statusMessage };
}
