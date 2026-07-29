"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. 실제 useSearchParams를 사용하는 컴포넌트
function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState(
    "초대 정보를 확인하고 수락 절차를 진행 중입니다...",
  );

  const token = searchParams.get("token");
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    if (token) localStorage.setItem("pending_invite_token", token);
    if (projectId) localStorage.setItem("pending_invite_projectId", projectId);

    const acceptPayload = {
      token: token || localStorage.getItem("pending_invite_token"),
      projectId: projectId || localStorage.getItem("pending_invite_projectId"),
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Project Connection
        </h2>
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
