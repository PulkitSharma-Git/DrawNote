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
      className={`relative inline-flex items-center justify-center w-full p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-orange-500 via-orange-600 to-blue-500 group-hover:from-orange-400 group-hover:via-orange-500 group-hover:to-blue-400 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-blue-500 ${className}`}
    >
      <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-transparent text-center">
        {children}
      </span>
    </button>
  );
}
