import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { ogImageUrl, rssAlternateTypes, SITE } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Agrasen Technologies | QuickBase & Low-Code Applications",
  description:
    "Custom QuickBase applications, Smartsheet solutions, and other low-code systems from Agrasen Technologies. Based in Orlando, FL with over 15 years of experience.",
  keywords: [
    "QuickBase",
    "QuickBase development",
    "low-code applications",
    "low-code development",
    "Smartsheet",
    "IT consulting",
    "Orlando",
    "Florida",
    "application development",
    "Agrasen Technologies",
  ],
  openGraph: {
    title: "Agrasen Technologies | QuickBase & Low-Code Applications",
    description:
      "Custom QuickBase applications and low-code systems with over 15 years of experience.",
    url: SITE_URL,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: ogImageUrl(),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agrasen Technologies | QuickBase & Low-Code Applications",
    description:
      "Custom QuickBase applications and low-code systems with over 15 years of experience.",
    images: [ogImageUrl()],
  },
  alternates: {
    canonical: SITE_URL,
    types: rssAlternateTypes(),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
