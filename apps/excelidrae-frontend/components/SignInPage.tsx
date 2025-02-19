"use client";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Input1 } from "@/components/Input1";
import { Button } from "@/components/Button";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthCard } from "@/components/AuthCard";

export function SignInPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function onClickHandler() {
    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      try {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        router.push("/join");
      } catch (error) {
        console.error("Signin failed:", error);
        alert("Invalid credentials, please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <AuthCard title="Sign In">
        <Input1 ref={emailRef} type="text" placeholder="Email" />
        <Input1 ref={passwordRef} type="password" placeholder="Password" />
        <Button onClick={onClickHandler}>Sign In</Button>
      </AuthCard>
    </AuthLayout>
  );
}
