import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NotificationKind } from "@/types/notification";

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
        ignoredTypes: JSON.stringify(["Issue", "PullRequest", "Commit"]),
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

export const updateRepositoryPreferenceIgnoreTypes = async (
  userId: string,
  repository: string,
  ignoredTypes: NotificationKind[],
  select?: Prisma.RepositoryPreferenceSelect
) => {
  try {
    return await prisma.repositoryPreference.update({
      where: { userId_repository: { userId, repository } },
      data: { ignoredTypes: JSON.stringify(ignoredTypes) },
      select,
    });
  } catch (error) {
    throw error;
  }
};
