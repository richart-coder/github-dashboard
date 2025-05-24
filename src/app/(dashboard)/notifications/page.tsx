import validateSession from "@/services/auth";
import {
  fetchUserGitHubRepositories,
  fetchUserGitHubNotifications,
} from "@/services/octokit";
import {
  getRepositoryPreferences,
  ensureRepositoryPreferences,
} from "@/repositories/repo-preference";
import RepoSelector from "@/components/client/notifications/RepoSelector";
import createRepositoryViewModels from "@/viewModels/createRepositoryViewModel";

async function getInitialData() {
  const { session } = await validateSession();
  const { data: githubRepos } = await fetchUserGitHubRepositories(session);
  await ensureRepositoryPreferences(
    session.user.id,
    githubRepos.map((repo) => repo.full_name)
  );
  const { data: githubNotifications } = await fetchUserGitHubNotifications(
    session
  );

  const preferences = await getRepositoryPreferences(session.user.id);
  return createRepositoryViewModels(preferences, githubNotifications);
}

export default async function NotificationsPage() {
  const initialData = await getInitialData();
  return <RepoSelector repos={initialData} />;
}
