import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-gray-200 font-sans selection:bg-[#00FFA3] selection:text-black">
      <Link href="/">
        <div className="absolute left-10 top-10 flex items-center gap-2 text-gray-500 hover:text-[#00FFA3] transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            메인화면으로 가기
          </span>
        </div>
      </Link>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FFA3]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.15)]">
            <div className="text-[#00FFA3] font-black italic text-xl tracking-tighter">
              C
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
