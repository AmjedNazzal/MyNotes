"use client";
import reactDom from "react-dom";
import { useEffect, useRef } from "react";

export default function DeleteConfirmationPortal({ children, isModalOpen }) {
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
  return reactDom.createPortal(<>{children}</>, portalRef.current);
}
