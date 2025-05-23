import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { GitHubNotificationType } from "@/types/notification";
export async function getRepositoryPreferences(
  userId: string,
  select?: Prisma.RepositoryPreferenceSelect
) {
  return await prisma.repositoryPreference.findMany({
    where: { userId },
    select,
  });
}

export async function ensureRepositoryPreferences(
  userId: string,
  githubRepoNames: string[]
) {
  try {
    if (githubRepoNames.length === 0) {
      return {
        createdCount: 0,
        missingRepos: [],
        totalRepos: 0,
      };
    }

    const existingPreferences = await getRepositoryPreferences(userId, {
      repository: true,
    });

    const existingRepoNames = new Set(
      existingPreferences.map((p) => p.repository)
    );

    const missingRepos = githubRepoNames.filter(
      (repo) => !existingRepoNames.has(repo)
    );

    if (missingRepos.length === 0) {
      return {
        createdCount: 0,
        missingRepos: [],
        totalRepos: githubRepoNames.length,
      };
    }

    const createdPreferences = await prisma.repositoryPreference.createMany({
      data: missingRepos.map((repoName) => ({
        userId,
        repository: repoName,
        isActive: false,
        types: '["Issue", "PullRequest", "Commit"]',
      })),
    });

    return {
      createdCount: createdPreferences.count,
      missingRepos,
      totalRepos: githubRepoNames.length,
    };
  } catch (error) {
    throw error;
  }
}

export async function setActiveRepository(userId: string, repository: string) {
  try {
    return await prisma.$transaction([
      prisma.repositoryPreference.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      }),

      prisma.repositoryPreference.update({
        where: {
          userId_repository: { userId, repository },
        },
        data: { isActive: true },
      }),
    ]);
  } catch (error) {
    throw error;
  }
}

export const updateRepositoryPreferenceTypes = async (
  userId: string,
  repository: string,
  types: GitHubNotificationType[],
  select?: Prisma.RepositoryPreferenceSelect
) => {
  try {
    return await prisma.repositoryPreference.update({
      where: { userId_repository: { userId, repository } },
      data: { types: JSON.stringify(types) },
      select,
    });
  } catch (error) {
    throw error;
  }
};
