import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnSignup = nextUrl.pathname.startsWith("/signup");
      const isOnMyNotes = nextUrl.pathname.startsWith("/my-notes");
      if (isOnSignup && !isLoggedIn) {
        return true;
      }
      if (isOnMyNotes) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/my-notes", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
