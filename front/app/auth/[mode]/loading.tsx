"use client";
import CstLoading from "@/components/share/CstLoading";

export default function Loading() {
  const description = "연결중에 있습니다..";

  return <CstLoading imageName="" description={description} />;
}
