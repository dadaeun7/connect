import { signIn } from "@/auth";

export default function ExternalUp() {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center">
        <div className="flex-1 h-[1px] bg-white/5" />
        <span className="px-4 text-[10px] text-gray-700 font-black tracking-[0.3em]">
          OR
        </span>
        <div className="flex-1 h-[1px] bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 bg-black border border-white/5 py-4 rounded-xl hover:border-white/20 transition-all"
        >
          <span className="text-[10px] font-black uppercase">Github</span>
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 bg-black border border-white/5 py-4 rounded-xl hover:border-white/20 transition-all"
        >
          <span className="text-[10px] font-black uppercase text-[#00FFA3]">
            Gmail
          </span>
        </button>
      </div>
    </div>
  );
}
