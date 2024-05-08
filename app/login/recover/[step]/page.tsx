"use client";
import { useState, useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendEmailRecovery, resetPassword } from "../../../lib/actions";
import { useRouter } from "next/navigation";

interface SearchParams {
  params: {
    step: string;
  };
  searchParams: {
    email: string;
    tkn: string;
  };
}

export default function Page(searchParams: SearchParams) {
  const { params } = searchParams;
  const { step } = params;
  const [errorMessage, dispatch] = useFormState(sendEmailRecovery, undefined);
  const [message, chanagePassword] = useFormState(resetPassword, undefined);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [passwordError, sePasswordError] = useState("");

  const validatePassword = () => {
    if (newPasswordRef.current) {
      const passwordCheck = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(
        newPasswordRef.current.value
      );
      if (!passwordCheck) {
        sePasswordError(
          "Your password must be at least 8 characters and must contain at least one letter, one number and one special character"
        );
      } else {
        sePasswordError("");
      }
    } else {
      sePasswordError(
        "Your password must be at least 8 characters and must contain at least one letter, one number and one special character"
      );
    }
  };

  function SendRecoveryEmail() {
    const { pending } = useFormStatus();
    return (
      <button
        aria-disabled={pending}
        style={{
          letterSpacing: "0.26px",
          fontWeight: "900",
          lineHeight: "normal",
        }}
        className={`flex items-center w-full h-[38px] justify-center bg-yellow-400 py-[12px] mt-[10px] text-[12px] text-white rounded-md`}
      >
        {pending ? (
          // Use a simple CSS spinner
          <div className="spinner"></div>
        ) : (
          "Send a recovery email"
        )}
      </button>
    );
  }

  const ChangePassword = () => {
    const { pending } = useFormStatus();
    if (!pending && message?.startsWith("Password successfully changed!")) {
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
    return (
      <button
        aria-disabled={pending}
        disabled={!!passwordError}
        style={{
          letterSpacing: "0.26px",
          fontWeight: "900",
          lineHeight: "normal",
        }}
        className={`flex items-center w-full h-[38px] justify-center bg-yellow-400 py-[12px] mt-[10px] text-[12px] text-white rounded-md`}
      >
        {pending ? (
          // Use a simple CSS spinner
          <div className="spinner"></div>
        ) : (
          "Confirm password change"
        )}
      </button>
    );
  };

  return (
    <div className="flex w-full justify-center items-center h-full pt-20">
      <>
        {step === "step-one" && (
          <div className="flex items-center w-[35%] flex-col gap-[30px]">
            <div
              style={{
                letterSpacing: "0.9px",
                fontWeight: "500",
                lineHeight: "25px",
              }}
              className="text-[17px] justify-start text-white flex w-full items-center"
            >
              <h2
                style={{
                  letterSpacing: "1.2px",
                  lineHeight: "normal",
                  fontWeight: "900",
                  textTransform: "capitalize",
                }}
                className="text-[24px]"
              >
                Recover your account
              </h2>
            </div>
            <form
              action={dispatch}
              className="flex flex-col w-full items-center justify-center text-[12px] gap-[15px]"
              style={{
                lineHeight: "34px",
              }}
            >
              <input
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                placeholder="Enter your email"
                id="email"
                type="email"
                name="email"
                required
              />
              {errorMessage && (
                <>
                  <div className="flex w-full justify-center">
                    <p
                      style={{
                        letterSpacing: "0.2px",
                        fontWeight: "500",
                        lineHeight: "20px",
                        fontSize: "12px",
                        color: errorMessage.includes("An email has been sent")
                          ? "#52b963"
                          : "#dc2626",
                      }}
                    >
                      {errorMessage}
                    </p>
                  </div>
                </>
              )}
              <SendRecoveryEmail />
            </form>
          </div>
        )}

        {step === "step-two" && (
          <div className="flex items-center w-[35%] flex-col gap-[30px]">
            <div
              style={{
                letterSpacing: "0.9px",
                fontWeight: "500",
                lineHeight: "25px",
              }}
              className="text-[17px] justify-start text-white flex w-full items-center"
            >
              <h2
                style={{
                  letterSpacing: "1.2px",
                  lineHeight: "normal",
                  fontWeight: "900",
                  textTransform: "capitalize",
                }}
                className="text-[24px]"
              >
                Reset your password
              </h2>
            </div>
            <form
              action={chanagePassword}
              className="flex flex-col w-full items-center justify-center text-[12px] gap-[15px]"
              style={{
                lineHeight: "34px",
              }}
            >
              <input
                ref={newPasswordRef}
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                id="newpassword"
                type="password"
                name="newpassword"
                placeholder="Enter your new password"
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
                ref={confirmPasswordRef}
                className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
                id="re-password"
                type="password"
                name="re-password"
                placeholder="Confirm your new password"
                required
              />
              <input
                style={{ outline: "none", visibility: "hidden", opacity: "0" }}
                className="flex h-0 absolute"
                id="email"
                type="password"
                name="email"
                value={searchParams.searchParams.email}
                required
                readOnly
              />
              <input
                style={{ outline: "none", visibility: "hidden", opacity: "0" }}
                className="flex h-0 absolute"
                id="token"
                type="password"
                name="token"
                value={searchParams.searchParams.tkn}
                required
                readOnly
              />

              {message && (
                <div className="flex w-full">
                  <p
                    style={{
                      letterSpacing: "0.2px",
                      fontWeight: "500",
                      lineHeight: "20px",
                    }}
                    className={
                      message.startsWith("Password successfully changed!")
                        ? "text-green-500 text-[10px]"
                        : "text-red-600 text-[10px]"
                    }
                  >
                    {message}
                  </p>
                </div>
              )}
              <ChangePassword />
            </form>
          </div>
        )}
      </>
    </div>
  );
}
