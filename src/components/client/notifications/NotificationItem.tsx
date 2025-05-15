import React from "react";
import Link from "next/link";

type NotificationItemProps = {
  notification: {
    id: string;
    unread: boolean;
    subject: {
      title: string;
      url: string;
      type: string;
    };
    updated_at: string;
    url: string;
    webUrl: string;
  };
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
  const { id, subject, updated_at, unread, webUrl } = notification;

  return (
    <div className="border rounded-lg p-4 space-y-2 bg-white shadow">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-semibold text-lg w-[40ch] line-clamp-2">
            {subject.title}
          </h2>
          <p className="text-gray-500 text-sm">{subject.type}</p>
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
        <div className="flex gap-6">
          {subject.url && (
            <button
              onClick={() => onShowContent(subject.url, subject.title)}
              className="bg-blue-600 text-white rounded px-3 py-1 font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              查看內容
            </button>
          )}
          <Link
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 font-semibold px-2 py-1"
          >
            前往 GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
