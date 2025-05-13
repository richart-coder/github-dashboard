export default function notificationAdapter(notification: any) {
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
    webUrl: `https://github.com/${notification.repository.full_name}`,
  };
}
