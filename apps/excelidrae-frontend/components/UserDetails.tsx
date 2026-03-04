"use client";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface UserDetailsProps {
  email: string;
  name: string;
}

export default function UserDetails({ email, name }: UserDetailsProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="w-72 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40 p-4 space-y-4">
      {/* Profile info */}
      <div className="flex items-center gap-3">
        <IoPersonCircleOutline className="text-white/70 shrink-0" size={44} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-white/40 truncate">{email}</p>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 rounded-xl text-sm font-medium text-white/70 border border-white/10 bg-white/5 transition-all duration-200 hover:text-white hover:bg-white/10 hover:border-white/20"
      >
        Sign out
      </button>
    </div>
  );
}