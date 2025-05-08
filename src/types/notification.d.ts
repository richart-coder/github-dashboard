export interface Notification {
  id: string;
  repository: {
    full_name: string;
  };
  subject: {
    type: string;
    title: string;
    url: string;
  };
  updated_at: string;
  unread: boolean;
}
