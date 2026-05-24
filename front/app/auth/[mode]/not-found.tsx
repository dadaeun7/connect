export default function NotFound() {
  return (
    <div className="flex items-center justify-center text-center">
      <div className="bg-[var(--card)] p-8">
        <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">
          잘못된 접근입니다.
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">
          요청하신 인증 컨텍스트 경로가 올바르지 않습니다.
        </p>
      </div>
    </div>
  );
}
