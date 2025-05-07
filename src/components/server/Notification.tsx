import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { notificationsQueryOptions } from "@/data/query-options/notifications";
import NotificationList from "../client/notifications/NotificationList";

export default async function Notification() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(notificationsQueryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationList />
    </HydrationBoundary>
  );
}
