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
    async jwt({ token, account, user }) {
      if (!user || !account) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      return {
        ...token,
        accessToken: account.access_token,
        id: dbUser?.id,
      };
    },
    async session({ session, token }) {
      if (session.accessToken) return session;

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
        accessToken: token.accessToken,
      };
    },
    async signIn({ user }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: {
          email: user.email,
        },
        update: {},
        create: {
          email: user.email,
        },
      });
      return true;
    },
  },
};
