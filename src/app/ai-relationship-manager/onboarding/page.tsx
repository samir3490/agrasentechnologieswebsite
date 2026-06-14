"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { AuthLayout, Alert } from "@/components/arm/layout/AuthLayout";
import { parseJsonResponse } from "@/lib/arm/api/parse-json-response";

export default function OnboardingPage() {
  const { getIdToken, refreshAccounts } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi("/accounts"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) throw new Error(data.error || "Failed to create workspace");
      await refreshAccounts();
      router.push(`${armPath("/dashboard")}?welcome=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Name your workspace"
      subtitle="Personal, business, and NGO modes are all enabled"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <input
          type="text"
          placeholder="e.g. My Network, LAF Donors, Sales CRM"
          required
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Creating..." : "Get started"}
        </button>
      </form>
    </AuthLayout>
  );
}
