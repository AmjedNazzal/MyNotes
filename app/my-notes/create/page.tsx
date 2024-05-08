"use client";
import CrudForm from "@/(components)/form";
import { useRouter } from "next/navigation";
import { addNewNote } from "@/lib/actions";

interface FormData {
  title: string;
  description: string;
}

export default function Create() {
  const router = useRouter();
  async function handleCreate(formData: FormData) {
    try {
      const res = await addNewNote(formData);
      if (res === "success") {
        router.push("/");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const initialFormValues = {
    title: "",
    description: "",
  };
  return (
    <div className="flex relative bg-[#3e3e42] justify-start items-center flex-col gap-10 py-10 px-10">
      <CrudForm
        handleDataSubmit={handleCreate}
        initialFormValues={initialFormValues}
        buttonText="Create"
      />
    </div>
  );
}
