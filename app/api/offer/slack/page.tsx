"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function SlackLogin() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold">Slack Login</h1>
      {!session ? (
        <button
          className="px-4 py-2 bg-black text-white rounded-md"
          onClick={() => {
            signIn("slack");
          }}
        >
          Slack 연동하기
        </button>
      ) : (
        <button
          className="text-sm text-gray-500 border px-2 py-1 rounded"
          onClick={() => {
            signOut();
          }}
        >
          Slack 연동 해제
        </button>
      )}
    </div>
  );
}
