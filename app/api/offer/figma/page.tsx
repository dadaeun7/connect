"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function FigmaLogin() {
  const { data: session } = useSession();

  return (
    <div>
      <h2 className="text-2xl font-bold"> Figma Login</h2>
      {!session ? (
        <button
          className="px-4 py-2 bg-black text-white rounded-md"
          onClick={() => {
            signIn("figma");
          }}
        >
          Figma 연결하기
        </button>
      ) : (
        <button
          className="text-sm text-gray-500 border px-2 py-1 rounded"
          onClick={() => {
            signOut();
          }}
        >
          Figma 연결해제하기
        </button>
      )}
    </div>
  );
}
