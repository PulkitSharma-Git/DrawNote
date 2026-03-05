// BarButton.tsx
import { ReactNode } from "react";

interface BarButtonProps {
  icon?: ReactNode;
  label?: string;
  activate?: boolean;
  onClick?: () => void;
}

export function BarButton({ icon, label, activate, onClick }: BarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative group flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
        ${activate
          ? "bg-white/15 text-white border border-white/20"
          : "text-white/40 hover:text-white/80 hover:bg-white/8"
        }`}
    >
      {/* Active glow */}
      {activate && (
        <span className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-blue-500 opacity-20 blur-md" />
      )}
      <span className="relative z-10">{icon}</span>
    </button>
  );
}