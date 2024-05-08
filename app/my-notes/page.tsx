"use client";
import Link from "next/link";
import { PlusCircle, TrashIcon, EditIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchNotes, DeleteNote, MarkTutorialDone } from "../lib/actions";
import Tutorial from "../(components)/tutorial";
import { MoveRightIcon } from "lucide-react";

interface Note {
  author: string;
  createdAt: string;
  description: string;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

type NotesType = [Note] | [] | undefined;

export default function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState<NotesType>([]);
  const [noteToDeleteID, setNoteToDeleteID] = useState("");
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function getNotes() {
      try {
        const data = await fetchNotes();
        if (data) {
          setNotes(data.notesData);
          if (data.isUserNew) {
            setShouldShowTutorial(true);
          }
        }
      } catch (error) {
        console.log("error fetching: ", error);
      }
    }
    getNotes();
  }, [noteToDeleteID]);

  async function DeleteNoteHandler(id: string) {
    try {
      const res = await DeleteNote(id);
      if (res === "success") {
        router.refresh();
        setShouldShowWarning(false);
        setNoteToDeleteID("");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  function formatTimestamp(timeStamp: string) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as const;

    const date = new Date(timeStamp);
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  }

  async function handleTutotialEnd() {
    try {
      const res = await MarkTutorialDone();
      if (res === "success") {
        router.refresh();
        setShouldShowTutorial(false);
        setStep(0);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const colors = [
    { header: "#fdd40a", body: "#ffea85", text: "#525767" },
    { header: "#0ad4fd", body: "#85d5fd", text: "#525767" },
    { header: "#0afd6f", body: "#85ffb7", text: "#525767" },
    { header: "#636363", body: "#6F6F6F", text: "#FFFFFF" },
    { header: "#F5F5F5", body: "#FFFFFF", text: "#525767" },
  ];

  return (
    <>
      <div className="flex relative bg-[#3e3e42] justify-start items-center flex-col gap-10">
        <div
          style={{ zIndex: shouldShowTutorial && step === 1 ? "100" : "" }}
          className="flex w-full justify-end pb-10 px-20"
        >
          {shouldShowTutorial && step === 1 ? (
            <>
              <div className="flex relative items-center">
                <div className="absolute right-[110%]">
                  <MoveRightIcon size={150} color="#fdd40a" />
                </div>

                <div className="flex gap-2 items-center shadow-[0px_1px_1px_1px_#00000024] bg-[#636363] text-white font-[500] leading-[19px] text-[15px] p-3 rounded-md">
                  Create New
                  <PlusCircle size={20} />
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="my-notes/create">
                <button className="flex gap-2 items-center shadow-[0px_1px_1px_1px_#00000024] bg-[#636363] text-white font-[500] leading-[19px] text-[15px] p-3 rounded-md">
                  Create New
                  <PlusCircle size={20} />
                </button>
              </Link>
            </>
          )}
        </div>
        <div className="flex flex-col w-full justify-center items-center xl:grid xl:grid-cols-2 gap-10 px-20 pb-10">
          {notes &&
            notes.map((note: Note, index: number) => {
              const colorIndex = index % colors.length;
              return (
                <div
                  key={index}
                  className="flex w-full relative flex-col shadow-[0px_2px_2px_2px_#00000024] p-0"
                >
                  <div
                    style={{
                      zIndex: shouldShowTutorial && step === 2 ? "100" : "",
                      backgroundColor:
                        step === 2 ? "rgba(255,255,255,0.5)" : "",
                    }}
                    className="flex absolute justify-end gap-2 right-7 top-5"
                  >
                    {shouldShowTutorial && step === 2 ? (
                      <>
                        <div className="flex relative gap-2 items-center">
                          <div className="absolute right-[110%]">
                            <MoveRightIcon size={150} color="#fdd40a" />
                          </div>
                          <div>
                            <EditIcon size={20} color="#ffff" />
                          </div>
                          <div className="text-red-500">
                            <TrashIcon size={20} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`my-notes/edit/${note._id}`}
                          style={{ display: "contents" }}
                        >
                          <button>
                            <EditIcon
                              size={20}
                              color={`${colors[colorIndex].text}`}
                            />
                          </button>
                        </Link>
                        <button
                          className="text-red-400"
                          onClick={() => {
                            setNoteToDeleteID(note._id);
                            setShouldShowWarning(true);
                          }}
                        >
                          <TrashIcon size={20} />
                        </button>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: colors[colorIndex].header,
                      color: colors[colorIndex].text,
                    }}
                    className="flex py-5 px-7 bg-[#] rounded-t-[10px]"
                  >
                    <h1 className="font-[500] leading-[19px] text-[16px]">
                      {note.title}
                    </h1>
                  </div>
                  <div
                    style={{ backgroundColor: colors[colorIndex].body }}
                    className="flex flex-col pt-7 pb-4 px-7 gap-7 rounded-b-[10px]"
                  >
                    <p
                      style={{ color: colors[colorIndex].text }}
                      className="font-[400] text-[12px] leading-[16px]"
                    >
                      {note.description}
                    </p>
                    <div>
                      <hr className="mb-3"></hr>
                      <p
                        style={{ color: colors[colorIndex].text }}
                        className="font-[400] text-[10px] leading-[14px]"
                      >
                        {formatTimestamp(note.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {shouldShowWarning && (
        <div className="flex absolute top-0 text-white w-full h-full justify-center items-center">
          <div
            className="flex absolute w-full h-full bg-[#252526] opacity-80"
            onClick={() => setShouldShowWarning(false)}
          ></div>
          <div className="flex xl:w-[40%] h-[30%] bg-[#3e3e42] absolute flex-col px-10 py-10 items-center justify-between rounded-md">
            <h1>Are you sure you want to delete this item?</h1>
            <div className="flex gap-10 justify-center">
              <button
                className="shadow-[0px_0px_1px_1px_#00000024] py-2 px-3 rounded-md"
                onClick={() => setShouldShowWarning(false)}
              >
                Cancel
              </button>
              <button
                className="shadow-[0px_0px_1px_1px_#00000024] bg-red-500 text-white py-2 px-3 rounded-md"
                onClick={() => DeleteNoteHandler(noteToDeleteID)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {shouldShowTutorial && (
        <Tutorial
          step={step}
          setStep={setStep}
          handleTutotialEnd={handleTutotialEnd}
        />
      )}
    </>
  );
}
