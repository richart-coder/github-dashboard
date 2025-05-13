import type { QueryKey } from "@tanstack/react-query";
import type { RepoWithNotifications } from "@/types/notification";

const MINUTE = 1000 * 60;

export function repositoriesQueryOptions(initialData: RepoWithNotifications[]) {
  return {
    queryKey: ["repositories"] as QueryKey,
    queryFn: async () => initialData,
    staleTime: 30 * MINUTE,
    gcTime: 60 * MINUTE,
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  };
}

export function notificationDetailQueryOptions(apiUrl: string | null) {
  return {
    queryKey: ["notification-detail", apiUrl],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      if (!apiUrl) return null;
      const res = await fetch(apiUrl, { signal });
      if (!res.ok) throw new Error("無法取得內容");
      return res.json();
    },
    enabled: !!apiUrl,
  };
}
