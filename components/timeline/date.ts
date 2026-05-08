export interface Milestone {
  id: string;
  title: string;
  startDate: string; // "2026-04-05"
  endDate: string;   // "2026-04-12"
  logs: { text: string; time: string }[];
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