import type { Metadata } from "next";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = {
  ...armAppMetadata,
  title: "Sign in",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
