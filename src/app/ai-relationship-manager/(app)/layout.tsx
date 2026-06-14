import type { Metadata } from "next";
import { AppShell } from "@/components/arm/layout/AppShell";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = armAppMetadata;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
