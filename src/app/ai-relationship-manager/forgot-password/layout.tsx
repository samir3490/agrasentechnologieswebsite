import type { Metadata } from "next";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = {
  ...armAppMetadata,
  title: "Forgot password",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
