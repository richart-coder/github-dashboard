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
