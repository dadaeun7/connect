"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserInfoStore } from "@/app/store/useUserInfoStore";

// 1. 실제 useSearchParams를 사용하는 컴포넌트
function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("이동중...");
  const { userInfo } = useUserInfoStore();

  const token = searchParams.get("token");
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    if (token) {
      const result = token.split(":");

      console.log("result[0]:", result[0]);
      console.log("result[1]:", result[1]);

      if (result[1] !== userInfo.email) {
        router.push("/project");
      }

      localStorage.setItem("pending_invite_token", result[0]);
    }
    if (projectId) {
      const result = projectId.split(":");

      console.log("result[0]:", result[0]);
      console.log("result[1]:", result[1]);

      if (result[1] !== userInfo.email) {
        router.push("/project");
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
  }, [token, projectId, router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
        <p className="text-gray-600 font-medium">{statusMessage}</p>
      </div>
    </div>
  );
}

// 2. 페이지 바깥에서 Suspense 경계(Boundary)를 만들어주는 메인 컴포넌트
export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
            <p className="text-gray-600 font-medium">로딩 중...</p>
          </div>
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  );
}
