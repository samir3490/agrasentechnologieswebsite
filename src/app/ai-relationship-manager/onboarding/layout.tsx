import type { Metadata } from "next";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = {
  ...armAppMetadata,
  title: "Onboarding",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
