import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center justify-center
        rounded-xl px-8 py-4
        bg-neutral-900 text-white font-medium
        border border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.6)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]
        active:translate-y-0 active:shadow-[0_6px_20px_rgba(0,0,0,0.6)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60
        ${className}
      `}
    >
      {/* Glow layer */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-xl
          bg-gradient-to-r from-orange-500 via-red-500 to-blue-500
          opacity-0 blur-xl
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
