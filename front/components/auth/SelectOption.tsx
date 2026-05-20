import Link from "next/link";

export default function SelectOption({ mode }: { readonly mode: string }) {
  return (
    <div className="text-sm font-medium text-[var(--muted-foreground)]">
      {mode === "login" ? (
        <>
          계정이 없으신가요?
          <Link
            href="/auth/signup"
            className="text-[var(--primary)] font-bold ml-1.5 hover:underline underline-offset-4"
          >
            가입하기
          </Link>
        </>
      ) : (
        <>
          이미 계정이 있으신가요?
          <Link
            href="/auth/login"
            className="text-[var(--primary)] font-bold ml-1.5 hover:underline underline-offset-4"
          >
            로그인
          </Link>
        </>
      )}
    </div>
  );
}
