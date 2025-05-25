import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/zod/notification";
import MemoizedOverlayModal from "./OverlayModal";
import OverlayModalContent from "./OverlayModalContent";
import useDialogControl from "./hooks/useDialogControl";
import { repoNotificationUnreadMutationOptions } from "@/data/mutation-options/repo";

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const {
    ref: dialogRef,
    open: openDialog,
    close: closeDialog,
  } = useDialogControl();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const markAsReadMutation = useMutation(
    repoNotificationUnreadMutationOptions()
  );

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
