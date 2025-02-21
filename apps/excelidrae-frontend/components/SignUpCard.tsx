"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input1 } from "@/components/Input1";
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
      setLoading(true); // Start loading
      const name = nameRef.current.value;
      const username = emailRef.current.value;
      const password = passwordRef.current.value;

      try {
        const response = await axios.post(`${HTTP_BACKEND}/signup`, {
          name,
          username,
          password,
        });

        console.log("Response received:", response.data);
        alert(response.data.userId);

        setTimeout(() => router.push("/signin"), 1000);
      } catch (error) {
        console.error("Signup failed:", error);
        const err = error as AxiosError;
        const errorMessage =
          (err.response?.data as { message: string })?.message ||
          "Unknown error";
        alert("Signup failed: " + errorMessage);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      alert("Please fill all the fields");
    }
  }

  return (
    <div className="w-[400px] bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg shadow-orange-500/10 border border-white/20 flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>

      <Input1 ref={nameRef} type="text" placeholder="Name" disabled={loading} />
      <Input1 ref={emailRef} type="email" placeholder="Email" disabled={loading} />
      <Input1 ref={passwordRef} type="password" placeholder="Password" disabled={loading} />

      <Button onClick={onClickHandler} className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="flex items-center justify-center w-full">
      <SiSpinrilla className="animate-spin text-2xl" />
    </div>
        ) : (
          "Sign Up"
        )}
      </Button>
    </div>
  );
}
