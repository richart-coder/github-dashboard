import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import NotificationItem from "./NotificationItem";
import { Notification, RepoWithNotifications } from "@/types/zod/notification";
import OverlayModal from "./OverlayModal";
import ReactMarkdown from "react-markdown";
import { MarkdownComponents } from "./MarkdownComponents";
import Spinner from "./Spinner";
import useDialogControl from "./useDialogControl";
import { notificationDetailQueryOptions } from "@/data/query-options/notifications";
import toast from "react-hot-toast";
export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const queryClient = useQueryClient();

  const [dialogRef, openDialog, closeDialog] = useDialogControl();
  const handleCloseModal = useCallback(() => {
    closeDialog();
  }, [closeDialog]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const { data: detail, status: detailStatus } = useQuery<{ body: string }>(
    notificationDetailQueryOptions(selectedId)
  );

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onMutate: (id) => {
      const previousData = queryClient.getQueryData<RepoWithNotifications[]>([
        "repositories",
      ]);
      queryClient.setQueryData(
        ["repositories"],
        (oldData: RepoWithNotifications[]) => {
          if (!oldData) return oldData;
          return oldData.map((repo: RepoWithNotifications) => ({
            ...repo,
            notifications: repo.notifications.map(
              (notification: Notification) =>
                notification.id === id
                  ? { ...notification, unread: false }
                  : notification
            ),
          }));
        }
      );
      return { previousData };
    },
    onError: (error, _id, context) => {
      toast.error(error.message);
      if (context?.previousData) {
        queryClient.setQueryData(["repositories"], context.previousData);
      }
    },
  });

  const handleMarkAsRead = async (id: string, unread: boolean) => {
    if (!unread) return;
    markAsReadMutation.mutate(id);
  };

  const handleShowContent = (id: string, title: string) => {
    setSelectedId(id);
    setSelectedTitle(title);
    openDialog();
  };

  if (!notifications || notifications.length === 0) return <div>沒有通知</div>;

  return (
    <div className="space-y-4">
      {notifications.map((notification: Notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          markAsReadPending={markAsReadMutation.isPending}
          onShowContent={handleShowContent}
        />
      ))}
      <OverlayModal
        ref={dialogRef}
        onClose={handleCloseModal}
        title={selectedTitle}
      >
        {detailStatus === "success"
          ? detailContent.success(detail)
          : detailContent[detailStatus]}
      </OverlayModal>
    </div>
  );
}

const detailContent = {
  pending: (
    <div className="flex-1 flex items-center justify-center">
      <Spinner className="h-8 w-8 text-blue-600" />
    </div>
  ),
  error: (
    <div className="flex-1 flex items-center justify-center text-red-500">
      載入失敗，請稍後再試。
    </div>
  ),
  success: (detail: { body: string } | undefined) =>
    detail?.body ? (
      <ReactMarkdown components={MarkdownComponents}>
        {detail.body}
      </ReactMarkdown>
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-center py-8">
        無詳細內容
      </div>
    ),
};

async function markAsRead(threadId: string) {
  const response = await fetch(`/api/notifications/${threadId}/read`, {
    method: "PATCH",
  });
  return response.json();
}
