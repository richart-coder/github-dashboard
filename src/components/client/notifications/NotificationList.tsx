"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsQueryOptions } from "@/data/query-options/notifications";
import {
  useLocalNotificationState,
  NotificationPriority,
} from "./useLocalNotificationState";
import { useState } from "react";

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
  const { get, toggleRead, setPriority, toggleIgnored } =
    useLocalNotificationState();
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
    const local = get(notification.id) || {
      status: "UNREAD",
      priority: "MEDIUM",
      ignored: false,
    };
    return showIgnored || !local.ignored;
  });

  const handleToggleRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toggleRead(id);
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
      {filteredNotifications.map((notification: any, index: number) => {
        const {
          id,
          repository: { full_name = "" } = {},
          subject: { type = "", title = "", url: apiUrl = "" } = {},
          updated_at = "",
        } = notification;

        const [owner, repo] = full_name.split("/");
        const [_, number] = apiUrl.match(/\/(\d+)$/) ?? [];

        const TYPE_TO_PATH: Record<string, string> = {
          Issue: "issues",
          PullRequest: "pull",
        };
        const path = TYPE_TO_PATH[type];

        let webUrl = "https://github.com/notifications";
        if (owner && repo && number && path) {
          webUrl = `https://github.com/${owner}/${repo}/${path}/${number}`;
        } else if (full_name) {
          webUrl = `https://github.com/${full_name}`;
        }

        const local = get(id) || {
          status: "UNREAD",
          priority: "MEDIUM",
          ignored: false,
        };

        return (
          <div
            key={index}
            className={`border rounded-lg p-4 space-y-2 bg-white shadow ${
              local.status === "READ" ? "opacity-60" : ""
            } ${local.ignored ? "bg-gray-50" : ""}`}
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
                onClick={() => handleToggleRead(id)}
                disabled={
                  local.status === "READ" || markAsReadMutation.isPending
                }
                className={`px-2 py-1 rounded text-xs font-semibold border ${
                  local.status === "READ"
                    ? "bg-green-100 text-green-700 cursor-not-allowed opacity-50"
                    : "bg-yellow-100 text-yellow-700"
                } ${
                  markAsReadMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {markAsReadMutation.isPending
                  ? "處理中..."
                  : local.status === "READ"
                  ? "已讀"
                  : "未讀"}
              </button>
              <select
                value={local.priority}
                onChange={(e) =>
                  setPriority(id, e.target.value as NotificationPriority)
                }
                className="px-2 py-1 rounded text-xs border"
                aria-label="Set notification priority"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="IGNORED">Ignored</option>
              </select>
              <button
                onClick={() => toggleIgnored(id)}
                className={`px-2 py-1 rounded text-xs font-semibold border ${
                  local.ignored
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {local.ignored ? "恢復" : "忽略"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
