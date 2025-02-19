import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input1 = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 text-white bg-white/10 border border-white/20 rounded-xl 
          outline-none backdrop-blur-xl transition-all duration-300 ease-in-out
          shadow-md shadow-orange-500/10 hover:shadow-orange-500/20
          hover:bg-white/20 hover:border-orange-300/50 
          focus:ring-2 focus:ring-orange-400/50 focus:bg-black/30 
          placeholder-gray-300 ${className || ""}`}
      />
    );
  }
);

Input1.displayName = "Input1";
