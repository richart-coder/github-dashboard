import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { Octokit } from "@octokit/rest";
import { prisma } from "@/lib/prisma";

import RepoList from "@/components/client/notifications/RepoList";
import { redirect } from "next/navigation";

async function getInitialData() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || !session.user?.email) {
    redirect("/auth/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) {
    redirect("/auth/signin");
  }

  const octokit = new Octokit({
    auth: session.accessToken,
  });

  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
  });

  const dbPreferences = await prisma.repositoryPreference.findMany({
    where: {
      userId: dbUser.id,
    },
  });
  const preferencesMap = new Map(dbPreferences.map((p) => [p.repository, p]));

  const { data: notifications } =
    await octokit.activity.listNotificationsForAuthenticatedUser({
      all: true,
      participating: false,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      before: new Date().toISOString(),
    });

  const notificationMap = new Map();
  for (const n of notifications) {
    const repoName = n.repository.full_name;
    if (!notificationMap.has(repoName)) notificationMap.set(repoName, []);
    notificationMap.get(repoName).push({
      id: n.id,
      unread: n.unread,
      subject: {
        title: n.subject.title,
        url: n.subject.url,
        type: n.subject.type,
      },
      updated_at: n.updated_at,
      url: n.url,
      webUrl: `https://github.com/${n.repository.full_name}`,
    });
  }

  return repos.map((repo) => {
    const preference = preferencesMap.get(repo.full_name)!;
    let ignoredTypes: string[] = ["Issue", "PullRequest", "Commit"];

    if (preference.ignoredTypes) {
      try {
        ignoredTypes = JSON.parse(preference.ignoredTypes);
      } catch {
        ignoredTypes = preference.ignoredTypes.split(",");
      }
    }

    return {
      name: repo.full_name,
      isActive: preference.isActive,
      preference: {
        ignoredTypes,
      },
      notifications: notificationMap.get(repo.full_name) || [],
    };
  });
}

export default async function NotificationsPage() {
  const initialData = await getInitialData();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">通知中心</h1>
      <RepoList initialData={initialData} />
    </div>
  );
}
