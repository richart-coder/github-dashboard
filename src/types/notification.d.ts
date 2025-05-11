export interface Notification {
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
}
export type NotificationKind = "Issue" | "PullRequest" | "Commit";
export interface RepoWithNotifications {
  name: string;
  isActive: boolean;
  preference: {
    ignoredTypes: NotificationKind[];
  };
  notifications: Notification[];
}
