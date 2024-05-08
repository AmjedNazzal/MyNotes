"use client";

import { useEffect } from "react";
import { authenticate } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  useEffect(() => {
    if (!pathname.startsWith("/login")) {
      router.push("/login");
    }
  }, [pathname, router]);
  return (
    <>
      <main className="flex justify-center items-center flex-col gap-[20px] w-full pt-20">
        <div className="flex flex-col justify-center items-start w-[35%] gap-[20px]">
          <h1
            style={{
              letterSpacing: "1.2px",
              lineHeight: "normal",
              fontWeight: "900",
              textTransform: "capitalize",
            }}
            className="text-[24px] text-white"
          >
            Welcome back!
          </h1>
          <p
            style={{
              letterSpacing: "0.9px",
              lineHeight: "30px",
              fontWeight: "300",
            }}
            className="text-[18px] text-white"
          >
            Sign in to add more notes!
          </p>
          <form
            action={dispatch}
            className="flex w-full flex-col items-center justify-center text-[12px] gap-[15px]"
            style={{
              lineHeight: "34px",
            }}
          >
            <input
              className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
              placeholder="Email"
              id="email"
              type="email"
              name="email"
              required
            />
            <input
              className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
              placeholder="Password"
              id="password"
              type="password"
              name="password"
              required
            />
            {errorMessage && (
              <>
                <div className="flex w-full px-[15px]">
                  <p
                    style={{
                      letterSpacing: "0.2px",
                      fontWeight: "500",
                      lineHeight: "20px",
                    }}
                    className="text-red-600 text-[10px]"
                  >
                    Wrong username or password!
                  </p>
                </div>
              </>
            )}
            <div className="flex w-full items-start">
              <p className="leading-normal text-white">
                Can&rsquo;t remember your password?{" "}
                <Link
                  style={{
                    letterSpacing: "0.24px",
                    fontWeight: "400",
                    maxWidth: "fit-content",
                    color: "#0a95ff",
                  }}
                  href="/login/recover/[step]"
                  as={`/login/recover/step-one`}
                >
                  click here
                </Link>
              </p>
            </div>
            <div className="flex w-full items-start">
              <p className="leading-normal text-white">
                Don&rsquo;t have an account?{" "}
                <Link
                  style={{
                    letterSpacing: "0.24px",
                    fontWeight: "400",
                    maxWidth: "fit-content",
                    color: "#0a95ff",
                  }}
                  href="/signup"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <LoginButton />
          </form>
        </div>
      </main>
    </>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      style={{
        letterSpacing: "0.26px",
        fontWeight: "900",
        lineHeight: "normal",
      }}
      className={`flex items-center w-full h-[38px] justify-center bg-yellow-400 py-[12px] text-[12px] text-white rounded-md`}
    >
      {pending ? (
        // Use a simple CSS spinner
        <div className="spinner"></div>
      ) : (
        "Login"
      )}
    </button>
  );
}
