"use client";

import { useInviteAccept } from "../_hooks/useInviteAccept";

export default function InviteAcceptContent() {
  const { statusMessage } = useInviteAccept();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
        <p className="text-gray-600 font-medium">{statusMessage}</p>
      </div>
    </div>
  );
}
