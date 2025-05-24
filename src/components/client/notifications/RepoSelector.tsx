"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { repositoriesQueryOptions } from "@/data/query-options/repo";
import { repoActiveMutationOptions } from "@/data/mutation-options/repo";
import RepoNotificationSetting from "./RepoNotificationSetting";
import type { RepoWithNotifications } from "@/types/zod/notification";

import React from "react";

export default function RepoSelector({
  repos,
}: {
  repos: RepoWithNotifications[];
}) {
  const { data } = useQuery<RepoWithNotifications[]>(
    repositoriesQueryOptions(repos)
  );
  const { mutate: activateRepo } = useMutation(repoActiveMutationOptions());
  const currentRepo = data.find((repo) => repo.isActive) || data?.[0];

  return (
    <div className="p-12">
      <div className="mb-8">
        <label htmlFor="repo-select" className="sr-only">
          選擇儲存庫
        </label>
        <select
          id="repo-select"
          aria-label="選擇儲存庫"
          value={currentRepo.name}
          onChange={(e) => activateRepo(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md"
        >
          {data.map((repo) => (
            <option key={repo.name} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>
      <RepoNotificationSetting repo={currentRepo} />
    </div>
  );
}
