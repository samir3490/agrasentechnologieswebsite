"use client";

import { armPath } from "@/lib/arm/paths";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { AuthLayout, Alert } from "@/components/arm/layout/AuthLayout";
import { passwordResetErrorMessage } from "@/lib/arm/auth/password-errors";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-slate-500">Loading...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyResetCode, confirmPasswordResetWithCode } = useAuth();

  const oobCode = searchParams.get("oobCode") || searchParams.get("oobcode") || "";
  const mode = searchParams.get("mode");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [linkValid, setLinkValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!oobCode || (mode && mode !== "resetPassword")) {
        if (!cancelled) {
          setError("This reset link is missing or invalid. Request a new one.");
          setLinkValid(false);
          setVerifying(false);
        }
        return;
      }
      try {
        const accountEmail = await verifyResetCode(oobCode);
        if (!cancelled) {
          setEmail(accountEmail);
          setLinkValid(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(passwordResetErrorMessage(err, "This reset link is invalid or expired."));
          setLinkValid(false);
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [oobCode, mode, verifyResetCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await confirmPasswordResetWithCode(oobCode, password);
      setDone(true);
      setTimeout(() => router.push(armPath("/login")), 2000);
    } catch (err) {
      setError(passwordResetErrorMessage(err, "Could not reset password. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={email ? `for ${email}` : "Choose a new password for your account"}
      footer={
        <Link href={armPath("/login")} className="font-medium text-indigo-600 hover:text-indigo-700">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {verifying ? (
          <p className="text-sm text-slate-500">Verifying reset link...</p>
        ) : done ? (
          <Alert variant="success">Password updated. Redirecting you to sign in...</Alert>
        ) : linkValid ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input-field"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button type="submit" disabled={saving} className="btn-primary w-full py-3">
              {saving ? "Saving..." : "Update password"}
            </button>
          </form>
        ) : (
          <Link
            href={armPath("/forgot-password")}
            className="btn-primary inline-flex w-full justify-center py-3"
          >
            Request a new reset link
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}
