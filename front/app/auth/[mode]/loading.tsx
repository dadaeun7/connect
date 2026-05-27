"use client";
import CstLoading from "@/components/share/CstLoading";
import Image from "next/image";

export default function Loading() {
  const name = "chain";
  const description = "연결중에 있습니다..";

  return <CstLoading imageName={name} description={description} />;
}
