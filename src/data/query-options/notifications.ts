const MINUTE = 1000 * 60;
export function notificationsQueryOptions() {
  return {
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    staleTime: 5 * MINUTE,
    cacheTime: 10 * MINUTE,
  };
}

export function notificationDetailQueryOptions(apiUrl: string | null) {
  return {
    queryKey: ["notification-detail", apiUrl],
    queryFn: async () => {
      if (!apiUrl) throw new Error("無效的內容網址");
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("無法取得內容");
      return res.json();
    },
    enabled: Boolean(apiUrl),
  };
}
