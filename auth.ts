import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Notion from "next-auth/providers/notion";
import Figma from "next-auth/providers/figma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
  ],
});
