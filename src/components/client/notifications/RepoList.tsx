"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repositoriesQueryOptions } from "@/data/query-options/notifications";
import RepoNotificationSetting from "./RepoNotificationSetting";
import NProgress from "@/lib/nprogress";
import type { RepoWithNotifications } from "@/types/zod/notification";
import toast from "react-hot-toast";
export default function RepoList({
  initialData,
}: {
  initialData: RepoWithNotifications[];
}) {
  const queryClient = useQueryClient();
  const { data } = useQuery<RepoWithNotifications[]>(
    repositoriesQueryOptions(initialData)
  );

  const currentRepo = data.find((repo) => repo.isActive) || data?.[0];

  const { mutate: activateRepo } = useMutation({
    mutationFn: async (repoName: string) => {
      const res = await fetch(`/api/repositories/${repoName}/activate`, {
        method: "PUT",
      });
      const result = await res.json();
      if (!res.ok) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async (repoName: string) => {
      const previousData = queryClient.getQueryData<RepoWithNotifications[]>([
        "repositories",
      ]);
      NProgress.start();
      queryClient.setQueryData<RepoWithNotifications[]>(
        ["repositories"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((repo) => ({
            ...repo,
            isActive: repo.name === repoName,
          }));
        }
      );
      return { previousData };
    },
    onError: (error, _repoName, context) => {
      toast.error(error.message);
      if (context?.previousData) {
        queryClient.setQueryData<RepoWithNotifications[]>(
          ["repositories"],
          context.previousData
        );
      }
    },
    onSettled: () => {
      NProgress.done();
    },
  });

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
      <RepoNotificationSetting
        repoName={currentRepo.name}
        notifications={currentRepo.notifications}
        preference={currentRepo.preference}
      />
    </div>
  );
}
