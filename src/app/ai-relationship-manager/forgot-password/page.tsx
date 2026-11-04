"use client";

import { armPath } from "@/lib/arm/paths";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { AuthLayout, Alert } from "@/components/arm/layout/AuthLayout";
import { passwordResetErrorMessage } from "@/lib/arm/auth/password-errors";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      // Always show success-style message for unknown accounts to reduce enumeration,
      // except for clear validation / rate-limit errors.
      const code =
        err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
      if (code === "auth/user-not-found") {
        setSent(true);
      } else {
        setError(passwordResetErrorMessage(err, "Could not send reset email. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll email you a link to reset it"
      footer={
        <>
          Remembered it?{" "}
          <Link href={armPath("/login")} className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {sent ? (
          <>
            <Alert variant="success">
              If an account exists for <strong>{email.trim()}</strong>, a password reset link is on
              its way. Check your inbox and spam folder.
            </Alert>
            <Link href={armPath("/login")} className="btn-primary inline-flex w-full justify-center py-3">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
