import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

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
  },
};
