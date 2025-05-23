import React from "react";
import { GitHubNotificationType } from "@/types/notification";
const NOTIFICATION_TYPE_LABELS: {
  [key: string]: string;
  value: GitHubNotificationType;
}[] = [
  {
    label: "Pull Requests",
    value: "PullRequest",
    desc: "合併請求、程式碼審查相關通知",
  },
  { label: "Issues", value: "Issue", desc: "問題報告和功能請求相關通知" },
  { label: "Commit", value: "Commit", desc: "程式碼提交相關通知" },
];

export default function TypeList({
  types,
  onChange,
}: {
  types: GitHubNotificationType[];
  onChange: (type: GitHubNotificationType) => void;
}) {
  return (
    <div className="space-y-2">
      {NOTIFICATION_TYPE_LABELS.map((type) => (
        <div
          key={type.value}
          className="flex gap-3 py-2 rounded hover:bg-blue-50 transition"
        >
          <input
            type="checkbox"
            name="notificationType"
            checked={types.includes(type.value)}
            onChange={() => onChange(type.value)}
            className="w-4 h-4 accent-blue-500 mt-1"
            id={`type-${type.value}`}
          />
          <label
            htmlFor={`type-${type.value}`}
            className="w-full font-semibold text-[#111827] hover:cursor-pointer"
          >
            {type.label}
            <div className="text-xs text-[#6B7280]">{type.desc}</div>
          </label>
        </div>
      ))}
    </div>
  );
}
