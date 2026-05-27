import Link from "next/link";

export default function SelectOption({ mode }: { readonly mode: string }) {
  return (
    <div className="text-sm font-medium text-[var(--muted-foreground)]">
      계정이 없으신가요?
      <Link
        href="/auth/signup"
        className="font-bold ml-1.5 hover:underline underline-offset-4"
      >
        가입하기
      </Link>
    </div>
  );
}
