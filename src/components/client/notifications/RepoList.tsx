"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repositoriesQueryOptions } from "@/data/query-options/notifications";
import RepoNotificationSetting from "./RepoNotificationSetting";
import NProgress from "@/lib/nprogress";
import type { RepoWithNotifications } from "@/types/notification";

export default function RepoList({
  initialData,
}: {
  initialData: RepoWithNotifications[];
}) {
  const queryClient = useQueryClient();
  const { data } = useQuery<RepoWithNotifications[]>(
    repositoriesQueryOptions(initialData)
  );

  const currentRepo = data?.find((repo) => repo.isActive) || data?.[0];

  const { mutate: activateRepo } = useMutation({
    mutationFn: async (repoName: string) => {
      const [owner, repo] = repoName.split("/");
      const response = await fetch(
        `/api/repositories/${owner}/${repo}/activate`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Failed to activate repository");
      return response.text();
    },
    onMutate: (repoName) => {
      NProgress.start();

      queryClient.setQueryData<RepoWithNotifications[]>(
        ["repositories"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((r) => ({
            ...r,
            isActive: r.name === repoName,
          }));
        }
      );
    },
    onError: (error, repoName) => {
      queryClient.setQueryData<RepoWithNotifications[]>(
        ["repositories"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((r) => ({
            ...r,
            isActive: r.name === currentRepo?.name,
          }));
        }
      );
    },
    onSettled: () => {
      NProgress.done();
    },
  });

  return (
    <div>
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
      <RepoNotificationSetting
        repoName={currentRepo.name}
        notifications={currentRepo.notifications}
        preference={currentRepo.preference}
      />
    </div>
  );
}
