import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/arm/auth/AuthProvider";
import { SITE } from "@/lib/arm/site";
import "./arm.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE.product} | ${SITE.company}`,
  description: SITE.tagline,
};

export default function ArmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} arm-app min-h-screen antialiased text-slate-900`}>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
