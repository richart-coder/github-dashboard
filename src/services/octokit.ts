import { Octokit } from "@octokit/rest";
import { Session } from "next-auth";

export async function fetchUserGitHubRepositories(session: Session) {
  const octokit = new Octokit({
    auth: session?.accessToken,
  });
  try {
    const { data: githubRepos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
    });
    return {
      data: githubRepos,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchUserGitHubNotifications(
  session: Session,
  daysBack = 30
) {
  const octokit = new Octokit({
    auth: session?.accessToken,
  });
  try {
    const { data: githubNotifications } =
      await octokit.activity.listNotificationsForAuthenticatedUser({
        all: true,
        participating: false,
        since: new Date(
          Date.now() - daysBack * 24 * 60 * 60 * 1000
        ).toISOString(),
        before: new Date().toISOString(),
      });
    return { data: githubNotifications };
  } catch (error) {
    throw error;
  }
}

export async function markNotificationAsRead(
  session: Session,
  threadId: number
) {
  const octokit = new Octokit({
    auth: session?.accessToken,
  });
  try {
    return await octokit.activity.markThreadAsRead({
      thread_id: threadId,
    });
  } catch (error) {
    throw error;
  }
}
