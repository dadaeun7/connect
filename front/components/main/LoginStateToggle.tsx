import { PROJECT_WORKLINE } from "@/app/etc/constant";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginStateToggle() {
  const [info, setInfo] = useState({
    href: "/auth/login",
    title: "로그인",
  });

  const { data: session, status } = useSession();

  if (status === "loading") {
    setInfo({
      href: "/",
      title: "로딩중...",
    });
  }

  if (session) {
    setInfo({
      href: PROJECT_WORKLINE,
      title: String(session.user.email),
    });
  }

  return (
    <>
      <Link href={info.href}>
        <button className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors">
          {info.title}
        </button>
      </Link>
    </>
  );
}
