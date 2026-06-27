export type StatusType = "inprogress" | "done" | "blocked" | "review" | "todo";
/** 
-  status: todo: 이슈가 등록되었으나, 담당자 할정 전 검토가 필요한 상태.
-  status: inprogress 담당자가 할당되어 실제 작업 중.
-  status: review 코드나 기획안 작성이 끝나고 동료의 검토를 기다리는 중.
-  status: done 테스트 서버에서 검증이 완료되어 배포 대기 중.
-  status: blocked 오류가 아니거나, 수정하지 않기로 결정된 경우.
 */

export type PriorityType = "high" | "medium" | "low";
/**
 * priority: high 높은 우선순위의 작업으로, 빠른 시일 내에 처리해야 하는 경우.
 * priority: medium 보통 우선순위의 작업으로, 일정 내에 처리하면 되는 경우.
 * priority: low 낮은 우선순위의 작업으로, 여유가 있을 때 처리해도 되는 경우.
 */

export const StatusList = ["inprogress", "done", "blocked", "review", "todo"];
export const PriorityList = ["high", "medium", "low"];

export const PRIORITY_COLORS = {
  High: { color: "var(--task-rose)", bg: "var(--task-rose-bg)" },
  Medium: { color: "var(--task-amber)", bg: "var(--task-amber-bg)" },
  Low: { color: "var(--task-teal)", bg: "var(--task-teal-bg)" },
};

export const STATUS_COLORS = {
  "In Progress": {
    color: "var(--task-blue)",
    bg: "var(--task-blue-bg)",
  },
  Done: {
    color: "var(--task-teal)",
    bg: "var(--task-teal-bg)",
  },
  Blocked: {
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
  },
  Review: {
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
  },
};
