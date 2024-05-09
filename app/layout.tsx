import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/(components)/logoutButton";
import { auth } from "../auth";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userEmail = (session?.user as { email: string })?.email;

  return (
    <html lang="en">
      <head>
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="MyNotes" />
        <meta property="og:description" content="Create your notes easily" />
        <meta
          property="og:url"
          content="https://my-notes-amjed-nazzals-projects.vercel.app/"
        />
        <meta property="og:site_name" content="MyNotes" />
        <meta
          property="og:image"
          content="https://my-notes-amjed-nazzals-projects.vercel.app/opengraph-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpg" />
      </head>
      <body
        style={{ backgroundColor: "#3e3e42", minHeight: " 100vh" }}
        className={inter.className}
      >
        <div className="flex w-full items-center justify-between px-20 py-5">
          <Link className="flex w-fit" href="/">
            <img src="/logo.png" className="w-[55px]"></img>
          </Link>
          {userEmail && <LogoutButton />}
        </div>
        {children}
      </body>
    </html>
  );
}
