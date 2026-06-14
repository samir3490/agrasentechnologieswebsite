import { armPath } from "@/lib/arm/paths";
import type { ReactNode } from "react";
import Link from "next/link";
import { SITE } from "@/lib/arm/site";

export function Alert({
  variant,
  children,
}: {
  variant: "error" | "success" | "info";
  children: ReactNode;
}) {
  const styles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}>{children}</div>
  );
}

export function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link href={armPath()} className="inline-block text-2xl font-bold gradient-text">
            {SITE.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{SITE.tagline}</p>
        </div>
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
