import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] text-white border border-white/10 outline-none transition-all duration-200 placeholder:text-white/30 hover:bg-white/10 hover:border-white/20 focus:bg-black/30 focus:border-white/20 focus:ring-1 focus:ring-white/10 ${className}`}
    />
  ),
);

Input.displayName = "Input";
