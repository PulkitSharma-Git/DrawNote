import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button2({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white/80 bg-transparent border border-white/10 rounded-xl backdrop-blur-md transition-all duration-200 hover:text-white hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${className}`}
    >
      {children}
    </button>
  );
}