"use client";
import { repoActiveMutationOptions } from "@/data/mutation-options/repo";
import { repositoriesQueryOptions } from "@/data/query-options/repo";
import type { RepoWithNotifications } from "@/types/zod/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import RepoNotificationSetting from "./RepoNotificationSetting";
import Selector from "./Selector";
export default function RepoSelector({
  repos,
}: {
  repos: RepoWithNotifications[];
}) {
  const { data } = useQuery<RepoWithNotifications[]>(
    repositoriesQueryOptions(repos)
  );

  const [selectedName, setSelectedName] = useState<string>(
    () => (data.find((repo) => repo.isActive)?.name || data[0]?.name) ?? ""
  );

  const activeMutation = useMutation(repoActiveMutationOptions());
  const handleSelect = (repoName: string) => {
    setSelectedName(repoName);
    activeMutation.mutate(repoName);
  };

  if (data.length == 0) {
    return (
      <div className="p-12">
        <Selector
          id="repo-select"
          label="沒有儲存庫"
          selectedValue="請先新增儲存庫"
        >
          <option value="請先新增儲存庫">請先新增儲存庫</option>
        </Selector>
      </div>
    );
  }
  return (
    <div className="p-12">
      <Selector
        id="repo-select"
        label="選擇儲存庫"
        selectedValue={selectedName}
        onSelect={handleSelect}
      >
        {data.map((repo) => (
          <option key={repo.name} value={repo.name}>
            {repo.name}
          </option>
        ))}
      </Selector>

      <RepoNotificationSetting
        repo={data.find((repo) => repo.isActive) || data[0]}
      />
    </div>
  );
}
