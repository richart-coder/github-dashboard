import type { Notification } from "@/types/zod/notification";
import type { RepositoryPreference } from "@prisma/client";

import notificationAdapter from "@/app/(dashboard)/notifications/notificationAdapter";
import type { GitHubNotification } from "@/types/notification";
const getOrCreate = <K, V>(map: Map<K, V>, key: K, defaultValue: V): V => {
  if (!map.has(key)) {
    map.set(key, defaultValue);
  }
  return map.get(key)!;
};

export default function createRepositoryViewModels(
  preferences: RepositoryPreference[],
  notifications: GitHubNotification[]
) {
  const notificationMap = new Map<string, Notification[]>([]);

  notifications.forEach((notification) => {
    const repoName = notification.repository.full_name;
    getOrCreate(notificationMap, repoName, []).push(
      notificationAdapter(notification)
    );
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
