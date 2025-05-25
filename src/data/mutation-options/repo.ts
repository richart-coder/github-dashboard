import createOptimisticHelper from "./createOptimisticHelper";
import toast from "react-hot-toast";
import NProgress from "@/lib/nprogress";
import type { RepoWithNotifications } from "@/types/zod/notification";
import type { GitHubNotificationType } from "@/types/notification";
const repoActiveMutationOptions = () => {
  const { optimisticUpdate, rollback } = createOptimisticHelper([
    "repositories",
  ]);
  return {
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
      NProgress.start();
      return await optimisticUpdate<RepoWithNotifications[]>((oldData) => {
        if (!oldData) return;
        return oldData.map((repo) => ({
          ...repo,
          isActive: repo.name === repoName,
        }));
      });
    },
    onError: (
      error: Error,
      _repoName: string,
      context?: { previousData?: RepoWithNotifications[] }
    ) => {
      toast.error(error.message);
      if (!context?.previousData) return;
      rollback(context.previousData);
    },
    onSettled: () => {
      NProgress.done();
    },
  };
};

const repoPreferenceMutationOptions = (repoName: string) => {
  const { optimisticUpdate, rollback } = createOptimisticHelper([
    "repositories",
  ]);
  return {
    mutationFn: async (types: GitHubNotificationType[]) => {
      const res = await fetch(`/api/repositories/${repoName}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          types,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async (types: GitHubNotificationType[]) => {
      return await optimisticUpdate<RepoWithNotifications[]>((oldData) => {
        if (!oldData) return;
        return oldData.map((repo: any) =>
          repo.name === repoName
            ? {
                ...repo,
                preference: {
                  ...repo.preference,
                  types,
                },
              }
            : repo
        );
      });
    },
    onError: (
      err: Error,
      _types: GitHubNotificationType[],
      context?: { previousData?: RepoWithNotifications[] }
    ) => {
      toast.error(err.message);
      if (!context?.previousData) return;
      rollback(context.previousData);
    },
  };
};

const repoNotificationUnreadMutationOptions = () => {
  const { optimisticUpdate, rollback } = createOptimisticHelper([
    "repositories",
  ]);
  return {
    mutationFn: async (threadId: string) => {
      const response = await fetch(`/api/notifications/${threadId}/read`, {
        method: "PATCH",
      });
      return response.json();
    },
    onMutate: async (id: string) => {
      return await optimisticUpdate<RepoWithNotifications[]>((oldData) => {
        if (!oldData) return;
        return oldData.map((repo) => ({
          ...repo,
          notifications: repo.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, unread: false }
              : notification
          ),
        }));
      });
    },
    onError: (
      error: Error,
      _id: string,
      context?: { previousData?: RepoWithNotifications[] }
    ) => {
      toast.error(error.message);
      if (!context?.previousData) return;
      rollback(context.previousData);
    },
  };
};
export {
  repoActiveMutationOptions,
  repoPreferenceMutationOptions,
  repoNotificationUnreadMutationOptions,
};
