import { useState } from "react";
import { FaUsers } from "react-icons/fa";

export type RoomUser = {
  id: string;
  name: string;
  photo: string | null;
};

// A predefined selection of beautiful, recognizable matching UI colors
const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
];

// Generates a steady color mapping based on unique user ID
function getAvatarColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function RoomUsers({ users }: { users: RoomUser[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/40 text-white/70 hover:text-white transition-all hover:bg-white/5"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <FaUsers className="size-5" />
        <span className="text-sm font-medium">{users.length}</span>
      </button>
      
      {isOpen && (
        <div 
          className="p-2 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/40 flex flex-col gap-1 min-w-[200px]"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          <div className="px-2 py-1 mb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">
            People in Room
          </div>
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${getAvatarColor(u.id)}`}
              >
                {/* Future: If avatars are introduced, replace this initials fallback with an image tag rendering u.photo */}
                {u.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 truncate text-sm text-white/90 font-medium">
                {u.name}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="px-2 py-3 text-sm text-white/40 text-center italic">Waiting for others...</div>
          )}
        </div>
      )}
    </div>
  );
}
