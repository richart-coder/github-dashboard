import React from "react";

const TYPE_TO_PATH: Record<string, string> = {
  Issue: "issues",
  PullRequest: "pull",
};

type NotificationItemProps = {
  notification: any;
  onMarkAsRead: (id: string, unread: boolean) => void;
  markAsReadPending: boolean;
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  markAsReadPending,
}: NotificationItemProps) {
  const {
    id,
    repository: { full_name = "" } = {},
    subject: { type = "", title = "", url: apiUrl = "" } = {},
    updated_at = "",
    unread = true,
  } = notification;

  const [owner, repo] = full_name.split("/");
  const [_, number] = apiUrl.match(/\/(\d+)$/) ?? [];
  const path = TYPE_TO_PATH[type];

  let webUrl = "https://github.com/notifications";
  if (owner && repo && number && path) {
    webUrl = `https://github.com/${owner}/${repo}/${path}/${number}`;
  } else if (full_name) {
    webUrl = `https://github.com/${full_name}`;
  }

  return (
    <div
      className={`border rounded-lg p-4 space-y-2 bg-white shadow ${
        !unread ? "opacity-60" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-lg">{title}</p>
          <p className="text-gray-500 text-sm">
            {type} @{full_name}
          </p>
          <p className="text-gray-400 text-xs">
            {updated_at ? new Date(updated_at).toLocaleString() : ""}
          </p>
        </div>
        <a
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-semibold"
        >
          查看
        </a>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => onMarkAsRead(id, unread)}
          disabled={!unread || markAsReadPending}
          className={`px-2 py-1 rounded text-xs font-semibold border ${
            !unread
              ? "bg-green-100 text-green-700 cursor-not-allowed opacity-50"
              : "bg-yellow-100 text-yellow-700"
          } ${markAsReadPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {markAsReadPending ? "處理中..." : !unread ? "已讀" : "未讀"}
        </button>
      </div>
    </div>
  );
}
