"use client";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { FaSpinner } from "react-icons/fa";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function SignUpCard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});

  const validateField = (fieldName: keyof ValidationErrors, value: string, isSubmitting = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errMessage = "";

    if (fieldName === "name") {
      if (!value.trim()) {
        if (isSubmitting) {
          errMessage = "Name is required.";
        }
      } else if (value.length > 50) {
        errMessage = "Name must be at most 50 characters long.";
      }
    }

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
    if (fieldName === "name") setName(value);
    if (fieldName === "email") setEmail(value);
    if (fieldName === "password") setPassword(value);

    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  async function onClickHandler() {
    const nameErr = validateField("name", name, true);
    const emailErr = validateField("email", email, true);
    const passwordErr = validateField("password", password, true);

    setTouched({ name: true, email: true, password: true });

    if (nameErr || emailErr || passwordErr) {
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/signup`, {
        name,
        username: email,
        password,
      });

      const signinRes = await axios.post(`${HTTP_BACKEND}/signin`, {
        username: email,
        password,
      });

      localStorage.setItem("token", signinRes.data.token);
      router.push("/join");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
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
          Draw
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
            Note
          </span>
        </span>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-white/40">
          Get started for free — no credit card required
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full name"
            disabled={loading}
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name", name)}
          />
          {touched.name && errors.name && (
            <p className="text-xs text-red-400 mt-1.5 pl-1">{errors.name}</p>
          )}
        </div>

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
          />
          {touched.password && errors.password && errors.password !== "Password must be at least 8 characters long." && (
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
        <Link
          href="/signin"
          className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
        >
          Sign in
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
  );
}
