"use client";
import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input1 } from "@/components/Input1";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/Button";
import { FaSpinner } from "react-icons/fa";

export function SignUpCard() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onClickHandler() {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) return;
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/signup`, {
        name: nameRef.current.value,
        username: emailRef.current.value,
        password: passwordRef.current.value,
      });
      router.push("/signin");
    } catch (error) {
      const err = error as AxiosError;
      alert("Signup failed: " + ((err.response?.data as { message: string })?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Header */}
      <div className="space-y-1">
        {/* Mobile-only logo */}
        <span className="lg:hidden block text-lg font-extrabold tracking-wide text-white mb-6">
          Draw<span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">Note</span>
        </span>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Create your account</h2>
        <p className="text-sm text-white/40">Get started for free — no credit card required</p>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <Input1 ref={nameRef} type="text" placeholder="Full name" disabled={loading} />
        <Input1 ref={emailRef} type="email" placeholder="Email address" disabled={loading} />
        <PasswordInput ref={passwordRef} placeholder="Password" disabled={loading} />
      </div>

      {/* CTA */}
      <Button onClick={onClickHandler} className="w-full h-11 disabled:opacity-60">
        {loading ? <FaSpinner className="animate-spin" /> : "Create account →"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Sign in link */}
      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/signin" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
          Sign in
        </Link>
      </p>

      {/* Legal */}
      <p className="text-center text-xs text-white/25">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="hover:text-white/50 transition-colors underline underline-offset-2 decoration-white/10">Terms</Link>
        {" & "}
        <Link href="/privacy" className="hover:text-white/50 transition-colors underline underline-offset-2 decoration-white/10">Privacy Policy</Link>
      </p>
    </div>
  );
}