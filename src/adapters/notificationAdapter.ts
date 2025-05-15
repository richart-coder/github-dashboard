import type { GitHubNotification } from "@/types/notification";
import { Notification } from "@/types/zod/notification";
function getWebUrl(notification: GitHubNotification) {
  const { subject, repository } = notification;
  const repoFullName = repository.full_name;
  const { url: apiUrl, type } = subject;

  if (!apiUrl || !type) return `https://github.com/${repoFullName}`;

  const [_, number] = apiUrl.match(/\/(\d+)$/) ?? [];
  const [__, sha] = apiUrl.match(/\/commits\/([a-f0-9]+)$/) ?? [];

  if (type === "PullRequest" && number) {
    return `https://github.com/${repoFullName}/pull/${number}`;
  }
  if (type === "Issue" && number) {
    return `https://github.com/${repoFullName}/issues/${number}`;
  }
  if (type === "Commit" && sha) {
    return `https://github.com/${repoFullName}/commit/${sha}`;
  }

  return `https://github.com/${repoFullName}`;
}
export default function notificationAdapter(
  notification: GitHubNotification
): Notification {
  return {
    id: notification.id,
    unread: notification.unread,
    subject: {
      title: notification.subject.title,
      url: notification.subject.url,
      type: notification.subject.type,
    },
    updated_at: notification.updated_at,
    url: notification.url,
    webUrl: getWebUrl(notification),
  };
}
