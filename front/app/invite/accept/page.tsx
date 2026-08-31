import { Suspense } from "react";
import InviteAcceptContent from "./_components/InviteAcceptContent";

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
            <p className="text-gray-600 font-medium">로딩 중...</p>
          </div>
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  );
}
