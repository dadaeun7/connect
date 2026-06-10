import Link from "next/link";

interface Setting {
  [key: string]: {
    comment: string;
    btnMsg: string;
    link: string;
  };
}

export default function SelectOption({ mode }: { readonly mode: string }) {
  const setting: Setting = {
    login: {
      comment: "계정이 없으신가요?",
      btnMsg: "가입하기",
      link: "/auth/signup",
    },
    signup: {
      comment: "이메일 인증을 완료하셨나요?",
      btnMsg: "로그인",
      link: "/auth/login",
    },
  };

  return (
    <div className="text-sm font-medium text-[var(--muted-foreground)]">
      {setting[mode].comment}
      <Link
        href={setting[mode].link}
        className="font-bold ml-1.5 hover:underline underline-offset-4"
      >
        {setting[mode].btnMsg}
      </Link>
    </div>
  );
}
