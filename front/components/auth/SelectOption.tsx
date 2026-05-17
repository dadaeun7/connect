import Link from "next/link";

export default function SelectOption({ mode }: { readonly mode: string }) {
  return (
    <>
      {mode === "login" ? (
        <>
          계정이 없으신가요?
          <Link href="/auth/signup" className="text-[#00FFA3] font-bold ml-1">
            가입하기
          </Link>
        </>
      ) : (
        <>
          이미 계정이 있으신가요?
          <Link href="/auth/login" className="text-[#00FFA3] font-bold ml-1">
            로그인
          </Link>
        </>
      )}
    </>
  );
}
