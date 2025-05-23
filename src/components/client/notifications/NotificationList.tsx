import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import NotificationItem from "./NotificationItem";
import { Notification, RepoWithNotifications } from "@/types/zod/notification";
import MemoizedOverlayModal from "./OverlayModal";
import OverlayModalContent from "./OverlayModalContent";
import useDialogControl from "./useDialogControl";
import toast from "react-hot-toast";

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const queryClient = useQueryClient();
  const {
    ref: dialogRef,
    open: openDialog,
    close: closeDialog,
  } = useDialogControl();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

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

  const handleMark = useCallback((id: string, unread: boolean) => {
    if (!unread) return;
    markAsReadMutation.mutate(id);
  }, []);

  const handleShowContent = useCallback((id: string, title: string) => {
    setSelectedId(id);
    setSelectedTitle(title);
    openDialog();
  }, []);

  if (!notifications || notifications.length === 0) return <div>沒有通知</div>;

  return (
    <div className="space-y-4">
      {notifications.map((notification: Notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMark={handleMark}
          pending={markAsReadMutation.isPending}
          onShowContent={handleShowContent}
        />
      ))}

      <MemoizedOverlayModal
        ref={dialogRef}
        onClose={closeDialog}
        title={selectedTitle}
      >
        <OverlayModalContent id={selectedId} />
      </MemoizedOverlayModal>
    </div>
  );
}

async function markAsRead(threadId: string) {
  const response = await fetch(`/api/notifications/${threadId}/read`, {
    method: "PATCH",
  });
  return response.json();
}
