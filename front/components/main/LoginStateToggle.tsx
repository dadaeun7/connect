import { PROJECT_WORKLINE } from "@/app/etc/constant";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginStateToggle() {

  const { data: session, status } = useSession();
  
  let href = "/auth/login";
  let title = "로그인";

  if(status === "loading"){
    href= "/";
    title="...";
  }else if (session) {
    href=PROJECT_WORKLINE;
    title="콘솔로 이동";
//    title=String(session.user.email);
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
