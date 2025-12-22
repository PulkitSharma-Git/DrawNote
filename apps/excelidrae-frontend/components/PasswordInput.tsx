"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineErrorOutline } from "react-icons/md";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  minLength?: number;
};

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, minLength = 8, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const [capsLock, setCapsLock] = useState(false);

  // ===== Password strength =====
  const strength = (() => {
    let score = 0;
    if (value.length >= minLength) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  })();

  const strengthLabel = ["Weak", "Okay", "Good", "Strong", "Very strong"][strength];
  const strengthPercent = (strength / 4) * 100;
  const hasInput = value.length > 0;

  // ===== Caps lock detection =====
  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      setCapsLock(e.getModifierState("CapsLock"));

    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Input */}
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`
            w-full px-4 py-3 pr-12
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

        {/* Eye toggle */}
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            flex items-center justify-center
            rounded-full p-1.5
            bg-white/10 backdrop-blur-md
            text-white/70 hover:text-white
            transition-colors
          "
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="h-5 w-5" />
          ) : (
            <AiOutlineEye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Strength bar */}
      <div
        className={`h-2 w-full rounded-full bg-white/10 overflow-hidden
          transition-opacity duration-500 ease-out
          ${hasInput ? "opacity-100" : "opacity-0"}
        `}
      >
        <div
          style={{ width: `${strengthPercent}%` }}
          className="
            h-full rounded-full
            bg-gradient-to-r from-blue-500 via-orange-400 to-red-500
            transition-all duration-700 ease-in-out
          "
        />
      </div>

      {/* Strength label */}
      <p
        className={`text-xs text-white/50 transition-opacity duration-500
          ${hasInput ? "opacity-100" : "opacity-0"}
        `}
      >
        Strength: <span className="text-white">{strengthLabel}</span>
      </p>

      {/* Caps Lock */}
      {capsLock && hasInput && (
        <div className="flex items-center gap-1 text-xs text-orange-400">
          <MdOutlineErrorOutline />
          Caps Lock is ON
        </div>
      )}

      {/* Validation */}
      {hasInput && value.length < minLength && (
        <p className="text-xs text-red-400">
          Password must be at least {minLength} characters
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
