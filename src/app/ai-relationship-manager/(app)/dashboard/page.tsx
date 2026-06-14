"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import type { DailyDigest } from "@/lib/arm/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const showWelcome = searchParams.get("welcome") === "1";
  const { currentAccount, getIdToken } = useAuth();
  const [contactsTotal, setContactsTotal] = useState(0);
  const [needsAttention, setNeedsAttention] = useState(0);
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [contactsRes, digestRes] = await Promise.all([
        fetch(armApi(`/accounts/${currentAccount.id}/contacts`), { headers }),
        fetch(armApi(`/accounts/${currentAccount.id}/digest`), { headers }),
      ]);
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContactsTotal(data.total ?? 0);
        const contacts = (data.contacts || []) as { healthLabel?: string }[];
        setNeedsAttention(
          contacts.filter((c) => c.healthLabel === "weak" || c.healthLabel === "dormant").length
        );
      }
      if (digestRes.ok) {
        setDigest(await digestRes.json());
      }
      setLoading(false);
    })();
  }, [currentAccount, getIdToken]);

  return (
    <div className="space-y-8 animate-fade-in">
      {showWelcome && (
        <section className="glass-card rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6">
          <h2 className="font-semibold text-slate-900">Welcome to {currentAccount?.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add your first contact, then open Settings to connect email, calendar, and optional AI
            tools — each step has a Test button so you know everything works.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`${armPath("/contacts")}?new=1`} className="btn-primary py-2">
              Add first contact
            </Link>
            <Link href={armPath("/settings")} className="btn-secondary py-2">
              Open setup checklist
            </Link>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">{currentAccount?.name}</p>
        </div>
        <Link href={`${armPath("/contacts")}?new=1`} className="btn-primary">
          Add contact
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total contacts" value={loading ? "—" : String(contactsTotal)} />
        <StatCard
          label="Birthdays (30 days)"
          value={loading ? "—" : String(digest?.birthdays.length ?? 0)}
        />
        <StatCard
          label="Anniversaries (30 days)"
          value={loading ? "—" : String(digest?.anniversaries.length ?? 0)}
        />
        <StatCard
          label="Need attention"
          value={loading ? "—" : String(needsAttention)}
        />
      </div>

      <section className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold text-slate-900">Today&apos;s digest</h2>
        <p className="mt-1 text-sm text-slate-500">
          Birthdays, anniversaries, and people you haven&apos;t contacted recently
        </p>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        ) : !digest ||
          (digest.birthdays.length === 0 &&
            digest.anniversaries.length === 0 &&
            digest.suggestedOutreach.length === 0) ? (
          <p className="mt-4 text-sm text-slate-500">
            Nothing urgent today. Add birthdays to contacts to see reminders here.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <DigestSection title="Birthdays" items={digest.birthdays} />
            <DigestSection title="Anniversaries" items={digest.anniversaries} />
            <DigestSection title="Suggested outreach" items={digest.suggestedOutreach} />
          </div>
        )}
      </section>
    </div>
  );
}

function DigestSection({
  title,
  items,
}: {
  title: string;
  items: DailyDigest["birthdays"];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={`${item.contactId}-${item.type}`}>
            <Link
              href={`${armPath("/contacts")}/${item.contactId}`}
              className="block rounded-lg border border-slate-100 bg-white/60 px-3 py-2 text-sm hover:border-indigo-200"
            >
              {item.message}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 hover-lift">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
