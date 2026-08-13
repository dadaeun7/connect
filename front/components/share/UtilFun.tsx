export const offsetTimeToLocalTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 18);

  const formattedStr = date.toISOString();

  return formattedStr
    .replace(/\.\d+Z$/, "Z")
    .replace("T", " ")
    .replace("Z", "");
};

export const offsetTimePlusNine = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);

  const formattedStr = date.toISOString();

  return formattedStr
    .replace(/\.\d+Z$/, "Z")
    .replace("T", " ")
    .replace("Z", "");
};

export const toISOWithOffset = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // KST(+09:00) 기준 오프셋
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
};

// viewDate(해당 월의 1일) 기준으로 시작일/종료일 생성
export const getMonthRange = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const start = new Date(year, month - 1, 1, 0, 0, 0);
  const end = new Date(year, month + 2, 0, 23, 59, 59);

  return {
    startDate: toISOWithOffset(start),
    endDate: toISOWithOffset(end),
  };
};
