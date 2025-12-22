"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input1 } from "@/components/Input1";
import { Button } from "@/components/Button";
import { SignInLayout } from "@/components/SignInLayout";
import { SignInCard } from "@/components/SignInCard";
import { SiSpinrilla } from "react-icons/si";

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
      <SignInCard
        title="Welcome back"
        subtitle="Sign in to continue"
      >
        <Input1
          ref={emailRef}
          type="email"
          placeholder="Email address"
          disabled={loading}
        />

        <Input1
          ref={passwordRef}
          placeholder="Password"
          disabled={loading}
        />

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onClickHandler}
            className="h-12 w-full max-w-[260px]"
          >
            {loading ? (
              <SiSpinrilla className="animate-spin text-xl" />
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </SignInCard>
    </SignInLayout>
  );
}
