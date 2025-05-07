import NotificationList from "@/components/client/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">通知中心</h1>
      <NotificationList />
    </div>
  );
}
