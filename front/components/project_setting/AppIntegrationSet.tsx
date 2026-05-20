"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AppIntegrationSet({ app }: { app: string }) {
  const { data: session } = useSession();
  const appName = app.charAt(0).toUpperCase() + app.slice(1);

  return (
    <div className="p-4 bg-[var(--card)] flex items-center justify-between text-sm font-bold border-t border-[var(--border)]/40">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]" />
        <span className="text-[var(--muted-foreground)] text-sm font-bold tracking-wide">
          {appName} Managed Pipeline Gateway Hub
        </span>
      </div>

      {!session ? (
        <button
          className="px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-black rounded-lg text-xs shadow-sm hover:opacity-90 transition-opacity"
          onClick={() => signIn(app)}
        >
          {appName} 간편 보안 연동
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/20 font-black tracking-wide">
            정상 승인 완료
          </span>
          <button
            className="text-xs text-[var(--muted-foreground)] border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 rounded-lg hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            onClick={() => signOut()}
          >
            연동 끊기
          </button>
        </div>
      )}
    </div>
  );
}
