"use client";

import React, { Suspense, ReactNode } from "react";
import CstLoading from "../CstLoading";

interface AsyncSuspenseProps {
  children: ReactNode;
  imageName?: string;
  description?: string;
  customMinH?: string;
}

export function AsyncSuspense({
  children,
  imageName = "loading",
  description = "데이터를 불러오는 중입니다",
  customMinH = "85vh",
}: Readonly<AsyncSuspenseProps>) {
  return (
    <Suspense
      fallback={
        <CstLoading
          imageName={imageName}
          description={description}
          customMinH={customMinH}
        />
      }
    >
      {children}
    </Suspense>
  );
}
