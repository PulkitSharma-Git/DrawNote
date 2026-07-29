import { useState } from "react";
import { FaUsers } from "react-icons/fa";

export type RoomUser = {
  id: string;
  name: string;
  photo: string | null;
};

// Deterministic gradient selection based on name hash for a personalized avatar color
const AVATAR_GRADIENTS = [
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-600",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-red-500",
  "from-fuchsia-500 to-pink-500",
];

function getAvatarGradient(name: string) {
  const charCode = name ? name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
  return AVATAR_GRADIENTS[charCode % AVATAR_GRADIENTS.length];
}

export function RoomUsers({ users }: { users: RoomUser[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/40 text-white/70 hover:text-white transition-all hover:bg-white/5"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        <FaUsers className="size-5" />
        <span className="text-sm font-medium">{users.length}</span>
      </button>

      {isOpen && (
        <div
          className="p-2 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/40 flex flex-col gap-1 min-w-[200px]"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <div className="px-2 py-1 mb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">
            People in Room
          </div>
          {users.map((u) => {
            const initial = u.name ? u.name.trim().charAt(0).toUpperCase() : "?";
            const gradientClass = getAvatarGradient(u.name);

            return (
              <div
                key={u.id}
                className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-default"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-xs shadow-md ring-1 ring-white/10 shrink-0 select-none`}
                >
                  {initial}
                </div>
                <div className="flex-1 truncate text-sm text-white/90 font-medium">
                  {u.name}
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="px-2 py-3 text-sm text-white/40 text-center italic">
              Waiting for others...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
