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

export interface RepoWithNotifications {
  name: string;
  isActive: boolean;
  preference: {
    ignoredTypes: string[];
  };
  notifications: Notification[];
}
