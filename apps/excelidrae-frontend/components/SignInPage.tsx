"use client";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input1 } from "@/components/Input1";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/Button";
import { SignInLayout } from "@/components/SignInLayout";
import { FaSpinner } from "react-icons/fa";

export function SignInPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function onClickHandler() {
    if (!emailRef.current || !passwordRef.current) return;
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKEND}/signin`, {
        username: emailRef.current.value,
        password: passwordRef.current.value,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/join");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignInLayout>
      <div className="w-full max-w-[400px] space-y-8">
        {/* Mobile logo */}
        <span className="lg:hidden block text-lg font-extrabold tracking-wide text-white">
          Draw<span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">Note</span>
        </span>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h2>
          <p className="text-sm text-white/40">Sign in to continue to DrawNote</p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <Input1 ref={emailRef} type="email" placeholder="Email address" disabled={loading} />
          <PasswordInput ref={passwordRef} placeholder="Password" disabled={loading} showStrength={false} />
        </div>

        {/* CTA */}
        <Button onClick={onClickHandler} className="w-full h-11 disabled:opacity-60">
          {loading ? <FaSpinner className="animate-spin" /> : "Sign in →"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-white/40">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
            Sign up free
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
    </SignInLayout>
  );
}