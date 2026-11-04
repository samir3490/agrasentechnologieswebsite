import type { Metadata } from "next";
import { armAppMetadata } from "@/lib/arm/seo/metadata";

export const metadata: Metadata = {
  ...armAppMetadata,
  title: "ARM Operator",
};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
