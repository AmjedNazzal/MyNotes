"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

type HandleSubmitFunction = (formData: CustomFormData) => Promise<void>;

type CustomFormData = {
  title: string;
  description: string;
};

export default function CrudForm({
  handleDataSubmit,
  initialFormValues,
  buttonText,
}: {
  handleDataSubmit: HandleSubmitFunction;
  initialFormValues: CustomFormData;
  buttonText: string;
}) {
  const [formData, setFormData] = useState<CustomFormData>(initialFormValues);
  useEffect(() => {
    if (initialFormValues) {
      setFormData(initialFormValues);
    }
  }, [initialFormValues]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState: CustomFormData) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleDataSubmit(formData);
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-[70%] gap-[20px]">
      <input
        className="flex w-full shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
        name="title"
        id="title"
        type="text"
        value={formData.title}
        placeholder="Title"
        onChange={handleChange}
        required
      ></input>
      <textarea
        className="flex w-full resize-none shadow-[0px_0px_1px_1px_#00000024] rounded-md py-3 px-3 bg-[#636363] text-white"
        name="description"
        id="description"
        placeholder="Description"
        value={formData.description}
        rows={5}
        onChange={handleChange}
        required
      />
      <button
        className="shadow-[0px_0px_1px_1px_#00000024] py-2 px-20 w-fit rounded-md bg-[#85ffb7] text-[#525767]"
        type="submit"
      >
        {buttonText}
      </button>
    </form>
  );
}
