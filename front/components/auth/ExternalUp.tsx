import { GITHUB_REQ_URL, GOOGLE_REQ_URL } from "@/lib/constant";
import { useAuth } from "./hooks/useAuth";

export default function ExternalUp() {
  const { setLoading } = useAuth("external"); // "external" 모드는 임시로 설정

  const submitExternal = (api: string) => {
    window.location.href = api;
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center">
        <div className="flex-1 h-[1px] bg-[var(--border)]" />
        <span className="px-4 text-[10px] text-[var(--muted-foreground)] font-black tracking-widest">
          다른 서비스 계정으로 로그인
        </span>
        <div className="flex-1 h-[1px] bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            submitExternal(GITHUB_REQ_URL);
          }}
          className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] py-2.5 rounded-lg hover:border-[var(--primary)]/40 text-sm font-bold text-[var(--foreground)] transition-colors shadow-xs"
        >
          <img src="/github.png" alt="github login" className="h-7" />
        </button>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            submitExternal(GOOGLE_REQ_URL);
          }}
          className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] py-2.5 rounded-lg hover:border-[var(--primary)]/40 text-sm font-bold text-[var(--foreground)] transition-colors shadow-xs"
        >
          <img src="/gmail.png" alt="gmail login" className="h-5" />
        </button>
      </div>
    </div>
  );
}
