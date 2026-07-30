"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Undo } from "lucide-react";

interface UndoToastProps {
  roomname: string;
  duration?: number; // duration in ms, default 5000
  onTimeout: () => void;
  onUndo: () => void;
}

export default function UndoToast({
  roomname,
  duration = 5000,
  onTimeout,
  onUndo,
}: UndoToastProps) {
  const [width, setWidth] = useState("100%");

  useEffect(() => {
    // Trigger transition after render has painted initial state
    const transitionTimer = setTimeout(() => {
      setWidth("0%");
    }, 20);

    const timeoutTimer = setTimeout(() => {
      onTimeout();
    }, duration);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(timeoutTimer);
    };
  }, [duration, onTimeout]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: 0, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:left-6 sm:right-auto sm:inset-x-auto z-[9999] w-auto sm:w-full sm:max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#0d0e12]/95 text-white shadow-2xl backdrop-blur-md"
    >
      {/* Toast Content */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">
            Deleted <span className="text-orange-400 font-semibold">"{roomname}"</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onUndo}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-transparent hover:bg-white/10 hover:border-white/20 rounded-lg transition-all duration-200 active:scale-95"
        >
          <Undo className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>

      {/* Signature Loader Progress Bar */}
      <div className="h-1.5 w-full bg-white/[0.03] overflow-hidden">
        <div
          style={{
            width,
            transition: `width ${duration}ms linear`,
          }}
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-blue-500"
        />
      </div>
    </motion.div>
  );
}
