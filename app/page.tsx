"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);

  const fetchRepos = async () => {
    if (!session?.accessToken) return;

    const res = await fetch("https://api.github.com/user/repos?sort=updated", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await res.json();
    setRepos(data);
  };

  return (
    <div className="p-8">
      {!session ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Unified Dashboard</h1>
          <button
            onClick={() => signIn("github")}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            GitHub로 로그인
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {session.user?.name}님의 대시보드
            </h1>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 border px-2 py-1 rounded"
            >
              로그아웃
            </button>
          </div>

          <button
            onClick={fetchRepos}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            내 GitHub 레포지토리 불러오기
          </button>

          <div className="grid gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="p-4 border rounded-lg shadow-sm hover:border-blue-500 transition-colors"
              >
                <h3 className="font-bold">{repo.name}</h3>
                <p className="text-sm text-gray-600">
                  {repo.description || "설명 없음"}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  최근 업데이트:{" "}
                  {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
