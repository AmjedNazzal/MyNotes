import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnSignup = nextUrl.pathname.startsWith("/signup");
      const isOnLogIn = nextUrl.pathname.startsWith("/login");
      if (isOnSignup && !isLoggedIn) {
        return true;
      }
      if (!isOnSignup && !isOnLogIn) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
