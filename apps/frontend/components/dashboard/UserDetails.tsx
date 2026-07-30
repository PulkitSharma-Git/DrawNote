"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DestructiveButton } from "../ui/DestructiveButton";

interface UserDetailsProps {
  email: string;
  name: string;
  loading?: boolean;
}

export default function UserDetails({ email, name, loading }: UserDetailsProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="relative w-64 rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl p-4 space-y-4 text-left overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 animate-pulse pointer-events-none" />
        
        {/* Profile details skeleton */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse ring-2 ring-white/5 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            {/* Name bar */}
            <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
            {/* Email bar */}
            <div className="h-3 bg-white/5 rounded animate-pulse w-5/6" />
          </div>
        </div>

        <div className="relative z-10 h-px w-full bg-white/10" />

        {/* Action button skeleton */}
        <div className="relative z-10 h-9 w-full rounded-xl bg-white/5 animate-pulse" />
      </div>
    );
  }

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
      <DestructiveButton
        onClick={handleLogout}
        className="w-full text-xs font-semibold"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </DestructiveButton>
    </div>
  );
}
