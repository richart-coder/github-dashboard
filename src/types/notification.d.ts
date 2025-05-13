import type { components } from "@octokit/openapi-types";
export type GitHubNotification = components["schemas"]["thread"];

export type NotificationKind = "Issue" | "PullRequest" | "Commit";
export interface Notification {
  id: string;
  unread: boolean;
  subject: {
    title: string;
    url: string;
    type: NotificationKind;
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
