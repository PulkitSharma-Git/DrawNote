"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface UserDetailsProps {
  email: string;
  name: string;
}

export default function UserDetails({ email, name }: UserDetailsProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Generate a dynamic initial letter
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  // Deterministic gradient selection based on name hash for a personalized avatar color
  const gradients = [
    "from-indigo-500 to-purple-500",
    "from-cyan-500 to-blue-600",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-fuchsia-500 to-pink-500",
  ];
  const charCode = name ? name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
  const gradientClass = gradients[charCode % gradients.length];

  return (
    <div className="w-64 rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl p-4 space-y-4 text-left">
      {/* Profile details */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white/10 shrink-0 select-none`}>
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate" title={name || "User"}>
            {name || "User"}
          </p>
          <p className="text-xs text-white/40 truncate mt-0.5" title={email || "no-email@draw.note"}>
            {email || "no-email@draw.note"}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-sm"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
