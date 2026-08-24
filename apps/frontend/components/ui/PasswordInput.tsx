"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  minLength?: number;
  showStrength?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, minLength = 8, showStrength = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState("");

    const strength = (() => {
      let score = 0;
      if (value.length >= minLength) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    })();

    const strengthLabel = ["Weak", "Okay", "Good", "Strong", "Very strong"][
      strength
    ];
    const strengthPercent = (strength / 4) * 100;
    const hasInput = value.length > 0;

    return (
      <div className="space-y-1.5">
        {/* Input */}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              props.onChange?.(e);
            }}
            className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 text-white border border-white/15 backdrop-blur-xl outline-none transition-all duration-300 ease-out placeholder:text-white/40 hover:bg-white/15 hover:border-white/25 focus:bg-black/40 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${className || ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full p-1.5 bg-white/10 backdrop-blur-md text-white/70 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Strength bar & warnings */}
        {showStrength && hasInput && (
          <div className="space-y-1 pl-1">
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${strengthPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-orange-400 to-red-500 transition-all duration-700 ease-in-out"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/40">
              <p>
                Strength: <span className="text-white/60">{strengthLabel}</span>
              </p>
              {value.length < minLength && (
                <p className="text-red-400/80 transition-all">
                  Must be at least {minLength} characters
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
