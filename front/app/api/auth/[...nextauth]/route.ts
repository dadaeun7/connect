import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Notion from "next-auth/providers/notion";
import Figma from "next-auth/providers/figma";
import Slack from "next-auth/providers/slack";

interface CustomCredentials {
  userId: string;
  accessToken: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        accessToken: { type: "text" },
        userId: { type: "text" },
      },
      async authorize(credentials) {
        const authRes = credentials as CustomCredentials;

        if (authRes?.accessToken) {
          return {
            id: String(credentials.userId),
            email: String(credentials.userId),
            accessToken: String(credentials.accessToken),
          };
        }
        return null;
      },
    }),
    GitHub,
    Notion({
      clientId: process.env.AUTH_NOTION_ID,
      clientSecret: process.env.AUTH_NOTION_SECRET,
      redirectUri: process.env.AUTH_NOTION_REDIRECT_URI,
    } as any),
    Figma({
      authorization: {
        url: "https://www.figma.com/oauth",
        params: {
          scope:
            "current_user:read, file_comments:read, file_metadata:read, file_versions:read",
        },
      },
    }),
    Slack({
      clientId: process.env.AUTH_SLACK_ID,
      clientSecret: process.env.AUTH_SLACK_SECRET,
      redirectUri: process.env.AUTH_SLACK_REDIRECT_URI,
    } as any),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      if (account) {
        token[account.provider] = {
          accessToken: account.access_token,
          providerAccountId: account.providerAccountId,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.github = token.github;
      session.notion = token.notion;
      session.figma = token.figma;
      session.slack = token.slack;
      return session;
    },
  },
});
