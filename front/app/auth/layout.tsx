import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] relative">
      {/* 좌상단 메인 이동 내비게이션 바 */}
      <Link href="/">
        <div className="absolute left-8 top-8 flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors group cursor-pointer">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
      </Link>

      {/* 메인 폼 카드 컨테이너 */}
      <div className="relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 shadow-md dark:shadow-black/40">
        {/* 상단 엠블럼 심볼 마크 구역 */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="logo" className="h-12" />
        </div>

        {/* 하위 자식 컴포넌트 바인딩 폼 */}
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
