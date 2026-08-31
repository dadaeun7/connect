import React, { Suspense } from "react";
import { Menu, AuthMode } from "./_types/_type";
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

  if (!Menu[mode]) {
    notFound();
  }

  console.log("mode: " + mode);

  const [
    comment,
    firstInput,
    secondInput,
    external,
    button,
    _,
    firIcon,
    secIcon,
  ] = Menu[mode];

  return (
    <Suspense fallback={<Loading />}>
      <AuthPage
        mode={mode}
        comment={comment}
        firstInput={firstInput}
        secondInput={secondInput}
        external={external}
        button={button}
        firIcon={firIcon}
        secIcon={secIcon}
      />
    </Suspense>
  );
}
