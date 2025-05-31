import type { components } from "@octokit/openapi-types";

export type GitHubNotification = components["schemas"]["thread"];
export type GitHubNotificationType = GitHubNotification["subject"]["type"];
