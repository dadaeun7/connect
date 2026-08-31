import InvitationHistorySection from "./invte_history/InvitationHistorySection";
import InviteFormSection from "./invte_history/InviteFormSection";
import { useProjectStore } from "@/app/store/useProjectStore";
import { useAffiliationTab } from "./hooks/useAffiliationTab";
import { AsyncBoundary } from "../share/wrappers/AsyncBoundary";
import { AsyncSuspense } from "../share/wrappers/AsyncSuspense";

const AffiliationTab = () => {
  const { currentProject } = useProjectStore();
  const { inviteHistory, projectUsers } = useAffiliationTab(
    String(currentProject?.id),
  );

  return (
    <AsyncBoundary>
      <AsyncSuspense description="초대 정보를 불러오는 중입니다...">
        <div className="space-y-20 animate-in fade-in duration-300 bg-[var(--card)] rounded-xl p-6 shadow-sm">
          {/* 1. 프로젝트 초대 및 목록 */}
          <InviteFormSection projectUsers={projectUsers} />
          {/* 2. 초대 메일 발송 이력 */}
          <InvitationHistorySection inviteHistory={inviteHistory} />
        </div>
      </AsyncSuspense>
    </AsyncBoundary>
  );
};

export default AffiliationTab;
