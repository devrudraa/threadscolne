import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },

  callbacks: {
    async signIn({ user, account }) {
      // return true;
      const userExist = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!userExist) return true;

      const userAccount = await prisma.account.findFirst({
        where: {
          user: userExist,
        },
      });

      if (userAccount?.provider === account?.provider) return true;

      return "/auth/error?error=Already exist an account with this email";
    },

    async session({ token, session, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!dbUser) {
        return {
          ...session,
          error: "user not found",
        };
      }
      return {
        ...session,
        user: {
          ...(session.user || {}),
          id: dbUser.id,
          username: dbUser.username,
        },
      };
    },

    redirect() {
      return "/";
    },
  },
};

const getAuthSession = () => getServerSession(authOptions);

export default getAuthSession;
