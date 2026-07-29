"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CstLoading from "../share/CstLoading";
import { modalBoxStyle, modalOverlayStyle } from "../share/ConfirmationContext";

interface ToggleProps {
  isLoggedIn: boolean;
}

export default function LoginStateToggle({ isLoggedIn }: ToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // 쿠키 읽는 유틸 함수
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const handleClick = () => {
    setLoading(true);
    // 1. 비로그인 상태면 로그인 페이지로 이동
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    // 2. 로그인 상태일 때 초대 쿠키 검사
    const savedProjectId = getCookie("pending_invite_projectId");
    const saveToken = getCookie("pending_invite_token");

    if (savedProjectId) {
      // localStorage 저장 후 쿠키 만료 처리
      localStorage.setItem("pending_invite_projectId", savedProjectId);
      document.cookie = "pending_invite_projectId=; max-age=0; path=/;";

      // 초대 수락 페이지로 이동
      router.push(`/invite/accept?projectId=${savedProjectId}`);
      return;
    }

    if (saveToken) {
      localStorage.setItem("pending_invite_token", saveToken);
      document.cookie = "pending_invite_token=; max-age=0; path=/;";

      // 초대 수락 페이지로 이동
      router.push(`/invite/accept?token=${saveToken}`);
      return;
    }

    // 3. 초대 쿠키가 없으면 일반 콘솔로 이동
    router.push("/project");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider border border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
      >
        {isLoggedIn ? "콘솔로 이동" : "로그인"}
      </button>
      {loading && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <CstLoading
              imageName=""
              description="이동중입니다."
              customMinH="30vh"
            />
          </div>
        </div>
      )}
    </>
  );
}
