"use client";
import { logOutHandler } from "../lib/actions";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logOutHandler()}
      className="flex gap-1 items-center justify-center shadow-[0px_0px_1px_1px_#00000024] bg-red-500 text-white py-2 px-2 text-[13px] rounded-md"
    >
      <LogOutIcon size={17} />
      Sign out
    </button>
  );
}
