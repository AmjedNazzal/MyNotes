import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { users } from "@/app/(models)/DB";
import mongoose, { Schema } from "mongoose";

interface userTypes {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  isNewFirstLogin: boolean;
}

type User = userTypes | null;

async function getUser(email: string): Promise<User> {
  try {
    const user: User = await users.findOne({ email: email });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().min(8), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token._id = user._id;
        token.isNewFirstLogin = user.isNewFirstLogin;
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          isNewFirstLogin: token.isNewFirstLogin,
          userID: token._id,
        },
      };
    },
  },
});
