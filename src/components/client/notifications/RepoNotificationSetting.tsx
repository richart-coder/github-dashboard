"use client";
import { MemoizedButton } from "@/components/client/ui/Button";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { RepoWithNotifications } from "@/types/zod/notification";
import { GitHubNotificationType } from "@/types/notification";
import NotificationList from "./NotificationList";
import TypeList from "./TypeList";
import { repoPreferenceMutationOptions } from "@/data/mutation-options/repo";
const NOTIFICATION_TYPES: GitHubNotificationType[] = [
  "Issue",
  "PullRequest",
  "Commit",
];
type RepoNotificationSettingProps = {
  repo: RepoWithNotifications;
};
export default function RepoNotificationSetting({
  repo,
}: RepoNotificationSettingProps) {
  const {
    name,
    notifications,
    preference = { types: NOTIFICATION_TYPES },
  } = repo;
  const mutation = useMutation(repoPreferenceMutationOptions(name));

  const toggleType = useCallback(
    (
      type: GitHubNotificationType,
      condition: (types: GitHubNotificationType[]) => boolean
    ) => {
      return condition(preference.types)
        ? preference.types.filter((t) => t !== type)
        : preference.types.concat(type);
    },
    [preference.types]
  );

  const handleTypeChange = (type: GitHubNotificationType) => {
    const newTypes = toggleType(type, (types) => types.includes(type));
    mutation.mutate(newTypes);
  };

  const handleSelectAll = useCallback(() => {
    mutation.mutate(NOTIFICATION_TYPES);
  }, []);

  const handleDeselectAll = useCallback(() => {
    mutation.mutate([]);
  }, []);

  const filteredNotifications = notifications.filter((n) =>
    preference.types.includes(n.subject.type)
  );

  return (
    <div className="flex gap-8">
      <div className="w-1/3 border-r pr-4">
        <div className="mb-2 flex justify-end gap-4">
          <MemoizedButton
            className="text-blue-600 text-xs font-medium hover:text-blue-700 hover:cursor-pointer"
            onClick={handleSelectAll}
          >
            全選
          </MemoizedButton>
          <MemoizedButton
            className="text-blue-600 text-xs font-medium hover:text-blue-700 hover:cursor-pointer"
            onClick={handleDeselectAll}
          >
            取消全選
          </MemoizedButton>
        </div>
        <TypeList types={preference.types} onChange={handleTypeChange} />
      </div>
      <div className="flex-1">
        <h2 className="font-bold mb-4">通知列表</h2>
        <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
          <NotificationList notifications={filteredNotifications} />
        </div>
      </div>
    </div>
  );
}
