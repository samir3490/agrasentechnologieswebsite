"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { SITE } from "@/lib/arm/site";

const NAV = [
  { href: armPath("/dashboard"), label: "Dashboard" },
  { href: armPath("/contacts"), label: "Contacts" },
  { href: armPath("/settings"), label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, accountsLoading, accounts, currentAccount, setCurrentAccountId, logout } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(armPath("/login"));
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !accountsLoading && user && accounts.length === 0 && pathname !== armPath("/onboarding")) {
      router.replace(armPath("/onboarding"));
    }
  }, [loading, accountsLoading, user, accounts.length, pathname, router]);

  if (loading || accountsLoading) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href={armPath("/dashboard")} className="text-lg font-bold gradient-text">
              {SITE.name}
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href)
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {accounts.length > 1 && (
              <select
                className="input-field max-w-[180px] py-1.5 text-sm"
                value={currentAccount?.id ?? ""}
                onChange={(e) => setCurrentAccountId(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            )}
            <span className="hidden text-sm text-slate-500 md:inline">{user.email}</span>
            <button type="button" onClick={() => logout()} className="btn-secondary py-1.5 text-xs">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
