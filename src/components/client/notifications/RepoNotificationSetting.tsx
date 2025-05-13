"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notification";
import NotificationList from "./NotificationList";
import { NotificationKind } from "@/types/notification";
export const NOTIFICATION_TYPE_LABELS: {
  [key: string]: string;
  value: NotificationKind;
}[] = [
  {
    label: "Pull Requests",
    value: "PullRequest",
    desc: "合併請求、程式碼審查相關通知",
  },
  { label: "Issues", value: "Issue", desc: "問題報告和功能請求相關通知" },
  { label: "Commit", value: "Commit", desc: "程式碼提交相關通知" },
];
const NOTIFICATION_TYPES: NotificationKind[] = [
  "Issue",
  "PullRequest",
  "Commit",
];

export default function RepoNotificationSetting({
  repoName,
  notifications,
  preference = { ignoredTypes: NOTIFICATION_TYPES },
}: {
  repoName: string;
  notifications: Notification[];
  preference: { ignoredTypes: NotificationKind[] };
}) {
  const queryClient = useQueryClient();
  const getPreferenceApiUrl = () => {
    const [owner, repo] = repoName.split("/");
    return `/api/repositories/${owner}/${repo}/preferences`;
  };

  const mutation = useMutation({
    mutationFn: async (payload: { types: string[] }) => {
      const url = getPreferenceApiUrl();
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ignoredTypes: payload.types,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");
      return res.json();
    },
    onMutate: async (payload: { types: string[] }) => {
      await queryClient.cancelQueries({ queryKey: ["repositories"] });
      const previousData = queryClient.getQueryData(["repositories"]);
      queryClient.setQueryData(["repositories"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((repo: any) =>
          repo.name === repoName
            ? {
                ...repo,
                preference: {
                  ...repo.preference,
                  ignoredTypes: payload.types,
                },
              }
            : repo
        );
      });
      return { previousData };
    },
    onError: (err, payload, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["repositories"], context.previousData);
      }
    },
  });

  const handleTypeChange = (type: NotificationKind) => {
    const newTypes = preference.ignoredTypes.includes(type)
      ? preference.ignoredTypes.filter((t) => t !== type)
      : [...preference.ignoredTypes, type];
    mutation.mutate({ types: newTypes });
  };

  const handleSelectAll = () => {
    mutation.mutate({ types: NOTIFICATION_TYPES });
  };

  const handleDeselectAll = () => {
    mutation.mutate({ types: [] });
  };
  const filteredNotifications = notifications.filter((n) =>
    preference.ignoredTypes.includes(n.subject.type)
  );

  return (
    <div className="flex gap-8">
      <div className="w-1/3 border-r pr-4">
        <div className="mb-2 flex justify-end gap-4">
          <button
            className="text-blue-600 text-xs font-medium hover:underline"
            onClick={handleSelectAll}
          >
            全選
          </button>
          <button
            className="text-blue-600 text-xs font-medium hover:underline"
            onClick={handleDeselectAll}
          >
            取消全選
          </button>
        </div>
        <div className="space-y-2">
          {NOTIFICATION_TYPE_LABELS.map((type) => (
            <div
              key={type.value}
              className="flex items-start gap-3 py-2 rounded hover:bg-blue-50 transition hover:cursor-pointer"
            >
              <input
                type="checkbox"
                name="notificationType"
                checked={preference.ignoredTypes.includes(type.value)}
                onChange={() => handleTypeChange(type.value)}
                className="w-4 h-4 accent-blue-500 mt-1"
                id={`type-${type.value}-${repoName}`}
              />
              <label
                htmlFor={`type-${type.value}-${repoName}`}
                className="font-semibold text-[#111827] hover:cursor-pointer"
              >
                {type.label}
                <div className="text-xs text-[#6B7280]">{type.desc}</div>
              </label>
            </div>
          ))}
        </div>
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
