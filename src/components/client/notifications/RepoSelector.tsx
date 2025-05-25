"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { repositoriesQueryOptions } from "@/data/query-options/repo";
import { repoActiveMutationOptions } from "@/data/mutation-options/repo";
import RepoNotificationSetting from "./RepoNotificationSetting";
import type { RepoWithNotifications } from "@/types/zod/notification";
import React, { useState, useMemo } from "react";

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
        <div className="mb-8">
          <label htmlFor="repo-select" className="sr-only">
            沒有儲存庫
          </label>
          <RepoSelect
            selectedRepoName={selectedName}
            repoNames={["請先新增儲存庫"]}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="p-12">
      <div className="mb-8">
        <label htmlFor="repo-select" className="sr-only">
          選擇儲存庫
        </label>
        <RepoSelect
          selectedRepoName={selectedName}
          repoNames={useMemo(() => data.map((repo) => repo.name), [data])}
          onSelect={handleSelect}
        />
      </div>

      <RepoNotificationSetting
        repo={data.find((repo) => repo.isActive) || data[0]}
      />
    </div>
  );
}

type RepoSelectProps = {
  selectedRepoName: string;
  repoNames: string[];
  onSelect?: (repoName: string) => void;
};

const RepoSelect = ({
  selectedRepoName,
  repoNames,
  onSelect,
}: RepoSelectProps) => {
  return (
    <select
      id="repo-select"
      value={selectedRepoName}
      onChange={(e) => onSelect?.(e.target.value)}
      className="border rounded px-3 py-2 w-full max-w-md"
    >
      {repoNames.map((repoName) => (
        <option key={repoName} value={repoName}>
          {repoName}
        </option>
      ))}
    </select>
  );
};
