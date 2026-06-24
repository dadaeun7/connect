import Link from "next/link";

interface ToggleProps {
  isLoggedIn: boolean;
}

export default function LoginStateToggle({ isLoggedIn }: ToggleProps) {
  let href = "/auth/login";
  let title = "로그인";

  if (isLoggedIn) {
    href = "/project";
    title = "콘솔로 이동";
  }

  return (
    <>
      <Link href={href}>
        <button className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider border border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors">
          {title}
        </button>
      </Link>
    </>
  );
}
