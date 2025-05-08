"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsQueryOptions } from "@/data/query-options/notifications";
import { useState } from "react";
import NotificationItem from "./NotificationItem";



async function markAsRead(threadId: string) {
  const response = await fetch(`/api/notifications/${threadId}/read`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
  return response.json();
}

export default function NotificationList() {
  const { data, isLoading, error } = useQuery(notificationsQueryOptions());
  const [showIgnored, setShowIgnored] = useState(false);
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isLoading) return <div>Loading notifications...</div>;
  if (error)
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  if (!data || data.length === 0) return <div>沒有通知</div>;

  const filteredNotifications = data.filter((notification: any) => {
    return showIgnored || !notification.ignored;
  });

  const handleMarkAsRead = async (id: string, unread: boolean) => {
    if (!unread) return;
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowIgnored(!showIgnored)}
          className="px-3 py-1 rounded text-sm font-semibold border bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {showIgnored ? "隱藏已忽略" : "顯示已忽略"}
        </button>
      </div>
      {filteredNotifications.map((notification: any, index: number) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          markAsReadPending={markAsReadMutation.isPending}
        />
      ))}
    </div>
  );
}
