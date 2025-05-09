import React from "react";
import type { Notification } from "@/types/notification";

const TYPE_TO_PATH: Record<string, string> = {
  Issue: "issues",
  PullRequest: "pull",
};

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: string, unread: boolean) => void;
  markAsReadPending: boolean;
  onShowContent: (apiUrl: string, title: string) => void;
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  markAsReadPending,
  onShowContent,
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
    <div className="border rounded-lg p-4 space-y-2 bg-white shadow">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-medium text-lg">{title}</p>
          <p className="text-gray-500 text-sm">
            {type} @{full_name}
          </p>
          <p className="text-gray-400 text-xs">
            {updated_at ? new Date(updated_at).toLocaleString() : ""}
          </p>
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
        <div className="flex flex-col gap-2">
          {apiUrl && (
            <button
              onClick={() => onShowContent(apiUrl, title)}
              className="bg-blue-600 text-white rounded px-3 py-1 font-semibold hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
            >
              查看內容
            </button>
          )}
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 font-semibold px-2 py-1"
          >
            前往 GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
