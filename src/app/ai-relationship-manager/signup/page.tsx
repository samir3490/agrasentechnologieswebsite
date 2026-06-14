"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { AuthLayout, Alert } from "@/components/arm/layout/AuthLayout";

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      router.push(armPath("/onboarding"));
    } catch {
      setError("Could not create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push(armPath("/onboarding"));
    } catch {
      setError("Google sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free for up to 100 contacts"
      footer={
        <>
          Already have an account?{" "}
          <Link href={armPath("/login")} className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="btn-secondary w-full py-3"
        >
          Sign up with Google
        </button>
        <div className="relative text-center text-xs text-slate-400">
          <span className="bg-white px-2">or email</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-slate-200" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
