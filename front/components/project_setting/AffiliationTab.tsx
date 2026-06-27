import ActivityHistorySection from "./invte_history/ActivityHistorySection";
import CurrentAffiliationSection from "./invte_history/CurrentAffiliationSection";
import InvitationHistorySection from "./invte_history/InvitationHistorySection";
import InviteFormSection from "./invte_history/InviteFormSection";

const AffiliationTab = () => {
  return (
    <div className="space-y-20 animate-in fade-in duration-300 bg-[var(--card)] rounded-xl p-6 shadow-sm">
      <div>
        {/* 1. 프로젝트 초대 및 목록 */}
        <InviteFormSection />
        {/* 2. 초대 메일 발송 이력 */}
        <InvitationHistorySection />
      </div>
      <div>
        {/* 3. 현재 소속된 정보 */}
        <CurrentAffiliationSection />

        {/* 4. 활동 히스토리 이력 */}
        <ActivityHistorySection />
      </div>
    </div>
  );
};

export default AffiliationTab;
