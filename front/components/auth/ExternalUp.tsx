import { signIn } from "@/auth";

export default function ExternalUp() {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center">
        <div className="flex-1 h-[1px] bg-[var(--border)]" />
        <span className="px-4 text-[10px] text-[var(--muted-foreground)] font-black tracking-widest">
          OR
        </span>
        <div className="flex-1 h-[1px] bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] py-3 rounded-lg hover:border-[var(--primary)]/40 text-sm font-bold text-[var(--foreground)] transition-colors shadow-xs"
        >
          <span className="tracking-wide uppercase">Github</span>
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] py-3 rounded-lg hover:border-[var(--primary)]/40 text-sm font-bold text-[var(--foreground)] transition-colors shadow-xs"
        >
          <span className="tracking-wide uppercase">Gmail</span>
        </button>
      </div>
    </div>
  );
}
