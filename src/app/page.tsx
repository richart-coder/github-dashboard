"use client";

import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!session ? (
        <button
          onClick={() => signIn("github")}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          使用 GitHub 登入
        </button>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            歡迎回來，{session.user?.name}！
          </h1>
          <p className="text-gray-600">您已成功登入</p>
        </div>
      )}
    </main>
  );
}
