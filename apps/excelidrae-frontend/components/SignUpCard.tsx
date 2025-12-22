"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input1 } from "@/components/Input1";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/Button";
import { SiSpinrilla } from "react-icons/si";

export function SignUpCard() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  async function onClickHandler() {
    if (nameRef.current && emailRef.current && passwordRef.current) {
      setLoading(true);

      try {
        await axios.post(`${HTTP_BACKEND}/signup`, {
          name: nameRef.current.value,
          username: emailRef.current.value,
          password: passwordRef.current.value,
        });

        setTimeout(() => router.push("/signin"), 1000);
      } catch (error) {
        const err = error as AxiosError;
        alert(
          "Signup failed: " +
            ((err.response?.data as { message: string })?.message ||
              "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="relative w-[420px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-orange-500/10 to-red-500/20 blur-2xl" />

      {/* Card */}
      <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-[2px] hover:border-white/30">
        
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-white/60">
            Start building in minutes
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input1
            ref={nameRef}
            type="text"
            placeholder="Full name"
            disabled={loading}
          />
          <Input1
            ref={emailRef}
            type="email"
            placeholder="Email address"
            disabled={loading}
          />
          <PasswordInput
            ref={passwordRef}
            placeholder="Password"
            disabled={loading}
          />
        </div>

        {/* CTA */}
        {/* CTA */}
<div className="mt-6 flex justify-center">
  <Button
    onClick={onClickHandler}
    className="
      h-12 w-full max-w-[260px]
      rounded-xl
      text-white
      font-medium
      transition-all duration-300
      hover:shadow-lg hover:shadow-blue-500/20
      active:scale-[0.98]
      disabled:opacity-60
    "
  >
    {loading ? (
      <SiSpinrilla className="animate-spin text-xl" />
    ) : (
      "Sign Up"
    )}
  </Button>
</div>


        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/50">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
