import { AsyncBoundary } from "../share/wrappers/AsyncBoundary";
import { AsyncSuspense } from "../share/wrappers/AsyncSuspense";
import MyInfoTabContent from "./MyInfoTabContent";

export default function MyInfoTab() {
  return (
    <AsyncBoundary>
      <AsyncSuspense description="사용자 정보를 불러오는 중입니다...">
        <MyInfoTabContent />
      </AsyncSuspense>
    </AsyncBoundary>
  );
}
