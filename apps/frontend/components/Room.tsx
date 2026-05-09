// Room.tsx
"use client";
import { useState } from "react";
import { IoCopyOutline, IoCheckmarkOutline, IoArrowForward, IoTrashOutline, IoShareSocialOutline } from "react-icons/io5";

interface RoomProps {
  roomname: string;
  roomId: string;
  onClick: () => void;
  onDelete?: (roomId: string) => void;
}

export default function Room({ roomname, roomId, onClick, onDelete }: RoomProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  function copyId(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  }

  function copyLink(e: React.MouseEvent) {
    e.stopPropagation();
    const link = `${window.location.origin}/canvas/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(roomId);
    }
  }

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Solid gradient fill on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">{roomname}</h2>
            <p className="text-xs text-white/30 mt-0.5">Collaborative canvas</p>
          </div>
          {/* Arrow */}
          <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-white/5 border border-white/10 text-white/30 group-hover:text-white group-hover:border-white/20 transition-all duration-200">
            <IoArrowForward className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />

        {/* Footer — Actions */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-white/20 font-mono truncate">{roomId}</span>
          <div className="flex items-center gap-3">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="shrink-0 flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors duration-200"
                title="Delete Room"
              >
                <IoTrashOutline className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={copyLink}
              className="shrink-0 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
            >
              {copiedLink
                ? <><IoCheckmarkOutline className="h-3.5 w-3.5 text-green-400" /></>
                : <><IoShareSocialOutline className="h-3.5 w-3.5" /></>
              }
            </button>
            <button
              onClick={copyId}
              className="shrink-0 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
            >
              {copiedId
                ? <><IoCheckmarkOutline className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Copied</span></>
                : <><IoCopyOutline className="h-3.5 w-3.5" /><span>Copy ID</span></>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
