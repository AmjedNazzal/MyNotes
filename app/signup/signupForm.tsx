"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { signUp } from "@/lib/actions";
import { usePathname, useRouter } from "next/navigation";

export default function SignupForm() {
  const [errorToShow, setErrorToShow] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);
  const input1Ref = useRef<HTMLInputElement | null>(null);
  const input2Ref = useRef<HTMLInputElement | null>(null);
  const input3Ref = useRef<HTMLInputElement | null>(null);
  const url = usePathname();
  const router = useRouter();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, sePasswordError] = useState("");

  const validateEmail = () => {
    if (input1Ref.current) {
      const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        input1Ref.current.value
      );
      if (!emailCheck) {
        setEmailError("You must enter a valid email");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("You must enter a valid email");
    }
  };

  const validatePassword = () => {
    if (input2Ref.current) {
      const passwordCheck = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(
        input2Ref.current.value
      );
      if (!passwordCheck) {
        sePasswordError(
          "Your password must be at least 8 characters and must contain at least one letter and one number"
        );
      } else {
        sePasswordError("");
      }
    } else {
      sePasswordError(
        "Your password must be at least 8 characters and must contain at least one letter and one number"
      );
    }
  };

  function RegisterButton() {
    return (
      <button
        type="submit"
        aria-disabled={isPending}
        style={{
          letterSpacing: "0.26px",
          fontWeight: "900",
          lineHeight: "normal",
        }}
        className={`flex items-center w-full h-[38px] mt-[10px] justify-center bg-yellow-400 py-[12px] text-[12px] text-white rounded-md`}
      >
        {isPending ? (
          // Use a simple CSS spinner
          <div className="spinner"></div>
        ) : (
          "Register"
        )}
      </button>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (usernameError || emailError || passwordError) {
      return;
    }
    setIsPending(true);
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("url", url);
    const res = await signUp(undefined, formData);
    setErrorToShow(res);
    setIsPending(false);
    if (res === "Registered successfully") {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };
  return (
    <>
      <main className="flex justify-center items-center flex-col gap-[20px] w-full pt-10">
        <div className="flex flex-col justify-start text-white items-start gap-[20px] w-[35%]">
          <h1
            style={{
              letterSpacing: "1.2px",
              lineHeight: "normal",
              fontWeight: "900",
              textTransform: "capitalize",
            }}
            className="text-[24px]"
          >
            Start taking notes!
          </h1>
          <p
            style={{
              letterSpacing: "0.9px",
              lineHeight: "30px",
              fontWeight: "300",
            }}
            className="text-[18px]"
          >
            Easy and simple to use
          </p>
          <div className="flex flex-col w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-start text-[12px] gap-[15px]"
              style={{
                lineHeight: "34px",
              }}
            >
              <input
                ref={input1Ref}
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                placeholder="Your Email"
                id="email"
                type="text"
                name="email"
                required
                onBlur={validateEmail}
              />

              {emailError && (
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
                      {emailError}
                    </p>
                  </div>
                </>
              )}

              <input
                ref={input2Ref}
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                placeholder="New password"
                id="password"
                type="password"
                name="password"
                required
                onBlur={validatePassword}
              />

              {passwordError && (
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
                      {passwordError}
                    </p>
                  </div>
                </>
              )}

              <input
                ref={input3Ref}
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                placeholder="Confirm Password"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
              />

              {errorToShow && errorToShow !== "Registered successfully" && (
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
                      {errorToShow}
                    </p>
                  </div>
                </>
              )}
              <RegisterButton />
            </form>
          </div>
        </div>
      </main>
      {errorToShow === "Registered successfully" && (
        <>
          <div
            style={{ zIndex: "1000" }}
            className="flex absolute top-0 text-white w-full h-full justify-center items-center"
          >
            <div
              style={{ height: "100%" }}
              className="flex w-full bg-[#252526] opacity-80"
            ></div>
            <div
              style={{
                borderRadius: "5px",
                border: "1px solid var(--Border, #EAEAEA)",
              }}
              className="flex w-[50%] flex-col items-center justify-center h-[50%] gap-[50px] bg-white absolute"
            >
              <p
                style={{
                  letterSpacing: "0.2px",
                  fontWeight: "700",
                  lineHeight: "20px",
                }}
                className="text-gray-500 text-[30px]"
              >
                Thank you for signing up!
              </p>
              <p
                style={{
                  letterSpacing: "0.2px",
                  fontWeight: "500",
                  lineHeight: "20px",
                }}
                className="text-gray-400 text-[17px]"
              >
                Redirecting you to the login page
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
