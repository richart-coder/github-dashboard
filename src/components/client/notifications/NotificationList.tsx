"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notificationsQueryOptions,
  notificationDetailQueryOptions,
} from "@/data/query-options/notifications";
import { useState } from "react";
import NotificationItem from "./NotificationItem";
import OverlayModal from "./OverlayModal";
import ReactMarkdown from "react-markdown";
import { MarkdownComponents } from "./MarkdownComponents";
import Spinner from "./Spinner";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApiUrl, setSelectedApiUrl] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const {
    data: detail,
    isError: detailError,
    isFetching,
  } = useQuery<{ body?: string }>(
    notificationDetailQueryOptions(selectedApiUrl)
  );

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = async (id: string, unread: boolean) => {
    if (!unread) return;
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleShowContent = (apiUrl: string, title: string) => {
    setSelectedApiUrl(apiUrl);
    setSelectedTitle(title);
    setModalOpen(true);
  };

  if (isLoading) return <div>Loading notifications...</div>;
  if (error)
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  if (!data || data.length === 0) return <div>沒有通知</div>;

  const filteredNotifications = data.filter((notification: any) => {
    return showIgnored || !notification.ignored;
  });

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
      {filteredNotifications.map((notification: any) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          markAsReadPending={markAsReadMutation.isPending}
          onShowContent={handleShowContent}
        />
      ))}
      <OverlayModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${selectedTitle} 詳細內容`}
      >
        {isFetching ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="h-8 w-8 text-blue-600" />
          </div>
        ) : detailError ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            載入失敗，請稍後再試。
          </div>
        ) : !detail?.body ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-center py-8">
            無詳細內容
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="prose max-w-none flex-1">
              <ReactMarkdown components={MarkdownComponents}>
                {detail.body}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </OverlayModal>
    </div>
  );
}
