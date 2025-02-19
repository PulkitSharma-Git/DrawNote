import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function Button2({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center px-5 py-2.5 mb-2 me-2 text-sm font-medium text-white bg-transparent border border-gray-300 rounded-lg backdrop-blur-md hover:bg-white/10 focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-200"
    >
      {children}
    </button>
  );
}
