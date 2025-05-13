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
