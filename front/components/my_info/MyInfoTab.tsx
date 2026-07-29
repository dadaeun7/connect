import CurrentAffiliationSection from "./CurrentAffiliationSection";
import CstAlert from "../share/CstAlert";
import { useEffect, useState } from "react";
import { useUserInfoStore } from "@/app/store/useUserInfoStore";
import { useConfirmation } from "../share/ConfirmationContext";

const externalIcon = {
  GITHUB: <img className="w-4 h-4" src="/github.png" alt="github" />,
  GMAIL: <img className="w-4 h-4" src="/gmail.png" alt="gmail" />,
};

export default function MyInfoTab({
  userWithDraw,
}: Readonly<{ userWithDraw: () => Promise<boolean> }>) {
  const { userInfo } = useUserInfoStore();
  const [name, setName] = useState<string>("");
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "인증 시간이 만료되었습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const { openConfirm } = useConfirmation();

  const withDrawHandle = async () => {
    openConfirm({
      message: "탈퇴 이후 정보는 복구할 수 없습니다. 회원 탈퇴를 하시겠습니까?",
      onConfirm: () => {
        const result = async () => {
          const data = await userWithDraw();

          if (!data) {
            alert("실패했습니다");
            return;
          }

          setAlertConfig((props) => ({
            ...props,
            isOpen: true,
            message: "정상적으로 회원 탈퇴가 되었습니다.",
            type: "success",
          }));

          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        };

        result();
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    setName(userInfo.name);
  }, [userInfo]);

  const updateName = async () => {
    if (name === "" || name == null || name == undefined) return;
    if (name === userInfo?.name) return;

    try {
      const res = await fetch(`/update/info`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          affiliation: "",
        }),
      });

      if (!res.ok) throw new Error("name update error");

      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
        message: "성공적으로 수정되었습니다",
        type: "success",
      }));

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
        message: "수정 중 에러가 발생했습니다.",
        type: "error",
      }));
      console.error(error);
    }
  };

  const inputStyle =
    "w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium transition-colors";
  const labelStyle =
    "block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 px-0.5";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
      <CstAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={alertConfig.onClose}
      />
      {/* 개인 정보 구역 */}
      <div className="flex justify-between items-center mb-6 mt-1">
        <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="w-1 h-4 bg-[var(--primary)] rounded-full" /> 개인
          정보
        </h3>
        {userInfo?.joinType !== "COMPANY" && (
          <button className="flex gap-2 text-[11px] font-black text-[var(--primary)]/85 border border-[var(--primary)]/20 px-3 py-1 rounded-md">
            {userInfo?.joinType === "GITHUB"
              ? externalIcon.GITHUB
              : externalIcon.GMAIL}
            <span>연동중</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4 pl-1">
        <div className="col-span-2">
          <label className={labelStyle}>이름</label>
          <input
            className={inputStyle}
            value={name ?? ""}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="col-span-3">
          <label className={labelStyle}>이메일 주소</label>
          <input
            className={inputStyle}
            value={userInfo?.email ?? ""}
            disabled={true}
            readOnly
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={updateName}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4"
        >
          이름 수정하기
        </button>
        <button
          onClick={() => {
            withDrawHandle();
          }}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4"
        >
          회원 탈퇴
        </button>
      </div>

      <div className="flex-1 h-[1px] bg-[var(--border)]/60" />

      {/* 3. 현재 소속된 정보 */}
      <CurrentAffiliationSection />
    </div>
  );
}
