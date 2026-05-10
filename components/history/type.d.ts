export type StatusType = 'triage' | 'in_progress' | 'in_review' | 'verified' | 'wontfix';
/** 
- ⏳ status: triage: 이슈가 등록되었으나, 담당자 할정 전 검토가 필요한 상태.
- 🚧 status: in-progress 담당자가 할당되어 실제 작업 중.
- 👀 status: in-review 코드나 기획안 작성이 끝나고 동료의 검토를 기다리는 중.
- ✅ status: verified 테스트 서버에서 검증이 완료되어 배포 대기 중.
- 🚫 status: wontfix 오류가 아니거나, 수정하지 않기로 결정된 경우.
 */

export type SizeType = 'xs' | 's' | 'm' | 'l';
/**
- size: XS 1~2시간 내 해결 가능한 단순 작업.
- size: S 1일 내 해결 가능한 소규모 작업.
- size: M 2~3일 내 해결 가능한 중규모 작업.
- size: L 1주일 이상의 시간이 필요한 대규모 작업.
 */

export type PriorityType = 'urgent' | 'high' | 'medium' | 'low';
/**
 * priority: urgent 긴급한 작업으로, 즉시 대응이 필요한 경우.
 * priority: high 높은 우선순위의 작업으로, 빠른 시일 내에 처리해야 하는 경우.
 * priority: medium 보통 우선순위의 작업으로, 일정 내에 처리하면 되는 경우.
 * priority: low 낮은 우선순위의 작업으로, 여유가 있을 때 처리해도 되는 경우.
 */