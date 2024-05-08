import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "./(components)/logoutButton";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyNotes",
  description: "Create your notes easily",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userEmail = (session?.user as { email: string })?.email;

  return (
    <html lang="en">
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
