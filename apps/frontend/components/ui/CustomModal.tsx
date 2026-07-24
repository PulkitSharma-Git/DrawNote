"use client";
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
}: CustomModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    // Lock scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle overlay click to close
  function handleOverlayClick(e: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-[#0d0e12] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 p-6 space-y-4 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-white tracking-tight">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 ml-auto"
            aria-label="Close modal"
          >
            <IoClose className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
