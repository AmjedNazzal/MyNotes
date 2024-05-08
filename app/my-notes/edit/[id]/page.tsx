"use client";
import CrudForm from "@/app/(components)/form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchSingleNote, UpdateNote } from "@/app/lib/actions";

interface Params {
  id: string;
}

interface FormData {
  title: string;
  description: string;
}

export default function Edit({ params }: { params: Params }) {
  const router = useRouter();
  const { id } = params;
  const [initialFormValues, setInitialFormValues] = useState({
    title: "",
    description: "",
  });
  useEffect(() => {
    async function getNote() {
      try {
        const note = await fetchSingleNote(id);
        if (note) {
          setInitialFormValues({
            title: note.title,
            description: note.description,
          });
        }
      } catch (error) {
        console.log("error fetching: ", error);
      }
    }
    getNote();
  }, [id]);

  async function handleUpdate(formData: FormData) {
    try {
      const res = await UpdateNote(formData, id);
      if (res === "success") {
        router.push("/");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return (
    <div className="flex relative bg-[#3e3e42] justify-start items-center flex-col gap-10 py-10 px-10">
      <CrudForm
        handleDataSubmit={handleUpdate}
        initialFormValues={initialFormValues}
        buttonText="Save"
      />
    </div>
  );
}
