import { useUserInfoStore } from "@/app/store/useUserInfoStore";
import CurrentAffiliationSection from "./CurrentAffiliationSection";
import { useUserInfo } from "./hooks/useUserInfo";
import CstAlert from "../share/CstAlert";

const externalIcon = {
  GITHUB: <img className="w-4 h-4" src="/github.png" alt="github" />,
  GMAIL: <img className="w-4 h-4" src="/gmail.png" alt="gmail" />,
};

export default function MyInfoTabContent() {
  const { userInfo } = useUserInfoStore();
  const {
    name,
    setName,
    alertConfig,
    setAlertConfig,
    onUpdateName,
    withDrawHandle,
  } = useUserInfo();

  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));

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
        onClose={closeAlert}
      />

      <div className="flex justify-between items-center mb-6 mt-1">
        <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="w-1 h-4 bg-[var(--primary)] rounded-full" /> 계정
          정보
        </h3>
        {userInfo?.joinType !== "COMPANY" && (
          <button
            type="button"
            className="flex gap-2 text-[11px] font-black text-[var(--primary)]/85 border border-[var(--primary)]/20 px-3 py-1 rounded-md"
          >
            {userInfo?.joinType === "GITHUB"
              ? externalIcon.GITHUB
              : externalIcon.GMAIL}
            <span>연동됨</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4 pl-1">
        <div className="col-span-2">
          <label className={labelStyle}>이름</label>
          <input
            className={inputStyle}
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
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
          type="button"
          onClick={onUpdateName}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4"
        >
          이름 변경하기
        </button>
        <button
          type="button"
          onClick={withDrawHandle}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4"
        >
          회원 탈퇴
        </button>
      </div>

      <div className="flex-1 h-[1px] bg-[var(--border)]/60" />

      <CurrentAffiliationSection />
    </div>
  );
}
