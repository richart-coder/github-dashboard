import { RepositoryPreference } from "@prisma/client";
import { Notification } from "@/types/zod/notification";

import notificationAdapter from "@/adapters/notificationAdapter";
import type { GitHubNotification } from "@/types/notification";
export default function createRepositoryViewModels(
  preferences: RepositoryPreference[],
  notifications: GitHubNotification[],
  adapter = notificationAdapter
) {
  const notificationMap = new Map<string, Notification[]>();

  notifications.forEach((notification) => {
    const repoName = notification.repository.full_name;
    if (!notificationMap.has(repoName)) {
      notificationMap.set(repoName, []);
    }
    notificationMap.get(repoName)!.push(adapter(notification));
  });

  return preferences.map((preference) => ({
    name: preference.repository,
    isActive: preference.isActive,
    preference: {
      types: JSON.parse(preference.types),
    },
    notifications: notificationMap.get(preference.repository) || [],
  }));
}
