import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Notion from "next-auth/providers/notion";
import Figma from "next-auth/providers/figma";
import Slack from "next-auth/providers/slack";
import { BASE, REFRESH_TOKEN } from "./app/etc/constant";

interface CustomCredentials {
  userId: string;
  accessToken: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
    updateAge: 30 * 60
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        userId: { type: "text" },
        accessToken: { type: "text" },
      },
      async authorize(credentials) {
        const authRes = credentials as CustomCredentials;

        if (!authRes?.accessToken) {
          return null;
        }
        
        return {
            id: String(credentials.userId),
            name:  String(credentials.userId),
            email: String(credentials.userId),
            accessToken: String(credentials.accessToken),
          };
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
        token.exp = Date.now() + 30 * 60 * 1000;
        return token;
      }

      if (account) {
        token[account.provider] = {
          accessToken: account.access_token,
          providerAccountId: account.providerAccountId,
        };
      }

      if(Date.now() < (token.exp as number)){
        return token;
      }

      return token;
    },
    async session({ session, token }: any) {

      if(token.error === "RefreshAccessTokenError"){
        return {...session,error:token.error };
      }

      session.accessToken = token.accessToken;
      session.github = token.github;
      session.notion = token.notion;
      session.figma = token.figma;
      session.slack = token.slack;
      return session;
    },
  },
});

async function refreshToken(token: any){

  try{
    const response = await fetch(BASE+REFRESH_TOKEN, {
      method: "POST",
      body: JSON.stringify({email: token.userId})
    });

    const refreshToken = await response.json();

    if(!refreshToken.ok) throw refreshToken;

    return {
      ...token,
      accessToken: refreshToken.accessToken,
      exp: Date.now() + 30 * 60 * 1000
    }

  }catch(error){
    return {...token, error: "RefreshAccessTokenError"}
  }
}
