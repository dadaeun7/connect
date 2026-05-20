import React from "react";
import { Menu, AuthMode } from "./_type";
import AuthPage from "@/components/auth/AuthPage";

export default async function Page({
  params,
}: {
  readonly params: Promise<{ mode: string }>;
}) {
  const { mode: rawMode } = await params;
  const mode = rawMode as AuthMode;

  // 구글 디자인 가이드라인 기준: 예외 경고 메시지의 가독성 스케일 상향 및 시인성 확보
  if (!Menu[mode]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 text-center">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 max-w-sm shadow-sm">
          <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">
            잘못된 접근입니다.
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2 font-medium">
            요청하신 인증 컨텍스트 경로가 올바르지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  const [comment, firstInput, secondInput, external, button] = Menu[mode];

  return (
    <AuthPage
      key={mode}
      mode={mode}
      comment={comment}
      firstInput={firstInput}
      secondInput={secondInput}
      external={external}
      button={button}
    />
  );
}
