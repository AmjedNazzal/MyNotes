"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname.startsWith("/my-notes")) {
      router.push("/my-notes");
    }
  }, [pathname, router]);
  return <></>;
}
