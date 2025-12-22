import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input1 = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          w-full px-4 py-3
          rounded-xl
          bg-white/10 text-white
          border border-white/15
          backdrop-blur-xl
          outline-none
          transition-all duration-300 ease-out
          placeholder:text-white/40

          hover:bg-white/15 hover:border-white/25

          focus:bg-black/40
          focus:border-blue-400/40
          focus:ring-2 focus:ring-blue-500/30

          shadow-[0_4px_20px_rgba(0,0,0,0.4)]

          ${className || ""}
        `}
      />
    );
  }
);

Input1.displayName = "Input1";
