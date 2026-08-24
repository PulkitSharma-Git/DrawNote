"use client";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { SignInLayout } from "./SignInLayout";
import { FaSpinner } from "react-icons/fa";

interface ValidationErrors {
  email?: string;
  password?: string;
}

export function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateField = (fieldName: keyof ValidationErrors, value: string, isSubmitting = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errMessage = "";

    if (fieldName === "email") {
      if (!value.trim()) {
        if (isSubmitting) {
          errMessage = "Email address is required.";
        }
      } else if (!emailRegex.test(value)) {
        errMessage = "Invalid email format.";
      } else if (value.length > 100) {
        errMessage = "Email must be at most 100 characters long.";
      }
    }

    if (fieldName === "password") {
      if (!value) {
        if (isSubmitting) {
          errMessage = "Password is required.";
        }
      } else if (value.length < 8) {
        errMessage = "Password must be at least 8 characters long.";
      } else if (value.length > 100) {
        errMessage = "Password must be at most 100 characters long.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errMessage,
    }));

    return errMessage;
  };

  const handleBlur = (fieldName: keyof ValidationErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handleChange = (fieldName: keyof ValidationErrors, value: string) => {
    if (fieldName === "email") setEmail(value);
    if (fieldName === "password") setPassword(value);

    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  async function onClickHandler() {
    const emailErr = validateField("email", email, true);
    const passwordErr = validateField("password", password, true);

    setTouched({ email: true, password: true });

    if (emailErr || passwordErr) {
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKEND}/signin`, {
        username: email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/join");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignInLayout>
      <div className="w-full max-w-[400px] space-y-8">
        {/* Mobile logo */}
        <span className="lg:hidden block text-lg font-extrabold tracking-wide text-white">
          Draw
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
            Note
          </span>
        </span>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-white/40">
            Sign in to continue to DrawNote
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              disabled={loading}
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email", email)}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-400 mt-1.5 pl-1">{errors.email}</p>
            )}
          </div>

          <div>
            <PasswordInput
              placeholder="Password"
              disabled={loading}
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password", password)}
              showStrength={false}
            />
            {touched.password && errors.password && (
              <p className="text-xs text-red-400 mt-1.5 pl-1">{errors.password}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={onClickHandler}
          className="w-full h-11 disabled:opacity-60"
        >
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
          <Link
            href="/signup"
            className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
          >
            Sign up free
          </Link>
        </p>

        {/* Legal */}
        <p className="text-center text-xs text-white/25">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-white/50 transition-colors underline underline-offset-2 decoration-white/10"
          >
            Terms
          </Link>
          {" & "}
          <Link
            href="/privacy"
            className="hover:text-white/50 transition-colors underline underline-offset-2 decoration-white/10"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </SignInLayout>
  );
}
