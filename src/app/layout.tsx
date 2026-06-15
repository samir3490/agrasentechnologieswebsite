import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { ogImageUrl, SITE } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Agrasen Technologies | IT Consulting & Application Development",
  description:
    "Agrasen Technologies delivers innovative IT consulting, application development on QuickBase & Smartsheet, and strategic business solutions. Based in Orlando, FL with over 15 years of industry experience.",
  keywords: [
    "IT consulting",
    "application development",
    "QuickBase",
    "Smartsheet",
    "Orlando",
    "Florida",
    "web development",
    "business solutions",
    "digital transformation",
    "Agrasen Technologies",
  ],
  openGraph: {
    title: "Agrasen Technologies | IT Consulting & Application Development",
    description:
      "Innovative IT consulting, application development, and strategic business solutions with over 15 years of experience.",
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
    title: "Agrasen Technologies | IT Consulting & Application Development",
    description:
      "Innovative IT consulting, application development, and strategic business solutions with over 15 years of experience.",
    images: [ogImageUrl()],
  },
  alternates: {
    canonical: SITE_URL,
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
