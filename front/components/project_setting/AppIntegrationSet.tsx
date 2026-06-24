"use client";

export default function AppIntegrationSet({
  app,
  redirectUrl,
}: {
  app: string;
  redirectUrl: string;
}) {
  return (
    <div className="p-4 bg-[var(--card)] flex items-center justify-between text-sm font-bold border-t border-[var(--border)]/40">
      <div className="flex items-center gap-1">
        <span className="text-[var(--muted-foreground)] text-sm font-bold tracking-wide">
          {redirectUrl}
        </span>
      </div>

      <button className="px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-black rounded-lg text-[11px] shadow-sm hover:opacity-90 transition-opacity uppercase cursor-pointer">
        위치 확인
      </button>
    </div>
  );
}
