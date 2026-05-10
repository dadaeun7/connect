"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function AppIntegrationSet({app}:{app:string}) {
  const { data: session } = useSession();

  return (
    <div className="p-3">
      {!session ? (
        <button
          className="px-4 py-4 w-full bg-black text-white rounded-xl uppercase tracking-widest text-xs"
          onClick={() => {
            signIn(app);
          }}
        >
          {app.charAt(0).toUpperCase() + app.slice(1)} 연결하기
        </button>
      ) : (
        <button
          className="text-sm text-gray-500 border px-2 py-1 rounded"
          onClick={() => {
            signOut();
          }}
        >
          {app.charAt(0).toUpperCase() + app.slice(1)} 연결해제하기
        </button>
      )}
    </div>
  );
}