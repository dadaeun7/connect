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

  if (!Menu[mode]) {
    return <div className="text-white">잘못된 접근입니다.</div>;
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
