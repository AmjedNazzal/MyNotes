"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

type HandleTutorialEndFunction = () => Promise<void>;

export default function Tutorial({
  step,
  setStep,
  handleTutotialEnd,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  handleTutotialEnd: HandleTutorialEndFunction;
}) {
  return (
    <div className="flex absolute top-0 z-20 text-white w-full h-full justify-center items-center">
      <div className="flex absolute w-full h-full bg-[#252526] opacity-50"></div>
      <div className="flex relative px-10 py-10 items-center">
        <img src="/logo.png" className="w-[80px]"></img>
        <div className="flex absolute w-[400px] right-[-400px] items-center justify-center">
          <div className="w-3 overflow-hidden">
            <div className="h-4 bg-[#ffea85] rotate-45 transform origin-bottom-right rounded-sm"></div>
          </div>
          <div className="flex flex-col bg-[#ffea85] text-[#525767] gap-3 p-4 my-6 rounded-lg flex-1">
            {step <= 0 && (
              <>
                <p>Welcome to MyNotes!</p>
                <p>
                  Let&rsquo;s walk you through everything you need to know so
                  you can start taking your notes!
                </p>
              </>
            )}
            {step === 1 && (
              <>
                <p>Adding new notes</p>
                <p>
                  To add new notes, click on the <b>Create New</b> button in the
                  top right side of the screen
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <p>You can edit or delete your notes</p>
                <p>
                  Click on the edit or delete note icons to keep your notes up
                  to date and organised!
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <p>I hope you enjoy MyNotes!</p>
              </>
            )}
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    handleTutotialEnd();
                  }
                }}
              >
                {step < 3 ? "Next" : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
