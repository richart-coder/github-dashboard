"use client";
import useFocusTrap from "./useTrapFocus";
import useEscapeKey from "./useEscapeKey";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notificationsQueryOptions,
  notificationDetailQueryOptions,
} from "@/data/query-options/notifications";
import { useState, useCallback } from "react";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/notification";
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
  const {
    data,
    isLoading: isLoadingNotifications,
    error,
  } = useQuery(notificationsQueryOptions());
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);
  const [selectedApiUrl, setSelectedApiUrl] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const modalRef = useFocusTrap(modalOpen);
  useEscapeKey(modalOpen, handleCloseModal);
  const {
    data: detail,
    isError: detailError,
    isLoading: isLoadingDetail,
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

  if (isLoadingNotifications) return <div>Loading notifications...</div>;
  if (error)
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  if (!data || data.length === 0) return <div>沒有通知</div>;

  return (
    <div className="space-y-4">
      {data.map((notification: Notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          markAsReadPending={markAsReadMutation.isPending}
          onShowContent={handleShowContent}
        />
      ))}
      <OverlayModal
        ref={modalRef}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${selectedTitle} 詳細內容`}
      >
        {isLoadingDetail ? (
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
