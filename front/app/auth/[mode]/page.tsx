import React, { Suspense } from "react";
import { Menu, AuthMode } from "./_type";
import AuthPage from "@/components/auth/AuthPage";
import Loading from "./loading";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  readonly params: Promise<{ mode: string }>;
}) {
  const { mode: rawMode } = await params;
  const mode = rawMode as AuthMode;

  // 구글 디자인 가이드라인 기준: 예외 경고 메시지의 가독성 스케일 상향 및 시인성 확보
  if (!Menu[mode]) {
    notFound();
  }

  const [
    comment,
    firstInput,
    secondInput,
    external,
    button,
    api,
    firIcon,
    secIcon,
    request,
  ] = Menu[mode];

  return (
    <Suspense fallback={<Loading />}>
      <AuthPage
        key={mode}
        mode={mode}
        comment={comment}
        firstInput={firstInput}
        secondInput={secondInput}
        external={external}
        button={button}
        api={api}
        firIcon={firIcon}
        secIcon={secIcon}
        request={request}
      />
    </Suspense>
  );
}
