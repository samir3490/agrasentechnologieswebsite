import type { Metadata } from "next";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = {
  ...armAppMetadata,
  title: "Reset password",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
