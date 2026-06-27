import { useProjectStore } from "@/app/store/useProjectStore";
import { ChevronDown, Mail } from "lucide-react";
import AppDetailModify from "./app_detail/AppDatailModify";

export default function GeneralTab() {
  const currentProject = useProjectStore((state) => state.currentProject);

  return (
    <div className="space-y-20 animate-in fade-in duration-300 bg-[var(--card)] rounded-xl p-6 shadow-sm">
      {/**프로젝트 이름 */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--foreground)]">
          프로젝트 기본 정보
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          현재 프로젝트의 이름을 지정합니다.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 grid grid-cols-8 gap-4">
        <div className="col-span-6">
          {" "}
          <label className="text-[11px] font-bold uppercase text-[var(--muted-foreground)] tracking-wider">
            프로젝트 이름
          </label>
          <input
            className="mt-2 w-full border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-semibold transition-colors"
            defaultValue={currentProject?.name}
          />
        </div>
      </div>
      {/**앱 세부 권한 */}
      <AppDetailModify />
    </div>
  );
}
