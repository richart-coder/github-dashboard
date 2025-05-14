import type { components } from "@octokit/openapi-types";
export type GitHubNotification = components["schemas"]["thread"];
type GitHubNotificationType = GitHubNotification["subject"]["type"];

export interface Notification {
  id: string;
  unread: boolean;
  subject: {
    title: string;
    url: string;
    type: GitHubNotificationType;
  };
  updated_at: string;
  url: string;
  webUrl: string;
}

export interface RepoWithNotifications {
  name: string;
  isActive: boolean;
  preference: {
    ignoredTypes: NotificationKind[];
  };
  notifications: Notification[];
}
