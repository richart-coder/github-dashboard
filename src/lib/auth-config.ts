import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email notifications",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (!account) return token;
      return {
        ...token,
        accessToken: account.access_token,
      };
    },
    async session({ session, token }) {
      if (session.accessToken) return session;

      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: { email: user.email },
        });
      }
      const existing = await prisma.repositoryPreference.findFirst({
        where: { userId: dbUser.id },
      });
      if (!existing && account?.access_token) {
        const { Octokit } = await import("@octokit/rest");
        const octokit = new Octokit({ auth: account.access_token });
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
          per_page: 100,
        });
        await Promise.all(
          repos.map((repo, idx) =>
            prisma.repositoryPreference.create({
              data: {
                userId: dbUser.id,
                repository: repo.full_name,
                isActive: idx === 0,
                ignoredTypes: JSON.stringify([
                  "Issue",
                  "PullRequest",
                  "Commit",
                ]),
              },
            })
          )
        );
      }
      return true;
    },
  },
};
