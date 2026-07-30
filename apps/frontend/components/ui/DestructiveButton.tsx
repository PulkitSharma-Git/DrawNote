import { ReactNode } from "react";

interface DestructiveButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function DestructiveButton({
  children,
  onClick,
  className = "",
  type = "button",
}: DestructiveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-4 py-2.5
        text-sm font-medium text-white bg-red-600 hover:bg-red-500
        transition-all duration-200 active:scale-[0.98]
        shadow-lg shadow-red-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
        ${className}
      `}
    >
      {children}
    </button>
  );
}
