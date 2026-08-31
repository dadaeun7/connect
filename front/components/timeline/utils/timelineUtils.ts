import { IssueTitleResponse } from "@/app/store/useIssueStore";

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildMonthDays(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d, 0, 0, 0, 0));
  }
  return days;
}

export function assignRows(issues: IssueTitleResponse[], visibleDays: Date[]) {
  // 기존 assignRows 및 getTaskSegment 동일하게 유지
  const result: {
    issue: IssueTitleResponse;
    row: number;
    segment: any;
  }[] = [];
  const rowEnds: number[] = [];

  for (const issue of issues) {
    const segment = getTaskSegment(issue, visibleDays);
    if (!segment) continue;

    let rowIndex = rowEnds.findIndex((end) => end < segment.startIdx);
    if (rowIndex === -1) {
      rowIndex = rowEnds.length;
      rowEnds.push(segment.endIdx);
    } else {
      rowEnds[rowIndex] = segment.endIdx;
    }

    result.push({ issue, row: rowIndex, segment });
  }
  return result;
}

export function getTaskSegment(issue: IssueTitleResponse, visibleDays: Date[]) {
  if (visibleDays.length === 0 || !issue.dueDate || !issue.createdAt)
    return null;

  const rawStart = new Date(issue.createdAt);
  const rawEnd = new Date(issue.dueDate);
  if (Number.isNaN(rawStart.getTime()) || Number.isNaN(rawEnd.getTime()))
    return null;

  let taskStart = new Date(
    rawStart.getFullYear(),
    rawStart.getMonth(),
    rawStart.getDate(),
  );
  let taskEnd = new Date(
    rawEnd.getFullYear(),
    rawEnd.getMonth(),
    rawEnd.getDate(),
  );

  if (taskStart > taskEnd) taskStart = new Date(taskEnd);

  const rangeStart = visibleDays[0];
  const rangeEnd = visibleDays.at(-1)!;

  if (taskEnd < rangeStart || taskStart > rangeEnd) return null;

  const clippedStart = taskStart < rangeStart ? rangeStart : taskStart;
  const clippedEnd = taskEnd > rangeEnd ? rangeEnd : taskEnd;

  const startIdx = visibleDays.findIndex(
    (d) => formatDateKey(d) === formatDateKey(clippedStart),
  );
  const endIdx = visibleDays.findIndex(
    (d) => formatDateKey(d) === formatDateKey(clippedEnd),
  );

  if (startIdx === -1 || endIdx === -1) return null;

  return { startIdx, endIdx };
}

export const calculateRows = (items: any[]) => {
  const sorted = [...items].sort((a, b) => a.start - b.start); // 시작일 기준 정렬
  const rows: number[][] = []; // 각 줄의 마지막 종료일을 저장

  return sorted.map((item) => {
    let rowIndex = rows.findIndex((rowLastDay) => rowLastDay < item.start); // 들어갈 수 있는 줄 찾기
    if (rowIndex === -1) {
      rows.push(item.end);
      rowIndex = rows.length - 1;
    } else {
      rows[rowIndex] = item.end; // 해당 줄의 마지막 종료일 갱신
    }
    return { ...item, row: rowIndex };
  });
};
