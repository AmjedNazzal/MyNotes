"use client";
import reactDom from "react-dom";
import { useEffect, useRef } from "react";

export default function NoteViewPortal({ children, isModalOpen, closeModal }) {
  const portalRef = useRef(null);

  useEffect(() => {
    if (!portalRef.current && document) {
      portalRef.current = document?.createElement("div");
    }
    const portalNode = portalRef.current;
    document.body.appendChild(portalNode);

    return () => {
      document.body.removeChild(portalNode);
    };
  }, [isModalOpen]);
  if (!isModalOpen) return null;
  return reactDom.createPortal(
    <div className="flex absolute top-0 text-white w-full h-full justify-center items-center">
      <div
        className="flex absolute w-full h-full bg-[#252526] opacity-80"
        onClick={closeModal}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "80%",
        }}
        className="rounded-md"
      >
        {children}
      </div>
    </div>,
    portalRef.current
  );
}
